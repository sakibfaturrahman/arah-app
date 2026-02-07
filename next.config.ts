import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // SOLUSI NEXT.JS 16:
  // Tambahkan ini untuk membungkam error Turbopack sesuai saran TIP di terminal
  // @ts-ignore - Tambahkan ignore jika IDE Anda protes karena masalah tipe data
  turbopack: {},

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/7.x/**",
      },
    ],
  },
};

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

// Gunakan casting 'as any' agar plugin PWA tidak bentrok dengan tipe data NextConfig 16
export default withPWA(nextConfig as any);
