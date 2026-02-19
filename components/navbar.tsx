"use client";
import React, { useState } from "react";
import {
  Search,
  Bell,
  X,
  Sparkles,
  Clock,
  BookOpen,
  ChevronDown,
  ClipboardCheck,
  MapPin,
  Image as ImageIcon,
  MoonStar,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useNotification } from "@/hooks/useNotification";
import { navItems, bottomNavItems } from "@/components/constants/navigation";
import { globalSmartSearch } from "@/lib/services/searchService";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRamadhanOpen, setIsRamadhanOpen] = useState(false);
  const [isMobileRamadhanOpen, setIsMobileRamadhanOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { notification, setNotification, history, clearHistory } =
    useNotification();

  const handleSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    setIsSearching(true);
    const result = await globalSmartSearch(searchValue);
    router.push(result.url);
    setIsSearching(false);
    setIsSearchOpen(false);
    setSearchValue("");
  };

  const filteredNavItems = navItems.filter(
    (item) => item.name !== "Asmaul Husna",
  );

  const ramadhanLinks = [
    {
      name: "Kalkulator Islami",
      desc: "Hitung Target Khatam",
      href: "/ramadhan/kalkulator",
      icon: ClipboardCheck,
      color: "bg-emerald-50 text-emerald-500",
    },
    {
      name: "Masjid Terdekat",
      desc: "Cari Masjid Tarawih",
      href: "/ramadhan/masjid-terdekat",
      icon: MapPin,
      color: "bg-amber-100 text-amber-600",
    },
    {
      name: "Kartu Ucapan",
      desc: "Generate Ucapan Ramadhan",
      href: "/ramadhan/kartu-ucapan",
      icon: ImageIcon,
      color: "bg-blue-50 text-blue-500",
    },
  ];

  return (
    <>
      {/* --- 1. GLOBAL SEARCH MODAL --- */}
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
                onSubmit={handleSmartSearch}
                className="p-4 flex items-center gap-3 border-b border-slate-100"
              >
                <Search
                  className={cn(
                    "w-5 h-5 text-[#5465ff]",
                    isSearching && "animate-pulse",
                  )}
                />
                <input
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Cari 'Kahfi' atau 'Doa Makan'..."
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

      {/* --- 2. NOTIFICATION CENTER --- */}
      <AnimatePresence>
        {isNotifOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotifOpen(false)}
              className="fixed inset-0 z-[250] bg-slate-900/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[300] w-full max-w-sm bg-white shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b flex items-center justify-between bg-[#fafafa]">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Notifikasi
                  </h3>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                    Aktivitas Ibadah
                  </p>
                </div>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="p-2 bg-white rounded-xl shadow-sm border border-slate-100"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notification && (
                  <div className="p-4 rounded-2xl bg-[#5465ff]/5 border border-[#5465ff]/10 space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#5465ff]" />
                      <span className="text-[10px] font-bold text-[#5465ff] uppercase">
                        Baru Saja
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {notification.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {notification.message}
                    </p>
                  </div>
                )}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                      Riwayat Aktivitas
                    </p>
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="text-[10px] font-bold text-rose-400 hover:text-rose-500"
                      >
                        Hapus Semua
                      </button>
                    )}
                  </div>
                  <div className="space-y-6">
                    {history.length > 0 ? (
                      history.map((item) => (
                        <div key={item.id} className="flex gap-4 group">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                              item.type === "prayer"
                                ? "bg-amber-50"
                                : "bg-blue-50",
                            )}
                          >
                            {item.type === "prayer" ? (
                              <Clock className="w-4 h-4 text-amber-500" />
                            ) : (
                              <BookOpen className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              {item.message}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center">
                        <p className="text-xs text-slate-400">
                          Belum ada riwayat aktivitas
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- 3. MOBILE RAMADHAN DRAWER --- */}
      <AnimatePresence>
        {isMobileRamadhanOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileRamadhanOpen(false)}
              className="fixed inset-0 z-[300] bg-slate-900/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[350] bg-white rounded-t-[3rem] p-8 lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-2xl">
                    <MoonStar className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Menu Ramadhan
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Persiapan Ibadah
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileRamadhanOpen(false)}
                  className="p-2 bg-slate-50 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                {ramadhanLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileRamadhanOpen(false)}
                    className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] group active:scale-95 transition-all border border-transparent active:border-slate-200"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                          link.color,
                        )}
                      >
                        <link.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {link.name}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400">
                          {link.desc}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-active:text-slate-900" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- 4. HEADER MOBILE --- */}
      <div className="fixed top-0 left-0 right-0 z-[100] lg:hidden bg-white/80 backdrop-blur-md border-b px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-white shadow-sm shrink-0"
          >
            <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
          </Link>
          <button
            onClick={() => setIsMobileRamadhanOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-100 shadow-sm active:scale-95 transition-all"
          >
            <MoonStar className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-tighter">
              Ramadhan
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2.5 bg-slate-50 rounded-full text-slate-500"
          >
            <Bell className="w-5 h-5" />
            {notification && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#5465ff] border-2 border-white rounded-full" />
            )}
          </button>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 bg-slate-100 rounded-full text-slate-500"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- 5. HEADER DESKTOP --- */}
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
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-[12px] font-bold transition-all rounded-full",
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-900",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktopActive"
                      className="absolute inset-0 bg-[#5465ff] shadow-sm rounded-full"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon className="w-4 h-4" /> {item.name}
                  </span>
                </Link>
              );
            })}

            <div
              className="relative"
              onMouseEnter={() => setIsRamadhanOpen(true)}
              onMouseLeave={() => setIsRamadhanOpen(false)}
            >
              <button
                className={cn(
                  "relative px-4 py-2 text-[12px] font-bold transition-all rounded-full flex items-center gap-2",
                  pathname.startsWith("/ramadhan")
                    ? "text-[#5465ff]"
                    : "text-slate-400 hover:text-slate-900",
                )}
              >
                <MoonStar className="w-4 h-4 text-amber-500" /> Ramadhan{" "}
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {isRamadhanOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-3xl shadow-xl border border-slate-100 p-2 overflow-hidden"
                  >
                    {ramadhanLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-colors"
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            link.color,
                          )}
                        >
                          <link.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {link.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {link.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-3 bg-slate-100 hover:bg-white border rounded-full text-slate-500 transition-all"
            >
              <Bell className="w-5 h-5" />
              {notification && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#5465ff] border-2 border-white rounded-full" />
              )}
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-3 bg-slate-100 hover:bg-white border rounded-full text-slate-400 transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* --- 6. BOTTOM NAVIGATION (MOBILE) --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[450px] lg:hidden z-[100]">
        <nav className="bg-white/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-white/40 rounded-[2.5rem] px-2 py-2 flex justify-around items-center relative h-16">
          {bottomNavItems.map((item, idx) => {
            const isActive = pathname === item.href;
            const isCenter = idx === 2;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center transition-all duration-300 flex-1",
                  isCenter ? "mb-6" : "mb-0",
                )}
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center transition-all duration-500 rounded-3xl w-full py-1",
                    isActive && !isCenter ? "bg-[#5465ff]/5" : "",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center transition-all duration-500",
                      isCenter
                        ? "w-14 h-14 bg-[#5465ff] rounded-2xl shadow-lg text-white"
                        : "w-8 h-8",
                      isActive ? "scale-110" : "scale-100",
                    )}
                  >
                    <item.icon
                      className={cn(
                        isCenter ? "w-7 h-7 text-white" : "w-5 h-5",
                        !isCenter &&
                          (isActive ? "text-[#5465ff]" : "text-slate-400"),
                        isActive && isCenter ? "animate-pulse" : "",
                      )}
                    />
                  </div>
                  {!isCenter && (
                    <span
                      className={cn(
                        "text-[10px] font-bold mt-1",
                        isActive ? "text-[#5465ff]" : "text-slate-400",
                      )}
                    >
                      {item.name}
                    </span>
                  )}
                </div>
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
