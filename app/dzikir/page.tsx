"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Sun,
  Moon,
  Sparkles,
  Wind,
  Leaf,
  Quote,
  Check,
  BookOpen,
  Users2,
  ScrollText,
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

  // --- LOGIK SCROLL PROGRESS ---
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
      icon: Sun,
      theme: "text-amber-500",
      accent: "bg-amber-50",
    },
    {
      id: "sore",
      label: "Dzikir Sore",
      icon: Moon,
      theme: "text-indigo-500",
      accent: "bg-indigo-50",
    },
    {
      id: "sholat",
      label: "Setelah Sholat",
      icon: Sparkles,
      theme: "text-[#5465ff]",
      accent: "bg-blue-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32 pt-28 font-sans text-slate-900">
      {/* --- FLOATING PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#5465ff] z-[100] origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-5xl mx-auto px-4">
        {/* --- HEADER SECTION (Consistent with Quran/Asmaul Husna) --- */}
        <div className="mb-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter">
                Adzkar<span className="text-[#5465ff]">.</span>
              </h1>
              <p className="text-gray-500 font-medium mt-2">
                Temukan ketenangan hati melalui dzikir harian sesuai sunnah.
              </p>
            </div>

            {/* Tab Selector Inside Header Area */}
            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 w-fit">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id as DzikirType);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300",
                    activeTab === cat.id
                      ? "bg-slate-50 text-slate-900"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  <cat.icon
                    className={cn(
                      "w-3.5 h-3.5",
                      activeTab === cat.id ? cat.theme : "text-slate-300",
                    )}
                  />
                  <span className="hidden sm:inline">
                    {cat.label.split(" ")[1] || cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* --- MENU NAVIGASI INTERNAL (Consistent Pill Style) --- */}
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
              <div
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border",
                  pathname === "/dzikir"
                    ? "bg-[#5465ff] text-white border-[#5465ff] shadow-lg shadow-[#5465ff]/20"
                    : "bg-white text-gray-400 border-gray-100 hover:border-[#5465ff]/20 hover:text-[#5465ff]",
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Dzikir
              </div>
            </Link>
          </div>
        </div>

        {/* --- CONTENT LIST --- */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 hover:border-[#5465ff]/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-[#5465ff]/5"
                >
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-300 group-hover:bg-[#5465ff] group-hover:text-white transition-all duration-500 shadow-inner">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="px-4 py-1.5 rounded-full bg-[#5465ff]/5 border border-[#5465ff]/10 flex items-center gap-2">
                        <Check className="w-3 h-3 text-[#5465ff]" />
                        <span className="text-[9px] font-bold text-[#5465ff] uppercase tracking-widest">
                          Dibaca {item.ulang}
                        </span>
                      </div>
                    </div>
                    <Quote className="w-5 h-5 text-slate-100 group-hover:text-[#5465ff]/20 transition-colors" />
                  </div>

                  <div className="space-y-10">
                    <h2
                      className="text-3xl md:text-5xl font-serif text-right leading-[2.2] text-slate-800"
                      style={{ direction: "rtl" }}
                    >
                      {item.arab}
                    </h2>

                    <div className="relative pt-8 border-t border-slate-50">
                      <div className="flex items-center gap-2 mb-3">
                        <Leaf className="w-3.5 h-3.5 text-[#5465ff] opacity-40" />
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                          Terjemahan
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed italic">
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
