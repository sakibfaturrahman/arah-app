export interface PrayerData {
  timings: {
    Fajr: string;
    Imsak: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
  };
  date: {
    hijri: {
      day: string;
      month: { en: string; ar: string };
      year: string;
    };
    readable: string;
    gregorian?: {
      day: string;
      weekday: { en: string };
    };
  };
}

// Data cadangan jika API gagal total (Waktu standar Indonesia Barat)
const FALLBACK_PRAYER: PrayerData = {
  timings: {
    Imsak: "04:30",
    Fajr: "04:40",
    Dhuhr: "12:05",
    Asr: "15:20",
    Maghrib: "18:15",
    Isha: "19:25",
  },
  date: {
    hijri: {
      day: "29",
      month: { en: "Sha'ban", ar: "شَعْبَان" },
      year: "1447",
    },
    readable: "17 Feb 2026",
  },
};

export const PRAYER_LIST = [
  { key: "Imsak", label: "Imsak" },
  { key: "Fajr", label: "Subuh" },
  { key: "Dhuhr", label: "Dzuhur" },
  { key: "Asr", label: "Ashar" },
  { key: "Maghrib", label: "Maghrib" },
  { key: "Isha", label: "Isya" },
];

/**
 * Mendapatkan Jadwal Sholat Harian
 */
export async function getPrayerTimes(): Promise<PrayerData | null> {
  if (typeof window === "undefined") return null;

  const savedLoc = localStorage.getItem("user-location");
  if (!savedLoc) return null;

  try {
    const { lat, lng } = JSON.parse(savedLoc);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 detik timeout

    const response = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=11`,
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("API Server Error");

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.warn("Gagal mengambil jadwal harian, menggunakan fallback.");
    return FALLBACK_PRAYER;
  }
}

/**
 * Mendapatkan Jadwal Sholat Bulanan
 */
export async function getMonthlyPrayerTimes(
  month: number,
  year: number,
): Promise<any[] | null> {
  if (typeof window === "undefined") return null;

  const savedLoc = localStorage.getItem("user-location");
  if (!savedLoc) return null;

  try {
    const { lat, lng } = JSON.parse(savedLoc);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 detik timeout

    const response = await fetch(
      `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lng}&method=11&month=${month}&year=${year}`,
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("Monthly API Error");

    const result = await response.json();

    // Pastikan mengembalikan array (result.data) agar tidak error saat di-.map()
    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("Gagal mengambil jadwal bulanan:", error);
    // Kembalikan array kosong daripada null agar UI tidak TypeError
    return [];
  }
}
