// Konfigurasi narator berdasarkan file yang tersedia di folder Anda
export const NARRATORS = [
  { id: "abu-dawud", name: "Abu Dawud" },
  { id: "ahmad", name: "Ahmad" },
  { id: "bukhari", name: "Bukhari" },
  { id: "darimi", name: "Darimi" },
  { id: "ibnu-majah", name: "Ibnu Majah" },
  { id: "malik", name: "Malik" },
  { id: "muslim", name: "Muslim" },
  { id: "nasai", name: "An-Nasa'i" },
  { id: "tirmidzi", name: "Tirmidzi" },
];

// Fungsi untuk mengambil data hadist secara dinamis
export const getHadithByNarrator = async (narratorId: string) => {
  try {
    // Import dinamis untuk mencegah memori penuh
    const data = await import(`@/lib/data/hadist/${narratorId}.json`);
    return data.default;
  } catch (error) {
    console.error("Gagal memuat file hadist:", error);
    return [];
  }
};
