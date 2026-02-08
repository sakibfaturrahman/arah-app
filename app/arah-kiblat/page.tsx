"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Target,
  ShieldCheck,
  RefreshCw,
  Info,
  Maximize2,
  Milestone,
  Box,
} from "lucide-react";
import { Qibla, Coordinates } from "adhan";
import { cn } from "@/lib/utils";

const KABAH_COORDS = { lat: 21.422487, lng: 39.826206 };

// ================= UTIL =================
function angularDiff(a: number, b: number) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export default function ArahKiblat() {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [distance, setDistance] = useState<number | null>(null);
  const [address, setAddress] = useState("Mendeteksi lokasi...");
  const [isIos, setIsIos] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ================= DISTANCE =================
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // ================= LOCATION =================
  const initLocation = useCallback(() => {
    if (!("geolocation" in navigator)) return;

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = new Coordinates(latitude, longitude);
        const qiblaAngle = Qibla(coords); // 0–360 dari utara

        setLocation({ lat: latitude, lng: longitude });
        setQiblaDirection(qiblaAngle);
        setDistance(
          calculateDistance(
            latitude,
            longitude,
            KABAH_COORDS.lat,
            KABAH_COORDS.lng,
          ),
        );

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await res.json();
          setAddress(data.display_name.split(",").slice(0, 3).join(","));
        } catch {
          setAddress("Koordinat berhasil dikunci");
        }

        setIsLoading(false);
      },
      () => {
        setAddress("Izin lokasi diperlukan");
        setIsLoading(false);
      },
      { enableHighAccuracy: true },
    );
  }, []);

  // ================= COMPASS =================
  useEffect(() => {
    initLocation();

    const handleOrientation = (e: any) => {
      let compass = 0;

      if (typeof e.webkitCompassHeading === "number") {
        // iOS (paling akurat)
        compass = e.webkitCompassHeading;
      } else if (typeof e.alpha === "number") {
        // Android
        compass = (360 - e.alpha) % 360;
      }

      setHeading(compass);
    };

    if (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      setIsIos(true);
    } else {
      window.addEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true,
      );
    }

    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation,
      );
    };
  }, [initLocation]);

  // ================= iOS PERMISSION =================
  const requestPermission = async () => {
    const res = await (DeviceOrientationEvent as any).requestPermission();
    if (res === "granted") {
      window.addEventListener(
        "deviceorientation",
        (e: any) => {
          if (typeof e.webkitCompassHeading === "number") {
            setHeading(e.webkitCompassHeading);
          }
        },
        true,
      );
      setIsIos(false);
    }
  };

  // ================= ALIGN CHECK =================
  const diff =
    qiblaDirection !== null ? angularDiff(heading, qiblaDirection) : 999;
  const isAligned = diff < 2;

  // ================= UI (DARI AWAL) =================
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFDFD] to-[#F9F9F9] flex flex-col items-center pt-16 pb-12 px-6 font-sans text-slate-900">
      <div className="w-full max-w-md text-center mb-10 mt-6">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 mb-4"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Akurasi GPS Aktif
          </span>
        </motion.div>
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-black tracking-tight text-slate-900 mb-2"
        >
          Kiblat<span className="text-[#5465ff]">Finder</span>
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm text-slate-500 font-medium"
        >
          Arah presisi menuju Ka&apos;bah Makkah
        </motion.p>
      </div>

      {/* --- COMPASS UI --- */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative w-80 h-80 flex items-center justify-center mb-12"
      >
        {/* Glow saat sejajar (Aligned) */}
        <AnimatePresence>
          {isAligned && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 rounded-full bg-emerald-400/20 blur-3xl"
            />
          )}
        </AnimatePresence>

        {/* Piringan Kompas */}
        <div className="absolute inset-0 rounded-full bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-slate-100" />

        {/* Penanda Derajat */}
        <div className="absolute inset-4 rounded-full border border-slate-50">
          {[...Array(36)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 flex justify-center"
              style={{ transform: `rotate(${i * 10}deg)` }}
            >
              <div
                className={cn(
                  "w-0.5 rounded-full",
                  i % 9 === 0 ? "h-3 bg-slate-300" : "h-1.5 bg-slate-100",
                )}
              />
            </div>
          ))}
        </div>

        {/* Body yang Berputar sesuai Heading HP */}
        <motion.div
          animate={{ rotate: -heading }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="relative w-full h-full flex items-center justify-center z-10"
        >
          {/* Penanda Utara (North) */}
          <div className="absolute top-8 flex flex-col items-center">
            <span className="text-[10px] font-black text-rose-500 mb-1">U</span>
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
          </div>

          {/* Indikator Arah Kiblat (Dihitung Berdasarkan Lokasi) */}
          {qiblaDirection !== null && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ transform: `rotate(${qiblaDirection}deg)` }}
            >
              {/* Jarum Pointer Modern */}
              <motion.div
                animate={{
                  height: isAligned ? 140 : 120,
                  backgroundColor: isAligned ? "#10b981" : "#5465ff",
                }}
                className="w-1 rounded-full shadow-[0_0_20px_rgba(84,101,255,0.2)] transition-colors duration-300"
              />

              {/* Ikon Ka'bah sebagai pengganti Navigation */}
              <div
                className={cn(
                  "mt-[-24px] p-3 rounded-2xl shadow-2xl border-4 border-white transition-all duration-500 flex items-center justify-center",
                  isAligned ? "bg-emerald-500 scale-110" : "bg-slate-900",
                )}
              >
                <Box className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </motion.div>

        {/* Poros Tengah (Pivot) */}
        <div className="absolute w-5 h-5 bg-white rounded-full border-[5px] border-slate-900 z-20 shadow-sm" />
      </motion.div>

      {/* --- INFO CARDS --- */}
      <div className="w-full max-w-md space-y-4">
        <AnimatePresence>
          {isIos && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              onClick={requestPermission}
              className="w-full py-4 bg-gradient-to-r from-[#5465ff] to-[#4353ff] text-white rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:from-[#4353ff] hover:to-[#374bff] flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" /> Aktifkan Sensor iPhone
            </motion.button>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Target className="w-4 h-4 text-[#5465ff]" />
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Arah Kiblat
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={qiblaDirection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-black text-slate-900"
              >
                {qiblaDirection?.toFixed(1) || "--"}
              </motion.span>
              <span className="text-sm font-bold text-[#5465ff]">°</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -4 }}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Milestone className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Jarak
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={distance}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-black text-slate-900"
              >
                {distance ? Math.round(distance).toLocaleString("id-ID") : "--"}
              </motion.span>
              <span className="text-sm font-bold text-emerald-500">KM</span>
            </div>
          </motion.div>
        </div>

        {/* Info Lokasi Detil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all"
        >
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
            <MapPin className="w-5 h-5 text-[#5465ff]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                Lokasi Terkunci
              </span>
              {isLoading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-3 h-3 text-[#5465ff]" />
                </motion.div>
              )}
            </div>
            <p className="text-xs font-bold text-slate-700 truncate">
              {address}
            </p>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-bold text-slate-300 uppercase">
                  Lat
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-600">
                  {location?.lat.toFixed(5)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-bold text-slate-300 uppercase">
                  Lng
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-600">
                  {location?.lng.toFixed(5)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Panduan Kalibrasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex items-start gap-3 px-2 py-3 bg-slate-50 rounded-xl border border-slate-100"
        >
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[10px] font-medium text-slate-600 leading-relaxed">
            Letakkan perangkat di permukaan yang rata. Jauhkan dari benda logam
            atau medan magnet besar untuk hasil yang akurat.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
