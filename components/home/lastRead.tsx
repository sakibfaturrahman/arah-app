"use client";
import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import {
  Bookmark,
  ChevronRight,
  BookOpen,
  Sparkles,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LastRead() {
  const [lastRead, setLastRead] = useState<any>(null);
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Fungsi untuk menghitung selisih waktu secara manual (tanpa library luar)
  const calculateTimeAgo = useCallback((timestamp: number) => {
    if (!timestamp) return "Baru saja";
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);

    if (seconds < 60) return "Baru saja";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m yang lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}j yang lalu`;
    return "Kemarin";
  }, []);

  const fetchLastRead = useCallback(() => {
    const storedData = localStorage.getItem("lastReadSurah");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        const surahName = parsed.name || parsed.nama;
        if (parsed.id && surahName) {
          setLastRead({ ...parsed, name: surahName });
          // Asumsi Anda menyimpan 'timestamp' saat user mengklik surah
          setTimeAgo(calculateTimeAgo(parsed.timestamp));
        }
      } catch (e) {
        console.error("Error parsing data", e);
      }
    }
  }, [calculateTimeAgo]);

  useEffect(() => {
    setMounted(true);
    fetchLastRead();

    // Update waktu "time ago" setiap 1 menit agar tetap akurat
    const timeInterval = setInterval(() => {
      if (lastRead?.timestamp) {
        setTimeAgo(calculateTimeAgo(lastRead.timestamp));
      }
    }, 60000);

    const handleUpdate = () => fetchLastRead();
    window.addEventListener("lastReadUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener("lastReadUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [fetchLastRead, lastRead?.timestamp, calculateTimeAgo]);

  if (!mounted || !lastRead) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={lastRead.id + lastRead.timestamp}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="px-4 md:px-0 mt-8 mb-12"
      >
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#5465ff]/10 rounded-lg">
              <Bookmark className="w-3.5 h-3.5 text-[#5465ff] fill-[#5465ff]" />
            </div>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Lanjut Tilawah
            </h4>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-wider">
              {timeAgo}
            </span>
          </div>
        </div>

        <Link href={`/al-quran/${lastRead.id}`}>
          <Card className="group relative overflow-hidden p-6 border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(84,101,255,0.15)] transition-all duration-500 rounded-[2.5rem] cursor-pointer">
            {/* Dekorasi Background */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#5465ff]/5 rounded-full blur-3xl group-hover:bg-[#5465ff]/10 transition-colors duration-500" />

            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-5">
                {/* Nomor Surah */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:border-[#5465ff]/20 transition-colors">
                    <span className="text-[10px] font-black text-slate-300 leading-none mb-1">
                      SURAH
                    </span>
                    <span className="text-xl font-black text-slate-900 leading-none">
                      {lastRead.id}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                  </motion.div>
                </div>

                <div className="space-y-1.5">
                  <h5 className="font-black text-slate-900 text-xl tracking-tight group-hover:text-[#5465ff] transition-colors">
                    {lastRead.name}
                  </h5>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                      <BookOpen className="w-3 h-3 text-[#5465ff]" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        Ayat {lastRead.verse || "1"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-[9px] font-black text-[#5465ff] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    Baca Sekarang
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#5465ff] group-hover:text-white group-hover:rotate-[360deg] transition-all duration-700">
                  <ChevronRight className="h-6 w-6" />
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
