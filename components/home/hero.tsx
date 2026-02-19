"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Quote,
  BellRing,
  Timer,
  ArrowRight,
  Loader2,
  Fingerprint,
  Calculator,
  MapPin,
  Type,
  Sun,
  Zap,
  CheckCircle2,
  Share2,
  Check,
  Copy,
  Moon,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPrayerTimes, PrayerData } from "@/lib/getPrayerTimes";
import { getDailyHadith } from "@/lib/getDailyHadith";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HeroSection() {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [dailyHadith, setDailyHadith] = useState<any>(null);
  const [tracker, setTracker] = useState<Record<string, boolean>>({});
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [nextPrayer, setNextPrayer] = useState({
    name: "...",
    time: "--:--",
    diff: "...",
  });

  const prayerList = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya", "Tarawih"];

  useEffect(() => {
    async function loadData() {
      const [hadith, pData] = await Promise.all([
        getDailyHadith(),
        getPrayerTimes(),
      ]);
      if (hadith) setDailyHadith(hadith);
      if (pData) {
        setPrayerData(pData);
        calculateNextPrayer(pData.timings);
      }
      const savedTrackerData = localStorage.getItem("ibadah_tracker_data");
      let trackerData = {};
      const today = new Date().toDateString();
      if (savedTrackerData) {
        const { data, date } = JSON.parse(savedTrackerData);
        if (date === today) trackerData = data;
        else
          localStorage.setItem(
            "ibadah_tracker_data",
            JSON.stringify({ data: {}, date: today }),
          );
      } else {
        localStorage.setItem(
          "ibadah_tracker_data",
          JSON.stringify({ data: {}, date: today }),
        );
      }
      setTracker(trackerData);
    }
    loadData();

    // Timer untuk reset data setiap jam 00:00
    const checkMidnight = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setDate(nextMidnight.getDate() + 1);
      nextMidnight.setHours(0, 0, 0, 0);

      const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

      const timeout = setTimeout(() => {
        // Reset tracker data
        localStorage.setItem(
          "ibadah_tracker_data",
          JSON.stringify({ data: {}, date: new Date().toDateString() }),
        );
        setTracker({});
        // Jalankan ulang loadData untuk fetch data baru
        loadData();
      }, timeUntilMidnight);

      return timeout;
    };

    const timeoutId = checkMidnight();

    return () => clearTimeout(timeoutId);
  }, []);

  const toggleTracker = (name: string) => {
    const newTracker = { ...tracker, [name]: !tracker[name] };
    setTracker(newTracker);
    const today = new Date().toDateString();
    localStorage.setItem(
      "ibadah_tracker_data",
      JSON.stringify({ data: newTracker, date: today }),
    );

    // Check jika Tarawih ditekan dan semua ibadah selesai
    if (name === "Tarawih") {
      const allCompleted = prayerList.every((prayer) =>
        prayer === "Tarawih" ? !tracker[prayer] : newTracker[prayer],
      );
      if (allCompleted) {
        setShowCongratulations(true);
      }
    }
  };

  const calculateNextPrayer = (timings: any) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayers = [
      { name: "Imsak", time: timings.Imsak },
      { name: "Subuh", time: timings.Fajr },
      { name: "Dzuhur", time: timings.Dhuhr },
      { name: "Ashar", time: timings.Asr },
      { name: "Maghrib", time: timings.Maghrib },
      { name: "Isya", time: timings.Isha },
    ];
    let found = false;
    for (let prayer of prayers) {
      const [h, m] = prayer.time.split(":").map(Number);
      if (h * 60 + m > currentMinutes) {
        const diff = h * 60 + m - currentMinutes;
        setNextPrayer({
          name: prayer.name,
          time: prayer.time,
          diff:
            diff > 60 ? `${Math.floor(diff / 60)}j ${diff % 60}m` : `${diff}m`,
        });
        found = true;
        break;
      }
    }
    if (!found)
      setNextPrayer({ name: "Imsak", time: timings.Imsak, diff: "Besok" });
  };

  const handleShareHadith = async () => {
    if (!dailyHadith) return;

    const shareText = `Hadits Hari Ini\n\n${dailyHadith.arab}\n\n"${dailyHadith.id}"\n\n(${dailyHadith.slug} - No. ${dailyHadith.number})\n\nDibagikan melalui Aplikasi Arah.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Hadits Hari Ini",
          text: shareText,
          url: window.location.href,
        });
        setIsShared(true);
        toast.success("Hadits dibagikan!");
        setTimeout(() => setIsShared(false), 2000);
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setIsShared(true);
        toast.success("Link hadits disalin!");
        setTimeout(() => setIsShared(false), 2000);
      } catch (err) {
        toast.error("Gagal bagikan hadits");
      }
    }
  };

  const handleCopyHadith = async () => {
    if (!dailyHadith) return;

    const shareText = `Hadits Hari Ini\n\n${dailyHadith.arab}\n\n"${dailyHadith.id}"\n\n(${dailyHadith.slug} - No. ${dailyHadith.number})\n\nDibagikan melalui Aplikasi Arah.`;

    try {
      await navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      toast.success("Hadits berhasil disalin!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Gagal menyalin hadits");
    }
  };

  const completedCount = Object.values(tracker).filter(Boolean).length;
  const progressPercentage = Math.round(
    (completedCount / prayerList.length) * 100,
  );

  const shortcuts = [
    { icon: Sun, label: "Dzikir", href: "/dzikir" },
    { icon: Fingerprint, label: "Tasbih", href: "/tasbih" },
    { icon: Calculator, label: "Kalkulator", href: "/ramadhan/kalkulator" },
    { icon: MapPin, label: "Masjid", href: "/ramadhan/masjid-terdekat" },
    { icon: Moon, label: "Asmaul", href: "/asmaul-husna" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto px-4 md:px-0 space-y-10 pb-20"
    >
      {/* 1. NEXT PRAYER & BORDERLESS SHORTCUTS */}
      <div className="flex flex-col gap-10">
        <motion.div variants={itemVariants} className="w-full">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
              <div className="bg-[#5465ff]/10 p-4 rounded-3xl text-[#5465ff]">
                <BellRing className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
                  Shalat Berikutnya
                </p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-3xl font-black text-slate-900">
                    {nextPrayer.name}
                  </h3>
                  <span className="text-2xl font-light text-[#5465ff]">
                    {nextPrayer.time}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-0 flex items-center justify-between md:justify-end md:gap-8 border-t md:border-t-0 pt-4 md:pt-0">
              <div className="flex items-center gap-2 text-orange-500 bg-orange-50 px-4 py-2 rounded-full font-bold text-xs">
                <Timer className="w-4 h-4" />
                {nextPrayer.diff} lagi
              </div>
              <button className="p-3 bg-slate-900 text-white rounded-full hover:bg-[#5465ff] transition-all group">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-5 gap-2 md:gap-4"
        >
          {shortcuts.map((s, i) => (
            <motion.a
              key={i}
              href={s.href}
              // Efek melayang saat hover: naik ke atas (y: -8) dan sedikit membesar
              whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              // Efek saat ditekan: mengecil sedikit untuk sensasi klik tactile
              whileTap={{ scale: 0.92 }}
              className="flex flex-col items-center gap-3 group transition-all"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-3xl bg-white shadow-sm border border-slate-50 group-hover:shadow-xl group-hover:shadow-blue-500/10 group-hover:border-[#5465ff] group-hover:bg-blue-50 transition-all duration-300">
                <s.icon className="w-6 h-6 text-slate-400 group-hover:text-[#5465ff] transition-colors duration-300" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors duration-300 text-center leading-tight">
                {s.label}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* 2. HADITH CARD (Biru Dominan - Kontras Tinggi) */}
      <motion.div variants={itemVariants}>
        <Card className="border-none bg-[#5465ff] shadow-2xl shadow-blue-500/20 overflow-hidden rounded-[2.5rem] relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Image
              src="/assets-svg/islamic-lantern-svgrepo-com.svg"
              alt="Islamic Icon"
              width={180}
              height={180}
              className="invert"
            />
          </div>

          <CardContent className="p-8 md:p-12 relative z-10">
            <div className="flex justify-between items-start mb-10">
              <Badge className="bg-white/20 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                Hadits Hari Ini
              </Badge>

              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopyHadith}
                  className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-sm transition-colors text-white border border-white/10"
                  title="Salin Hadits"
                >
                  {isCopied ? (
                    <Check className="w-5 h-5 text-green-300" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShareHadith}
                  className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-sm transition-colors text-white border border-white/10"
                  title="Bagikan Hadits"
                >
                  {isShared ? (
                    <Check className="w-5 h-5 text-green-300" />
                  ) : (
                    <Share2 className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {dailyHadith ? (
                <div className="space-y-10">
                  <p
                    className="text-right text-3xl md:text-5xl font-serif leading-[1.8] md:leading-[1.6] text-white font-medium"
                    style={{ direction: "rtl" }}
                  >
                    {dailyHadith.arab}
                  </p>

                  <div className="space-y-6">
                    <p className="text-base md:text-xl font-medium leading-relaxed text-blue-50 italic border-l-2 border-white/30 pl-6">
                      "{dailyHadith.id}"
                    </p>

                    <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <Image
                          src="/assets-svg/islamic-lantern-svgrepo-com.svg"
                          alt="icon"
                          width={16}
                          height={16}
                          className="invert opacity-80"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">
                        {dailyHadith.slug} — NO. {dailyHadith.number}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center gap-4 text-white">
                  <Loader2 className="w-6 h-6 animate-spin opacity-50" />
                  <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-bold">
                    Sinkronisasi
                  </span>
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3. TRACKER SECTION */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <div className="bg-[#5465ff] p-3 rounded-2xl shadow-lg shadow-blue-200">
            <Image
              src="/assets-svg/mun-mashhad-svgrepo-com.svg"
              alt="Checklist Icon"
              width={24}
              height={24}
              className="invert"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Istiqomah Ibadah
            </h3>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-[#5465ff]"
                />
              </div>
              <span className="text-xs font-black text-[#5465ff]">
                {progressPercentage}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {prayerList.map((prayer) => (
            <button
              key={prayer}
              onClick={() => toggleTracker(prayer)}
              className={cn(
                "flex flex-col items-start gap-3 p-5 rounded-[2rem] border transition-all duration-300 active:scale-95 shadow-sm",
                tracker[prayer]
                  ? "bg-[#5465ff] border-[#5465ff] text-white shadow-blue-200"
                  : "bg-white border-slate-50 text-slate-600 hover:border-slate-200",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center",
                  tracker[prayer] ? "bg-white/20" : "bg-slate-50",
                )}
              >
                {tracker[prayer] ? (
                  <Image
                    src="/assets-svg/mosque-svgrepo-com.svg"
                    alt="completed"
                    width={20}
                    height={20}
                    className="invert brightness-0"
                  />
                ) : (
                  <Image
                    src="/assets-svg/islamic-1-svgrepo-com.svg"
                    alt="pending"
                    width={20}
                    height={20}
                    className="opacity-40"
                  />
                )}
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-black uppercase tracking-wider">
                  {prayer}
                </span>
                <span
                  className={cn(
                    "text-[8px] uppercase font-bold",
                    tracker[prayer] ? "text-white/60" : "text-slate-400",
                  )}
                >
                  {tracker[prayer] ? "Selesai" : "Belum"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Congratulations Modal */}
      <Dialog open={showCongratulations} onOpenChange={setShowCongratulations}>
        <DialogContent className="border-none bg-gradient-to-br from-[#5465ff] to-blue-600 shadow-2xl shadow-blue-500/30 rounded-[2.5rem] max-w-md">
          <DialogTitle className="sr-only">Selamat Ulang Tahun</DialogTitle>
          <DialogHeader className="text-center space-y-6">
            <div className="flex justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="text-5xl"
              >
                ✨
              </motion.div>
            </div>

            <div className="space-y-4 text-white">
              <h2 className="text-3xl font-black">Alhamdulillah! 🌙</h2>
              <DialogDescription className="text-base leading-relaxed text-white/90 italic">
                "Tidaklah sempurna ibadah seseorang melainkan dengan ilmu dan
                keikhlasan." Semoga amal ibadahmu hari ini diterima oleh Allah
                dan menjadi berkah bagimu dan keluargamu.
              </DialogDescription>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-3">
                <div>
                  <p className="text-xs font-bold text-white/60 mb-2 uppercase tracking-widest">
                    Doa Arab:
                  </p>
                  <p
                    className="text-base text-white/90 leading-relaxed text-right"
                    style={{ direction: "rtl" }}
                  >
                    اللهم تقبل منا إنك أنت السميع العليم وتب علينا إنك أنت
                    التواب الرحيم
                  </p>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-xs font-bold text-white/60 mb-2 uppercase tracking-widest">
                    Latin:
                  </p>
                  <p className="text-sm text-white/80 italic leading-relaxed">
                    "Allahumma taqabbal minna, innaka anta as-sami'ul 'alim wa
                    tubu 'alaina, innaka anta at-tawwabur rahim."
                  </p>
                  <p className="text-xs text-white/60 mt-3">
                    <span className="font-semibold">Artinya: </span>"Ya Allah,
                    terimalah dari kami, sesungguhnya Engkau adalah Yang Maha
                    Mendengar lagi Maha Mengetahui. Terimalah taubat kami,
                    sesungguhnya Engkau adalah Yang Maha Penerima taubat lagi
                    Maha Penyayang."
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCongratulations(false)}
                className="w-full mt-6 py-3 bg-white text-[#5465ff] rounded-2xl font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Terima Kasih
              </button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
