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
  const [lastCheck, setLastCheck] = useState<string | null>(null);

  // Load history dari localStorage saat pertama kali buka
  useEffect(() => {
    const savedHistory = localStorage.getItem("notif-history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    // Load current notification dari localStorage
    const savedNotif = localStorage.getItem("notif-current");
    if (savedNotif) {
      const parsed = JSON.parse(savedNotif);
      // Hanya load jika masih hari yang sama
      if (parsed.date === new Date().toDateString()) {
        setNotification(parsed.data);
      }
    }
  }, []);

  // Fungsi untuk menambah notifikasi ke history tanpa duplikat
  const addToHistory = (newNotif: NotificationItem) => {
    setHistory((prev) => {
      // Cek apakah notifikasi yang sama (ID yang sama) sudah ada
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
      const currentHour = String(now.getHours()).padStart(2, "0");
      const currentMinute = String(now.getMinutes()).padStart(2, "0");
      const timeStr = `${currentHour}:${currentMinute}`;
      const timeCheck = `${currentHour}:${currentMinute}:${String(now.getSeconds()).padStart(2, "0")}`;
      const dateKey = now.toDateString();

      // Cegah check berulang di detik yang sama
      if (lastCheck === timeCheck) return;
      setLastCheck(timeCheck);

      console.log("[Notification Check]", timeStr);

      try {
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

          for (const prayer of prayers) {
            // Check apakah waktu saat ini sama dengan waktu sholat
            // Dengan tolerance ±1 menit
            const [prayerHour, prayerMin] = prayer.time.split(":").map(Number);
            const currentTotalMin = now.getHours() * 60 + now.getMinutes();
            const prayerTotalMin = prayerHour * 60 + prayerMin;
            const diffMin = Math.abs(currentTotalMin - prayerTotalMin);

            if (diffMin <= 1) {
              // Jika dalam range ±1 menit
              const newNotif: NotificationItem = {
                id: `prayer-${prayer.name}-${dateKey}`,
                title: `Waktu Shalat ${prayer.name}`,
                message: `Pukul ${prayer.time}. Mari sejenak menghadap Sang Pencipta.`,
                time: "Baru saja",
                type: "prayer",
              };

              setNotification(newNotif);
              addToHistory(newNotif);

              // Simpan ke localStorage untuk persistence
              localStorage.setItem(
                "notif-current",
                JSON.stringify({ data: newNotif, date: dateKey }),
              );

              console.log("[Prayer Notification]", newNotif.title);
              break; // Hanya satu notifikasi per detik
            }
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

            localStorage.setItem(
              "notif-current",
              JSON.stringify({ data: newNotif, date: dateKey }),
            );

            console.log("[Tadarus Notification]", newNotif.title);
          }
        }
      } catch (error) {
        console.error("[Notification Error]", error);
      }
    };

    // Check setiap detik untuk akurasi lebih baik
    const interval = setInterval(checkLogic, 1000);
    checkLogic(); // Jalankan segera saat mount

    return () => clearInterval(interval);
  }, [lastCheck]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("notif-history");
  };

  return { notification, setNotification, history, clearHistory };
}
