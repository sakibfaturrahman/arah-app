"use client";
import { useState, useEffect } from "react";
import { getPrayerTimes } from "@/lib/getPrayerTimes";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "prayer" | "tadarus" | "general";
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationItem | null>(
    null,
  );
  const [history, setHistory] = useState<NotificationItem[]>([]);

  // Load history dari localStorage saat pertama kali buka
  useEffect(() => {
    const savedHistory = localStorage.getItem("notif-history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Fungsi untuk menambah notifikasi ke history tanpa duplikat
  const addToHistory = (newNotif: NotificationItem) => {
    setHistory((prev) => {
      // Cek apakah notifikasi yang sama (judul & menit yang sama) sudah ada
      const isExist = prev.some((h) => h.id === newNotif.id);
      if (isExist) return prev;

      const updated = [newNotif, ...prev].slice(0, 10); // Simpan 10 terakhir saja
      localStorage.setItem("notif-history", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const checkLogic = async () => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const dateKey = now.toDateString(); // Untuk ID unik harian

      // 1. Logika Waktu Sholat
      const data = await getPrayerTimes();
      if (data) {
        const prayers = [
          { name: "Subuh", time: data.timings.Fajr },
          { name: "Dzuhur", time: data.timings.Dhuhr },
          { name: "Ashar", time: data.timings.Asr },
          { name: "Maghrib", time: data.timings.Maghrib },
          { name: "Isya", time: data.timings.Isha },
        ];

        const match = prayers.find((p) => p.time === timeStr);
        if (match) {
          const newNotif: NotificationItem = {
            id: `prayer-${match.name}-${dateKey}-${timeStr}`,
            title: `Waktu Shalat ${match.name}`,
            message: `Pukul ${match.time}. Mari sejenak menghadap Sang Pencipta.`,
            time: "Baru saja",
            type: "prayer",
          };
          setNotification(newNotif);
          addToHistory(newNotif);
        }
      }

      // 2. Logika Tadarus
      const lastRead = localStorage.getItem("lastReadSurah");
      if (lastRead) {
        const { updatedAt, name } = JSON.parse(lastRead);
        const diffInHours =
          (now.getTime() - new Date(updatedAt).getTime()) / (1000 * 3600);

        if (
          diffInHours >= 12 &&
          now.getHours() === 20 &&
          now.getMinutes() === 0
        ) {
          const newNotif: NotificationItem = {
            id: `tadarus-${dateKey}`,
            title: "Lanjutkan Tadarus",
            message: `Terakhir Anda membaca ${name}. Mari istiqomah mengaji hari ini.`,
            time: "Baru saja",
            type: "tadarus",
          };
          setNotification(newNotif);
          addToHistory(newNotif);
        }
      }
    };

    const interval = setInterval(checkLogic, 60000);
    checkLogic();
    return () => clearInterval(interval);
  }, []);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("notif-history");
  };

  return { notification, setNotification, history, clearHistory };
}
