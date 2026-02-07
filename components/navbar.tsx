"use client";
import React, { useState } from "react";
import {
  Search,
  Bell,
  X,
  Sparkles,
  Clock,
  BookOpen,
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { getAllSurah } from "@/lib/getQuran";
import { useNotification } from "@/hooks/useNotification";
import { navItems, bottomNavItems } from "@/components/constants/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { notification, setNotification } = useNotification();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Contoh data riwayat notifikasi (Bisa dikembangkan menggunakan state/db)
  const notifHistory = [
    {
      id: 1,
      title: "Waktu Dzuhur",
      desc: "Sudah masuk waktu shalat Dzuhur untuk wilayah Anda.",
      time: "12:05",
      icon: Clock,
    },
    {
      id: 2,
      title: "Lanjutkan Membaca",
      desc: "Terakhir Anda membaca Al-Kahfi. Yuk selesaikan!",
      time: "09:00",
      icon: BookOpen,
    },
  ];

  const handleSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.toLowerCase().trim();
    if (!query) return;

    try {
      const allSurah = await getAllSurah();
      const matchSurah = allSurah.find(
        (s: any) =>
          query.includes(s.nama_latin.toLowerCase()) ||
          s.nama_latin.toLowerCase().includes(query),
      );

      if (matchSurah) {
        router.push(`/al-quran/${matchSurah.nomor}`);
      } else if (query.includes("doa")) {
        router.push(
          `/doa?search=${encodeURIComponent(query.replace("doa", "").trim())}`,
        );
      } else {
        router.push(`/al-quran?search=${encodeURIComponent(query)}`);
      }
    } catch (error) {
      router.push(`/al-quran?search=${encodeURIComponent(query)}`);
    }
    setIsSearchOpen(false);
    setSearchValue("");
  };

  return (
    <>
      {/* --- NOTIFICATION DRAWER (Right Side) --- */}
      <AnimatePresence>
        {isNotifOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotifOpen(false)}
              className="fixed inset-0 z-[250] bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[300] w-full max-w-[350px] bg-white shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#5465ff]/10 rounded-2xl flex items-center justify-center text-[#5465ff]">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black tracking-tighter text-gray-900 uppercase">
                    Pesan Kita
                  </h2>
                </div>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="p-2 bg-slate-50 rounded-xl text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
                {notifHistory.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 bg-slate-50 rounded-[1.5rem] border border-transparent hover:border-[#5465ff]/20 transition-all group"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-[#5465ff] transition-colors">
                        <n.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-xs font-bold text-gray-900">
                            {n.title}
                          </h4>
                          <span className="text-[9px] font-bold text-slate-300">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {notifHistory.length === 0 && (
                  <div className="text-center py-20">
                    <History className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Belum ada riwayat
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- REAL-TIME POPUP (Top Notification) --- */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: "-50%" }}
            animate={{ opacity: 1, y: 30, x: "-50%" }}
            exit={{ opacity: 0, y: -100, x: "-50%" }}
            className="fixed top-0 left-1/2 z-[400] w-[92%] max-w-md bg-white border-2 border-[#5465ff]/10 shadow-2xl rounded-[2rem] p-4 flex items-center gap-4 cursor-pointer"
            onClick={() => setIsNotifOpen(true)}
          >
            <div className="bg-[#5465ff] p-2.5 rounded-2xl shadow-lg shadow-blue-500/30 text-white shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                {notification.title}
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                {notification.message}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotification(null);
              }}
              className="p-2 text-slate-300 hover:text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MOBILE HEADER --- */}
      <div className="fixed top-0 left-0 right-0 z-[100] lg:hidden bg-white/80 backdrop-blur-md border-b px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-white shadow-sm"
        >
          <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2.5 bg-slate-100 rounded-full text-slate-500"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 bg-slate-100 rounded-full text-slate-500"
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
                    "relative px-6 py-2.5 text-[12px] font-bold transition-all rounded-full whitespace-nowrap",
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-3.5 bg-slate-100 hover:bg-white border rounded-full text-slate-400 transition-all"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-3.5 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-3.5 bg-slate-100 hover:bg-white border rounded-full text-slate-400 transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* --- SEARCH MODAL (Tetap Sama) --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-slate-900/60 backdrop-blur-sm p-4 flex items-start justify-center pt-20"
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <form
                onSubmit={handleSmartSearch}
                className="p-4 flex items-center gap-3 border-b border-slate-100"
              >
                <Search className="w-5 h-5 text-[#5465ff]" />
                <input
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Ketik 'Al Kahfi' atau 'Doa Makan'..."
                  className="flex-1 bg-transparent outline-none text-sm font-medium h-10"
                />
                <button type="button" onClick={() => setIsSearchOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </form>
              <div className="p-4 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                  Saran Cepat
                </p>
                {["Al-Kahfi", "Dzikir Pagi", "Doa Tidur"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSearchValue(s)}
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
    </>
  );
}
