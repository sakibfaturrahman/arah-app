"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
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

  const handleReset = () => {
    setCount(0);
    setRotation(0);
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
        <div className="absolute top-[-14px] z-20">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-[#5465ff]"
          />
        </div>

        <button
          onClick={handleTap}
          className="relative w-80 h-80 flex items-center justify-center bg-white rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-50 active:scale-95 transition-transform overflow-hidden outline-none"
        >
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

          <div className="relative z-10 flex flex-col items-center">
            <span className="text-7xl font-black text-slate-800 tracking-tighter leading-none">
              {count}
            </span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">
              Target: {target}
            </span>
          </div>
        </button>
      </div>

      {/* 4. RESET ACTION BUTTON */}
      <div
        className={cn(
          "fixed bottom-32 left-1/2 -translate-x-1/2 z-40",
          "md:relative md:bottom-0 md:left-0 md:translate-x-0 md:mt-12",
        )}
      >
        <div className="bg-white p-2 rounded-full border border-slate-100 shadow-xl md:shadow-sm">
          <button
            onClick={handleReset}
            className="flex items-center gap-3 px-6 py-3 bg-slate-50 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-all group"
          >
            <RotateCcw className="w-5 h-5 group-active:rotate-[-180deg] transition-transform duration-500" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Reset
            </span>
          </button>
        </div>
      </div>

      <p className="mt-12 text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
        ARAH - Pendamping Ibadah
      </p>
    </div>
  );
}
