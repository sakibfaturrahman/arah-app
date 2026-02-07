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
      "ARAH adalah pendamping digital minimalis yang dirancang untuk membantu Anda menavigasi waktu ibadah dengan lebih bermakna.",
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
      "Eksplorasi ribuan Hadis dan ayat suci Al-Qur'an secara instan untuk memperdalam literasi Islam Anda.",
    icon: <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-emerald-500" />,
    color: "bg-emerald-50/50",
  },
  {
    title: "Disiplin Ibadah",
    dalil: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا",
    mean: "Sesungguhnya shalat itu adalah kewajiban yang ditentukan waktunya.",
    introTitle: "Presisi & Akurasi",
    introDesc:
      "Melalui integrasi data astronomi, ARAH memastikan Anda tetap terhubung dengan waktu Shalat & Adzan.",
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

  const safeComplete = () => {
    if (typeof onComplete === "function") {
      onComplete();
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
        () => safeComplete(),
      );
    } else {
      safeComplete();
    }
  };

  return (
    // Tambahkan pointer-events-auto agar semua elemen di dalamnya bisa merespon klik
    <div className="fixed inset-0 z-[9999] bg-[#FAFAFA] flex flex-col items-center justify-center overflow-hidden font-sans pointer-events-auto">
      {/* --- BACKGROUND ANIMATION (Kecilkan Z-Index agar tidak menutupi tombol) --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-[#5465ff]/10 rounded-full blur-3xl"
        />
      </div>

      <AnimatePresence mode="wait">
        {!showLocationModal ? (
          <motion.div
            key={`step-${current}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            // Pointer events auto sangat penting di sini
            className="relative z-10 w-full max-w-xl px-6 h-full flex flex-col items-center justify-center py-10 pointer-events-auto"
          >
            {/* Scrollable Content */}
            <div className="flex-1 w-full flex flex-col items-center justify-center pt-10">
              <motion.div
                className={cn(
                  "p-8 rounded-[2.5rem] mb-8 shadow-inner shrink-0 flex items-center justify-center",
                  onboardingData[current].color,
                )}
              >
                {onboardingData[current].icon}
              </motion.div>

              <div className="space-y-6 flex flex-col items-center w-full">
                <div className="space-y-4 w-full text-center">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5465ff]">
                    {onboardingData[current].title}
                  </h2>
                  <h1
                    className="text-3xl md:text-5xl font-serif leading-relaxed text-slate-800"
                    style={{ direction: "rtl" }}
                  >
                    {onboardingData[current].dalil}
                  </h1>
                  <p className="text-xs italic text-slate-400 max-w-sm mx-auto leading-relaxed px-4">
                    "{onboardingData[current].mean}"
                  </p>
                </div>

                <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm w-full max-w-md relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5465ff] text-white px-4 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-2 h-2 fill-white" /> Mengenal ARAH
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2">
                    {onboardingData[current].introTitle}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                    {onboardingData[current].introDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* --- CONTROLS Area --- */}
            <div className="w-full max-w-xs space-y-6 mt-8 pb-10 relative z-20">
              <div className="flex justify-center gap-2">
                {onboardingData.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === current ? "bg-[#5465ff] w-8" : "bg-slate-200 w-2",
                    )}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  // Ubah dari motion.button ke button biasa dulu untuk test,
                  // atau pastikan z-index tombol paling tinggi.
                  onClick={handleNext}
                  className="w-full py-5 bg-[#5465ff] text-white rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#5465ff]/30 cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all relative z-30"
                >
                  {current === onboardingData.length - 1
                    ? "Buka Pintu Hikmah"
                    : "Lanjutkan"}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowLocationModal(true)}
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#5465ff] transition-colors py-2 cursor-pointer relative z-30"
                >
                  Lewati Perkenalan
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* --- LOCATION MODAL --- */
          <motion.div
            key="location-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-50 w-full max-w-xs md:max-w-sm px-6 pointer-events-auto"
          >
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center border border-slate-50 space-y-8">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <MapPin className="w-10 h-10 text-[#5465ff]" />
                </motion.div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">
                  Aktifkan Presisi
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Izinkan lokasi untuk sinkronisasi waktu sholat yang akurat.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={requestLocation}
                  className="w-full py-5 bg-[#5465ff] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 cursor-pointer hover:brightness-110"
                >
                  <MousePointer2 className="w-4 h-4" /> Izinkan Sekarang
                </button>
                <button
                  onClick={safeComplete}
                  className="w-full py-5 bg-slate-50 text-slate-400 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
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
