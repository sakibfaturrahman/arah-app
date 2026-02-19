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
    localStorage.setItem("finished-onboarding", "true");
    window.dispatchEvent(new Event("onboarding-finished"));
    setShowWelcome(false);
  };

  if (showWelcome === null) return null;

  return (
    <AnimatePresence mode="wait">
      {showWelcome ? (
        <motion.div key="onboarding-screen" className="fixed inset-0 z-[9999]">
          <Onboarding onComplete={handleComplete} />
        </motion.div>
      ) : (
        <motion.div
          key="main-app-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col min-h-screen pb-32 bg-[#fafafa]"
        >
          {/* 1. GREETING: Full Width */}
          <section className="w-full bg-white mt-5">
            <Greeting />
          </section>

          {/* 2. KONTEN LAINNYA: Terpusat & Berjarak */}
          <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
            <div className="flex flex-col space-y-10 mt-6">
              {/* Prayer & Info */}
              <div className="grid grid-cols-1 gap-6">
                <HeroSection />
              </div>

              {/* Progress */}
              <section>
                <LastRead />
              </section>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
