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
} from "lucide-react";
import { getPrayerTimes, PrayerData } from "@/lib/getPrayerTimes";
import { getDailyHadith } from "@/lib/getDailyHadith";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
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
  const [nextPrayer, setNextPrayer] = useState({
    name: "...",
    time: "--:--",
    diff: "...",
  });

  useEffect(() => {
    async function loadInitialData() {
      // 1. Load Hadits Lokal (One Day One Hadith)
      const hadith = await getDailyHadith();
      if (hadith) setDailyHadith(hadith);

      // 2. Load Prayer Times
      const pData = await getPrayerTimes();
      if (pData) {
        setPrayerData(pData);
        calculateNextPrayer(pData.timings);
      }
    }
    loadInitialData();
  }, []);

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
      const prayerMinutes = h * 60 + m;

      if (prayerMinutes > currentMinutes) {
        const diff = prayerMinutes - currentMinutes;
        const hoursDiff = Math.floor(diff / 60);
        const minsDiff = diff % 60;

        setNextPrayer({
          name: prayer.name,
          time: prayer.time,
          diff: hoursDiff > 0 ? `-${hoursDiff}j ${minsDiff}m` : `-${minsDiff}m`,
        });
        found = true;
        break;
      }
    }
    if (!found)
      setNextPrayer({ name: "Imsak", time: timings.Imsak, diff: "Besok" });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 md:px-0 space-y-6"
    >
      {/* --- CARD HADITS DINAMIS (ONE DAY ONE HADITH) --- */}
      <motion.div variants={itemVariants}>
        <Card className="border-none bg-gradient-to-br from-[#5465ff] via-[#5465ff] to-[#7a89ff] text-white shadow-[0_20px_40px_rgba(84,101,255,0.2)] overflow-hidden relative group rounded-[2.5rem]">
          {/* Efek Cahaya Dekoratif */}
          <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />

          <CardContent className="p-8 relative z-10">
            <div className="flex justify-between items-start mb-6">
              <Badge className="bg-white/10 backdrop-blur-md border-none px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold font-mono">
                <Sparkles className="w-3 h-3 mr-2" /> One Day One Hadith
              </Badge>
              <Quote className="text-white/20 w-10 h-10 -mt-2" />
            </div>

            <AnimatePresence mode="wait">
              {dailyHadith ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <p
                    className="text-right text-3xl md:text-4xl font-serif leading-relaxed opacity-90 hidden md:block select-none"
                    style={{ direction: "rtl" }}
                  >
                    {dailyHadith.arab}
                  </p>
                  <p className="text-lg md:text-xl font-medium leading-relaxed tracking-wide italic font-sans border-l-2 border-white/20 pl-4">
                    "
                    {dailyHadith.id.length > 250
                      ? dailyHadith.id.substring(0, 250) + "..."
                      : dailyHadith.id}
                    "
                  </p>
                </motion.div>
              ) : (
                <div className="h-32 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin opacity-40" />
                  <p className="text-xs opacity-50 font-sans tracking-widest uppercase font-bold">
                    Sinkronisasi Hikmah...
                  </p>
                </div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-white/30" />
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70 font-mono">
                  {dailyHadith
                    ? `${dailyHadith.slug} — NO. ${dailyHadith.number}`
                    : "MEMUAT PERAWI"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* --- SMART ACTIVITY BAR --- */}
      <motion.div variants={itemVariants}>
        <div className="bg-white border border-gray-100 rounded-[2.2rem] p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row overflow-hidden transition-all hover:shadow-lg">
          {/* Section Imsak / Ramadhan Care */}
          <div className="flex-1 flex items-center gap-4 p-5 sm:p-6 border-b sm:border-b-0 sm:border-r border-gray-50 group">
            <div className="bg-orange-50 p-3.5 rounded-2xl flex-shrink-0 group-hover:bg-orange-100 transition-colors">
              <Timer className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded-full bg-orange-100/50 text-[9px] font-bold uppercase tracking-widest text-orange-700 mb-1.5 font-mono">
                Ramadhan Care
              </span>
              <p className="text-sm text-gray-800 font-bold leading-snug font-sans">
                {prayerData ? (
                  <>
                    Imsak pukul{" "}
                    <span className="text-orange-600 font-bold">
                      {prayerData.timings.Imsak}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-300">Menghitung...</span>
                )}
                <br />
                <span className="text-orange-600/60 font-medium text-[11px] italic">
                  Niatkan puasa dari sekarang ✨
                </span>
              </p>
            </div>
          </div>

          {/* Section Sholat Berikutnya */}
          <div className="flex-1 flex items-center justify-between p-5 sm:p-6 hover:bg-gray-50/50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="bg-[#5465ff]/5 p-3.5 rounded-2xl group-hover:bg-[#5465ff]/10 transition-colors">
                <BellRing className="w-6 h-6 text-[#5465ff] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest font-mono">
                    Berikutnya
                  </p>
                  <span className="text-[9px] font-bold text-[#5465ff] bg-[#5465ff]/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    {nextPrayer.diff}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 font-sans">
                  <p className="text-xl font-bold text-gray-800 tracking-tight">
                    {nextPrayer.name}
                  </p>
                  <p className="text-2xl font-bold text-[#5465ff] tracking-tighter font-mono">
                    {nextPrayer.time}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#5465ff] group-hover:text-white transition-all shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
