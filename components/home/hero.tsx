"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Quote,
  BellRing,
  Timer,
  Sparkles,
  ArrowRight,
  Loader2,
  Fingerprint,
  Calculator,
  MapPin,
  Type,
  Sun,
  Zap,
} from "lucide-react";
import { getPrayerTimes, PrayerData } from "@/lib/getPrayerTimes";
import { getDailyHadith } from "@/lib/getDailyHadith";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HeroSection() {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [dailyHadith, setDailyHadith] = useState<any>(null);
  const [tracker, setTracker] = useState<Record<string, boolean>>({});
  const [nextPrayer, setNextPrayer] = useState({
    name: "...",
    time: "--:--",
    diff: "...",
  });

  const prayerList = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya", "Tarawih"];

  useEffect(() => {
    async function loadData() {
      const [hadith, pData] = await Promise.all([
        getDailyHadith(),
        getPrayerTimes(),
      ]);
      if (hadith) setDailyHadith(hadith);
      if (pData) {
        setPrayerData(pData);
        calculateNextPrayer(pData.timings);
      }

      const savedTracker = localStorage.getItem("ibadah_tracker");
      if (savedTracker) setTracker(JSON.parse(savedTracker));
    }
    loadData();
  }, []);

  const toggleTracker = (name: string) => {
    const newTracker = { ...tracker, [name]: !tracker[name] };
    setTracker(newTracker);
    localStorage.setItem("ibadah_tracker", JSON.stringify(newTracker));
  };

  const calculateNextPrayer = (timings: any) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayers = [
      { name: "Imsak", time: timings.Imsak },
      { name: "Subuh", time: timings.Fajr },
      { name: "Dzuhur", time: timings.Dhuhr },
      { name: "Ashar", time: timings.Asr },
      { name: "Maghrib", time: timings.Maghrib },
      { name: "Isya", time: timings.Isha },
    ];

    let found = false;
    for (let prayer of prayers) {
      const [h, m] = prayer.time.split(":").map(Number);
      if (h * 60 + m > currentMinutes) {
        const diff = h * 60 + m - currentMinutes;
        setNextPrayer({
          name: prayer.name,
          time: prayer.time,
          diff:
            diff > 60 ? `${Math.floor(diff / 60)}j ${diff % 60}m` : `${diff}m`,
        });
        found = true;
        break;
      }
    }
    if (!found)
      setNextPrayer({ name: "Imsak", time: timings.Imsak, diff: "Besok" });
  };

  const completedCount = Object.values(tracker).filter(Boolean).length;
  const progressPercentage = Math.round(
    (completedCount / prayerList.length) * 100,
  );

  const shortcuts = [
    { icon: Sun, label: "Dzikir", href: "/dzikir" },
    { icon: Fingerprint, label: "Tasbih", href: "/tasbih" },
    { icon: Calculator, label: "Zakat", href: "/kalkulator" },
    { icon: MapPin, label: "Masjid", href: "/ramadhan/masjid-terdekat" },
    { icon: Type, label: "Asmaul", href: "/asmaul-husna" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 md:px-0 space-y-5 md:space-y-6 pb-12 w-full max-w-full overflow-x-hidden"
    >
      {/* 1. SMART ACTIVITY BAR */}
      <motion.div variants={itemVariants} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#5465ff] to-cyan-400 rounded-[2rem] md:rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative bg-white border border-gray-100 rounded-[2rem] md:rounded-[3rem] p-1.5 flex flex-col md:flex-row items-center shadow-sm">
          <div className="flex-1 flex items-center gap-3 md:gap-4 px-4 py-3 md:px-6 md:py-3 w-full border-b md:border-b-0 md:border-r border-gray-50">
            <div className="bg-[#5465ff]/10 p-2.5 md:p-3 rounded-full text-[#5465ff] flex-shrink-0">
              <BellRing className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 tracking-widest truncate">
                Berikutnya
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl font-black text-gray-800 truncate">
                  {nextPrayer.name}
                </span>
                <span className="text-lg md:text-xl font-mono font-light text-[#5465ff]">
                  {nextPrayer.time}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-between px-4 py-3 md:px-6 md:py-3 w-full">
            <div className="flex items-center gap-3">
              <Timer className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
              <span className="text-xs md:text-sm font-bold text-gray-700">
                {nextPrayer.diff} lagi
              </span>
            </div>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#5465ff] group-hover:text-white transition-all cursor-pointer">
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. FLOATING SHORTCUTS - Unified Dock */}
      <motion.div
        variants={itemVariants}
        className="flex justify-center w-full px-2"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 p-2 md:p-3 rounded-full md:rounded-[2.5rem] shadow-xl shadow-blue-500/5 flex items-center gap-2 md:gap-3 w-fit">
          {shortcuts.map((s, i) => (
            <motion.a
              key={i}
              href={s.href}
              whileHover={{ y: -5, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-10 h-10 md:w-12 md:h-12 flex flex-col items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors duration-300 group"
            >
              <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-gray-800 text-white text-[9px] px-2 py-1 rounded-md font-bold uppercase tracking-tighter hidden md:block">
                {s.label}
              </span>
              <s.icon className="w-4 h-4 md:w-5 md:h-5 group-active:text-[#5465ff]" />
            </motion.a>
          ))}
          <div className="h-5 w-px bg-gray-100 mx-0.5" />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-[#5465ff]/5 text-[#5465ff]"
          >
            <Zap className="w-3 h-3 md:w-4 md:h-4 fill-current" />
          </motion.button>
        </div>
      </motion.div>

      {/* 3. HADITH CARD */}
      <motion.div variants={itemVariants}>
        <Card className="border-none bg-gradient-to-br from-[#5465ff] to-[#7a89ff] text-white shadow-xl overflow-hidden relative rounded-tl-[3rem] rounded-br-[3rem] md:rounded-tl-[4rem] md:rounded-br-[4rem] rounded-tr-xl rounded-bl-xl">
          <div className="absolute top-[-10%] right-[-5%] w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-full blur-3xl" />
          <CardContent className="p-6 md:p-10 relative z-10">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <Badge className="bg-white/20 backdrop-blur-md border-none px-2.5 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em]">
                Satu Hari Satu Hadist
              </Badge>
              <Quote className="text-white/20 w-8 h-8 md:w-10 md:h-10 rotate-180" />
            </div>

            <AnimatePresence mode="wait">
              {dailyHadith ? (
                <div className="space-y-4 md:y-6">
                  <p
                    className="text-right text-xl md:text-3xl font-serif leading-relaxed opacity-95 select-none"
                    style={{ direction: "rtl" }}
                  >
                    {dailyHadith.arab}
                  </p>
                  <div className="bg-black/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-5 border border-white/5">
                    <p className="text-[11px] md:text-sm font-light leading-relaxed opacity-90 italic text-blue-50">
                      "{dailyHadith.id}"
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-cyan-300" />
                    <p className="text-[8px] md:text-[10px] font-mono opacity-60 uppercase tracking-widest truncate">
                      {dailyHadith.slug} — NO. {dailyHadith.number}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-24 md:h-32 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-white/50" />
                  <span className="text-[8px] tracking-widest uppercase opacity-40">
                    Sinkronisasi...
                  </span>
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* 4. PROGRESS TRACKER */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6"
      >
        {/* Progress Summary */}
        <div className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-sm flex flex-row md:flex-col items-center md:justify-center gap-4 md:text-center">
          <div className="relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle
                className="text-gray-100"
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <motion.path
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${progressPercentage}, 100` }}
                className="text-[#5465ff]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm md:text-xl font-black text-gray-800 leading-none">
                {progressPercentage}%
              </span>
            </div>
          </div>
          <div className="flex flex-col md:items-center">
            <h3 className="text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-tighter">
              Rutinitas Ibadah
            </h3>
            <p className="text-[9px] md:text-[10px] text-gray-400">
              {completedCount}/{prayerList.length} selesai
            </p>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:col-span-2">
          {prayerList.map((prayer) => (
            <button
              key={prayer}
              onClick={() => toggleTracker(prayer)}
              className={`group flex flex-col items-start p-3 md:p-4 rounded-2xl md:rounded-[1.8rem] border transition-all duration-300 ${
                tracker[prayer]
                  ? "bg-[#5465ff] border-[#5465ff] text-white shadow-md shadow-blue-100"
                  : "bg-white border-gray-100 text-gray-600 active:bg-blue-50"
              }`}
            >
              <div
                className={`p-1.5 md:p-2 rounded-lg mb-2 md:mb-3 ${tracker[prayer] ? "bg-white/20" : "bg-gray-50"}`}
              >
                <Zap
                  className={`w-3 h-3 ${tracker[prayer] ? "text-white" : "text-gray-400"}`}
                />
              </div>
              <span className="text-[10px] md:text-[11px] font-bold tracking-tight">
                {prayer}
              </span>
              <span
                className={`text-[7px] md:text-[8px] uppercase mt-0.5 ${tracker[prayer] ? "text-blue-100" : "text-gray-300"}`}
              >
                {tracker[prayer] ? "Selesai" : "Pending"}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
