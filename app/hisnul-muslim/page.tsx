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
    <div className="min-h-screen bg-[#F8F9FA] pb-32 pt-12 md:pt-20 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto px-6">
        {/* --- HEADER --- */}
        <header className="mb-12 space-y-8 mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-50 rounded-lg">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Daily Supplication
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                Kumpulan <span className="font-bold text-slate-500">Doa</span>
              </h1>
            </div>

            {/* TAB SELECTOR */}
            <nav className="flex bg-white border border-slate-100 p-1 rounded-2xl shadow-sm">
              {(["semua", "bookmark"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-5 py-2 rounded-xl text-xs font-medium transition-all duration-300 flex items-center gap-2",
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-md"
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
                    ? "Semua Doa"
                    : `Tersimpan (${bookmarks.length})`}
                </button>
              ))}
            </nav>
          </div>

          {/* SEARCH BOX */}
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari doa (misal: Tahajud, Makan)..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none font-medium text-slate-600"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center py-32 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
            <p className="text-xs font-medium text-slate-400 tracking-widest uppercase">
              Memuat Hikmah...
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredDoa.length > 0 ? (
                filteredDoa.map((doa) => (
                  <motion.div
                    layout
                    key={doa.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className={cn(
                      "group bg-white border transition-all duration-500 rounded-[2rem]",
                      expandedId === doa.id
                        ? "border-blue-100 shadow-xl shadow-blue-500/5"
                        : "border-slate-100 hover:border-slate-200 shadow-sm",
                    )}
                  >
                    {/* CARD HEADER */}
                    <div
                      className="p-6 md:p-8 flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        setExpandedId(expandedId === doa.id ? null : doa.id)
                      }
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-500",
                            expandedId === doa.id
                              ? "bg-slate-900 text-white"
                              : "bg-slate-50 text-slate-400",
                          )}
                        >
                          {String(doa.id).padStart(2, "0")}
                        </div>
                        <div className="space-y-1">
                          <h3
                            className={cn(
                              "text-lg font-semibold tracking-tight transition-colors",
                              expandedId === doa.id
                                ? "text-blue-600"
                                : "text-slate-800",
                            )}
                          >
                            {doa.nama}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Hash className="w-3 h-3 text-slate-300" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              {doa.grup}
                            </span>
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
                            "p-2.5 rounded-full transition-all active:scale-90",
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
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 text-slate-300 transition-transform duration-500",
                            expandedId === doa.id && "rotate-180 text-blue-500",
                          )}
                        />
                      </div>
                    </div>

                    {/* CARD CONTENT */}
                    <AnimatePresence>
                      {expandedId === doa.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "circOut" }}
                        >
                          <div className="px-6 md:px-12 pb-10 space-y-10">
                            <div className="h-px w-full bg-slate-50" />

                            <div className="space-y-8">
                              <h2
                                className="text-3xl md:text-5xl font-serif text-right leading-[1.8] text-slate-800"
                                style={{ direction: "rtl" }}
                              >
                                {doa.ar}
                              </h2>
                              <p className="text-blue-600/80 text-sm md:text-base font-medium italic leading-relaxed text-left border-l-2 border-blue-100 pl-4">
                                {doa.tr}
                              </p>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-slate-400">
                                <BookOpen className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                  Terjemahan
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed font-normal">
                                {doa.idn}
                              </p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-6 border-t border-slate-50">
                              <div className="flex gap-2 flex-wrap justify-center">
                                {doa.tag.map((t: string) => (
                                  <span
                                    key={t}
                                    className="px-3 py-1 bg-slate-50 text-[10px] font-medium text-slate-400 rounded-lg"
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                              <button
                                onClick={() => handleCopy(doa)}
                                className={cn(
                                  "w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold transition-all duration-300",
                                  copiedId === doa.id
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                                    : "bg-slate-900 text-white hover:bg-blue-600 shadow-md",
                                )}
                              >
                                {copiedId === doa.id ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                                {copiedId === doa.id
                                  ? "Berhasil Disalin"
                                  : "Salin Doa"}
                              </button>
                            </div>

                            {doa.tentang && (
                              <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100/50 flex gap-4">
                                <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                                    Penjelasan & Sumber
                                  </p>
                                  <p className="text-xs text-amber-800/70 leading-relaxed font-medium">
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
                <div className="text-center py-32 space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-medium text-sm">
                    Tidak menemukan doa yang dicari.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
