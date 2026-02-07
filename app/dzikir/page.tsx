"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Sun,
  Moon,
  Sparkles,
  Wind,
  Quote,
  Library,
  Compass,
  Zap,
  BookOpen,
  Users2,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Import data
import dzikirPagi from "@/lib/data/dzikir-pagi.json";
import dzikirSore from "@/lib/data/dzikir-sore.json";
import dzikirSholat from "@/lib/data/dzikir-sholat.json";

type DzikirType = "pagi" | "sore" | "sholat";

export default function DzikirPage() {
  const [activeTab, setActiveTab] = useState<DzikirType>("pagi");
  const [items, setItems] = useState<any[]>([]);
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const dataMap = {
      pagi: dzikirPagi.data,
      sore: dzikirSore.data,
      sholat: dzikirSholat.data,
    };
    setItems(dataMap[activeTab] || []);
  }, [activeTab]);

  const categories = [
    {
      id: "pagi",
      label: "Dzikir Pagi",
      desc: "Keberkahan awal hari",
      icon: Sun,
      theme: "text-amber-500",
    },
    {
      id: "sore",
      label: "Dzikir Sore",
      desc: "Ketenangan jelang malam",
      icon: Moon,
      theme: "text-indigo-500",
    },
    {
      id: "sholat",
      label: "Ba'da Sholat",
      desc: "Sempurnakan wajibmu",
      icon: Sparkles,
      theme: "text-[#5465ff]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32 pt-28 font-sans text-slate-900">
      {/* Progress Bar di bagian paling atas */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#5465ff] z-[100] origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-5xl mx-auto px-4">
        {/* --- HEADER SECTION --- */}
        <div className="mb-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="relative">
              <div className="absolute -top-6 -left-2 opacity-10">
                <Wind className="w-12 h-12 text-[#5465ff]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter">
                Dzikir<span className="text-[#5465ff]">.</span>
              </h1>
              <p className="text-gray-500 font-medium mt-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                Untaian doa penyejuk hati sesuai tuntunan sunnah.
              </p>
            </div>

            {/* --- TAB SELECTOR (RESPONSIVE WEB & MOBILE) --- */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-white border border-slate-100 rounded-[2rem] shadow-sm w-full md:max-w-xl">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id as DzikirType);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1.5 py-3 md:py-4 rounded-[1.5rem] transition-all duration-500",
                    activeTab === cat.id
                      ? "bg-slate-50 shadow-inner"
                      : "hover:bg-slate-50/50",
                  )}
                >
                  <cat.icon
                    className={cn(
                      "w-5 h-5 md:w-6 md:h-6 transition-transform duration-500",
                      activeTab === cat.id
                        ? `${cat.theme} scale-110`
                        : "text-slate-300",
                    )}
                  />
                  <div className="flex flex-col items-center text-center">
                    <span
                      className={cn(
                        "text-[10px] md:text-xs font-bold tracking-tight",
                        activeTab === cat.id
                          ? "text-slate-900"
                          : "text-slate-400",
                      )}
                    >
                      {cat.label}
                    </span>
                    <span
                      className={cn(
                        "hidden sm:block text-[8px] md:text-[9px] font-medium text-slate-400 mt-0.5 opacity-70",
                        activeTab === cat.id
                          ? "block"
                          : "hidden md:block opacity-40",
                      )}
                    >
                      {cat.desc}
                    </span>
                  </div>
                  {activeTab === cat.id && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-1.5 md:bottom-2 w-1.5 h-1.5 bg-[#5465ff] rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* --- INTERNAL FEATURE NAVIGATION --- */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-slate-100">
            <Link href="/al-quran">
              <div className="px-5 py-2.5 rounded-full text-xs font-bold bg-white text-gray-400 border border-gray-100 hover:border-[#5465ff]/20 hover:text-[#5465ff] transition-all flex items-center gap-2 whitespace-nowrap">
                <BookOpen className="w-3.5 h-3.5" />
                Al-Qur'an
              </div>
            </Link>

            <Link href="/asmaul-husna">
              <div className="px-5 py-2.5 rounded-full text-xs font-bold bg-white text-gray-400 border border-gray-100 hover:border-[#5465ff]/20 hover:text-[#5465ff] transition-all flex items-center gap-2 whitespace-nowrap">
                <Users2 className="w-3.5 h-3.5" />
                Asmaul Husna
              </div>
            </Link>

            <Link href="/dzikir">
              <div className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#5465ff] text-white border border-[#5465ff] shadow-lg shadow-[#5465ff]/20 transition-all flex items-center gap-2 whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5" />
                Dzikir
              </div>
            </Link>
          </div>
        </div>

        {/* --- DZIKIR CONTENT LIST --- */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-8"
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-14 hover:border-[#5465ff]/20 transition-all duration-700 shadow-sm hover:shadow-2xl hover:shadow-[#5465ff]/5"
                >
                  <div className="flex justify-between items-start mb-12">
                    <div className="flex items-start gap-4">
                      {/* Number Card */}
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-white shadow-inner group-hover:bg-[#5465ff] group-hover:text-white transition-all duration-700">
                        <span className="text-[10px] md:text-xs font-bold leading-none">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Library className="w-3 h-3 md:w-3.5 md:h-3.5 mt-1 opacity-20" />
                      </div>

                      <div className="space-y-2">
                        {/* Repeat Badge */}
                        <div className="px-4 py-1.5 rounded-full bg-[#5465ff]/5 border border-[#5465ff]/10 flex items-center gap-2 w-fit">
                          <Zap className="w-3 h-3 text-[#5465ff] animate-pulse" />
                          <span className="text-[9px] md:text-[10px] font-bold text-[#5465ff] uppercase tracking-widest">
                            Baca {item.ulang}x
                          </span>
                        </div>
                        <p className="hidden sm:block text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                          Ketulusan membawa ketenangan
                        </p>
                      </div>
                    </div>
                    <Compass className="w-6 h-6 text-slate-100 group-hover:text-[#5465ff]/20 transition-all duration-500" />
                  </div>

                  <div className="space-y-12">
                    {/* Arabic Text */}
                    <h2
                      className="text-3xl md:text-5xl font-serif text-right leading-[2.4] md:leading-[2.6] text-slate-800 transition-all duration-700 group-hover:text-gray-950"
                      style={{ direction: "rtl" }}
                    >
                      {item.arab}
                    </h2>

                    {/* Translation Section */}
                    <div className="relative pt-10 border-t border-slate-50">
                      <Quote className="absolute -top-4 left-0 w-8 h-8 text-[#5465ff]/10 group-hover:text-[#5465ff]/20 transition-colors" />
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-4 bg-[#5465ff] rounded-full" />
                        <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Arti & Makna
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm md:text-lg font-medium leading-relaxed italic pr-4">
                        "{item.indo}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
