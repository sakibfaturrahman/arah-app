"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Compass, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 py-12 font-sans overflow-hidden">
      {/* --- DEKORASI BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5465ff]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* --- ICON/VISUAL --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-32 h-32 mx-auto mb-8"
        >
          <div className="absolute inset-0 bg-[#5465ff]/10 rounded-[2.5rem] rotate-12 animate-pulse" />
          <div className="absolute inset-0 bg-white shadow-xl rounded-[2.5rem] flex items-center justify-center border border-slate-50">
            <Compass className="w-16 h-16 text-[#5465ff] animate-spin-slow" />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -right-4 p-3 bg-amber-50 rounded-2xl border border-amber-100 shadow-sm"
          >
            <Search className="w-6 h-6 text-amber-500" />
          </motion.div>
        </motion.div>

        {/* --- TEXT CONTENT --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#5465ff]">
            Halaman Tidak Ditemukan
          </h2>

          <h1
            className="text-4xl font-serif text-slate-800 leading-relaxed"
            style={{ direction: "rtl" }}
          >
            وَعَسَىٰ أَنْ تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَكُمْ
          </h1>

          <p className="text-xs italic text-slate-400 max-w-xs mx-auto leading-relaxed">
            "Boleh jadi kamu membenci sesuatu, padahal ia amat baik bagimu..."
            (Al-Baqarah: 216)
          </p>

          <div className="pt-6">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Tersesat Adalah Awal Menemukan Jalan
            </h3>
            <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed px-4">
              Sepertinya Anda sampai di tempat yang belum kami bangun. Mari
              kembali ke jalur utama untuk melanjutkan ibadah.
            </p>
          </div>
        </motion.div>

        {/* --- NAVIGATION BUTTONS --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col gap-3"
        >
          <Link
            href="/"
            className="w-full py-5 bg-[#5465ff] text-white rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#5465ff]/30 active:scale-95 transition-transform"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full py-5 bg-white text-slate-500 border border-slate-100 rounded-full text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Halaman Sebelumnya
          </button>
        </motion.div>

        {/* --- QUOTE KECIL --- */}
        <p className="mt-12 text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
          <span className="w-8 h-[1px] bg-slate-200" />
          Arah - Pendamping Ibadah
          <span className="w-8 h-[1px] bg-slate-200" />
        </p>
      </div>
    </div>
  );
}
