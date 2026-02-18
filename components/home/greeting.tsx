"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Sun,
  SunMoon,
  Moon,
  CloudSun,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { getHijriDate } from "@/lib/getHijri";
import { cn } from "@/lib/utils";

export default function Greeting() {
  const [time, setTime] = useState(new Date());
  const [hijriDate, setHijriDate] = useState<string>("Memuat...");
  const [locationName, setLocationName] = useState<string>("Mencari Lokasi...");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchLocationName = useCallback(async () => {
    const savedLoc = localStorage.getItem("user-location");
    if (savedLoc) {
      const { lat, lng } = JSON.parse(savedLoc);
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`,
        );
        const data = await response.json();
        const city = data.city || data.locality || "Lokasi Aktif";
        setLocationName(city);
      } catch (error) {
        setLocationName("Lokasi Terdeteksi");
      }
    } else {
      setLocationName("Lokasi belum diatur");
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 60000); // Update setiap menit karena tidak butuh detik
    getHijriDate().then((res) => {
      if (res) setHijriDate(res);
    });
    fetchLocationName();
    return () => clearInterval(timer);
  }, [fetchLocationName]);

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
            setTimeout(() => setIsRefreshing(false), 1000);
            window.dispatchEvent(new Event("location-updated"));
          });
        },
        () => {
          setIsRefreshing(false);
          alert("Gagal memperbarui lokasi.");
        },
      );
    }
  };

  const hours = time.getHours();
  const getGreeting = () => {
    if (hours >= 5 && hours < 11)
      return {
        text: "Selamat Pagi",
        icon: <Sun className="w-4 h-4 text-amber-500" />,
      };
    if (hours >= 11 && hours < 15)
      return {
        text: "Selamat Siang",
        icon: <CloudSun className="w-4 h-4 text-orange-500" />,
      };
    if (hours >= 15 && hours < 18)
      return {
        text: "Selamat Sore",
        icon: <SunMoon className="w-4 h-4 text-orange-600" />,
      };
    return {
      text: "Selamat Malam",
      icon: <Moon className="w-4 h-4 text-indigo-500" />,
    };
  };

  const { text, icon } = getGreeting();
  const formatTime = (val: number) => val.toString().padStart(2, "0");

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden bg-white border border-slate-100 rounded-[3rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
    >
      {/* Background Arabic Art - Low Opacity */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none scale-125 md:scale-100 transition-transform duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url('/assets-svg/arabic-art-svgrepo-com.svg')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        {/* SISI KIRI (Greeting & Lokasi) */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2.5 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 shadow-sm"
          >
            {icon} {text}
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
            Assalamu’alaikum<span className="text-[#5465ff]">.</span>
          </h2>

          <div className="flex items-center gap-2 group/loc">
            <div className="flex items-center gap-2 text-slate-400 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-2xl border border-slate-50">
              <MapPin className="w-4 h-4 text-[#5465ff] animate-bounce" />
              <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-600">
                {locationName}
              </span>
            </div>

            <button
              onClick={handleUpdateLocation}
              disabled={isRefreshing}
              className="flex items-center justify-center p-2.5 bg-slate-100 hover:bg-[#5465ff] hover:text-white rounded-xl transition-all active:scale-90 disabled:opacity-50 shadow-sm"
              title="Perbarui Lokasi"
            >
              <RefreshCw
                className={cn(
                  "w-3.5 h-3.5 transition-all",
                  isRefreshing && "animate-spin",
                )}
              />
            </button>
          </div>
        </div>

        {/* SISI KANAN (Jam & Tanggal) */}
        <div className="flex flex-col items-center md:items-end gap-5">
          <div className="relative group/time">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#5465ff]/20 to-[#a0a8ff]/20 rounded-[2.5rem] blur opacity-0 group-hover/time:opacity-100 transition duration-500" />
            <div className="relative flex items-center gap-4 bg-white px-8 py-5 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(84,101,255,0.08)]">
              <Clock className="w-5 h-5 text-[#5465ff]" />
              <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-800 flex items-center">
                {formatTime(time.getHours())}
                <span className="text-[#5465ff]/30 px-1 inline-block -translate-y-1">
                  :
                </span>
                {formatTime(time.getMinutes())}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {time.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="flex items-center gap-2.5 px-4 py-2 bg-[#5465ff] text-white rounded-2xl shadow-lg shadow-[#5465ff]/20">
              <CalendarDays className="w-4 h-4 text-white/80" />
              <span className="text-[12px] font-black">{hijriDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Curved Abstract Footer Decor */}
      <div className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-[200%] h-full text-slate-50 fill-current animate-[wave_15s_linear_infinite]"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,-1.14,1200,0.43V0Z" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </motion.div>
  );
}
