"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, Navigation } from "lucide-react";

export default function ArahKiblat() {
  const [heading, setHeading] = useState(0); // Rotasi HP
  const kiblatAngle = 295; // Contoh sudut kiblat untuk Indonesia (estimasi)

  useEffect(() => {
    const handler = (e: any) => {
      // Mengambil data dari sensor magnetometer/kompas perangkat
      const alpha = e.webkitCompassHeading || Math.abs(e.alpha - 360);
      setHeading(alpha);
    };

    window.addEventListener("deviceorientation", handler, true);
    return () => window.removeEventListener("deviceorientation", handler);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-black text-slate-900">
          Kompas <span className="text-[#5465ff]">Kiblat</span>
        </h1>
        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
          Putar perangkat Anda
        </p>
      </div>

      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Lingkaran Luar */}
        <div className="absolute inset-0 border-4 border-white shadow-xl rounded-full" />

        {/* Jarum Kompas yang berputar */}
        <motion.div
          animate={{ rotate: -heading }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Arah Utara */}
          <span className="absolute top-4 font-black text-slate-300 text-sm">
            U
          </span>

          {/* Icon Ka'bah / Penanda Kiblat */}
          <motion.div
            style={{ rotate: kiblatAngle }}
            className="absolute inset-0 flex flex-col items-center pt-8"
          >
            <div className="w-2 h-16 bg-[#5465ff] rounded-full shadow-[0_0_15px_rgba(84,101,255,0.5)]" />
            <Navigation className="w-8 h-8 text-[#5465ff] fill-[#5465ff] -mt-2" />
            <span className="text-[10px] font-black mt-2 text-[#5465ff] bg-white px-3 py-1 rounded-full shadow-sm">
              KIBLAT
            </span>
          </motion.div>
        </motion.div>

        {/* Center Point */}
        <div className="w-4 h-4 bg-white border-4 border-[#5465ff] rounded-full z-10 shadow-md" />
      </div>

      <div className="mt-12 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm w-full max-w-xs text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Sudut Perangkat
        </p>
        <p className="text-3xl font-black text-slate-900">
          {Math.round(heading)}°
        </p>
      </div>
    </div>
  );
}
