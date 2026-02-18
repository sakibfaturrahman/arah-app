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
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
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
    } else {
      setLocationName("Atur Lokasi");
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    getHijriDate().then((res) => res && setHijriDate(res));
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
        icon: <CloudSun className="w-4 h-4 text-orange-400" />,
      };
    if (hours >= 15 && hours < 18)
      return {
        text: "Selamat Sore",
        icon: <SunMoon className="w-4 h-4 text-orange-500" />,
      };
    return {
      text: "Selamat Malam",
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
    };
  };

  const { text, icon } = getGreeting();
  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        // Card base
        "relative overflow-hidden bg-5465ff backdrop-blur-md border border-white",
        // Custom curves: top-left and bottom-right more rounded, bottom-left and top-right less so
        "rounded-[2.5rem] rounded-tl-[4rem] rounded-br-[4rem] md:rounded-[2.5rem] md:rounded-tl-[3.5rem] md:rounded-br-[3.5rem]",
        // Extra: subtle border and shadow for depth
        "before:absolute before:inset-0 before:rounded-[2.5rem] before:rounded-tl-[4rem] before:rounded-br-[4rem] before:bg-gradient-to-br before:from-[#5465ff]/10 before:to-[#788bff]/5 before:pointer-events-none",
      )}
      style={{
        WebkitMaskImage:
          "radial-gradient(ellipse 120% 100% at 50% 0%, #000 80%, transparent 100%)",
      }}
    >
      {/* Background Decor - Bulatan Lembut & Lengkungan */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-[#5465ff]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl" />
      {/* Extra: Lengkungan bawah */}
      <svg
        className="absolute bottom-0 left-0 w-full h-10 md:h-12"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
      >
        <path d="M0,0 Q50,20 100,0 L100,10 L0,10 Z" fill="#5465ff0d" />
      </svg>

      <div className="relative z-10 p-7 md:p-10 flex flex-col gap-8">
        {/* Top Section: Greeting & Location */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
            {icon}
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {text}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Assalamu’alaikum<span className="text-[#5465ff]">.</span>
          </h2>

          <div className="flex items-center gap-2 pt-1">
            <MapPin className="w-3.5 h-3.5 text-[#5465ff]" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
              {locationName}
            </span>
            <div className="flex flex-col items-center gap-0.5 ml-1">
              <button
                onClick={handleUpdateLocation}
                disabled={isRefreshing}
                className="p-1.5 hover:bg-[#5465ff]/10 rounded-full transition-colors group"
              >
                <RefreshCw
                  className={cn(
                    "w-3 h-3 text-gray-300 group-hover:text-[#5465ff]",
                    isRefreshing && "animate-spin",
                  )}
                />
              </button>
              <span className="text-[7px] font-bold text-gray-300 uppercase tracking-tighter whitespace-nowrap">
                Perbarui
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Time & Dates (Dibuat melengkung ke dalam) */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 pt-6 border-t border-dashed border-gray-100">
          {/* Jam Utama */}
          <div className="flex justify-center md:justify-start items-baseline gap-1">
            <span className="text-5xl md:text-6xl font-black text-gray-800 tracking-tighter">
              {time.getHours().toString().padStart(2, "0")}
              <span className="text-[#5465ff] opacity-30">:</span>
              {time.getMinutes().toString().padStart(2, "0")}
            </span>
            {/* Detik dihilangkan */}
          </div>

          {/* Kalender Duo */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#5465ff] to-[#788bff] text-white rounded-2xl shadow-lg shadow-[#5465ff]/20">
              <CalendarDays className="w-4 h-4 text-white/80" />
              <span className="text-xs font-black tracking-tight">
                {hijriDate}
              </span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {time.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Arabic Art SVG */}
      <Image
        src="/assets-svg/arabic-art-svgrepo-com.svg"
        alt="arabic art"
        width={80}
        height={80}
        className="absolute top-4 right-4 w-20 h-20 opacity-10 select-none pointer-events-none"
        aria-hidden="true"
        priority
      />
    </motion.div>
  );
}
