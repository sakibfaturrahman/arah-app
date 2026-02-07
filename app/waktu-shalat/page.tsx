"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  MapPin,
  Loader2,
  Compass,
  Navigation,
  Share2,
  Download,
  ArrowRightLeft,
  X,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getMonthlyPrayerTimes, PRAYER_LIST } from "@/lib/getPrayerTimes";
import { getHijriDate } from "@/lib/getHijri";
import { cn } from "@/lib/utils";
import { generatePrayerSchedulePDF } from "@/lib/services/pdfService";

export default function JadwalSholatBulanan() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullAddress, setFullAddress] = useState<string>("Mencari Lokasi...");
  const [userCity, setUserCity] = useState<string>("");
  const [hijriDate, setHijriDate] = useState<string>("");
  const [showScrollHint, setShowScrollHint] = useState(false);

  const now = new Date();
  const currentDay = now.getDate();
  const namaBulan = now.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const hijri = await getHijriDate();
      if (hijri) setHijriDate(hijri);

      const savedLoc = localStorage.getItem("user-location");
      if (savedLoc) {
        try {
          const { lat, lng } = JSON.parse(savedLoc);
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`,
          );
          const geoData = await geoRes.json();
          const city = geoData.city || geoData.locality || "Lokasi Aktif";
          setFullAddress(
            `${geoData.locality}, ${geoData.city}, ${geoData.principalSubdivision}`,
          );
          setUserCity(city);
        } catch (e) {
          setUserCity("Lokasi Aktif");
        }
      }

      const data = await getMonthlyPrayerTimes(month, year);
      if (data) setSchedule(data);
      setLoading(false);

      if (window.innerWidth < 768) {
        setTimeout(() => setShowScrollHint(true), 1500);
      }
    }
    loadData();
  }, []);

  const handleDownloadPDF = async () => {
    await generatePrayerSchedulePDF({
      schedule,
      userCity,
      namaBulan,
      hijriDate,
      fullAddress,
    });
  };

  const handleShareWhatsApp = () => {
    const appUrl = "https://nalarah.my.id/waktu-sholat";
    const text =
      `Assalamu'alaikum wr. wb. ✨\n\n` +
      `Izin berbagi *Jadwal Sholat ${userCity}* untuk bulan *${namaBulan}* (${hijriDate}).\n\n` +
      `Yuk, jaga waktu sholat tepat waktu dengan aplikasi *Arah*. Aplikasinya sangat ringan dan akurat!\n\n` +
      `📍 *Lihat Jadwal Selengkapnya:* \n${appUrl}\n\n` +
      `📱 *Tips:* Instal aplikasi ini di HP kamu dengan klik 'Add to Home Screen' di browser. Semoga bermanfaat! 🤲`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40 pt-6 md:pt-28 font-sans overflow-x-hidden">
      {/* --- SCROLL HINT (MOBILE) --- */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[150] w-[85%] md:hidden"
          >
            <div className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10">
              <div className="bg-[#5465ff] p-2 rounded-xl animate-bounce">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold leading-tight flex-1">
                Geser tabel ke samping.
              </p>
              <button onClick={() => setShowScrollHint(false)} className="p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* --- HEADER COMPACT WITH CTA --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Jadwal <span className="text-[#5465ff]">Bulanan</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5465ff] whitespace-nowrap">
                  {hijriDate || "Memuat..."}
                </span>
              </div>
            </div>
          </div>

          {/* --- TOP CTA BUTTONS (COMPACT) --- */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-xs text-slate-700 hover:border-[#5465ff] hover:text-[#5465ff] transition-all shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Unduh PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] rounded-2xl font-bold text-xs text-white hover:bg-[#128C7E] transition-all shadow-md shadow-green-100 active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Bagikan Jadwal</span>
              <span className="sm:hidden">Share</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#5465ff]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Sinkronisasi...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* --- LEFT SIDE: INFO & KIBLAT (4 Cols) --- */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <MapPin className="w-5 h-5 text-[#5465ff]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Wilayah Anda
                    </p>
                    <p className="text-sm font-bold text-slate-800 line-clamp-2">
                      {userCity}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed italic border-t pt-4">
                  “Waktu sholat disesuaikan secara otomatis berdasarkan
                  koordinat GPS perangkat Anda agar presisi.”
                </p>
              </div>

              <motion.div
                whileHover={{ y: -5 }}
                className="relative overflow-hidden p-6 bg-[#5465ff] rounded-[2.5rem] shadow-xl shadow-[#5465ff]/20"
              >
                <div className="relative z-10 space-y-4">
                  <div>
                    <h2 className="text-white font-bold text-lg leading-tight">
                      Cek Arah Kiblat
                    </h2>
                    <p className="text-white/70 text-xs mt-1">
                      Gunakan sensor kompas HP.
                    </p>
                  </div>
                  <Link
                    href="/kiblat"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-white rounded-2xl text-[#5465ff] font-bold text-sm shadow-lg active:scale-95 transition-all"
                  >
                    Buka Kompas <Compass className="w-4 h-4" />
                  </Link>
                </div>
                <Compass className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 rotate-12" />
              </motion.div>
            </div>

            {/* --- RIGHT SIDE: TABLE (8 Cols) --- */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden"
              >
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="min-w-[700px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100 px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <div className="text-left">Tgl</div>
                      {PRAYER_LIST.map((p) => (
                        <div key={p.key} className="text-center">
                          {p.label}
                        </div>
                      ))}
                    </div>

                    {/* Table Body */}
                    <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-50 px-2 scrollbar-hide">
                      {schedule.map((day: any, index: number) => {
                        const isToday =
                          parseInt(day.date.gregorian.day) === currentDay;
                        return (
                          <div
                            key={index}
                            className={cn(
                              "grid grid-cols-7 px-6 py-4 items-center transition-all rounded-3xl mx-1 my-1",
                              isToday
                                ? "bg-[#5465ff]/5 border border-[#5465ff]/10"
                                : "hover:bg-slate-50/80",
                            )}
                          >
                            <div className="flex justify-start">
                              <div
                                className={cn(
                                  "flex flex-col items-center justify-center w-10 h-10 rounded-2xl",
                                  isToday
                                    ? "bg-[#5465ff] text-white shadow-lg"
                                    : "text-slate-500 bg-slate-100/50",
                                )}
                              >
                                <span className="text-xs font-black">
                                  {day.date.gregorian.day}
                                </span>
                                <span className="text-[7px] font-bold uppercase">
                                  {day.date.gregorian.weekday.en.slice(0, 3)}
                                </span>
                              </div>
                            </div>
                            {PRAYER_LIST.map((p) => (
                              <div
                                key={p.key}
                                className={cn(
                                  "text-center text-sm font-bold font-mono",
                                  isToday ? "text-[#5465ff]" : "text-slate-600",
                                )}
                              >
                                {day.timings[p.key].split(" ")[0]}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="mt-6 p-5 bg-white border border-slate-100 rounded-[2.5rem] flex items-start gap-4">
                <Navigation className="w-5 h-5 text-[#5465ff] shrink-0 mt-1" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Detail Koordinat
                  </p>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed">
                    {fullAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
