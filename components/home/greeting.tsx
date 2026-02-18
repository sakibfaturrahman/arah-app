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
    const timer = setInterval(() => setTime(new Date()), 1000);
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
        icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
      };
    if (hours >= 11 && hours < 15)
      return {
        text: "Selamat Siang",
        icon: <CloudSun className="w-3.5 h-3.5 text-orange-500" />,
      };
    if (hours >= 15 && hours < 18)
      return {
        text: "Selamat Sore",
        icon: <SunMoon className="w-3.5 h-3.5 text-orange-600" />,
      };
    return {
      text: "Selamat Malam",
      icon: <Moon className="w-3.5 h-3.5 text-indigo-500" />,
    };
  };

  const { text, icon } = getGreeting();
  const formatTime = (val: number) => val.toString().padStart(2, "0");

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)]"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        {/* SISI KIRI (Greeting & Lokasi) */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
            {icon} {text}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Assalamu’alaikum<span className="text-[#5465ff]">.</span>
          </h2>

          {/* Baris Lokasi + Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-[#5465ff]" />
              <span className="text-[11px] font-black uppercase tracking-[0.15em]">
                {locationName}
              </span>
            </div>

            {/* Tombol Refresh yang Dibuat Lebih Kontras */}
            <button
              onClick={handleUpdateLocation}
              disabled={isRefreshing}
              className="flex items-center justify-center p-2 bg-slate-100 hover:bg-[#5465ff] hover:text-white rounded-xl transition-all active:scale-90 disabled:opacity-50"
              title="Perbarui Lokasi"
            >
              <RefreshCw
                className={cn(
                  "w-3 h-3 transition-all",
                  isRefreshing && "animate-spin",
                )}
              />
            </button>
          </div>
        </div>

        {/* SISI KANAN (Jam & Tanggal) */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-[1.5rem] border border-slate-100 shadow-inner">
            <Clock className="w-4 h-4 text-[#5465ff]" />
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-800">
              {formatTime(time.getHours())}
              <span className="text-[#5465ff]/40 animate-pulse px-1">:</span>
              {formatTime(time.getMinutes())}
              <span className="text-xl md:text-2xl text-gray-400 font-bold ml-2">
                {formatTime(time.getSeconds())}
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
              {time.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#5465ff]/10 text-[#5465ff] rounded-xl">
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="text-[11px] font-extrabold">{hijriDate}</span>
            </div>
          </div>
        </div>
      </div>

      <Sparkles className="absolute -bottom-4 -right-4 w-20 h-20 text-[#5465ff]/5 rotate-12" />
    </motion.div>
  );
}
