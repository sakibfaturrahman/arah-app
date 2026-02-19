"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Clock,
  Volume2,
  VolumeX,
  Sparkles,
  Sunrise,
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Coffee,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { getPrayerTimes, PRAYER_LIST } from "@/lib/getPrayerTimes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const PRAYER_ICONS: Record<string, any> = {
  Imsak: Coffee,
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: SunMedium,
  Maghrib: Sunset,
  Isha: Moon,
};

export default function PrayerTimeTable() {
  const [timings, setTimings] = useState<any>(null);
  const [activePrayer, setActivePrayer] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAudioAllowed, setIsAudioAllowed] = useState(true);

  const adzanRegularRef = useRef<HTMLAudioElement | null>(null);
  const adzanSubuhRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!adzanRegularRef.current)
      adzanRegularRef.current = new Audio("/adzan/adzan.mp3");
    if (!adzanSubuhRef.current)
      adzanSubuhRef.current = new Audio("/adzan/adzan-shubuh.mp3");

    async function loadData() {
      const data = await getPrayerTimes();
      if (data) {
        setTimings(data.timings);
        checkActivePrayer(data.timings);
      }
    }
    loadData();

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      if (timings) {
        checkActivePrayer(timings);
        if (now.getSeconds() === 0) handleAutoAdzan(timeStr, timings);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timings]);

  const enableAudio = () => {
    setIsMuted(false);
    adzanRegularRef.current
      ?.play()
      .then(() => {
        adzanRegularRef.current?.pause();
        setIsAudioAllowed(true);
      })
      .catch(() => setIsAudioAllowed(false));
  };

  const handleAutoAdzan = (timeStr: string, prayerTimings: any) => {
    if (isMuted) return;
    if (prayerTimings.Fajr === timeStr) {
      adzanSubuhRef.current?.play().catch(() => setIsAudioAllowed(false));
      return;
    }
    const otherPrayers = ["Dhuhr", "Asr", "Maghrib", "Isha"];
    if (otherPrayers.some((key) => prayerTimings[key] === timeStr)) {
      adzanRegularRef.current?.play().catch(() => setIsAudioAllowed(false));
    }
  };

  const checkActivePrayer = (data: any) => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    let currentActive = "";
    for (let i = 0; i < PRAYER_LIST.length; i++) {
      const [h, m] = data[PRAYER_LIST[i].key].split(":").map(Number);
      const prayerMins = h * 60 + m;
      const nextPrayerObj = PRAYER_LIST[i + 1];
      let nextMins = 1440;
      if (nextPrayerObj) {
        const [nh, nm] = data[nextPrayerObj.key].split(":").map(Number);
        nextMins = nh * 60 + nm;
      }
      if (currentMins >= prayerMins && currentMins < nextMins) {
        currentActive = PRAYER_LIST[i].key;
        break;
      }
    }
    setActivePrayer(currentActive);
  };

  if (!mounted || !timings) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 px-4 py-6">
      {/* Alert Audio - Lebih Ringkas */}
      <AnimatePresence>
        {!isAudioAllowed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl mb-4">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[11px] font-medium">
                  Klik untuk mengaktifkan suara Adzan otomatis
                </span>
              </div>
              <button
                onClick={enableAudio}
                className="text-[10px] font-bold text-white bg-amber-500 px-3 py-1.5 rounded-lg shadow-sm"
              >
                AKTIFKAN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#5465ff]">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              Jadwal Shalat
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Waktu Ibadah
          </h2>
        </div>

        <button
          onClick={() => (isMuted ? enableAudio() : setIsMuted(true))}
          className={cn(
            "group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-[11px] font-bold border",
            isMuted
              ? "bg-slate-50 text-slate-400 border-slate-200"
              : "bg-white text-[#5465ff] border-[#5465ff]/20 shadow-sm hover:shadow-md",
          )}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
          )}
          {isMuted ? "ADZAN NONAKTIF" : "ADZAN AKTIF"}
        </button>
      </div>

      {/* Grid Utama - Menggunakan Flex/Grid yang lebih rapat */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRAYER_LIST.map((prayer) => {
          const isActive = activePrayer === prayer.key;
          const Icon = PRAYER_ICONS[prayer.key] || Clock;
          const time = timings[prayer.key];

          return (
            <motion.div
              key={prayer.key}
              whileHover={{ y: -2 }}
              className={cn(
                "relative flex items-center p-4 rounded-2xl border transition-all duration-300",
                isActive
                  ? "bg-white border-[#5465ff] shadow-[0_10px_30px_-10px_rgba(84,101,255,0.3)] ring-1 ring-[#5465ff]/10"
                  : "bg-slate-50/50 border-slate-100 hover:border-slate-200",
              )}
            >
              <div
                className={cn(
                  "p-2.5 rounded-xl mr-4",
                  isActive
                    ? "bg-[#5465ff] text-white shadow-lg"
                    : "bg-white text-slate-400 shadow-sm",
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-[9px] font-black tracking-widest uppercase mb-0.5",
                    isActive ? "text-[#5465ff]" : "text-slate-400",
                  )}
                >
                  {prayer.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      "text-xl font-bold font-mono tracking-tight",
                      isActive ? "text-slate-900" : "text-slate-600",
                    )}
                  >
                    {time}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-bold text-[#5465ff] animate-pulse ml-1">
                      SEKARANG
                    </span>
                  )}
                </div>
              </div>

              {isActive && (
                <div className="ml-auto">
                  <ChevronRight className="w-4 h-4 text-[#5465ff]/40" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
