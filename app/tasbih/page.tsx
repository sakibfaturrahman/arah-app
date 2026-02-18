"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Settings2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DZIKIR_STEPS = [
  {
    id: 1,
    text: "Subhanallah",
    arabic: "سُبْحَانَ ٱللَّٰهِ",
    target: 33,
    translate: "Maha Suci Allah",
  },
  {
    id: 2,
    text: "Alhamdulillah",
    arabic: "ٱلْحَمْدُ لِلَّٰهِ",
    target: 33,
    translate: "Segala Puji Bagi Allah",
  },
  {
    id: 3,
    text: "Allahu Akbar",
    arabic: "ٱللَّٰهُ أَكْبَرُ",
    target: 33,
    translate: "Allah Maha Besar",
  },
  {
    id: 4,
    text: "Astaghfirullah",
    arabic: "أَسْتَغْفِرُ ٱللَّٰهَ",
    target: 100,
    translate: "Aku memohon ampun kepada Allah",
  },
];

export default function TasbihPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(DZIKIR_STEPS[0].target);
  const [rotation, setRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTarget(DZIKIR_STEPS[currentStep].target);
    setCount(0);
    setRotation(0);
  }, [currentStep]);

  const handleTap = () => {
    const nextCount = count + 1;
    setRotation((prev) => prev - 360 / target);

    if (nextCount >= target) {
      if (currentStep < DZIKIR_STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setCount(target);
      }
    } else {
      setCount(nextCount);
    }

    if (navigator.vibrate) navigator.vibrate(40);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 pt-20 pb-32 overflow-hidden font-sans">
      {/* 1. HEADER & STEP NAVIGATION */}
      <div className="w-full max-w-xs flex items-center justify-between mb-10">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          className="p-2 text-slate-300 active:text-[#5465ff] transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <span className="text-[10px] font-black text-[#5465ff] uppercase tracking-[0.3em] block mb-1">
            Step {currentStep + 1}
          </span>
          <span className="text-sm font-bold text-slate-800">
            {DZIKIR_STEPS[currentStep].text}
          </span>
        </div>
        <button
          onClick={() =>
            setCurrentStep((prev) =>
              Math.min(DZIKIR_STEPS.length - 1, prev + 1),
            )
          }
          className="p-2 text-slate-300 active:text-[#5465ff] transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* 2. ARABIC TEXT & TRANSLATION */}
      <div className="text-center min-h-[100px] mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2
              className="text-4xl font-serif text-slate-800 mb-3 leading-relaxed"
              style={{ direction: "rtl" }}
            >
              {DZIKIR_STEPS[currentStep].arabic}
            </h2>
            <p className="text-xs font-medium text-slate-400 italic">
              "{DZIKIR_STEPS[currentStep].translate}"
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. TASBIH VISUAL (THE DONUT) */}
      <div className="relative flex flex-col items-center justify-center mb-12">
        {/* Indikator Segitiga */}
        <div className="absolute top-[-14px] z-20">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-[#5465ff]"
          />
        </div>

        {/* Lingkaran Putih Donat - Clickable */}
        <button
          onClick={handleTap}
          className="relative w-80 h-80 flex items-center justify-center bg-white rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-50 active:scale-95 transition-transform overflow-hidden outline-none"
        >
          {/* Jalur Butiran yang Berputar */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {[...Array(target)].map((_, i) => {
              const isSpecial = i + 1 === 11 || i + 1 === 22;
              return (
                <div
                  key={i}
                  className="absolute h-full w-2 flex justify-center pt-8"
                  style={{ transform: `rotate(${(i * 360) / target}deg)` }}
                >
                  <div
                    className={cn(
                      "rounded-full transition-all duration-300",
                      i < count
                        ? "bg-[#5465ff] scale-110 shadow-[0_0_10px_rgba(84,101,255,0.3)]"
                        : "bg-slate-200",
                      isSpecial
                        ? "w-4 h-4 bg-amber-400 border-2 border-amber-200 -mt-0.5"
                        : "w-2.5 h-2.5",
                    )}
                  />
                </div>
              );
            })}
          </motion.div>

          <span className="relative z-10 text-7xl font-black text-slate-800 tracking-tighter leading-none">
            {count}
          </span>
        </button>
      </div>

      {/* 4. MAIN ACTION BUTTONS */}
      <div
        className={cn(
          // Mobile: Floating di tengah bawah, beri jarak pb-32 agar tidak tertutup bottom bar
          "fixed bottom-32 left-1/2 -translate-x-1/2 z-40 w-full max-w-[200px]",
          // Desktop: Menjadi bagian dari flow dokumen (tidak floating), tetap rapat di tengah
          "md:relative md:bottom-0 md:left-0 md:translate-x-0 md:mt-12",
        )}
      >
        <div className="bg-white/80 backdrop-blur-md md:bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-xl md:shadow-sm flex items-center justify-center gap-6">
          <button
            onClick={() => {
              setCount(0);
              setRotation(0);
            }}
            className="p-4 bg-slate-50 rounded-full text-slate-400 active:text-red-500 transition-colors hover:bg-red-50"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="h-8 w-[1px] bg-slate-100" />{" "}
          {/* Divider kecil biar makin rapi */}
          <button
            onClick={() => setShowModal(true)}
            className="relative p-4 bg-slate-50 rounded-full text-slate-400 active:text-[#5465ff] transition-colors hover:bg-blue-50"
          >
            <Settings2 className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-[#5465ff] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md">
              {target}
            </span>
          </button>
        </div>
      </div>

      {/* 5. SETTINGS DRAWER (MODAL) */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[101] rounded-t-[3rem] p-8 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                  Set Target Dzikir
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-slate-50 rounded-full text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[33, 99, 100].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setTarget(val);
                      setShowModal(false);
                    }}
                    className={cn(
                      "py-4 rounded-[2rem] font-bold text-lg transition-all",
                      target === val
                        ? "bg-[#5465ff] text-white shadow-xl shadow-[#5465ff]/30"
                        : "bg-slate-50 text-slate-400",
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <p className="mt-12 text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
        ARAH - Pendamping Ibadah
      </p>
    </div>
  );
}
