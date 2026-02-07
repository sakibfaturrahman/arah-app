import type { Metadata, Viewport } from "next";
import { Montserrat, Onest } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

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

// 1. Konfigurasi Viewport untuk PWA (Penting untuk warna bar HP)
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

  // 2. Koneksi ke file manifest.json
  manifest: "/manifest.json",

  // 3. Implementasi Favicon Lengkap
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    // Konfigurasi ikon Android untuk PWA
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },

  // 4. Pengaturan Apple Web App (iOS)
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
        <Navbar />

        {/* Main content dengan padding top yang pas 
            agar tidak tertutup navbar fixed.
        */}
        <main className="flex-grow pt-15 md:pt-13">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
