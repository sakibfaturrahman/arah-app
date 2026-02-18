"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

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
      {/* Navbar & Footer hanya muncul jika onboarding selesai */}
      <AnimatePresence>
        {!locked && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>

      <main
        className={cn(
          "flex-grow overflow-x-hidden transition-all duration-500",
          !locked && "pt-15 md:pt-13",
        )}
      >
        {children}
      </main>

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
    </>
  );
}
