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
  Info,
  Maximize2,
  Milestone,
} from "lucide-react";
import { Qibla, Coordinates } from "adhan";
import { cn } from "@/lib/utils";

// Koordinat Ka'bah (Makkah)
const KABAH_COORDS = { lat: 21.422487, lng: 39.826206 };

export default function ArahKiblat() {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [distance, setDistance] = useState<number | null>(null);
  const [address, setAddress] = useState("Mencari lokasi...");
  const [isIos, setIsIos] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- FUNGSI HITUNG JARAK (HAVERSINE FORMULA) ---
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371; // Radius bumi dalam KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const initLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const coords = new Coordinates(latitude, longitude);
          const qiblaAngle = Qibla(coords);

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
            const addr = data.address;
            setAddress(
              `${addr.village || addr.suburb || addr.city_district || ""}, ${addr.city || addr.regency || ""}`,
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
    const handleOrientation = (e: any) => {
      const alpha =
        e.webkitCompassHeading || (e.alpha ? Math.abs(e.alpha - 360) : 0);
      setHeading(alpha);
    };

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
    (DeviceOrientationEvent as any).requestPermission().then((res: string) => {
      if (res === "granted") {
        window.addEventListener(
          "deviceorientation",
          (e: any) => setHeading(e.webkitCompassHeading),
          true,
        );
        setIsIos(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center py-10 px-5 font-sans">
      {/* Header */}
      <div className="text-center mb-8 mt-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#5465ff]/5 text-[#5465ff] rounded-full border border-[#5465ff]/10 mb-3"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Akurasi GPS Tinggi
          </span>
        </motion.div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
          Kiblat<span className="text-[#5465ff]">Finder</span>
        </h1>
        <p className="text-[11px] text-slate-400 font-medium tracking-wide">
          Gunakan sensor kompas untuk presisi arah Ka&apos;bah
        </p>
      </div>

      {/* Compass UI */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
        {/* Shadow Ring */}
        <div className="absolute inset-[-15px] rounded-full bg-gradient-to-b from-slate-100/50 to-transparent blur-2xl" />

        {/* Main Compass Disk */}
        <div className="absolute inset-0 rounded-full bg-white shadow-[0_25px_60px_rgba(84,101,255,0.12)] border border-slate-50 flex items-center justify-center">
          {/* Static Marks (Degree Scaler) */}
          {[...Array(72)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-2 flex justify-center"
              style={{ transform: `rotate(${i * 5}deg)` }}
            >
              <div
                className={cn(
                  "w-[1.5px] rounded-full",
                  i % 18 === 0
                    ? "h-4 bg-slate-300 w-[2px]"
                    : "h-1.5 bg-slate-100",
                  i === 0 && "bg-rose-400 h-5", // Utara mark
                )}
              />
            </div>
          ))}
        </div>

        {/* Rotating Body */}
        <motion.div
          animate={{ rotate: -heading }}
          transition={{ type: "spring", stiffness: 50, damping: 25 }}
          className="relative w-full h-full flex items-center justify-center z-10"
        >
          {/* North Marker */}
          <div className="absolute top-6 font-black text-[#5465ff] text-sm">
            U
          </div>

          {/* Qibla Jarum (Indicator) */}
          <AnimatePresence>
            {qiblaDirection !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: qiblaDirection }}
                className="absolute inset-0 flex flex-col items-center pt-8"
              >
                {/* Visual Jarum Modern */}
                <div className="w-1.5 h-24 bg-gradient-to-t from-[#5465ff] via-[#5465ff] to-cyan-400 rounded-full shadow-[0_0_25px_rgba(84,101,255,0.5)]" />
                <div className="bg-white p-2.5 rounded-2xl shadow-xl -mt-4 border-2 border-[#5465ff] relative">
                  <Navigation className="w-6 h-6 text-[#5465ff] fill-[#5465ff]" />
                  {/* Glowing Pulse */}
                  <div className="absolute inset-0 bg-[#5465ff] rounded-2xl animate-ping opacity-20" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Center Pivot */}
        <div className="absolute w-4 h-4 bg-slate-900 rounded-full border-4 border-white shadow-lg z-20" />
      </div>

      {/* Info Cards Container */}
      <div className="mt-12 w-full max-w-sm space-y-4">
        {isIos && (
          <button
            onClick={requestPermission}
            className="w-full py-4 bg-slate-900 text-white rounded-3xl font-bold text-sm shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <Maximize2 className="w-4 h-4" /> Kalibrasi iPhone
          </button>
        )}

        {/* Primary Data Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-5 rounded-[2.2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[#5465ff]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Sudut Kiblat
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900">
              {qiblaDirection?.toFixed(1) || "--"}°
            </p>
            <p className="text-[9px] text-slate-400 font-bold">
              Dihitung dari Utara
            </p>
          </div>
          <div className="bg-white p-5 rounded-[2.2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Milestone className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Jarak Ka&apos;bah
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900">
              ± {distance ? Math.round(distance).toLocaleString() : "--"}
            </p>
            <p className="text-[9px] text-slate-400 font-bold">
              Kilometer (KM)
            </p>
          </div>
        </div>

        {/* Location Footer Card */}
        <div className="bg-[#5465ff] p-6 rounded-[2.2rem] shadow-xl shadow-blue-100 text-white relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black text-blue-100 uppercase tracking-widest flex items-center gap-1">
                  Lokasi Anda Saat Ini{" "}
                  <RefreshCw
                    className={cn("w-2 h-2", isLoading && "animate-spin")}
                  />
                </p>
              </div>
              <p className="text-sm font-bold leading-tight">{address}</p>
              <div className="flex gap-2 pt-2">
                <span className="text-[10px] bg-black/10 px-2 py-1 rounded-lg">
                  Lat: {location?.lat.toFixed(4)}
                </span>
                <span className="text-[10px] bg-black/10 px-2 py-1 rounded-lg">
                  Lng: {location?.lng.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Help Info */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-2xl text-slate-400">
          <Info className="w-4 h-4 shrink-0" />
          <p className="text-[10px] font-medium leading-tight">
            Letakkan perangkat di permukaan rata. Jauhkan dari benda logam atau
            magnet untuk akurasi terbaik.
          </p>
        </div>
      </div>
    </div>
  );
}
