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
      day: "18",
      month: { en: "Sha'ban", ar: "شَعْبَان" },
      year: "1447",
    },
    readable: "06 Feb 2026",
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

export async function getPrayerTimes(): Promise<PrayerData | null> {
  if (typeof window === "undefined") return null;

  const savedLoc = localStorage.getItem("user-location");
  if (!savedLoc) return null;

  try {
    const { lat, lng } = JSON.parse(savedLoc);

    // Tambahkan timeout 5 detik agar tidak "hanging"
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=11`, // Method 11 adalah Kemenag RI
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("Server response error");

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.warn("Using fallback prayer times due to fetch failure.");
    // Jika gagal fetch, kita kembalikan data cadangan agar UI tetap muncul
    return FALLBACK_PRAYER;
  }
}
export async function getMonthlyPrayerTimes(month: number, year: number) {
  if (typeof window === "undefined") return null;
  const savedLoc = localStorage.getItem("user-location");
  if (!savedLoc) return null;

  try {
    const { lat, lng } = JSON.parse(savedLoc);
    // Method 11 untuk Kemenag RI
    const response = await fetch(
      `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lng}&method=11&month=${month}&year=${year}`,
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching monthly prayer times:", error);
    return null;
  }
}
