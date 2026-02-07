import { getAllSurah } from "@/lib/getQuran";
import { getAllDoa } from "@/lib/getDoa";

export type SearchResult = {
  type: "surah" | "doa" | "general";
  url: string;
  id?: number | string;
};

export async function globalSmartSearch(query: string): Promise<SearchResult> {
  const q = query.toLowerCase().trim();

  // 1. Logika Deteksi Tipe (Prefix detection)
  const isDoaQuery = q.includes("doa");

  // Membersihkan query dari simbol atau awalan umum agar pencarian lebih fleksibel
  // Contoh: "al-kahfi" -> "kahfi", "surah yasin" -> "yasin"
  const cleanQuery = q
    .replace(/^(surah|doa|bacaan)\s+/g, "")
    .replace(/^al-|^al\s+/g, "")
    .trim();

  try {
    // 2. Prioritas 1: Pencarian Surah
    // Kita mencari yang 'includes' agar input "kahfi" cocok dengan "Al-Kahfi"
    if (!isDoaQuery) {
      const allSurah = await getAllSurah();
      const matchSurah = allSurah.find((s: any) => {
        const nameLatin = s.nama_latin.toLowerCase().replace(/^al-/, "");
        return (
          nameLatin.includes(cleanQuery) ||
          s.nama_latin.toLowerCase().includes(q)
        );
      });

      if (matchSurah) {
        return {
          type: "surah",
          url: `/al-quran/${matchSurah.nomor}`,
          id: matchSurah.nomor,
        };
      }
    }

    // 3. Prioritas 2: Pencarian Doa
    // Jika mengandung kata "doa" atau tidak ditemukan di surah
    const allDoa = await getAllDoa();
    const matchDoa = allDoa.find(
      (d: any) =>
        d.nama.toLowerCase().includes(cleanQuery) ||
        d.nama.toLowerCase().includes(q),
    );

    if (matchDoa) {
      return {
        type: "doa",
        url: `/hisnul-muslim?search=${encodeURIComponent(cleanQuery)}`,
        id: matchDoa.id,
      };
    }

    // 4. Fallback: Lempar ke pencarian general di halaman Al-Quran
    return {
      type: "general",
      url: `/al-quran?search=${encodeURIComponent(q)}`,
    };
  } catch (error) {
    console.error("Search Service Error:", error);
    return {
      type: "general",
      url: `/al-quran?search=${encodeURIComponent(q)}`,
    };
  }
}
