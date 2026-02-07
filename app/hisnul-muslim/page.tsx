"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Copy,
  Check,
  Loader2,
  BookOpen,
  Heart,
  Sparkles,
  Info,
  Hash,
  Star,
  Wind,
} from "lucide-react";
import { getAllDoa } from "@/lib/getDoa";
import { cn } from "@/lib/utils";

export default function DoaPage() {
  const [doas, setDoas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"semua" | "bookmark">("semua");

  useEffect(() => {
    getAllDoa().then((res) => {
      setDoas(res);
      setLoading(false);
    });
    const saved = localStorage.getItem("doa-bookmarks");
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  const toggleBookmark = (id: number) => {
    const newBookmarks = bookmarks.includes(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem("doa-bookmarks", JSON.stringify(newBookmarks));
  };

  const handleCopy = async (doa: any) => {
    const text = `${doa.nama}\n\n${doa.ar}\n\nArtinya: "${doa.idn}"`;
    await navigator.clipboard.writeText(text);
    setCopiedId(doa.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDoa = doas.filter((d: any) => {
    const matchesSearch =
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.grup.toLowerCase().includes(search.toLowerCase());
    return activeTab === "bookmark"
      ? matchesSearch && bookmarks.includes(d.id)
      : matchesSearch;
  });

  return (
    // overflow-x-hidden untuk mencegah kebocoran margin di mobile
    <div className="min-h-screen bg-[#FAFAFA] pb-32 pt-24 md:pt-32 font-sans text-slate-900 overflow-x-hidden">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        {/* --- HEADER --- */}
        <header className="mb-12 space-y-10 relative">
          <div className="absolute -top-10 -left-6 opacity-5 pointer-events-none">
            <Wind className="w-32 h-32 text-blue-500" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100/50 rounded-xl">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">
                  Lentera Hati
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 leading-tight">
                Munajat <span className="text-blue-600 font-bold">Doa</span>
                <span className="text-blue-600">.</span>
              </h1>
              <p className="text-sm font-medium text-slate-700 max-w-sm">
                Kumpulan doa harian untuk menjaga langkah tetap dalam
                keberkahan.
              </p>
            </div>

            {/* TAB SELECTOR - Responsive widths */}
            <nav className="flex bg-white border border-slate-100 p-1.5 rounded-3xl shadow-sm w-full md:w-fit">
              {(["semua", "bookmark"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 md:flex-none px-6 py-3 rounded-[1.2rem] text-[11px] font-bold uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2",
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  {tab === "bookmark" && (
                    <Heart
                      className={cn(
                        "w-3 h-3",
                        activeTab === "bookmark" && "fill-current",
                      )}
                    />
                  )}
                  {tab === "semua"
                    ? "Katalog"
                    : `Favorit (${bookmarks.length})`}
                </button>
              ))}
            </nav>
          </div>

          {/* SEARCH BOX */}
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
              <div className="w-px h-4 bg-slate-100" />
            </div>
            <input
              type="text"
              placeholder="Cari ketenangan dalam doa..."
              className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none font-bold text-slate-600 placeholder:text-slate-300 placeholder:font-medium"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center py-32 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-200" />
            <p className="text-[10px] font-bold text-slate-300 tracking-[0.4em] uppercase">
              Membuka Lembaran...
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            <AnimatePresence mode="popLayout">
              {filteredDoa.length > 0 ? (
                filteredDoa.map((doa) => (
                  <motion.div
                    layout
                    key={doa.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className={cn(
                      "group bg-white border transition-all duration-700 rounded-[2.5rem] overflow-hidden",
                      expandedId === doa.id
                        ? "border-blue-100 shadow-2xl shadow-blue-500/5"
                        : "border-slate-100 hover:border-slate-200 shadow-sm",
                    )}
                  >
                    {/* CARD HEADER */}
                    <div
                      className="p-6 md:p-10 flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        setExpandedId(expandedId === doa.id ? null : doa.id)
                      }
                    >
                      <div className="flex items-center gap-6">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all duration-700",
                            expandedId === doa.id
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-200 rotate-6"
                              : "bg-slate-50 text-slate-400 group-hover:bg-slate-100",
                          )}
                        >
                          <span className="text-xs font-black">
                            {String(doa.id).padStart(2, "0")}
                          </span>
                          <Star
                            className={cn(
                              "w-2 h-2 mt-0.5",
                              expandedId === doa.id
                                ? "fill-white"
                                : "fill-slate-200",
                            )}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <h3
                            className={cn(
                              "text-lg md:text-xl font-bold tracking-tight transition-colors duration-500",
                              expandedId === doa.id
                                ? "text-blue-600"
                                : "text-slate-800",
                            )}
                          >
                            {doa.nama}
                          </h3>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg">
                              <Hash className="w-2.5 h-2.5 text-blue-400" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                {doa.grup}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(doa.id);
                          }}
                          className={cn(
                            "p-3 rounded-2xl transition-all duration-500",
                            bookmarks.includes(doa.id)
                              ? "text-rose-500 bg-rose-50"
                              : "text-slate-200 hover:text-rose-400 hover:bg-slate-50",
                          )}
                        >
                          <Heart
                            className={cn(
                              "w-5 h-5",
                              bookmarks.includes(doa.id) && "fill-current",
                            )}
                          />
                        </button>
                        <div
                          className={cn(
                            "p-2 rounded-xl transition-all duration-500",
                            expandedId === doa.id
                              ? "bg-blue-50 text-blue-600 rotate-180"
                              : "text-slate-200",
                          )}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* CARD CONTENT */}
                    <AnimatePresence>
                      {expandedId === doa.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.6,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <div className="px-6 md:px-14 pb-12 space-y-12">
                            <div className="h-px w-full bg-slate-100/50" />

                            {/* Arabic Section */}
                            <div className="space-y-10">
                              <h2
                                className="text-4xl md:text-6xl font-serif text-right leading-[2.2] text-slate-800 transition-all"
                                style={{ direction: "rtl" }}
                              >
                                {doa.ar}
                              </h2>
                              <div className="relative p-6 bg-blue-50/30 rounded-[2rem] border border-blue-100/30 group/tr">
                                <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-blue-100 rounded-full text-[9px] font-black text-blue-500 uppercase tracking-widest">
                                  Transliterasi
                                </div>
                                <p className="text-blue-600/90 text-sm md:text-lg font-bold italic leading-relaxed text-left">
                                  {doa.tr}
                                </p>
                              </div>
                            </div>

                            {/* Meaning Section */}
                            <div className="space-y-6">
                              <div className="flex items-center gap-3 text-slate-300">
                                <BookOpen className="w-5 h-5" />
                                <span className="text-xs font-black uppercase tracking-[0.2em]">
                                  Sari Tilawah
                                </span>
                              </div>
                              <p className="text-slate-600 text-base md:text-xl leading-relaxed font-medium">
                                {doa.idn}
                              </p>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex flex-col md:flex-row gap-6 items-center justify-between pt-10 border-t border-slate-50">
                              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                                {doa.tag.map((t: string) => (
                                  <span
                                    key={t}
                                    className="px-4 py-2 bg-slate-50 text-[10px] font-bold text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-500 transition-colors cursor-default"
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                              <button
                                onClick={() => handleCopy(doa)}
                                className={cn(
                                  "w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-700",
                                  copiedId === doa.id
                                    ? "bg-emerald-500 text-white shadow-2xl shadow-emerald-200"
                                    : "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200",
                                )}
                              >
                                {copiedId === doa.id ? (
                                  <>
                                    <Check className="w-4 h-4" /> Disalin
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" /> Salin Doa
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Explanation Section */}
                            {doa.tentang && (
                              <div className="p-6 md:p-8 bg-amber-50/50 rounded-[2rem] border border-amber-100/50 flex gap-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/20 rounded-full -mr-12 -mt-12" />
                                <Info className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                                <div className="space-y-2 relative z-10">
                                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">
                                    Hikmah & Referensi
                                  </p>
                                  <p className="text-sm text-amber-900/70 leading-relaxed font-bold">
                                    {doa.tentang}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-40 space-y-6"
                >
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-slate-100 rounded-full animate-ping opacity-20" />
                    <div className="relative w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-white">
                      <Heart className="w-8 h-8 text-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-900 font-bold text-lg tracking-tight">
                      Belum Ada Cahaya
                    </p>
                    <p className="text-slate-400 font-medium text-xs">
                      Coba cari dengan kata kunci lain atau periksa favorit
                      Anda.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
