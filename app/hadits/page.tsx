"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ChevronDown,
  Copy,
  Check,
  Share2,
  Library,
  Scroll,
  User,
  Hash,
  Star,
  Bookmark,
  Sparkles,
  Quote,
  Layers,
} from "lucide-react";
import { getHadithByNarrator, NARRATORS } from "@/lib/getHadith";
import { cn } from "@/lib/utils";

export default function HadistPage() {
  const [activeNarrator, setActiveNarrator] = useState("bukhari");
  const [hadiths, setHadiths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getHadithByNarrator(activeNarrator);
      setHadiths(data);
      setCurrentPage(1);
      setExpandedId(null);
      setLoading(false);
    };
    loadData();
  }, [activeNarrator]);

  const handleCopy = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHadiths = useMemo(() => {
    return hadiths.filter(
      (h) =>
        h.id.toLowerCase().includes(search.toLowerCase()) ||
        h.number.toString().includes(search),
    );
  }, [hadiths, search]);

  const totalPages = Math.ceil(filteredHadiths.length / itemsPerPage);
  const currentData = filteredHadiths.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32 pt-24 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto px-6">
        {/* --- HEADER --- */}
        <header className="text-center mb-10 md:mb-16 space-y-6 md:space-y-8 mt-6 md:mt-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 md:gap-4"
          >
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-3xl md:text-6xl font-bold tracking-tight text-slate-900 flex items-center justify-center gap-2 md:gap-3">
                Perpustakaan <span className="text-[#5465ff]">Hadist</span>
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-amber-400 fill-amber-400" />
              </h1>
              <p className="text-slate-500 font-bold text-xs md:text-base flex items-center justify-center gap-2 px-4">
                <Scroll className="w-4 h-4 md:w-5 md:h-5 text-[#5465ff] shrink-0" />
                <span className="leading-tight">
                  Telusuri warisan hikmah lisan suci Nabawi
                </span>
              </p>
            </div>
          </motion.div>

          {/* Narrator Chips - Scrollable di Mobile, Wrapped di Desktop */}
          <div className="relative">
            <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 md:gap-3 px-4 pb-2 md:pb-0 scrollbar-hide no-scrollbar">
              <div className="flex md:flex-wrap gap-2 md:justify-center w-max md:w-full max-w-4xl mx-auto p-3 md:p-4 bg-white shadow-sm rounded-2xl md:rounded-[2.5rem] border border-slate-100">
                {NARRATORS.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setActiveNarrator(n.id)}
                    className={cn(
                      "px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-bold transition-all duration-300 border flex items-center gap-2 uppercase tracking-wider whitespace-nowrap",
                      activeNarrator === n.id
                        ? "bg-[#5465ff] text-white border-[#5465ff] shadow-lg shadow-[#5465ff]/30"
                        : "bg-white text-slate-400 border-slate-100 hover:border-[#5465ff]/30 hover:text-[#5465ff]",
                    )}
                  >
                    <User
                      className={cn(
                        "w-3 h-3 md:w-3.5 md:h-3.5",
                        activeNarrator === n.id
                          ? "text-white"
                          : "text-[#5465ff]",
                      )}
                    />
                    {n.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative max-w-2xl mx-auto group px-4">
            {/* Ikon Pencarian (Kiri) */}
            <div className="absolute inset-y-0 left-7 md:left-9 flex items-center pointer-events-none z-10">
              <Search className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-focus-within:text-[#5465ff] transition-colors" />
            </div>

            <input
              type="text"
              placeholder={`Cari nomor/kata di Kitab ${NARRATORS.find((n) => n.id === activeNarrator)?.name}...`}
              className={cn(
                "w-full py-4 md:py-5 bg-white border border-slate-100 outline-none shadow-sm transition-all font-medium text-slate-700",
                "rounded-2xl md:rounded-[2rem]",
                "focus:ring-4 focus:ring-[#5465ff]/10 focus:border-[#5465ff]/30",
                "text-sm md:text-base",
                /* Padding disesuaikan agar teks tidak menabrak ikon kiri & kanan */
                "pl-12 md:pl-16 pr-12 md:pr-16",
              )}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Ikon Hash (Kanan) */}
            <div className="absolute inset-y-0 right-7 md:right-9 flex items-center z-10">
              <div className="p-1 md:p-1.5 bg-[#5465ff]/5 rounded-lg border border-[#5465ff]/10 group-focus-within:bg-[#5465ff] group-focus-within:border-[#5465ff] transition-colors group">
                <Hash className="w-3 h-3 md:w-4 md:h-4 text-[#5465ff] group-focus-within:text-white transition-colors" />
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="w-14 h-14 animate-spin text-[#5465ff]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Layers className="w-5 h-5 text-[#5465ff]/30" />
              </div>
            </div>
            <p className="text-xs font-medium text-[#5465ff] uppercase tracking-[0.4em] animate-pulse">
              Menyelami Sanad...
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Pagination Control Modern */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#5465ff]/10 rounded-2xl">
                  <Bookmark className="w-5 h-5 text-[#5465ff] fill-[#5465ff]" />
                </div>
                <p className="text-sm font-bold text-slate-600">
                  Ditemukan{" "}
                  <span className="text-[#5465ff] font-medium">
                    {filteredHadiths.length}
                  </span>{" "}
                  Hadist
                </p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-3 rounded-xl bg-white text-[#5465ff] hover:bg-[#5465ff] hover:text-white disabled:opacity-20 transition-all shadow-sm border border-slate-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="px-4 text-center">
                  <p className="text-[10px] font-medium uppercase text-slate-400 tracking-widest leading-none mb-1">
                    Hal
                  </p>
                  <span className="text-xs font-medium text-[#5465ff]">
                    {currentPage} / {totalPages}
                  </span>
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-3 rounded-xl bg-white text-[#5465ff] hover:bg-[#5465ff] hover:text-white disabled:opacity-20 transition-all shadow-sm border border-slate-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Hadist List Card */}
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {currentData.map((item, index) => (
                  <motion.div
                    layout
                    key={item.number}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "group bg-white border transition-all duration-500 rounded-[2.5rem] relative overflow-hidden",
                      expandedId === item.number
                        ? "border-[#5465ff]/30 shadow-2xl shadow-[#5465ff]/10 ring-2 ring-[#5465ff]/5"
                        : "border-slate-100 hover:border-[#5465ff]/20 shadow-sm hover:shadow-lg hover:shadow-slate-200/50",
                    )}
                  >
                    {/* Card Trigger */}
                    <div
                      onClick={() =>
                        setExpandedId(
                          expandedId === item.number ? null : item.number,
                        )
                      }
                      className="p-7 md:p-9 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-6">
                        <div
                          className={cn(
                            "w-14 h-14 rounded-3xl flex items-center justify-center text-sm font-medium transition-all duration-500 border-2",
                            expandedId === item.number
                              ? "bg-[#5465ff] text-white border-[#5465ff] rotate-12"
                              : "bg-[#5465ff]/5 text-[#5465ff] border-[#5465ff]/10 group-hover:bg-[#5465ff] group-hover:text-white",
                          )}
                        >
                          #{item.number}
                        </div>
                        <div className="space-y-1">
                          <h3
                            className={cn(
                              "text-lg font-bold transition-colors flex items-center gap-2",
                              expandedId === item.number
                                ? "text-[#5465ff]"
                                : "text-slate-700",
                            )}
                          >
                            H.R.{" "}
                            {
                              NARRATORS.find((n) => n.id === activeNarrator)
                                ?.name
                            }
                            {expandedId === item.number && (
                              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                            )}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#5465ff]/30 group-hover:bg-[#5465ff]" />
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                              Mutawattir & Sanad Shahih
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "p-3 rounded-full transition-colors",
                          expandedId === item.number
                            ? "bg-[#5465ff]/10"
                            : "bg-slate-50 group-hover:bg-[#5465ff]/5",
                        )}
                      >
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 text-slate-300 transition-transform duration-500",
                            expandedId === item.number &&
                              "rotate-180 text-[#5465ff]",
                          )}
                        />
                      </div>
                    </div>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {expandedId === item.number && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: "backOut" }}
                        >
                          <div className="px-8 md:px-16 pb-12 space-y-10 relative">
                            {/* Watermark Icon */}
                            <Quote className="absolute top-10 left-10 w-40 h-40 text-[#5465ff]/5 -z-0" />

                            <div className="h-px w-full bg-slate-100 relative z-10" />

                            <div className="space-y-8 relative z-10">
                              <div className="flex items-center justify-end">
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 rounded-xl border border-amber-100">
                                  <Scroll className="w-4 h-4 text-amber-500" />
                                  <span className="text-[10px] text-amber-600 font-medium uppercase tracking-widest">
                                    Matan Arab
                                  </span>
                                </div>
                              </div>
                              <h2
                                className="text-3xl md:text-5xl font-serif text-right leading-[2.4] text-slate-800"
                                style={{ direction: "rtl" }}
                              >
                                {item.arab}
                              </h2>
                            </div>

                            <div className="space-y-4 relative z-10 bg-[#5465ff]/5 p-8 rounded-[2.5rem] border border-[#5465ff]/10">
                              <div className="flex items-center gap-3 text-[#5465ff] mb-2">
                                <BookOpen className="w-6 h-6" />
                                <span className="text-[11px] font-medium uppercase tracking-[0.2em]">
                                  Terjemahan Hikmah
                                </span>
                              </div>
                              <p className="text-slate-700 leading-relaxed text-base md:text-xl font-medium italic">
                                "{item.id}"
                              </p>
                            </div>

                            {/* Tombol Aksi - Warna #5465ff */}
                            <div className="flex flex-col md:flex-row items-center gap-4 pt-8 relative z-10">
                              <button
                                onClick={() =>
                                  handleCopy(
                                    `${item.arab}\n\n${item.id}`,
                                    item.number,
                                  )
                                }
                                className={cn(
                                  "w-full md:flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[12px] font-medium uppercase tracking-widest transition-all",
                                  copiedId === item.number
                                    ? "bg-emerald-500 text-white shadow-xl shadow-emerald-200"
                                    : "bg-[#5465ff] text-white hover:shadow-xl hover:shadow-[#5465ff]/30 transform active:scale-95",
                                )}
                              >
                                {copiedId === item.number ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  <Copy className="w-5 h-5" />
                                )}
                                {copiedId === item.number
                                  ? "Hikmah Tersalin"
                                  : "Salin Teks Hadist"}
                              </button>

                              <div className="flex gap-3 w-full md:w-auto">
                                <button className="p-4 rounded-2xl bg-white border border-[#5465ff]/10 text-[#5465ff] hover:bg-[#5465ff] hover:text-white transition-all shadow-sm">
                                  <Share2 className="w-6 h-6" />
                                </button>
                                <button className="p-4 rounded-2xl bg-white border border-amber-200 text-amber-500 hover:bg-amber-50 transition-all shadow-sm">
                                  <Star className="w-6 h-6" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
