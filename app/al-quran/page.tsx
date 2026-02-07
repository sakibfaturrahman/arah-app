"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronRight,
  Loader2,
  Bookmark,
  BookOpen,
  Users2,
  Sparkles,
  Heart,
  Moon,
  Library,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllSurah } from "@/lib/getQuran";
import { cn } from "@/lib/utils";

export default function QuranIndex() {
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastReadId, setLastReadId] = useState<number | null>(null);
  const pathname = usePathname();

  const fetchLastReadId = () => {
    const stored = localStorage.getItem("lastReadSurah");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLastReadId(parsed.id);
      } catch (e) {
        console.error("Error parsing last read data", e);
      }
    }
  };

  useEffect(() => {
    getAllSurah().then((data) => {
      setSurahs(data);
      setLoading(false);
    });
    fetchLastReadId();

    const handleUpdate = () => fetchLastReadId();
    window.addEventListener("lastReadUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("lastReadUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleReadSurah = (surah: any) => {
    const payload = {
      id: surah.nomor,
      nama: surah.nama_latin,
      timestamp: Date.now(),
    };
    localStorage.setItem("lastReadSurah", JSON.stringify(payload));
    window.dispatchEvent(new Event("lastReadUpdated"));
  };

  // 🔹 LOGIKA PENCARIAN CERDAS
  const filteredSurah = useMemo(() => {
    const cleanQuery = search.toLowerCase().replace(/['-]/g, "").trim();

    if (!cleanQuery) return surahs;

    return surahs.filter((s: any) => {
      const nameLatin = s.nama_latin.toLowerCase().replace(/['-]/g, "");
      const meaning = s.arti.toLowerCase();
      const number = s.nomor.toString();

      return (
        nameLatin.includes(cleanQuery) ||
        meaning.includes(cleanQuery) ||
        number === cleanQuery
      );
    });
  }, [surahs, search]);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32 pt-28">
      <div className="max-w-5xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="relative">
              <div className="absolute -top-6 -left-2 opacity-10 rotate-12">
                <Moon className="w-12 h-12 text-[#5465ff]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter">
                Kalam Allah<span className="text-[#5465ff]">.</span>
              </h1>
              <p className="text-gray-500 font-medium mt-2 flex items-center gap-2">
                Tenangkan hati dengan setiap ayat hari ini.
              </p>
            </div>

            {/* SEARCH BOX CERDAS */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#5465ff] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Cari nama, arti, atau nomor..."
                className="w-full md:w-80 pl-12 pr-6 py-4 bg-white rounded-[1.5rem] border border-transparent shadow-sm focus:border-[#5465ff] focus:ring-1 focus:ring-[#5465ff] outline-none transition-all font-medium"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* NAV */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <Link href="/al-quran">
              <div
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 border transition-all",
                  pathname === "/al-quran"
                    ? "bg-[#5465ff] text-white border-[#5465ff] shadow-lg"
                    : "bg-white text-gray-400 border-gray-100",
                )}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Al Qur'an
              </div>
            </Link>
            <Link href="/asmaul-husna">
              <div className="px-5 py-2.5 rounded-full text-xs font-bold bg-white text-gray-400 border border-gray-100 hover:text-[#5465ff] flex items-center gap-2 transition-all">
                <Users2 className="w-3.5 h-3.5" />
                Asmaul Husna
              </div>
            </Link>
            <Link href="/dzikir">
              <div className="px-5 py-2.5 rounded-full text-xs font-bold bg-white text-gray-400 border border-gray-100 hover:text-[#5465ff] flex items-center gap-2 transition-all">
                <Sparkles className="w-3.5 h-3.5" />
                Dzikir
              </div>
            </Link>
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="flex flex-col items-center py-32 gap-4">
            <Loader2 className="animate-spin w-10 h-10 text-[#5465ff] opacity-20" />
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              Menyiapkan Lembaran Suci...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurah.length > 0 ? (
              filteredSurah.map((surah: any) => {
                const isLastRead = surah.nomor === lastReadId;
                return (
                  <Link
                    href={`/al-quran/${surah.nomor}`}
                    key={surah.nomor}
                    onClick={() => handleReadSurah(surah)}
                  >
                    <motion.div
                      layout
                      whileHover={{ y: -5 }}
                      className={cn(
                        "p-6 bg-white rounded-[2.5rem] border flex flex-col gap-4 relative transition-all duration-300",
                        isLastRead
                          ? "border-[#5465ff] shadow-xl shadow-[#5465ff]/10 ring-1 ring-[#5465ff]/20"
                          : "border-gray-100 shadow-sm hover:border-gray-200",
                      )}
                    >
                      {isLastRead && (
                        <div className="absolute top-0 right-8 z-10">
                          <div className="bg-[#5465ff] text-white text-[8px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-b-xl flex items-center gap-1 shadow-sm">
                            <Star className="w-2 h-2 fill-current" />
                            Istiqomah Membaca
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500",
                              isLastRead
                                ? "bg-[#5465ff] text-white rotate-3"
                                : "bg-gray-50 text-gray-400",
                            )}
                          >
                            {surah.nomor}
                          </div>
                          <div>
                            <h3
                              className={cn(
                                "font-bold text-lg tracking-tight",
                                isLastRead ? "text-[#5465ff]" : "text-gray-900",
                              )}
                            >
                              {surah.nama_latin}
                            </h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                              {surah.arti}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={cn(
                              "text-2xl font-serif mb-1",
                              isLastRead ? "text-[#5465ff]" : "text-gray-800",
                            )}
                          >
                            {surah.nama}
                          </p>
                          <ChevronRight
                            className={cn(
                              "w-4 h-4 ml-auto",
                              isLastRead ? "text-[#5465ff]" : "text-gray-200",
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-medium">
                  Surah tidak ditemukan. Coba cari dengan arti atau nomor.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
