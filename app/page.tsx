"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Onboarding from "@/components/onboarding";
import Greeting from "@/components/home/greeting";
import HeroSection from "@/components/home/hero";
import PrayerTimeTable from "@/components/home/prayersTime";
import LastRead from "@/components/home/lastRead";
import { cn } from "@/lib/utils";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);

  useEffect(() => {
    // Mengecek status di client-side
    const finished = localStorage.getItem("finished-onboarding");
    setShowWelcome(!finished);
  }, []);

  // Fungsi ini WAJIB ada dan diteruskan ke props Onboarding
  const handleComplete = () => {
    localStorage.setItem("finished-onboarding", "true");
    setShowWelcome(false);
  };

  if (showWelcome === null) return null;

  return (
    <>
      <AnimatePresence>
        {showWelcome && <Onboarding onComplete={handleComplete} />}
      </AnimatePresence>

      <motion.main
        animate={{
          filter: showWelcome ? "blur(20px)" : "blur(0px)",
          opacity: showWelcome ? 0.6 : 1,
          scale: showWelcome ? 0.98 : 1,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="flex-grow pt-4 md:pt-28 pb-32 bg-[#fafafa]"
      >
        <div className="max-w-screen-md mx-auto px-4 md:px-6">
          {/* Header Mobile */}
          <div className="md:hidden mb-4"></div>

          <div className="flex flex-col space-y-4">
            <Greeting />
            <section className="w-full">
              <HeroSection />
              <PrayerTimeTable />
            </section>
            <section className="w-full">
              <LastRead />
            </section>
          </div>
        </div>
      </motion.main>
    </>
  );
}
