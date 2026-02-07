"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Navigation,
  MapPin,
  Target,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Qibla, Coordinates } from "adhan"; // Library Adhan.js
import { cn } from "@/lib/utils";

export default function ArahKiblat() {
  const [heading, setHeading] = useState(0); // Derajat hadap HP
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [address, setAddress] = useState("Mencari lokasi...");
  const [isIos, setIsIos] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- LOGIKA PERHITUNGAN KIBLAT (ADHAN.JS) ---
  const initLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const coords = new Coordinates(latitude, longitude);

          // Menggunakan library Adhan untuk mendapatkan sudut kiblat yang presisi
          const qiblaAngle = Qibla(coords);

          setLocation({ lat: latitude, lng: longitude });
          setQiblaDirection(qiblaAngle);

          // Reverse Geocoding untuk alamat detail
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            );
            const data = await res.json();
            // Mengambil bagian alamat yang relevan saja agar clean
            const addr = data.address;
            setAddress(
              `${addr.village || addr.suburb || ""}, ${addr.city || addr.regency || ""}, ${addr.state || ""}`,
            );
          } catch (e) {
            setAddress("Lokasi berhasil dikunci");
          }
          setIsLoading(false);
        },
        () => {
          setAddress("Gagal mendapatkan izin lokasi");
          setIsLoading(false);
        },
      );
    }
  }, []);

  useEffect(() => {
    initLocation();

    // --- LOGIKA SENSOR KOMPAS ---
    const handleOrientation = (e: any) => {
      // Mengambil data hadap perangkat (Heading)
      const alpha =
        e.webkitCompassHeading || (e.alpha ? Math.abs(e.alpha - 360) : 0);
      setHeading(alpha);
    };

    // Deteksi iOS untuk request permission
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      setIsIos(true);
    } else {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () =>
      window.removeEventListener("deviceorientation", handleOrientation);
  }, [initLocation]);

  const requestPermission = () => {
    (DeviceOrientationEvent as any)
      .requestPermission()
      .then((response: string) => {
        if (response === "granted") {
          window.addEventListener(
            "deviceorientation",
            (e: any) => {
              setHeading(e.webkitCompassHeading);
            },
            true,
          );
          setIsIos(false);
        }
      });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center py-12 px-6 font-sans">
      {/* Header Section */}
      <div className="text-center space-y-2 mb-10 mt-15">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-[#5465ff]/5 text-[#5465ff] rounded-full border border-[#5465ff]/10"
        >
          <ShieldCheck className="w-3 h-3" />
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Arah <span className="text-[#5465ff] font-bold">Kiblat</span>
        </h1>
      </div>

      {/* Compass UI */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Outer Ring Decoration */}
        <div className="absolute inset-0 rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100" />

        {/* Degree Marks (Skala Kompas) */}
        {[...Array(72)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-4 flex justify-center"
            style={{ transform: `rotate(${i * 5}deg)` }}
          >
            <div
              className={cn(
                "w-[1px] rounded-full",
                i % 18 === 0 ? "h-4 bg-slate-300 w-[2px]" : "h-2 bg-slate-100",
              )}
            />
          </div>
        ))}

        {/* Rotatable Body */}
        <motion.div
          animate={{ rotate: -heading }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Cardinal Directions */}
          <div className="absolute top-10 font-bold text-slate-400 text-xs">
            U
          </div>
          <div className="absolute right-10 font-bold text-slate-400 text-xs">
            T
          </div>
          <div className="absolute bottom-10 font-bold text-slate-400 text-xs">
            S
          </div>
          <div className="absolute left-10 font-bold text-slate-400 text-xs">
            B
          </div>

          {/* Qibla Indicator (Jarum) */}
          <AnimatePresence>
            {qiblaDirection !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, rotate: qiblaDirection }}
                className="absolute inset-0 flex flex-col items-center pt-10"
              >
                {/* Glow Effect Line */}
                <div className="w-1.5 h-24 bg-gradient-to-t from-[#5465ff] to-blue-400 rounded-full shadow-[0_0_20px_rgba(84,101,255,0.4)]" />
                {/* Ka'bah Icon Placeholder / Navigation */}
                <div className="bg-white p-2 rounded-full shadow-lg -mt-2 border-2 border-[#5465ff]">
                  <Navigation className="w-6 h-6 text-[#5465ff] fill-[#5465ff]" />
                </div>
                <div className="mt-4 bg-[#5465ff] text-white text-[9px] font-bold px-4 py-1.5 rounded-full tracking-widest shadow-xl uppercase">
                  Kiblat
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Center Dot */}
        <div className="absolute w-5 h-5 bg-white border-[5px] border-[#5465ff] rounded-full shadow-md z-20" />
      </div>

      {/* Info Panel */}
      <div className="mt-12 w-full max-w-sm space-y-4">
        {isIos && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={requestPermission}
            className="w-full py-4 bg-slate-900 text-white rounded-3xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 mb-4"
          >
            <Compass className="w-4 h-4" /> Kalibrasi Sensor iPhone
          </motion.button>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-[#5465ff]">
              <Target className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Sudut Kiblat
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {qiblaDirection?.toFixed(1) || "--"}°
            </p>
          </div>
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-emerald-500">
              <Compass className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Arah HP
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {Math.round(heading)}°
            </p>
          </div>
        </div>

        {/* Full Geolocation Card */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-50 rounded-2xl shrink-0">
              <MapPin className="w-5 h-5 text-[#5465ff]" />
            </div>
            <div className="space-y-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Titik Koordinat Presisi
                </p>
                <button onClick={initLocation} className="text-[#5465ff]">
                  <RefreshCw
                    className={cn("w-3 h-3", isLoading && "animate-spin")}
                  />
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed truncate">
                {address}
              </p>
              <div className="flex gap-3 mt-1">
                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                  Lat: {location?.lat.toFixed(5)}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                  Lng: {location?.lng.toFixed(5)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
