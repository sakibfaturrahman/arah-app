"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronRight,
  Loader2,
  Bookmark,
  BookOpen,
  Users2,
  Sparkles,
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

  // 🔹 Ambil data terakhir dibaca
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

  // 🔥 SIMPAN SAAT SURAH DIBUKA
  const handleReadSurah = (surah: any) => {
    const payload = {
      id: surah.nomor,
      nama: surah.nama_latin,
      timestamp: Date.now(),
    };

    localStorage.setItem("lastReadSurah", JSON.stringify(payload));

    // Trigger realtime update (tab yang sama)
    window.dispatchEvent(new Event("lastReadUpdated"));
  };

  const filteredSurah = surahs.filter((s: any) =>
    s.nama_latin.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32 pt-28">
      <div className="max-w-5xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter">
                Al-Qur'an<span className="text-[#5465ff]">.</span>
              </h1>
              <p className="text-gray-500 font-medium mt-2">
                Baca dan pelajari firman Allah setiap hari.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#5465ff]" />
              </div>
              <input
                type="text"
                placeholder="Cari Surah..."
                className="w-full md:w-80 pl-12 pr-6 py-4 bg-white rounded-[1.5rem] border border-transparent shadow-sm focus:border-[#5465ff] focus:ring-1 focus:ring-[#5465ff] outline-none transition-all"
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
                    ? "bg-[#5465ff] text-white border-[#5465ff] shadow-md"
                    : "bg-white text-gray-400 border-gray-100 hover:border-gray-200",
                )}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Al-Qur'an
              </div>
            </Link>

            <Link href="/asmaul-husna">
              <div className="px-5 py-2.5 rounded-full text-xs font-bold bg-white text-gray-400 border border-gray-100 hover:border-gray-200 flex items-center gap-2 transition-all">
                <Users2 className="w-3.5 h-3.5" />
                Asmaul Husna
              </div>
            </Link>

            <Link href="/dzikir">
              <div className="px-5 py-2.5 rounded-full text-xs font-bold bg-white text-gray-400 border border-gray-100 hover:border-gray-200 flex items-center gap-2 transition-all">
                <Sparkles className="w-3.5 h-3.5" />
                Dzikir
              </div>
            </Link>
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <Loader2 className="animate-spin w-10 h-10 text-[#5465ff] opacity-20" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurah.map((surah: any) => {
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
                        ? "border-[#5465ff] shadow-[0_10px_25px_-5px_rgba(84,101,255,0.15)] ring-1 ring-[#5465ff]/20"
                        : "border-gray-100 shadow-sm hover:shadow-md",
                    )}
                  >
                    {/* Badge Terakhir Dibaca - Muncul otomatis jika ID cocok */}
                    {isLastRead && (
                      <div className="absolute top-0 right-8 z-10">
                        <div className="bg-[#5465ff] text-white text-[8px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-b-xl flex items-center gap-1 shadow-sm">
                          <Bookmark className="w-2.5 h-2.5 fill-current" />
                          Terakhir Dibaca
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-colors",
                            isLastRead
                              ? "bg-[#5465ff] text-white"
                              : "bg-gray-50 text-gray-900",
                          )}
                        >
                          {surah.nomor}
                        </div>
                        <div>
                          <h3
                            className={cn(
                              "font-bold transition-colors",
                              isLastRead ? "text-[#5465ff]" : "text-gray-900",
                            )}
                          >
                            {surah.nama_latin}
                          </h3>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {surah.tempat_turun} • {surah.jumlah_ayat} Ayat
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={cn(
                            "text-xl font-serif transition-colors",
                            isLastRead ? "text-[#5465ff]" : "text-gray-900",
                          )}
                        >
                          {surah.nama}
                        </p>
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 ml-auto transition-colors",
                            isLastRead ? "text-[#5465ff]" : "text-gray-200",
                          )}
                        />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
