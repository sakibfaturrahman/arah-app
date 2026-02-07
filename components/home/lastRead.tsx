"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Bookmark, ChevronRight, BookOpen, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function LastRead() {
  const [lastRead, setLastRead] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Fungsi untuk mengambil data terbaru
  const fetchLastRead = () => {
    const storedData = localStorage.getItem("lastReadSurah");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        const surahName = parsed.name || parsed.nama || parsed.nama;
        if (parsed.id && surahName) {
          setLastRead({ ...parsed, name: surahName });
        }
      } catch (e) {
        console.error("Error parsing data", e);
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchLastRead(); // Ambil data saat pertama kali load

    // LISTENER UNTUK REAL-TIME
    const handleUpdate = () => fetchLastRead();

    // Dengarkan perubahan dari tab yang sama (Custom Event)
    window.addEventListener("lastReadUpdated", handleUpdate);
    // Dengarkan perubahan dari tab lain (Storage Event)
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("lastReadUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  if (!mounted || !lastRead) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={lastRead.id} // Key ini penting agar animasi jalan saat data berubah
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="px-4 md:px-0 mt-8 mb-12"
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#5465ff] fill-[#5465ff]" />
            Terakhir Dibaca
          </h4>
        </div>

        <Link href={`/al-quran/${lastRead.id}`}>
          <Card className="group relative overflow-hidden p-5 border-none bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(84,101,255,0.1)] transition-all duration-500 rounded-[2rem] cursor-pointer">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#5465ff]/5 rounded-bl-[3rem] -z-0 transition-transform group-hover:scale-110 duration-500" />

            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5465ff]/10 to-[#5465ff]/5 flex items-center justify-center text-[#5465ff] font-black text-lg shadow-inner">
                    {lastRead.id}
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-black text-gray-900 text-lg tracking-tight">
                      {lastRead.name}
                    </h5>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full uppercase">
                      Baru Saja
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Lanjutkan Membaca
                  </p>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#5465ff] group-hover:text-white transition-all duration-300">
                <ChevronRight className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
