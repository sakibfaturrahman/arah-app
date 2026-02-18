"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";

export default function LocationPermission() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Cek apakah lokasi sudah ada di storage
    const savedLoc = localStorage.getItem("user-location");
    if (!savedLoc) {
      setIsOpen(true);
    }
  }, []);

  const handleAllowLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          localStorage.setItem(
            "user-location",
            JSON.stringify({ lat: latitude, lng: longitude }),
          );
          setIsOpen(false);

          // Trigger event agar komponen jadwal sholat otomatis update tanpa reload
          window.dispatchEvent(new Event("location-updated"));
        },
        (error) => {
          console.error("User menolak lokasi", error);
          setIsOpen(false); // Tutup modal agar tidak mengganggu jika ditolak
        },
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="sm:max-w-[420px] rounded-2xl border-none p-6"
      >
        <DialogHeader className="flex flex-col items-center gap-4 pt-2">
          <div className="w-20 h-20 bg-gradient-to-br from-[#eef2ff] to-[#e6f0ff] rounded-2xl flex items-center justify-center shadow-md">
            <MapPin className="w-10 h-10 text-[#4353ff]" />
          </div>
          <DialogTitle className="text-xl font-extrabold text-slate-900 text-center">
            Aktifkan Lokasi Anda
          </DialogTitle>
          <DialogDescription className="text-center text-slate-500 text-sm">
            Dapatkan jadwal sholat dan arah kiblat yang akurat sesuai posisi
            Anda saat ini.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-3">
          <Button
            onClick={handleAllowLocation}
            className="w-full h-14 bg-[#5465ff] text-white rounded-2xl font-semibold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-3"
          >
            <Navigation className="w-4 h-4" />
            Aktifkan Lokasi
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="w-full h-12 text-slate-600 font-medium rounded-2xl border-slate-200"
          >
            Lanjutkan Tanpa Lokasi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
