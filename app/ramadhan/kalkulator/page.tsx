"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  BookOpen,
  Calculator,
  Info,
  ArrowRight,
  Sparkles,
  ListChecks,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const KHATAM_DATA = [
  "Al-Fatihah — Al-Baqarah 195",
  "Al-Baqarah 196 — Selesai",
  "Ali 'Imran",
  "An-Nisa'",
  "Al-Ma'idah",
  "Al-An'am",
  "Al-A'raf",
  "Al-Anfal",
  "At-Taubah",
  "Yunus",
  "Hud",
  "Yusuf — Ar-Ra'd",
  "Ibrahim — Al-Hijr",
  "An-Nahl — Al-Isra'",
  "Al-Kahf — Maryam",
  "Thaha — Al-Anbiya'",
  "Al-Hajj — Al-Mu'minun",
  "An-Nur — Al-Furqan",
  "Asy-Syu'ara' — Al-Qashash",
  "Al-'Ankabut — As-Sajdah",
  "Al-Ahzab — Fathir",
  "Yasin — Shaad",
  "Az-Zumar — Fushshilat",
  "Asy-Syura — Al-Ahqaf",
  "Muhammad — Adz-Dzariyat",
  "Ath-Thur — Al-Hadid",
  "Al-Mujadilah — At-Tahrim",
  "Al-Mulk — Al-Mursalat",
  "An-Naba' — An-Naas",
];

export default function TargetRamadhanPage() {
  const [targetKhatam, setTargetKhatam] = useState(1);
  const [totalHalaman, setTotalHalaman] = useState(604);
  const [lembarPerSholat, setLembarPerSholat] = useState(0);

  useEffect(() => {
    const halamanPerHari = (targetKhatam * totalHalaman) / 30;
    const lembarPerWaktu = Math.ceil(halamanPerHari / 5 / 2);
    setLembarPerSholat(lembarPerWaktu);
  }, [targetKhatam, totalHalaman]);

  const getDailyTargetList = () => {
    const itemsPerDay = targetKhatam;
    const displayList = [];
    const totalDaysNeeded = Math.ceil(KHATAM_DATA.length / itemsPerDay);

    for (let day = 1; day <= totalDaysNeeded; day++) {
      const startIndex = (day - 1) * itemsPerDay;
      const dayTasks = KHATAM_DATA.slice(startIndex, startIndex + itemsPerDay);

      if (dayTasks.length > 0) {
        displayList.push({ day, tasks: dayTasks });
      }
    }
    return displayList;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-12 pb-32 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER PAGE */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">
                Pusat <span className="text-[#5465ff]">Target</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Manajemen Khatam Harian
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Sparkles className="w-6 h-6 text-amber-400 opacity-50" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start text-left">
          {/* KOLOM KIRI: SETTING */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 px-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              <Calculator className="w-4 h-4" /> Rumus Khatam Quran
            </h2>

            <div className="bg-[#5465ff] rounded-[3rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <Badge label="Metode Lembar" />
                  <BookOpen className="w-5 h-5 opacity-50" />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold opacity-70 block mb-3 uppercase tracking-widest">
                      Target Khatam (1 - 10 Kali)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={targetKhatam}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= 1 && val <= 10) setTargetKhatam(val);
                        }}
                        className="bg-white/10 border border-white/20 text-4xl font-black w-24 rounded-2xl p-4 outline-none focus:bg-white/20 transition-all"
                      />
                      <span className="font-bold text-xl opacity-90">
                        Kali / Bulan
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-6 text-slate-900 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 p-4 rounded-2xl text-[#5465ff]">
                        <BookOpen className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          Target Per Waktu Sholat
                        </p>
                        <h4 className="text-3xl font-black text-[#5465ff] leading-none mt-1">
                          {lembarPerSholat}{" "}
                          <span className="text-lg">Lembar</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <BookOpen className="absolute -right-12 -bottom-12 w-56 h-56 text-white/5 rotate-12 pointer-events-none" />
            </div>

            <div className="p-5 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                Gunakan rumus ini untuk membagi bacaan Anda setiap selesai
                shalat fardhu agar terasa lebih ringan.
              </p>
            </div>
          </div>

          {/* KOLOM KANAN: REKOMENDASI (DENGAN FIXED HEADER/FOOTER) */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 px-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              <Calendar className="w-4 h-4" /> Rekomendasi Surah Harian
            </h2>

            {/* Container Card Utama */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col max-h-[700px]">
              {/* FIXED HEADER DALAM CARD */}
              <div className="p-8 pb-4 bg-white border-b border-slate-50 z-20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    Target Bacaan Harian
                  </span>
                  <ListChecks className="w-4 h-4 text-[#5465ff]" />
                </div>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="flex-1 overflow-y-auto p-8 pt-4 no-scrollbar space-y-6">
                {getDailyTargetList().map((item) => (
                  <div
                    key={item.day}
                    className="group relative pl-6 border-l-2 border-slate-100 hover:border-[#5465ff] transition-all"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-200 group-hover:border-[#5465ff] transition-all" />
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[10px] font-black text-[#5465ff] uppercase">
                        Hari {item.day}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {item.tasks.map((task, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-blue-50/50 transition-all"
                        >
                          <p className="text-xs font-bold text-slate-700">
                            {task}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* FIXED FOOTER DALAM CARD */}
              <div className="p-6 bg-slate-50/50 border-t border-slate-50">
                <p className="text-[9px] font-bold text-slate-400 uppercase italic tracking-widest">
                  * Jadwal untuk {targetKhatam}x Khatam / Bulan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER PAGE */}
        <div className="mt-16 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
            Semangat Tilawah, Gapai Keberkahan
          </p>
        </div>
      </div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-[8px] font-black uppercase tracking-[0.2em] backdrop-blur-sm">
      {label}
    </span>
  );
}
