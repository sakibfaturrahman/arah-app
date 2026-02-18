"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  BookOpen,
  Moon,
  Sun,
  CheckCircle2,
  Circle,
  Calculator,
  Info,
  Target,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TargetRamadhanPage() {
  // State untuk data harian
  const [targetKhatam, setTargetKhatam] = useState(1); // Berapa kali khatam
  const [totalHalaman, setTotalHalaman] = useState(604); // Standar Madinah
  const [lembarPerSholat, setLembarPerSholat] = useState(0);

  // Hitung otomatis kebutuhan tilawah
  useEffect(() => {
    // 1 Khatam = totalHalaman.
    // Per hari = (Khatam * totalHalaman) / 30 hari
    // Per waktu sholat = (Halaman Per hari / 5) / 2 (karena 1 lembar = 2 halaman)
    const halamanPerHari = (targetKhatam * totalHalaman) / 30;
    const lembarPerWaktu = Math.ceil(halamanPerHari / 5 / 2);
    setLembarPerSholat(lembarPerWaktu);
  }, [targetKhatam, totalHalaman]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-28 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-tight">
              Target <span className="text-[#5465ff]">Ramadhan</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Manajemen Ibadah & Tilawah
            </p>
          </div>
        </div>

        {/* GRID SYSTEM: 2 KOLOM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* KOLOM KIRI: MUTABA'AH (CHECKLIST) */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 px-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              <Target className="w-4 h-4" /> Checklist Harian
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <button className="p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:border-orange-200 transition-all">
                <Sun className="w-8 h-8 text-orange-500" />
                <span className="text-[10px] font-black uppercase text-slate-900">
                  Puasa
                </span>
              </button>
              <button className="p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:border-indigo-200 transition-all">
                <Moon className="w-8 h-8 text-indigo-500" />
                <span className="text-[10px] font-black uppercase text-slate-900">
                  Tarawih
                </span>
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
              <div className="space-y-3">
                {["Subuh", "Dhuhur", "Ashar", "Maghrib", "Isya"].map(
                  (sholat) => (
                    <div
                      key={sholat}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group"
                    >
                      <span className="text-sm font-bold text-slate-700">
                        {sholat}
                      </span>
                      <Circle className="w-6 h-6 text-slate-200 group-hover:text-[#5465ff]" />
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: KALKULATOR TILAWAH */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 px-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              <Calculator className="w-4 h-4" /> Kalkulator Tilawah
            </h2>

            <div className="bg-[#5465ff] rounded-[3rem] p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-6">
                  Setting Target Khatam
                </p>

                <div className="space-y-6">
                  {/* Input Target */}
                  <div>
                    <label className="text-[10px] font-bold opacity-70 block mb-2 uppercase">
                      Mau Khatam Berapa Kali?
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={targetKhatam}
                        onChange={(e) =>
                          setTargetKhatam(Number(e.target.value))
                        }
                        className="bg-white/10 border border-white/20 text-2xl font-black w-20 rounded-2xl p-3 outline-none focus:bg-white/20"
                      />
                      <span className="font-bold">Kali dalam 30 Hari</span>
                    </div>
                  </div>

                  {/* Input Total Halaman */}
                  <div>
                    <label className="text-[10px] font-bold opacity-70 block mb-2 uppercase text-white/90">
                      Total Halaman Al-Quran Anda
                    </label>
                    <input
                      type="number"
                      value={totalHalaman}
                      onChange={(e) => setTotalHalaman(Number(e.target.value))}
                      className="bg-white/10 border border-white/20 text-sm font-bold w-full rounded-2xl p-4 outline-none focus:bg-white/20"
                    />
                    <div className="mt-3 flex items-start gap-2 bg-black/10 p-3 rounded-xl border border-white/5">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-[9px] leading-relaxed opacity-90 italic">
                        * Tiap mushaf bisa berbeda (Contoh: Madinah 604 hal,
                        Standar Indo 480/500 hal). Pastikan cek halaman terakhir
                        Mushaf Anda.
                      </p>
                    </div>
                  </div>
                </div>

                {/* HASIL KALKULASI */}
                <div className="mt-10 pt-8 border-t border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-4">
                    Rencana Bacaan:
                  </p>
                  <div className="bg-white rounded-3xl p-6 text-slate-900 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-[#5465ff] uppercase">
                          Target Per Sholat
                        </p>
                        <h4 className="text-2xl font-black">
                          {lembarPerSholat} Lembar
                        </h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase">
                          Halaman/Hari
                        </p>
                        <h4 className="text-lg font-black text-slate-600">
                          ± {Math.ceil((targetKhatam * totalHalaman) / 30)} Hal
                        </h4>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-[9px] font-bold opacity-60 uppercase tracking-widest">
                    "Bacalah walau satu ayat"
                  </p>
                </div>
              </div>
              <BookOpen className="absolute -right-8 -top-8 w-48 h-48 text-white/5 rotate-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
