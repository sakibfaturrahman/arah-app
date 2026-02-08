"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, AlertCircle } from "lucide-react";

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
          window.location.reload();
        },
        (error) => {
          console.error("User menolak lokasi", error);
          alert(
            "Akses ditolak. Mohon aktifkan lokasi melalui pengaturan browser Anda.",
          );
        },
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* onPointerDownOutside mencegah modal tertutup tanpa sengaja */}
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="sm:max-w-[420px] rounded-2xl border-none p-6"
      >
        <DialogHeader className="flex flex-col items-center gap-4 pt-2">
          <div className="w-20 h-20 bg-gradient-to-br from-[#eef2ff] to-[#e6f0ff] rounded-2xl flex items-center justify-center shadow-md">
            <MapPin className="w-10 h-10 text-[#4353ff]" />
          </div>

          <DialogTitle className="text-lg sm:text-xl font-extrabold text-slate-900 text-center leading-tight">
            Aktifkan Lokasi Anda
          </DialogTitle>

          <DialogDescription className="text-center text-slate-500 text-sm max-w-[36rem]">
            Untuk memberikan jadwal sholat dan arah kiblat yang akurat di lokasi
            Anda, Arah memerlukan izin lokasi. Data lokasi hanya digunakan untuk
            tujuan fungsional aplikasi dan tidak dibagikan ke pihak ketiga.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-3">
          <Button
            onClick={handleAllowLocation}
            aria-label="Aktifkan lokasi"
            className="w-full h-14 bg-gradient-to-r from-[#5465ff] to-[#4353ff] text-white rounded-2xl font-semibold shadow-lg hover:from-[#4353ff] hover:to-[#374bff] active:scale-95 transition-transform flex items-center justify-center gap-3"
          >
            <Navigation className="w-4 h-4" />
            Aktifkan Lokasi
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="w-full h-12 text-slate-600 font-medium rounded-2xl border-slate-200 hover:bg-slate-50"
          >
            Lanjutkan tanpa lokasi akurat
          </Button>

          <p className="text-xs text-slate-400 text-center pt-2">
            Anda bisa mengubah izin lokasi kapan saja melalui pengaturan
            browser.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
