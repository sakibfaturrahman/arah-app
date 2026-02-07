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
        className="sm:max-w-[400px] rounded-[2.5rem] border-none"
      >
        <DialogHeader className="flex flex-col items-center pt-4">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-amber-500 animate-pulse" />
          </div>
          <DialogTitle className="text-xl font-black text-gray-800 tracking-tighter text-center leading-tight">
            Opps, Anda sepertinya belum mengaktifkan layanan lokasi
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 font-medium pt-2">
            Arah membutuhkan koordinat Anda agar jadwal sholat dan arah kiblat
            ditampilkan dengan presisi sesuai tempat Anda berdiri.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col pt-6">
          <Button
            onClick={handleAllowLocation}
            className="w-full bg-[#5465ff] hover:bg-[#4353ff] text-white rounded-2xl font-bold h-14 shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <Navigation className="w-4 h-4 mr-2" /> Aktifkan Sekarang
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="w-full text-gray-400 font-bold text-[11px] uppercase tracking-widest"
          >
            Lanjutkan tanpa lokasi akurat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
