"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BookOpen, Wind, MapPin, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const onboardingData = [
  {
    title: "Demi Masa",
    dalil: "وَالْعَصْرِ ۙ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ",
    mean: "Demi masa. Sesungguhnya manusia itu benar-benar dalam kerugian.",
    introTitle: "Apa itu ARAH?",
    introDesc:
      "Pendamping digital minimalis untuk menavigasi waktu ibadah dengan lebih bermakna.",
    icon: <Clock className="w-12 h-12 md:w-16 md:h-16 text-[#5465ff]" />,
    color: "bg-blue-50/50",
  },
  {
    title: "Cahaya Ilmu",
    dalil:
      "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    mean: "Barangsiapa menempuh jalan mencari ilmu, Allah mudahkan jalannya ke surga.",
    introTitle: "Literasi Digital",
    introDesc:
      "Eksplorasi Hadis dan Al-Qur'an secara instan untuk memperdalam pemahaman agama.",
    icon: <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-emerald-500" />,
    color: "bg-emerald-50/50",
  },
  {
    title: "Disiplin Ibadah",
    dalil: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا",
    mean: "Sesungguhnya shalat itu adalah kewajiban yang ditentukan waktunya.",
    introTitle: "Presisi & Akurasi",
    introDesc:
      "Integrasi data astronomi memastikan akurasi waktu Shalat & Adzan secara real-time.",
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
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Welcome screen loading 3 detik sebelum auto-dismiss
    const t = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleNext = useCallback(() => {
    if (current < onboardingData.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      setShowLocationModal(true);
    }
  }, [current]);

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
          onComplete(); // Panggil fungsi selesai di sini
        },
        () => {
          // Tetap lanjut meskipun user menolak akses lokasi
          onComplete();
        },
        { timeout: 8000 },
      );
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#FAFAFA] flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#5465ff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            key="welcome-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[10000] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6"
            onClick={() => setShowWelcome(false)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8"
              >
                <img
                  src="/logo.jpg"
                  alt="ARAH Logo"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-xl"
                />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-serif text-slate-900 mb-2">
                ARAH
              </h1>
              <p className="text-sm text-slate-500 max-w-xs">Memuat...</p>
              <div className="mt-6 flex gap-1">
                <motion.div
                  className="w-1.5 h-1.5 bg-[#5465ff] rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 bg-[#5465ff] rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 bg-[#5465ff] rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!showLocationModal ? (
          <motion.div
            key={`step-${current}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-xl px-6 h-full flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="flex-1 w-full flex flex-col items-center justify-center">
              <div
                className={cn(
                  "p-8 rounded-[2.5rem] mb-8 shadow-inner transition-colors duration-500",
                  onboardingData[current].color,
                )}
              >
                {onboardingData[current].icon}
              </div>

              <div className="space-y-6 text-center w-full">
                <div className="space-y-2">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5465ff]">
                    {onboardingData[current].title}
                  </h2>
                  <h1
                    className="text-3xl md:text-5xl font-serif text-slate-800"
                    dir="rtl"
                  >
                    {onboardingData[current].dalil}
                  </h1>
                  <p className="text-xs italic text-slate-400 max-w-xs mx-auto leading-relaxed">
                    "{onboardingData[current].mean}"
                  </p>
                </div>

                <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm w-full max-w-md mx-auto">
                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    {onboardingData[current].introTitle}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {onboardingData[current].introDesc}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-6 mb-12">
              <div className="flex justify-center gap-2">
                {onboardingData.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === current ? "bg-[#5465ff] w-8" : "bg-slate-200 w-1.5",
                    )}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleNext}
                  className="w-full py-4 bg-[#5465ff] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform cursor-pointer"
                >
                  {current === onboardingData.length - 1
                    ? "Buka Pintu Hikmah"
                    : "Lanjutkan"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="text-[9px] font-bold text-slate-400 uppercase tracking-widest py-1 cursor-pointer"
                >
                  Lewati
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="location-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-50 w-full max-w-xs md:max-w-sm px-6"
          >
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center border border-slate-50 space-y-8">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto">
                <MapPin className="w-10 h-10 text-[#5465ff]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                  Aktifkan Presisi
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Izinkan lokasi untuk mendapatkan jadwal sholat yang akurat di
                  posisi Anda.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={requestLocation}
                  className="w-full py-5 bg-[#5465ff] text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform cursor-pointer"
                >
                  Izinkan Sekarang
                </button>
                <button
                  onClick={() => onComplete()}
                  className="w-full py-5 text-slate-400 text-xs font-bold cursor-pointer"
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
