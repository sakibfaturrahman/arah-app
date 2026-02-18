"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Onboarding from "@/components/onboarding";
import Greeting from "@/components/home/greeting";
import HeroSection from "@/components/home/hero";
import PrayerTimeTable from "@/components/home/prayersTime";
import LastRead from "@/components/home/lastRead";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);

  useEffect(() => {
    const finished = localStorage.getItem("finished-onboarding");
    setShowWelcome(finished !== "true");
  }, []);

  const handleComplete = () => {
    // 1. Simpan di storage
    localStorage.setItem("finished-onboarding", "true");

    // 2. Beritahu layout untuk unlock Navbar/Footer
    window.dispatchEvent(new Event("onboarding-finished"));

    // 3. Update state lokal untuk switch tampilan
    setShowWelcome(false);
  };

  // Cegah Hydration Mismatch
  if (showWelcome === null) return null;

  return (
    <AnimatePresence mode="wait">
      {showWelcome ? (
        <motion.div
          key="onboarding-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999]"
        >
          <Onboarding onComplete={handleComplete} />
        </motion.div>
      ) : (
        <motion.div
          key="main-app-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-grow pb-32 bg-[#fafafa]"
        >
          <div className="max-w-screen-md mx-auto px-4 md:px-6 pt-4 md:pt-10">
            <div className="flex flex-col space-y-6 mt-4">
              <Greeting />

              <section className="w-full space-y-4">
                <HeroSection />
                <PrayerTimeTable />
              </section>

              <section className="w-full">
                <LastRead />
              </section>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
