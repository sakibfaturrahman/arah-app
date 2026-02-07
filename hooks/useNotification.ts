"use client";
import { useState, useEffect } from "react";
import { getPrayerTimes } from "@/lib/getPrayerTimes";

export function useNotification() {
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const checkLogic = async () => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      // 1. Logika Waktu Sholat Real-time
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
          setNotification({
            title: `Waktu Shalat ${match.name}`,
            message: `Pukul ${match.time}. Mari sejenak menghadap Sang Pencipta.`,
          });
        }
      }

      // 2. Logika Tadarus
      const lastRead = localStorage.getItem("lastReadSurah");
      if (!lastRead) {
        // Cek hanya di jam tertentu agar tidak spam (misal jam 18:00)
        if (now.getHours() === 18 && now.getMinutes() === 0) {
          setNotification({
            title: "Mulai Kebiasaan Baik",
            message: "Yuk mulai baca Al-Qur'an hari ini untuk ketenangan hati.",
          });
        }
      } else {
        const { updatedAt, name } = JSON.parse(lastRead);
        const diffInHours =
          (now.getTime() - new Date(updatedAt).getTime()) / (1000 * 3600);

        // Jika sudah 24 jam belum baca lagi
        if (diffInHours >= 24 && now.getMinutes() === 0) {
          setNotification({
            title: "Lanjutkan Tadarus",
            message: `Terakhir Anda membaca ${name}. Mari istiqomah mengaji hari ini.`,
          });
        }
      }
    };

    const interval = setInterval(checkLogic, 60000); // Cek tiap 1 menit
    checkLogic();
    return () => clearInterval(interval);
  }, []);

  return { notification, setNotification };
}
