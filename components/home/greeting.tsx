"use client";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { getHijriDate } from "@/lib/getHijri";

export default function Greeting() {
  const [time, setTime] = useState(new Date());
  const [hijriDate, setHijriDate] = useState<string>("Memuat...");
  const [locationName, setLocationName] = useState<string>("Mencari Lokasi...");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);

    getHijriDate().then((res) => {
      if (res) setHijriDate(res);
    });

    const fetchLocationName = async () => {
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
    };

    fetchLocationName();
    return () => clearInterval(timer);
  }, []);

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

  if (!mounted) return <div className="h-32" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white border border-gray-100 rounded-[2rem] p-6 md:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        {/* Sisi Kiri: Greeting & Lokasi */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="inline-flex items-center gap-1.5 text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-1">
            {icon} {text}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Assalamu’alaikum<span className="text-[#5465ff]">.</span>
          </h2>
          <div className="flex items-center gap-1.5 text-gray-500">
            <MapPin className="w-3 h-3 text-[#5465ff]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {locationName}
            </span>
          </div>
        </div>

        {/* Sisi Kanan: Jam Satu Baris & Tanggal */}
        <div className="flex flex-col items-center md:items-end gap-2">
          {/* Jam Horizontal */}
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <Clock className="w-3.5 h-3.5 text-[#5465ff]" />
            <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-gray-800">
              {formatTime(time.getHours())}
              <span className="text-[#5465ff]/30 px-0.5 animate-pulse">:</span>
              {formatTime(time.getMinutes())}
              <span className="text-[#5465ff]/30 px-0.5">:</span>
              <span className="text-lg md:text-xl text-gray-400 font-medium">
                {formatTime(time.getSeconds())}
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              {time.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#5465ff]/10 text-[#5465ff] rounded-lg">
              <CalendarDays className="w-3 h-3" />
              <span className="text-[10px] font-bold whitespace-nowrap">
                {hijriDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Ornament */}
      <Sparkles className="absolute -bottom-2 -right-2 w-12 h-12 text-[#5465ff]/5" />
    </motion.div>
  );
}
