export interface Mosque {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  distance?: number;
}

/**
 * Fungsi untuk mengambil data masjid terdekat menggunakan Overpass API (OpenStreetMap).
 * Dioptimalkan dengan caching dan limitasi query untuk performa lebih cepat.
 */
export async function getNearbyMosques(
  lat: number,
  lon: number,
  radius: number = 4000, // Radius 4km cukup ideal untuk area urban
): Promise<Mosque[]> {
  // 1. Integrasi Caching (Mencegah loading ulang saat pindah halaman/tab)
  // Kita gunakan presisi 3 angka di belakang koma (~110 meter area) sebagai key cache
  const cacheKey = `mosques_${lat.toFixed(3)}_${lon.toFixed(3)}`;
  const cachedData =
    typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;

  if (cachedData) {
    console.log("Mengambil data masjid dari cache...");
    return JSON.parse(cachedData);
  }

  /**
   * 2. Query Overpass QL Teroptimasi
   * - Mencari node (titik tunggal) dan way (bangunan)
   * - Menggunakan 'out center' untuk mendapatkan titik koordinat tengah bangunan
   * - Limit hasil ke 30 entri agar respon API lebih ringan
   */
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
      way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
    );
    out center 30;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("API sedang sibuk (Too Many Requests).");
      }
      throw new Error("Gagal mengambil data dari OpenStreetMap.");
    }

    const data = await response.json();

    // 3. Mapping Data Elements
    const mappedMosques: Mosque[] = data.elements.map((el: any) => {
      // Koordinat bisa ada di lat/lon (node) atau center (way)
      const mosqueLat = el.lat || el.center.lat;
      const mosqueLon = el.lon || el.center.lon;

      return {
        id: el.id,
        name: el.tags.name || el.tags.description || "Masjid / Musholla",
        lat: mosqueLat,
        lon: mosqueLon,
        address:
          el.tags["addr:full"] ||
          el.tags["addr:street"] ||
          el.tags["addr:city"] ||
          "Alamat tidak tersedia di peta",
        // Menambahkan properti jarak (opsional jika ingin sorting)
        distance: calculateDistance(lat, lon, mosqueLat, mosqueLon),
      };
    });

    // Urutkan berdasarkan jarak terdekat
    const sortedMosques = mappedMosques.sort(
      (a, b) => (a.distance || 0) - (b.distance || 0),
    );

    // Simpan ke cache sebelum return
    if (typeof window !== "undefined" && sortedMosques.length > 0) {
      sessionStorage.setItem(cacheKey, JSON.stringify(sortedMosques));
    }

    return sortedMosques;
  } catch (error) {
    console.error("Mosque Service Error:", error);
    return [];
  }
}

/**
 * Helper: Menghitung jarak lurus (Haversine Formula) antara dua koordinat.
 * Berguna untuk sorting daftar masjid dari yang paling dekat.
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Hasil dalam km
}
