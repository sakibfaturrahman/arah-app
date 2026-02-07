"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar, MapPin, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { getMonthlyPrayerTimes, PRAYER_LIST } from "@/lib/getPrayerTimes";
import { cn } from "@/lib/utils";

export default function JadwalSholatBulanan() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCity, setUserCity] = useState<string>("Mencari Lokasi...");

  const now = new Date();
  const currentDay = now.getDate();

  useEffect(() => {
    async function loadData() {
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      // 1. Ambil Nama Kota berdasarkan Koordinat di LocalStorage
      const savedLoc = localStorage.getItem("user-location");
      if (savedLoc) {
        try {
          const { lat, lng } = JSON.parse(savedLoc);
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`,
          );
          const geoData = await geoRes.json();
          setUserCity(geoData.city || geoData.locality || "Lokasi Aktif");
        } catch (e) {
          setUserCity("Lokasi Terdeteksi");
        }
      }

      // 2. Ambil Jadwal Sholat
      const data = await getMonthlyPrayerTimes(month, year);
      if (data) setSchedule(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const namaBulan = now.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32 pt-6 md:pt-28 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="p-2.5 bg-white rounded-2xl shadow-sm hover:text-[#5465ff] transition-all active:scale-95 border border-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              Jadwal Bulanan
            </h1>
            <div className="flex items-center justify-center gap-1.5 text-gray-400">
              <MapPin className="w-3 h-3 text-[#5465ff]" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {userCity}
              </span>
            </div>
          </div>
          <div className="w-10" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-300">
            <Loader2 className="w-10 h-10 animate-spin text-[#5465ff]" />
            <p className="font-bold tracking-[0.2em] uppercase text-[10px]">
              Sinkronisasi Data...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Info Card Mobile */}
            <div className="md:hidden flex items-center gap-3 p-4 bg-blue-50/50 rounded-3xl border border-blue-100/50 mb-2">
              <Info className="w-4 h-4 text-[#5465ff]" />
              <p className="text-[10px] font-medium text-blue-700 leading-relaxed">
                Geser tabel ke samping untuk melihat jadwal lengkap sholat.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden"
            >
              {/* Container Scroll Horizontal untuk Mobile */}
              <div className="overflow-x-auto scrollbar-hide">
                <div className="min-w-[600px] md:min-w-full">
                  {/* Table Header */}
                  <div className="grid grid-cols-7 bg-gray-50/80 border-b border-gray-100 px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    <div className="text-left">Tgl</div>
                    {PRAYER_LIST.map((p) => (
                      <div key={p.key} className="text-center">
                        {p.label}
                      </div>
                    ))}
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-gray-50">
                    {schedule.map((day: any, index: number) => {
                      const isToday =
                        parseInt(day.date.gregorian.day) === currentDay;

                      return (
                        <div
                          key={index}
                          className={cn(
                            "grid grid-cols-7 px-6 py-4 items-center transition-colors",
                            isToday
                              ? "bg-[#5465ff]/[0.03]"
                              : "hover:bg-gray-50/50",
                          )}
                        >
                          <div className="text-left">
                            <span
                              className={cn(
                                "text-xs font-black flex items-center justify-center w-8 h-8 rounded-xl transition-all",
                                isToday
                                  ? "bg-[#5465ff] text-white shadow-lg shadow-[#5465ff]/30 scale-110"
                                  : "text-gray-400 bg-gray-50",
                              )}
                            >
                              {day.date.gregorian.day}
                            </span>
                          </div>
                          {PRAYER_LIST.map((p) => (
                            <div
                              key={p.key}
                              className={cn(
                                "text-center text-xs font-bold font-mono tracking-tighter",
                                isToday ? "text-[#5465ff]" : "text-gray-600",
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
          </div>
        )}

        {/* Footer Settings */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white border border-gray-100 rounded-[2rem] flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-2xl">
              <Calendar className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Periode
              </p>
              <p className="text-sm font-bold text-gray-900">{namaBulan}</p>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-[2rem] flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <MapPin className="w-5 h-5 text-[#5465ff]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Lokasi
              </p>
              <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                {userCity}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
