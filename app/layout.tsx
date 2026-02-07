import type { Metadata, Viewport } from "next";
import { Montserrat, Onest } from "next/font/google";
import "@/styles/globals.css";
import ClientLayout from "./client-layout"; // Kita akan buat file ini

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "300", "400", "500", "700", "900"],
});

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const viewport: Viewport = {
  themeColor: "#5465ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Arah - Pendamping Ibadah Modern",
  description: "Jadwal Sholat, Al-Quran, dan Fitur Islami",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Arah",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${montserrat.variable} ${onest.variable} font-sans antialiased bg-[#fafafa] text-gray-900 flex flex-col min-h-screen`}
      >
        {/* Pindahkan logika client-side (Onboarding/Navbar) ke sini */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
