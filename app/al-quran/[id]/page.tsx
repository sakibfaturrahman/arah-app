"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageSquareText,
  Copy,
  Loader2,
  CheckCircle2,
  Play,
  Pause,
} from "lucide-react";
import { getDetailSurah, getTafsirSurah } from "@/lib/getQuran";
import { cn } from "@/lib/utils";

export default function DetailSurah() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [tafsirData, setTafsirData] = useState<any>(null);
  const [view, setView] = useState<"ayat" | "tafsir">("ayat");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // --- PROGRESS BAR LOGIC ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // State Audio
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      try {
        const [resAyat, resTafsir] = await Promise.all([
          getDetailSurah(id as string),
          getTafsirSurah(id as string),
        ]);
        setData(resAyat);
        setTafsirData(resTafsir);

        if (resAyat?.audio) {
          audioRef.current = new Audio(resAyat.audio);
          audioRef.current.onended = () => setIsPlaying(false);
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    loadData();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [id]);

  const toggleFullAudio = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") console.error("Audio error:", err);
    }
  };

  const handleShare = async (ayat: any) => {
    const textToCopy = `${ayat.ar}\n\n"${ayat.idn}"\n(QS. ${data.nama_latin}: ${ayat.nomor})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(ayat.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Gagal menyalin", err);
    }
  };

  const goToSurah = (targetId: number) => {
    if (targetId >= 1 && targetId <= 114) {
      router.push(`/al-quran/${targetId}`);
    }
  };

  if (!data)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#fafafa]">
        <Loader2 className="animate-spin text-[#5465ff] w-10 h-10" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
          Memuat Surah...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-44 font-sans">
      {/* 1. PROGRESS BAR (Indikator Scroll) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#5465ff] z-[60] origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-3xl mx-auto px-4 pt-12">
        {/* Toggle View Mobile */}
        <div className="md:hidden flex bg-gray-100 p-1.5 rounded-2xl mb-8 border border-gray-200/50 shadow-inner">
          <button
            onClick={() => setView("ayat")}
            className={cn(
              "flex-1 py-3 rounded-xl font-black text-xs transition-all",
              view === "ayat"
                ? "bg-white text-[#5465ff] shadow-sm"
                : "text-gray-400",
            )}
          >
            Ayat
          </button>
          <button
            onClick={() => setView("tafsir")}
            className={cn(
              "flex-1 py-3 rounded-xl font-black text-xs transition-all",
              view === "tafsir"
                ? "bg-white text-[#5465ff] shadow-sm"
                : "text-gray-400",
            )}
          >
            Tafsir
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === "ayat" ? (
            <motion.div
              key="ayat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Pembukaan */}
              <div className="text-center space-y-6 py-10 mb-4 mt-14">
                <p className="text-xl md:text-2xl font-serif text-gray-400 italic">
                  أَعُوْذُ بِاللّٰهِ مِنَ الشَّيْطٰنِ الرَّجِيْمِ
                </p>
                {data.nomor !== 9 && (
                  <p className="text-4xl md:text-5xl font-serif text-gray-800 tracking-wide">
                    بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                  </p>
                )}
              </div>

              {data.ayat.map((ayat: any) => (
                <div
                  key={ayat.id}
                  className="p-6 md:p-10 bg-white rounded-[2.5rem] border border-gray-100 space-y-8 shadow-sm group"
                >
                  <div className="flex justify-between items-center">
                    <span className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 border border-gray-100">
                      {ayat.nomor}
                    </span>
                    <button
                      onClick={() => handleShare(ayat)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest",
                        copiedId === ayat.id
                          ? "bg-green-500 text-white shadow-lg shadow-green-200"
                          : "bg-gray-50 text-gray-400 hover:bg-[#5465ff] hover:text-white",
                      )}
                    >
                      {copiedId === ayat.id ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Salin Ayat
                        </>
                      )}
                    </button>
                  </div>
                  <p
                    className="text-right text-3xl md:text-5xl leading-[4.5rem] md:leading-[6.5rem] font-serif text-gray-800"
                    style={{ direction: "rtl" }}
                  >
                    {ayat.ar}
                  </p>
                  <div className="space-y-4 pt-6 border-t border-gray-50">
                    <p
                      className="text-[#5465ff] text-sm md:text-base font-medium leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: ayat.tr }}
                    />
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                      {ayat.idn}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="tafsir"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {tafsirData?.tafsir?.map((t: any) => (
                <div
                  key={t.id}
                  className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm"
                >
                  <div className="px-4 py-1.5 bg-[#5465ff] text-white rounded-xl text-[10px] font-black tracking-widest uppercase inline-block mb-6">
                    Ayat {t.ayat}
                  </div>
                  <p className="text-gray-700 leading-loose text-justify font-medium whitespace-pre-line">
                    {t.tafsir}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- FULL-WIDTH BOTTOM CONTROL BAR (NAVIGASI & AUDIO) --- */}
      <div className="hidden md:flex fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-2xl border-t border-gray-100 px-8 py-5">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            <div className="flex gap-2">
              <button
                disabled={parseInt(id as string) <= 1}
                onClick={() => goToSurah(parseInt(id as string) - 1)}
                className="p-3.5 rounded-2xl bg-gray-50 hover:bg-[#5465ff] hover:text-white transition-all disabled:opacity-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                disabled={parseInt(id as string) >= 114}
                onClick={() => goToSurah(parseInt(id as string) + 1)}
                className="p-3.5 rounded-2xl bg-gray-50 hover:bg-[#5465ff] hover:text-white transition-all disabled:opacity-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col min-w-[160px]">
              <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">
                {data.nama} <span className="font-medium">·</span>{" "}
                {data.nama_latin}
              </h2>
              <p className="text-[10px] font-semibold text-[#5465ff] tracking-[0.25em] mt-2">
                {data.arti} • {data.jumlah_ayat} ayat
              </p>
            </div>
          </div>

          {/* Audio Player Tengah */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={toggleFullAudio}
              className={cn(
                "flex items-center gap-4 px-10 py-4 rounded-[1.5rem] font-semibold text-xs tracking-[0.15em] transition-all shadow-xl",
                isPlaying
                  ? "bg-orange-500 text-white shadow-orange-200"
                  : "bg-[#5465ff] text-white shadow-blue-200",
              )}
            >
              {isPlaying ? (
                <Pause className="fill-current w-4 h-4" />
              ) : (
                <Play className="fill-current w-4 h-4" />
              )}
              {isPlaying ? "Jeda lantunan" : "Putar lantunan ayat"}
            </button>
          </div>

          <div className="flex-1 flex justify-end">
            <div className="flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/50">
              <button
                onClick={() => setView("ayat")}
                className={cn(
                  "flex items-center gap-3 px-8 py-3 rounded-xl font-semibold text-xs transition-all",
                  view === "ayat"
                    ? "bg-white text-[#5465ff] shadow-md shadow-blue-100"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                <BookOpen className="w-4 h-4" />
                Ayat
              </button>
              <button
                onClick={() => setView("tafsir")}
                className={cn(
                  "flex items-center gap-3 px-8 py-3 rounded-xl font-semibold text-xs transition-all",
                  view === "tafsir"
                    ? "bg-white text-[#5465ff] shadow-md shadow-blue-100"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                <MessageSquareText className="w-4 h-4" />
                Tafsir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
