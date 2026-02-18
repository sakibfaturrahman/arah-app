"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { InstallPWA } from "@/components/installPwa"; // Path sudah disesuaikan

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locked, setLocked] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkStatus = () => {
      const finished = localStorage.getItem("finished-onboarding");
      if (finished === "true") setLocked(false); // Logika onboarding tetap dipertahankan
    };

    checkStatus();

    window.addEventListener("onboarding-finished", checkStatus);
    return () => window.removeEventListener("onboarding-finished", checkStatus);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Navbar hanya muncul jika onboarding selesai */}
      <AnimatePresence>
        {!locked && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-0 left-0 right-0 z-[50]" // Navbar dibuat fixed agar tidak tertutup konten
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>

      <main
        className={cn(
          "flex-grow overflow-x-hidden transition-all duration-500",
          // Penyesuaian padding-top agar konten memiliki jarak yang cukup dari Navbar
          !locked ? "pt-15 md:pt-15" : "pt-0",
        )}
      >
        <div className={cn(!locked && "px-4 md:px-6")}>
          {" "}
          {/* Opsional: Tambahkan padding horizontal agar tidak mepet ke pinggir layar */}
          {children}
        </div>
      </main>

      {/* Footer hanya muncul jika onboarding selesai */}
      <AnimatePresence>
        {!locked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Install Prompt hanya muncul setelah onboarding */}
      {!locked && <InstallPWA />}
    </>
  );
}
