"use client";
import { useState, useEffect } from "react";

export function useLocationGuard() {
  const [showLocationModal, setShowLocationModal] = useState(false);

  const checkLocation = () => {
    const savedLocation = localStorage.getItem("user-location");

    // Jika data lokasi tidak ada atau kosong, munculkan modal
    if (!savedLocation) {
      setShowLocationModal(true);
    } else {
      setShowLocationModal(false);
    }
  };

  useEffect(() => {
    // Cek saat pertama kali aplikasi dimuat
    checkLocation();

    // Tambahkan event listener jika ada perubahan storage dari tab lain
    window.addEventListener("storage", checkLocation);
    return () => window.removeEventListener("storage", checkLocation);
  }, []);

  return { showLocationModal, setShowLocationModal, checkLocation };
}
