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
          window.location.reload(); // Refresh untuk trigger fetch API jadwal
        },
        (error) => {
          console.error("User menolak lokasi", error);
          setIsOpen(false);
        },
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-none">
        <DialogHeader className="flex flex-col items-center pt-4">
          <div className="w-16 h-16 bg-[#5465ff]/10 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-[#5465ff]" />
          </div>
          <DialogTitle className="text-2xl font-black text-gray-800 tracking-tight">
            Aktifkan Lokasi
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 font-medium">
            Arah membutuhkan akses lokasi untuk memberikan jadwal sholat yang
            presisi sesuai tempat Anda berada saat ini.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col pt-4">
          <Button
            onClick={handleAllowLocation}
            className="w-full bg-[#5465ff] hover:bg-[#4353ff] text-white rounded-xl font-bold h-12"
          >
            <Navigation className="w-4 h-4 mr-2" /> Izinkan Lokasi
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="w-full text-gray-400 font-medium"
          >
            Mungkin Nanti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
