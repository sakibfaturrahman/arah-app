// lib/getDailyHadith.ts

// 1. Definisikan tipe untuk mapping agar TypeScript tidak error
type HadithMapping = {
  [key: string]: () => Promise<any>;
};

// 2. Mapping import statis agar Turbopack bisa melacak file JSON
const HADITH_DATA: HadithMapping = {
  "abu-dawud": () => import("@/lib/data/hadist/abu-dawud.json"),
  ahmad: () => import("@/lib/data/hadist/ahmad.json"),
  bukhari: () => import("@/lib/data/hadist/bukhari.json"),
  darimi: () => import("@/lib/data/hadist/darimi.json"),
  "ibnu-majah": () => import("@/lib/data/hadist/ibnu-majah.json"),
  malik: () => import("@/lib/data/hadist/malik.json"),
  muslim: () => import("@/lib/data/hadist/muslim.json"),
  nasai: () => import("@/lib/data/hadist/nasai.json"),
  tirmidzi: () => import("@/lib/data/hadist/tirmidzi.json"),
};

export async function getDailyHadith() {
  const perawiList = [
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

  // Buat Seed berdasarkan tanggal hari ini (YYYYMMDD)
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  // Pilih Perawi berdasarkan seed
  const selectedPerawi = perawiList[seed % perawiList.length];

  try {
    // 3. Ambil loader berdasarkan ID perawi
    const loader = HADITH_DATA[selectedPerawi.id];

    if (!loader) {
      throw new Error(`Data untuk perawi ${selectedPerawi.id} tidak ditemukan`);
    }

    // 4. Import data secara dinamis (namun terdaftar statis)
    const hadithModule = await loader();
    const allHadiths = hadithModule.default;

    // 5. Tentukan nomor hadis berdasarkan seed
    const totalInFile = allHadiths.length;
    const hadithIndex = seed % totalInFile;
    const selectedData = allHadiths[hadithIndex];

    if (selectedData) {
      return {
        arab: selectedData.arab,
        id: selectedData.id, // Biasanya berisi terjemahan di JSON Anda
        slug: `HR. ${selectedPerawi.name.toUpperCase()}`,
        number: selectedData.number,
      };
    }

    return getFallbackHadith();
  } catch (error) {
    console.error("Gagal memuat Hadis Harian:", error);
    return getFallbackHadith();
  }
}

// Fungsi Fallback jika terjadi kendala pada file JSON
function getFallbackHadith() {
  return {
    arab: "خَيْرُ الناسِ أَنْفَعُهُمْ لِلناسِ",
    id: "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.",
    slug: "HR. AHMAD",
    number: 1,
  };
}
