"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  BookOpen,
  Wind,
  MapPin,
  ArrowRight,
  Sparkles,
  MousePointer2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const onboardingData = [
  {
    title: "Demi Masa",
    dalil: "وَالْعَصْرِ ۙ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ",
    mean: "Demi masa. Sesungguhnya manusia itu benar-benar dalam kerugian.",
    introTitle: "Apa itu ARAH?",
    introDesc:
      "ARAH adalah pendamping digital minimalis yang dirancang untuk membantu Anda menavigasi waktu ibadah dengan lebih bermakna di tengah kesibukan modern.",
    icon: <Clock className="w-12 h-12 md:w-16 md:h-16 text-[#5465ff]" />,
    color: "bg-blue-50/50",
  },
  {
    title: "Cahaya Ilmu",
    dalil:
      "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    mean: "Barangsiapa menempuh jalan mencari ilmu, Allah mudahkan jalannya ke surga.",
    introTitle: "Perpustakaan Digital",
    introDesc:
      "Eksplorasi ribuan Hadis dan ayat suci Al-Qur'an secara instan. ARAH diperuntukkan bagi Anda yang ingin memperdalam literasi Islam setiap hari.",
    icon: <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-emerald-500" />,
    color: "bg-emerald-50/50",
  },
  {
    title: "Disiplin Ibadah",
    dalil: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا",
    mean: "Sesungguhnya shalat itu adalah kewajiban yang ditentukan waktunya.",
    introTitle: "Presisi & Akurasi",
    introDesc:
      "Melalui integrasi data astronomi yang akurat, ARAH memastikan Anda tetap terhubung dengan waktu Shalat dan Adzan di mana pun Anda berada.",
    icon: <Wind className="w-12 h-12 md:w-16 md:h-16 text-rose-500" />,
    color: "bg-rose-50/50",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [current, setCurrent] = useState(0);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Helper to ensure onComplete is actually a function before calling
  const safeComplete = () => {
    if (typeof onComplete === "function") {
      onComplete();
    } else {
      console.error("onComplete prop is missing or not a function");
    }
  };

  const handleNext = () => {
    if (current < onboardingData.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowLocationModal(true);
    }
  };

  const requestLocation = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          localStorage.setItem(
            "user-location",
            JSON.stringify({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          );
          safeComplete();
        },
        () => safeComplete(), // Proceed even if denied
      );
    } else {
      safeComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#FAFAFA] flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* --- PARALLAX BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-[#5465ff]/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-10 left-10 w-48 h-48 md:w-72 md:h-72 bg-amber-100/30 rounded-full blur-3xl"
        />
      </div>

      <AnimatePresence mode="wait">
        {!showLocationModal ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-xl px-6 h-full flex flex-col items-center justify-center py-10"
          >
            {/* Scrollable Content Area */}
            <div className="flex-1 w-full flex flex-col items-center justify-center overflow-y-auto no-scrollbar pt-10">
              {/* Dynamic Animated Icon */}
              <motion.div
                key={`icon-${current}`}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className={cn(
                  "p-6 md:p-7 rounded-[2rem] md:rounded-[2.5rem] mb-6 shadow-inner shrink-0",
                  onboardingData[current].color,
                )}
              >
                {onboardingData[current].icon}
              </motion.div>

              <div className="space-y-4 md:space-y-6 flex flex-col items-center w-full">
                {/* Spiritual Section (Dalil) */}
                <div className="space-y-3 md:space-y-4 w-full">
                  <h2 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-[#5465ff] text-center">
                    {onboardingData[current].title}
                  </h2>
                  <motion.h1
                    key={`dalil-${current}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl md:text-5xl font-serif leading-relaxed text-slate-800 text-center px-2"
                    style={{ direction: "rtl" }}
                  >
                    {onboardingData[current].dalil}
                  </motion.h1>
                  <p className="text-[10px] md:text-[11px] italic text-slate-400 max-w-[280px] md:max-w-sm mx-auto leading-relaxed text-center">
                    "{onboardingData[current].mean}"
                  </p>
                </div>

                {/* --- APP INTRODUCTION CARD --- */}
                <motion.div
                  key={`intro-${current}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 md:mt-4 p-5 md:p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm w-full max-w-[340px] md:max-w-md relative"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5465ff] text-white px-3 py-1 rounded-full text-[7px] md:text-[8px] font-bold uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
                    <Sparkles className="w-2 h-2 fill-white" /> Mengenal ARAH
                  </div>
                  <h4 className="text-xs md:text-sm font-bold text-slate-800 mb-1 md:mb-2">
                    {onboardingData[current].introTitle}
                  </h4>
                  <p className="text-[11px] md:text-sm text-slate-500 leading-relaxed font-medium">
                    {onboardingData[current].introDesc}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Pagination & CTA Area */}
            <div className="w-full max-w-xs space-y-4 md:space-y-6 mt-6 pb-4">
              <div className="flex justify-center gap-2">
                {onboardingData.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      i === current ? "w-8 bg-[#5465ff]" : "w-2 bg-slate-200",
                    )}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleNext}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#5465ff] transition-all shadow-lg shadow-slate-200 active:scale-95"
                >
                  {current === onboardingData.length - 1
                    ? "Buka Pintu Hikmah"
                    : "Lanjutkan"}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#5465ff] transition-colors py-2"
                >
                  Lewati Perkenalan
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* --- LOCATION MODAL --- */
          <motion.div
            key="location"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-xs md:max-w-sm px-6"
          >
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl text-center border border-slate-50 space-y-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-[1.5rem] md:rounded-3xl flex items-center justify-center mx-auto">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MapPin className="w-8 h-8 md:w-10 md:h-10 text-[#5465ff]" />
                </motion.div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                  Aktifkan Presisi
                </h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                  Izinkan lokasi untuk sinkronisasi waktu sholat dan arah kiblat
                  yang akurat sesuai titik koordinat Anda.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <button
                  onClick={requestLocation}
                  className="w-full py-4 bg-[#5465ff] text-white rounded-2xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-transform"
                >
                  <MousePointer2 className="w-4 h-4" /> Izinkan Sekarang
                </button>
                <button
                  onClick={safeComplete}
                  className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs md:text-sm font-bold hover:bg-slate-100"
                >
                  Gunakan Manual
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
