"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Clock,
  Volume2,
  VolumeX,
  BellRing,
  Sparkles,
  Sunrise,
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Coffee,
  AlertCircle,
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

  // State untuk melacak apakah browser mengizinkan audio
  const [isAudioAllowed, setIsAudioAllowed] = useState(true);

  const adzanRegularRef = useRef<HTMLAudioElement | null>(null);
  const adzanSubuhRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);

    // Inisialisasi Audio
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
        // Jalankan auto adzan hanya pada detik 00 agar tidak re-trigger dalam satu menit
        if (now.getSeconds() === 0) {
          handleAutoAdzan(timeStr, timings);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timings]);

  // Fungsi untuk "memancing" izin autoplay dari browser
  const enableAudio = () => {
    setIsMuted(false);
    // Memutar audio kosong/sejenak untuk membuka kunci audio browser
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
      adzanSubuhRef.current?.play().catch((err) => {
        console.log("Autoplay diblokir browser:", err);
        setIsAudioAllowed(false);
      });
      return;
    }

    const otherPrayers = ["Dhuhr", "Asr", "Maghrib", "Isha"];
    if (otherPrayers.some((key) => prayerTimings[key] === timeStr)) {
      adzanRegularRef.current?.play().catch((err) => {
        console.log("Autoplay diblokir browser:", err);
        setIsAudioAllowed(false);
      });
    }
  };

  // ... (checkActivePrayer & getPrayerStatus tetap sama seperti kode Anda) ...
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

  const getPrayerStatus = (prayerTime: string) => {
    if (!prayerTime) return null;
    const [h, m] = prayerTime.split(":").map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(h, m, 0);
    const diffInMs = currentTime.getTime() - prayerDate.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    if (diffInMins === 0)
      return {
        label: "Sekarang",
        color: "text-emerald-500 animate-pulse bg-emerald-50",
      };
    if (diffInMins > 0 && diffInMins < 60)
      return {
        label: `${diffInMins}m lalu`,
        color: "text-amber-500 bg-amber-50",
      };
    return null;
  };

  if (!mounted || !timings) return null;

  return (
    <div className="w-full space-y-6 mt-5">
      {/* Alert Jika Audio Belum Diizinkan */}
      <AnimatePresence>
        {!isAudioAllowed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 md:mx-0 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <p className="text-xs font-medium text-amber-800">
                Browser membatasi suara otomatis. Klik aktifkan untuk mendengar
                Adzan.
              </p>
            </div>
            <button
              onClick={enableAudio}
              className="px-4 py-2 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-xl"
            >
              Aktifkan
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 md:px-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#5465ff]/10 rounded-2xl">
            <Sparkles className="w-5 h-5 text-[#5465ff]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-none">
              Jadwal Shalat
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide uppercase">
              Waktu setempat
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isMuted) enableAudio();
            else setIsMuted(true);
          }}
          className={cn(
            "flex items-center justify-center gap-2 px-6 py-3 rounded-2xl transition-all text-xs font-bold uppercase tracking-widest",
            isMuted
              ? "bg-slate-100 text-slate-400 border border-slate-200"
              : "bg-[#5465ff] text-white shadow-lg",
          )}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
          {isMuted ? "Suara Adzan Mati" : "Suara Adzan Aktif"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 px-4 md:px-0">
        {PRAYER_LIST.map((prayer) => {
          const isActive = activePrayer === prayer.key;
          const status = getPrayerStatus(timings[prayer.key]);
          const Icon = PRAYER_ICONS[prayer.key] || Clock;

          return (
            <motion.div
              key={prayer.key}
              animate={isActive ? { scale: 1.02 } : { scale: 1 }}
              className={cn(
                "relative group flex flex-col p-5 rounded-[2rem] border transition-all duration-500 overflow-hidden",
                isActive
                  ? "bg-white border-[#5465ff] shadow-xl"
                  : "bg-white/40 backdrop-blur-sm border-slate-100",
              )}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={cn(
                    "p-3 rounded-2xl",
                    isActive
                      ? "bg-[#5465ff] text-white"
                      : "bg-slate-50 text-slate-400",
                  )}
                >
                  <Icon
                    className={cn("w-6 h-6", isActive && "animate-pulse")}
                  />
                </div>
                {status && (
                  <span
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-tighter px-2 py-1 rounded-lg",
                      status.color,
                    )}
                  >
                    {status.label}
                  </span>
                )}
              </div>
              <div className="mt-auto space-y-1">
                <h3
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em]",
                    isActive ? "text-[#5465ff]" : "text-slate-400",
                  )}
                >
                  {prayer.label}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-3xl sm:text-4xl font-bold font-mono tracking-tighter",
                      isActive ? "text-slate-900" : "text-slate-600",
                    )}
                  >
                    {timings[prayer.key]}
                  </span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5465ff] animate-ping" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
