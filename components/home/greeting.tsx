"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Sun,
  SunMoon,
  Moon,
  CloudSun,
  RefreshCw,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { getHijriDate } from "@/lib/getHijri";
import { getPrayerTimes, PRAYER_LIST } from "@/lib/getPrayerTimes";
import { cn } from "@/lib/utils";

export default function IntegratedGreeting() {
  const [time, setTime] = useState(new Date());
  const [timings, setTimings] = useState<any>(null);
  const [activePrayer, setActivePrayer] = useState<string>("");
  const [hijriDate, setHijriDate] = useState<string>("Memuat...");
  const [locationName, setLocationName] = useState<string>("Mencari Lokasi...");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchLocationName = useCallback(async () => {
    const savedLoc = localStorage.getItem("user-location");
    if (savedLoc) {
      try {
        const { lat, lng } = JSON.parse(savedLoc);
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`,
        );
        const data = await response.json();
        setLocationName(data.city || data.locality || "Lokasi Aktif");
      } catch (error) {
        setLocationName("Lokasi Terdeteksi");
      }
    }
  }, []);

  const handleUpdateLocation = () => {
    if ("geolocation" in navigator) {
      setIsRefreshing(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          localStorage.setItem(
            "user-location",
            JSON.stringify({ lat: latitude, lng: longitude }),
          );
          fetchLocationName().then(() => {
            setTimeout(() => {
              setIsRefreshing(false);
              window.location.reload();
            }, 800);
          });
        },
        () => setIsRefreshing(false),
      );
    }
  };

  const checkActivePrayer = useCallback((data: any) => {
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
  }, []);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    getHijriDate().then((res) => res && setHijriDate(res));
    getPrayerTimes().then((data) => {
      if (data) {
        setTimings(data.timings);
        checkActivePrayer(data.timings);
      }
    });
    fetchLocationName();
    return () => clearInterval(timer);
  }, [fetchLocationName, checkActivePrayer]);

  if (!mounted) return null;

  const hours = time.getHours();
  const getGreeting = () => {
    if (hours >= 5 && hours < 11)
      return {
        text: "Selamat Pagi",
        icon: <Sun className="text-amber-500" />,
      };
    if (hours >= 11 && hours < 15)
      return {
        text: "Selamat Siang",
        icon: <CloudSun className="text-orange-400" />,
      };
    if (hours >= 15 && hours < 18)
      return {
        text: "Selamat Sore",
        icon: <SunMoon className="text-orange-500" />,
      };
    return {
      text: "Selamat Malam",
      icon: <Moon className="text-indigo-400" />,
    };
  };

  const { text, icon } = getGreeting();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      /* Background tetap putih */
      className="relative w-full min-h-[500px] pt-12 pb-20 overflow-hidden bg-white transition-colors duration-1000"
    >
      {/* Background Glow tetap biru lembut */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_rgba(84,101,255,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 px-6 max-w-lg mx-auto flex flex-col items-center">
        {/* Header: Greeting & Location */}
        <div className="w-full flex justify-between items-start mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {/* Teks tetap abu-abu gelap */}
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                {text}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#5465ff] animate-pulse" />
            </div>
            {/* Judul tetap hitam */}
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Assalamu’alaikum<span className="text-[#5465ff]">.</span>
            </h2>
          </div>

          <button
            onClick={handleUpdateLocation}
            className="flex items-center gap-2 py-2 px-3 rounded-2xl border transition-all active:scale-95 bg-slate-50 border-slate-100 text-slate-600"
          >
            <MapPin className="w-3.5 h-3.5 text-[#5465ff]" />
            <span className="text-[10px] font-bold truncate max-w-[80px] uppercase tracking-wider">
              {locationName}
            </span>
            <RefreshCw
              className={cn(
                "w-3 h-3 opacity-50",
                isRefreshing && "animate-spin",
              )}
            />
          </button>
        </div>

        {/* Big Clock Display */}
        <div className="relative mb-12 flex flex-col items-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            /* Jam tetap gelap */
            className="text-8xl font-black tracking-tighter tabular-nums mb-2 text-slate-900"
          >
            {time.getHours().toString().padStart(2, "0")}
            <span className="text-[#5465ff] inline-block mx-1">:</span>
            {time.getMinutes().toString().padStart(2, "0")}
          </motion.div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white shadow-lg border border-transparent">
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold tracking-wide uppercase">
                {hijriDate}
              </span>
            </div>
          </div>
        </div>

        {/* Prayer Times Grid */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Jadwal Shalat
            </h3>
            <Clock className="w-3.5 h-3.5 text-[#5465ff]" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {PRAYER_LIST.map((prayer) => {
              const timeVal = timings ? timings[prayer.key] : "--:--";
              const isActive = activePrayer === prayer.key;

              return (
                <div
                  key={prayer.key}
                  className={cn(
                    "relative overflow-hidden flex flex-col items-center justify-center py-5 rounded-[2rem] transition-all duration-500",
                    isActive
                      ? "bg-[#5465ff] text-white shadow-[0_20px_40px_-12px_rgba(84,101,255,0.4)] scale-[1.02] z-20"
                      : "bg-slate-50 border border-slate-100 text-slate-600",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
                    />
                  )}
                  <span
                    className={cn(
                      "text-[9px] font-black uppercase tracking-widest mb-1.5",
                      isActive ? "text-white/80" : "text-slate-400",
                    )}
                  >
                    {prayer.label}
                  </span>
                  <span className="text-lg font-bold tracking-tight">
                    {timeVal}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-[-40px] opacity-[0.05] pointer-events-none">
        <Image
          src="/assets-svg/mun-mashhad-svgrepo-com.svg"
          alt="art"
          width={300}
          height={300}
          className="" /* Hapus invert */
        />
      </div>

      {/* Bottom Wave/Curve - Warna fill disamakan dengan background bawah halaman (#FAFAFA) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C40.52,35.11,172.11,84.52,321.39,56.44Z"
            className="fill-slate-50"
          ></path>
        </svg>
      </div>
    </motion.section>
  );
}
