"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  BookOpen,
  Calculator,
  Info,
  Coins,
  ArrowRight,
  Sparkles,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TargetRamadhanPage() {
  // --- STATE KHATAM ---
  const [targetKhatam, setTargetKhatam] = useState(1);
  const [totalHalaman, setTotalHalaman] = useState(604);
  const [lembarPerSholat, setLembarPerSholat] = useState(0);

  // --- STATE ZAKAT ---
  const [zakatMal, setZakatMal] = useState<number>(0);
  const [hargaEmas, setHargaEmas] = useState<number>(1400000); // Estimasi harga emas/gram
  const [totalZakatMal, setTotalZakatMal] = useState<number>(0);

  // Hitung otomatis kebutuhan tilawah
  useEffect(() => {
    const halamanPerHari = (targetKhatam * totalHalaman) / 30;
    const lembarPerWaktu = Math.ceil(halamanPerHari / 5 / 2);
    setLembarPerSholat(lembarPerWaktu);
  }, [targetKhatam, totalHalaman]);

  // Hitung otomatis Zakat Mal
  useEffect(() => {
    const nisab = 85 * hargaEmas;
    if (zakatMal >= nisab) {
      setTotalZakatMal(zakatMal * 0.025);
    } else {
      setTotalZakatMal(0);
    }
  }, [zakatMal, hargaEmas]);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-12 pb-32 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">
                Pusat <span className="text-[#5465ff]">Target</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Kalkulator Spiritual & Finansial
              </p>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-amber-400 opacity-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- KHATAM CALCULATOR --- */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 px-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              <BookOpen className="w-4 h-4" /> Rumus Khatam Quran
            </h2>

            <div className="bg-[#5465ff] rounded-[3rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <Badge label="Metode Lembar" />
                  <Calculator className="w-5 h-5 opacity-50" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold opacity-70 block mb-2 uppercase">
                      Target Khatam
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={targetKhatam}
                        onChange={(e) =>
                          setTargetKhatam(Number(e.target.value))
                        }
                        className="bg-white/10 border border-white/20 text-3xl font-black w-24 rounded-2xl p-4 outline-none focus:bg-white/20 transition-all"
                      />
                      <span className="font-bold text-lg">Kali / Bulan</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold opacity-70 block mb-2 uppercase">
                      Total Halaman Mushaf
                    </label>
                    <select
                      value={totalHalaman}
                      onChange={(e) => setTotalHalaman(Number(e.target.value))}
                      className="bg-white/10 border border-white/20 text-sm font-bold w-full rounded-2xl p-4 outline-none appearance-none"
                    >
                      <option value={604} className="text-slate-900">
                        Standar Madinah (604 Hal)
                      </option>
                      <option value={480} className="text-slate-900">
                        Standar Indonesia (480 Hal)
                      </option>
                      <option value={500} className="text-slate-900">
                        Lainnya (500 Hal)
                      </option>
                    </select>
                  </div>
                </div>

                {/* HASIL */}
                <div className="bg-white rounded-[2rem] p-6 text-slate-900 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-4 rounded-2xl text-[#5465ff]">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">
                        Per Waktu Sholat
                      </p>
                      <h4 className="text-2xl font-black text-[#5465ff] leading-none">
                        {lembarPerSholat} Lembar
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <BookOpen className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5 rotate-12" />
            </div>
          </div>

          {/* --- ZAKAT CALCULATOR --- */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 px-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              <Wallet className="w-4 h-4" /> Kalkulator Zakat Mal
            </h2>

            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 block mb-3 uppercase tracking-widest">
                    Total Harta (Tabungan/Emas/Saham)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      onChange={(e) => setZakatMal(Number(e.target.value))}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black outline-none focus:border-[#5465ff]/30 transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                  <Info className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                  <p className="text-[10px] text-amber-700 leading-relaxed">
                    Nisab Zakat Mal adalah setara <b>85 gram emas</b>. Jika
                    harta Anda diatas nisab dan sudah tersimpan 1 tahun, wajib
                    zakat 2.5%.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Estimasi Wajib Zakat:
                  </p>
                  <div className="flex items-center justify-between">
                    <h4
                      className={cn(
                        "text-2xl font-black",
                        totalZakatMal > 0
                          ? "text-emerald-500"
                          : "text-slate-300",
                      )}
                    >
                      {formatRupiah(totalZakatMal)}
                    </h4>
                    {totalZakatMal > 0 && (
                      <div className="bg-emerald-500 text-white p-2 rounded-full">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
            Sempurnakan Ibadah di Bulan Suci
          </p>
        </div>
      </div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[8px] font-black uppercase tracking-widest">
      {label}
    </span>
  );
}
