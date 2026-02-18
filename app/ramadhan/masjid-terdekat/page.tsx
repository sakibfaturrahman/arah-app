"use client";
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Navigation,
  ChevronLeft,
  Loader2,
  Compass,
  Map as MapIcon,
  List,
  MapPin,
  CircleUser,
} from "lucide-react";
import Link from "next/link";
import { getNearbyMosques, Mosque } from "@/lib/services/mosqueService";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// 1. Import Map secara Dynamic
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-100 animate-pulse flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Inisialisasi Peta...
        </span>
      </div>
    ),
  },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function MasjidTerdekatPage() {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [activeMosque, setActiveMosque] = useState<Mosque | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    const initLeaflet = async () => {
      const leaflet = (await import("leaflet")).default;
      setL(leaflet);

      // Fix Ikon Default
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    };
    initLeaflet();

    async function initData() {
      const savedLoc = localStorage.getItem("user-location");
      if (savedLoc) {
        try {
          const coords = JSON.parse(savedLoc);
          setUserLoc(coords);
          const data = await getNearbyMosques(coords.lat, coords.lng);
          setMosques(data);
        } catch (e) {
          console.error("Gagal memproses lokasi", e);
        }
      }
      setLoading(false);
    }
    initData();
  }, []);

  const openInGoogleMaps = (lat: number, lon: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
      "_blank",
    );
  };

  // 2. Custom Ikon untuk Lokasi User (Biru Berdenyut)
  const userIcon = useMemo(() => {
    if (!L) return null;
    return L.divIcon({
      className: "custom-user-icon",
      html: `<div class="relative flex h-5 w-5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-5 w-5 bg-[#5465ff] border-2 border-white shadow-lg"></span>
            </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  }, [L]);

  // 3. Memoized Map - Ditambahkan pembungkus stabil dan key unik untuk mencegah error appendChild
  const RenderedMap = useMemo(() => {
    if (loading || !userLoc || !L) return null;

    return (
      <div className="absolute inset-0 w-full h-full">
        <MapContainer
          key={`map-${userLoc.lat}-${userLoc.lng}`}
          center={[userLoc.lat, userLoc.lng]}
          zoom={15}
          style={{
            height: "100%",
            width: "100%",
          }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Tanda Lokasi Saya */}
          {userIcon && (
            <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon}>
              <Popup>
                <div className="text-center font-bold text-[10px]">
                  Lokasi Anda
                </div>
              </Popup>
            </Marker>
          )}

          {/* Marker Masjid */}
          {mosques.map((mosque) => (
            <Marker
              key={`marker-${mosque.id}`}
              position={[mosque.lat, mosque.lon]}
              eventHandlers={{ click: () => setActiveMosque(mosque) }}
            >
              <Popup>
                <div className="text-center p-1">
                  <p className="font-bold text-[10px] mb-1">{mosque.name}</p>
                  <button
                    onClick={() => openInGoogleMaps(mosque.lat, mosque.lon)}
                    className="bg-[#5465ff] text-white px-3 py-1 rounded-full text-[8px] font-bold"
                  >
                    RUTE
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    );
  }, [loading, userLoc, mosques, L, userIcon]);

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#FAFAFA] overflow-hidden">
      <div className="pt-20 md:pt-28 px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/"
            className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900">
              Masjid <span className="text-[#5465ff]">Terdekat</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Sekitar Anda
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col md:flex-row px-4 md:px-6 pb-24 md:pb-6 gap-6 overflow-hidden">
        {/* LIST PANEL */}
        <div
          className={cn(
            "w-full md:w-[400px] flex-col h-full transition-all overflow-hidden",
            viewMode === "list" ? "flex" : "hidden md:flex",
          )}
        >
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 pb-10 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#5465ff] opacity-40" />
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                  Mencari Lokasi...
                </p>
              </div>
            ) : (
              mosques.map((mosque, idx) => (
                <motion.div
                  key={mosque.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    setActiveMosque(mosque);
                    if (window.innerWidth < 768) setViewMode("map");
                  }}
                  className={cn(
                    "bg-white p-4 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between",
                    activeMosque?.id === mosque.id
                      ? "border-[#5465ff] bg-blue-50/50"
                      : "border-slate-100 shadow-sm",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "p-3 rounded-2xl",
                        activeMosque?.id === mosque.id
                          ? "bg-[#5465ff] text-white shadow-lg"
                          : "bg-slate-50 text-slate-400",
                      )}
                    >
                      <Compass className="w-5 h-5" />
                    </div>
                    <div className="max-w-[180px]">
                      <h3 className="font-bold text-slate-900 text-sm truncate">
                        {mosque.name}
                      </h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase line-clamp-1 italic">
                        {mosque.address}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openInGoogleMaps(mosque.lat, mosque.lon);
                    }}
                    className="p-3 bg-slate-50 rounded-2xl text-slate-400"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* MAP AREA */}
        <div
          className={cn(
            "flex-1 relative rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-100 z-0",
            viewMode === "map" ? "block" : "hidden md:block",
          )}
        >
          {RenderedMap}

          <AnimatePresence>
            {activeMosque && viewMode === "map" && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-6 left-4 right-4 z-[10099] md:hidden"
              >
                <div className="bg-white/95 backdrop-blur-xl p-5 rounded-[2.5rem] shadow-2xl border border-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#5465ff] text-white rounded-2xl shadow-lg">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">
                        {activeMosque.name}
                      </h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        Ketuk Marker untuk Rute
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      openInGoogleMaps(activeMosque.lat, activeMosque.lon)
                    }
                    className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg"
                  >
                    <Navigation className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FLOATING TOGGLE MOBILE */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10100] flex bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-white md:hidden mb-15">
        <button
          onClick={() => setViewMode("map")}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
            viewMode === "map" ? "bg-[#5465ff] text-white" : "text-slate-400",
          )}
        >
          <MapIcon className="w-4 h-4" /> Peta
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
            viewMode === "list" ? "bg-[#5465ff] text-white" : "text-slate-400",
          )}
        >
          <List className="w-4 h-4" /> Daftar
        </button>
      </div>
    </div>
  );
}
