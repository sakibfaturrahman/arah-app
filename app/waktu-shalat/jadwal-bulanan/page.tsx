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
} from "lucide-react";
import Link from "next/link";
import { getMonthlyPrayerTimes, PRAYER_LIST } from "@/lib/getPrayerTimes";
import { cn } from "@/lib/utils";

// --- PDF Imports ---
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function JadwalSholatBulanan() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullAddress, setFullAddress] = useState<string>("Mencari Lokasi...");
  const [userCity, setUserCity] = useState<string>("");
  const [hijriPeriod, setHijriPeriod] = useState<string>("");
  const [showScrollHint, setShowScrollHint] = useState(false);

  const now = new Date();
  const currentDay = now.getDate();
  const namaBulan = now.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    async function loadData() {
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      // 1. Lokasi
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

      // 2. Data Sholat & Hijriah
      try {
        const [prayerData, hijriRes] = await Promise.all([
          getMonthlyPrayerTimes(month, year),
          fetch(
            `https://api.aladhan.com/v1/gToH/01-${String(month).padStart(2, "0")}-${year}`,
          ),
        ]);

        if (prayerData) setSchedule(prayerData);

        const hijriJson = await hijriRes.json();
        if (hijriJson.code === 200) {
          setHijriPeriod(
            `${hijriJson.data.hijri.month.en} ${hijriJson.data.hijri.year} H`,
          );
        }
      } catch (err) {
        console.error("Gagal memuat data:", err);
      }

      setLoading(false);
      if (window.innerWidth < 768) {
        setTimeout(() => setShowScrollHint(true), 1500);
      }
    }
    loadData();
  }, [now]);

  // --- PDF GENERATOR FUNCTION ---
  const handleDownloadPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Perbaikan Error: Definisikan warna sebagai Tuple eksplisit
    const primaryColor: [number, number, number] = [84, 101, 255];
    const whiteColor: [number, number, number] = [255, 255, 255];
    const lightGray: [number, number, number] = [245, 247, 255];

    // Helper Logo Base64
    const getBase64ImageFromURL = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg"));
        };
        img.onerror = (error) => reject(error);
      });
    };

    try {
      // Header: Logo
      try {
        const logoData = await getBase64ImageFromURL("/logo.jpg");
        doc.addImage(logoData, "JPEG", 14, 10, 12, 12);
      } catch (e) {
        console.warn("Logo tidak ditemukan");
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("ARAH.", 28, 18);

      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.setFont("helvetica", "normal");
      doc.text("Aplikasi Panduan Ibadah Digital Terpercaya", 28, 22);

      // Line Decoration
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(14, 26, 196, 26);

      // Main Title
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.setFont("helvetica", "bold");
      doc.text(
        `JADWAL SHOLAT ${userCity.toUpperCase()} & SEKITARNYA`,
        105,
        38,
        { align: "center" },
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${namaBulan}  /  ${hijriPeriod}`, 105, 44, { align: "center" });

      // Table Generation
      const tableColumn = [
        "Tanggal",
        "Imsak",
        "Subuh",
        "Terbit",
        "Dzuhur",
        "Ashar",
        "Maghrib",
        "Isya",
      ];
      const tableRows = schedule.map((day) => [
        `${day.date.gregorian.day} ${day.date.gregorian.month.en.slice(0, 3)}`,
        day.timings.Imsak.split(" ")[0],
        day.timings.Fajr.split(" ")[0],
        day.timings.Sunrise.split(" ")[0],
        day.timings.Dhuhr.split(" ")[0],
        day.timings.Asr.split(" ")[0],
        day.timings.Maghrib.split(" ")[0],
        day.timings.Isha.split(" ")[0],
      ]);

      autoTable(doc, {
        startY: 52,
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 8, halign: "center" },
        headStyles: {
          fillColor: primaryColor,
          textColor: whiteColor,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: lightGray },
        margin: { left: 14, right: 14 },
      });

      // Footer
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Dicetak pada: ${new Date().toLocaleString("id-ID")}`,
        14,
        finalY,
      );
      doc.text(`Lokasi: ${fullAddress}`, 14, finalY + 4, { maxWidth: 180 });

      doc.save(
        `Jadwal_Sholat_${userCity}_${namaBulan.replace(/\s+/g, "_")}.pdf`,
      );
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `*Jadwal Sholat ${userCity} - ${namaBulan}*\nCek jadwal lengkapnya di Arah.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40 pt-6 md:pt-28 font-sans">
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[150] w-[85%]"
          >
            <div className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10">
              <div className="bg-[#5465ff] p-2 rounded-xl animate-bounce">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold leading-tight flex-1">
                Geser tabel ke samping untuk melihat jadwal lengkap.
              </p>
              <button onClick={() => setShowScrollHint(false)} className="p-1">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4">
        {/* Header UI */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Jadwal <span className="text-[#5465ff]">Bulanan</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Navigation className="w-3 h-3 text-[#5465ff] fill-[#5465ff]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {userCity || "Mencari Lokasi..."}
              </span>
            </div>
          </div>
          <button
            onClick={handleShareWhatsApp}
            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#5465ff]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Sinkronisasi...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tabel UI */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="overflow-x-auto scrollbar-hide">
                <div className="min-w-[750px]">
                  <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100 px-8 py-6 text-[11px] font-black uppercase text-slate-400">
                    <div className="text-left">Tgl</div>
                    {PRAYER_LIST.map((p) => (
                      <div key={p.key} className="text-center">
                        {p.label}
                      </div>
                    ))}
                  </div>
                  <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-50 px-2">
                    {schedule.map((day: any, index: number) => {
                      const isToday =
                        parseInt(day.date.gregorian.day) === currentDay;
                      return (
                        <div
                          key={index}
                          className={cn(
                            "grid grid-cols-7 px-6 py-4 items-center rounded-3xl mx-1 my-1 transition-colors",
                            isToday
                              ? "bg-[#5465ff]/[0.08]"
                              : "hover:bg-slate-50",
                          )}
                        >
                          <div
                            className={cn(
                              "flex flex-col items-center justify-center w-10 h-10 rounded-2xl",
                              isToday
                                ? "bg-[#5465ff] text-white"
                                : "text-slate-500",
                            )}
                          >
                            <span className="text-xs font-black">
                              {day.date.gregorian.day}
                            </span>
                            <span className="text-[7px] font-bold uppercase">
                              {day.date.gregorian.weekday.en.slice(0, 3)}
                            </span>
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

            {/* Tombol Aksi */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center justify-center gap-3 p-5 bg-white border border-slate-200 rounded-[2rem] font-bold text-slate-700 active:scale-95 transition-all shadow-sm hover:border-[#5465ff]/30"
              >
                <Download className="w-5 h-5 text-[#5465ff]" />
                <span>Unduh PDF</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-3 p-5 bg-green-50 border border-green-100 rounded-[2rem] font-bold text-green-700 active:scale-95 transition-all shadow-sm hover:bg-green-100"
              >
                <Share2 className="w-5 h-5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
