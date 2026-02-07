"use client";
import React, { useState, useEffect } from "react";
import { Search, Bell, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { getPrayerTimes } from "@/lib/getPrayerTimes";
import { navItems, bottomNavItems } from "@/components/constants/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
  } | null>(null);

  // Fungsi Pencarian Aktif ke Halaman Al-Quran
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/al-quran?search=${encodeURIComponent(searchValue.trim())}`);
      setIsSearchOpen(false);
      setSearchValue("");
    }
  };

  useEffect(() => {
    const checkTimings = async () => {
      // 1. Ambil Jadwal Shalat
      const data = await getPrayerTimes();
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      if (data) {
        const prayers = [
          { name: "Subuh", time: data.timings.Fajr },
          { name: "Dzuhur", time: data.timings.Dhuhr },
          { name: "Ashar", time: data.timings.Asr },
          { name: "Maghrib", time: data.timings.Maghrib },
          { name: "Isya", time: data.timings.Isha },
        ];

        const currentPrayer = prayers.find((p) => p.time === currentTime);
        if (currentPrayer) {
          setNotification({
            title: `Waktunya Shalat ${currentPrayer.name}`,
            message: `Sudah masuk pukul ${currentPrayer.time}. Mari sejenak menghadap Allah.`,
          });
        }
      }

      // 2. Cek Pengingat Tadarus (24 Jam)
      const lastReadData = localStorage.getItem("lastReadSurah");
      if (lastReadData) {
        const { updatedAt, nama_latin } = JSON.parse(lastReadData);
        const lastTime = new Date(updatedAt).getTime();
        const diffInHours = (now.getTime() - lastTime) / (1000 * 60 * 60);

        // Jika lebih dari 24 jam belum tadarus
        if (diffInHours >= 24) {
          setNotification({
            title: "Waktunya Tadarus",
            message: `Terakhir Anda membaca surah ${nama_latin}. Yuk, lanjutkan mengaji hari ini agar hati tetap tenang.`,
          });
        }
      } else {
        // Jika belum pernah baca sama sekali
        setNotification({
          title: "Mulai Mengaji",
          message:
            "Yuk mulai baca Al-Qur'an hari ini untuk keberkahan waktumu.",
        });
      }
    };

    // Jalankan pengecekan setiap menit
    const interval = setInterval(checkTimings, 60000);
    checkTimings(); // Jalankan sekali saat mount

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* --- GLOBAL SEARCH MODAL --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm p-4 flex items-start justify-center pt-20"
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <form
                onSubmit={handleSearch}
                className="p-4 flex items-center gap-3 border-b border-slate-100"
              >
                <Search className="w-5 h-5 text-[#5465ff]" />
                <input
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Cari Surah, Hadits, atau Doa..."
                  className="flex-1 bg-transparent outline-none text-sm font-medium h-10"
                />
                <button type="button" onClick={() => setIsSearchOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </form>
              <div className="p-4 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                  Saran
                </p>
                {["Al-Kahfi", "Dzikir Pagi", "Ar-Rahman"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSearchValue(s);
                    }}
                    className="w-full text-left p-3 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" /> {s}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NOTIFICATION POPUP --- */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: "-50%" }}
            animate={{ opacity: 1, y: 80, x: "-50%" }}
            exit={{ opacity: 0, y: -100, x: "-50%" }}
            className="fixed top-0 left-1/2 z-[150] w-[90%] max-w-md bg-white border shadow-xl rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="bg-[#5465ff]/10 p-2 rounded-full">
              <Bell className="w-5 h-5 text-[#5465ff]" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-900">
                {notification.title}
              </h4>
              <p className="text-[10px] text-slate-500">
                {notification.message}
              </p>
            </div>
            <button onClick={() => setNotification(null)}>
              <X className="w-4 h-4 text-slate-300" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER MOBILE (Top Bar) --- */}
      {/* --- HEADER MOBILE (Top Bar) --- */}
      <div className="fixed top-0 left-0 right-0 z-[100] lg:hidden bg-white/80 backdrop-blur-md border-b px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-white shadow-sm"
        >
          <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
        </Link>

        <div className="flex items-center gap-2">
          {/* Tombol Notifikasi */}
          <button
            onClick={() => {
              if (notification) {
                // Aksi jika notifikasi diklik, misal buka modal atau scroll ke jadwal
              } else {
                setNotification({
                  title: "Belum Ada Info",
                  message: "Pantau terus waktu ibadahmu hari ini.",
                });
              }
            }}
            className="relative p-2.5 bg-slate-100 rounded-full text-slate-500 active:scale-95 transition-transform"
          >
            <Bell className="w-5 h-5" />
            {/* Indicator merah jika ada notifikasi aktif */}
            {notification && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
            )}
          </button>

          {/* Tombol Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 bg-slate-100 rounded-full text-slate-500 active:scale-95 transition-transform"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- DESKTOP HEADER --- */}
      <header className="fixed top-0 w-full z-50 px-6 py-6 hidden lg:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 backdrop-blur-2xl border border-white shadow-sm rounded-full px-8 h-20">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-white shadow-md">
              <Image
                src="/logo.jpg"
                alt="Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-lg font-bold tracking-tighter text-gray-900 uppercase">
              Arah<span className="text-[#5465ff]">.</span>
            </h1>
          </Link>

          <nav className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-[12px] font-bold transition-all rounded-full whitespace-nowrap",
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-900",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktopActive"
                      className="absolute inset-0 bg-[#5465ff] shadow-sm shadow-blue-500/30"
                      style={{ borderRadius: 9999 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon className="w-4 h-4" /> {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-3 bg-slate-100 hover:bg-white border rounded-full text-slate-400 transition-all"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* --- BOTTOM BAR MOBILE --- */}
      {/* --- BOTTOM BAR MOBILE --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[450px] lg:hidden z-[100]">
        <nav className="bg-white/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-white/40 rounded-[2.5rem] px-2 py-2 flex justify-around items-center relative h-16">
          {bottomNavItems.map((item, idx) => {
            const isActive = pathname === item.href;
            const isCenter = idx === 2; // Menu Al-Quran

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center transition-all duration-300 flex-1",
                  isCenter ? "mb-6" : "mb-0", // Sedikit turun dari sebelumnya (tadi mb-4/5)
                )}
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center transition-all duration-500 rounded-2xl w-full py-1",
                    // Efek background semi-transparan untuk menu aktif non-center
                    isActive && !isCenter ? "bg-[#5465ff]/5" : "",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center transition-all duration-500",
                      isCenter
                        ? "w-14 h-14 bg-[#5465ff] rounded-2xl shadow-lg shadow-blue-500/40 text-white"
                        : "w-8 h-8",
                      // Animasi scale lebih tegas saat aktif
                      isActive ? "scale-110" : "scale-100",
                    )}
                  >
                    <item.icon
                      className={cn(
                        isCenter ? "w-7 h-7" : "w-5 h-5",
                        // Warna ikon lebih menyala saat aktif
                        isActive && !isCenter
                          ? "text-[#5465ff]"
                          : "text-slate-400",
                        isActive && isCenter ? "animate-pulse" : "",
                      )}
                    />
                  </div>

                  {!isCenter && (
                    <span
                      className={cn(
                        "text-[10px] font-bold mt-1 transition-colors duration-300",
                        isActive
                          ? "text-[#5465ff] opacity-100"
                          : "text-slate-400 opacity-70",
                      )}
                    >
                      {item.name}
                    </span>
                  )}
                </div>

                {/* Indikator Glow di bawah menu aktif */}
                {isActive && !isCenter && (
                  <motion.div
                    layoutId="mobileActiveGlow"
                    className="absolute -bottom-1 w-5 h-1 bg-[#5465ff] rounded-full shadow-[0_0_8px_rgba(84,101,255,0.6)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
