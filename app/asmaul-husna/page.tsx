"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Heart,
  Loader2,
  BookOpen,
  Users2,
  ScrollText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import asmaulHusnaData from "@/lib/data/asmaul-husna.json";
import { cn } from "@/lib/utils";

export default function AsmaulHusnaPage() {
  const [asmaList, setAsmaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAsmaList(asmaulHusnaData.data);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredAsma = asmaList.filter(
    (item) =>
      item.latin.toLowerCase().includes(search.toLowerCase()) ||
      item.indo.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32 pt-28">
      <div className="max-w-5xl mx-auto px-4">
        {/* --- HEADER SECTION (Consistent with QuranIndex) --- */}
        <div className="mb-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter">
                Asmaul{" "}
                <span className="italic font-serif font-light">Husna</span>
                <span className="text-[#5465ff]">.</span>
              </h1>
              <p className="text-gray-500 font-medium mt-2">
                Meresapi keagungan Allah melalui nama-nama-Nya yang indah.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#5465ff] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Cari makna atau nama..."
                className="w-full md:w-80 pl-12 pr-6 py-4 bg-white border border-transparent shadow-sm rounded-[1.5rem] focus:ring-4 focus:ring-[#5465ff]/5 focus:border-[#5465ff]/20 transition-all font-medium outline-none text-slate-600"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* --- MENU NAVIGASI INTERNAL (Sub-Menu) --- */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <Link href="/al-quran">
              <div className="px-5 py-2.5 rounded-full text-xs font-bold bg-white text-gray-400 border border-gray-100 hover:border-[#5465ff]/20 hover:text-[#5465ff] transition-all flex items-center gap-2 whitespace-nowrap">
                <BookOpen className="w-3.5 h-3.5" />
                Al-Qur'an
              </div>
            </Link>

            <Link href="/asmaul-husna">
              <div
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border",
                  pathname === "/asmaul-husna"
                    ? "bg-[#5465ff] text-white border-[#5465ff] shadow-lg shadow-[#5465ff]/20"
                    : "bg-white text-gray-400 border-gray-100 hover:border-[#5465ff]/20 hover:text-[#5465ff]",
                )}
              >
                <Users2 className="w-3.5 h-3.5" />
                Asmaul Husna
              </div>
            </Link>

            <Link href="/dzikir">
              <div className="px-5 py-2.5 rounded-full text-xs font-bold bg-white text-gray-400 border border-gray-100 hover:border-[#5465ff]/20 hover:text-[#5465ff] transition-all flex items-center gap-2 whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5" />
                Dzikir
              </div>
            </Link>
          </div>
        </div>

        {/* --- GRID CONTENT --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-[#5465ff] w-10 h-10 opacity-20" />
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
              Membuka Gerbang Langit...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredAsma.map((item, index) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.01 }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-[#5465ff]/5 hover:border-[#5465ff]/20 transition-all duration-500 flex flex-col items-center text-center h-full"
                >
                  {/* Number Indicator */}
                  <div className="absolute top-5 left-5">
                    <span className="text-[10px] font-bold text-slate-300 group-hover:text-[#5465ff] transition-colors">
                      {String(item.id).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Arabic text */}
                  <div className="mt-4 mb-5">
                    <h2
                      className="text-4xl md:text-5xl font-serif text-slate-800 transition-transform duration-500 group-hover:scale-110"
                      style={{ direction: "rtl" }}
                    >
                      {item.arab}
                    </h2>
                  </div>

                  {/* Latin & Meaning */}
                  <div className="space-y-2 flex-grow">
                    <h3 className="text-sm font-bold text-[#5465ff] tracking-wide uppercase">
                      {item.latin}
                    </h3>
                    <div className="h-px w-6 bg-slate-100 mx-auto group-hover:w-10 group-hover:bg-[#5465ff]/30 transition-all duration-500" />
                    <p className="text-[11px] md:text-xs text-slate-500 font-medium leading-relaxed">
                      {item.indo}
                    </p>
                  </div>

                  {/* Minimal Interaction */}
                  <button className="mt-4 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-rose-50">
                    <Heart className="w-3.5 h-3.5 text-rose-300 hover:text-rose-500 transition-colors" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* --- FOOTER INFO --- */}
        {!loading && filteredAsma.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <Search className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">
              Nama tidak ditemukan, coba kata kunci lain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
