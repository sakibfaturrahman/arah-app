"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { InstallPWA } from "@/components/installPwa";

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
      if (finished === "true") setLocked(false);
    };
    checkStatus();
    window.addEventListener("onboarding-finished", checkStatus);
    return () => window.removeEventListener("onboarding-finished", checkStatus);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AnimatePresence>
        {!locked && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-0 left-0 right-0 z-[50]"
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>

      <main
        className={cn(
          "flex-grow transition-all duration-500",
          /* SOLUSI DESKTOP: 
             - Mobile (default): pt-0 agar Greeting menempel ke atas/Navbar mobile.
             - Desktop (md): pt-24 agar memberi ruang untuk Navbar desktop yang lebih besar.
          */
          !locked ? "pt-0 md:pt-24" : "pt-0",
        )}
      >
        {/* Container Utama tanpa padding horizontal agar Greeting bisa Full Width */}
        <div className="w-full">{children}</div>
      </main>

      <AnimatePresence>
        {!locked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            // Sembunyikan footer di mobile, muncul di desktop
            className="hidden md:block"
          >
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {!locked && <InstallPWA />}
    </>
  );
}
