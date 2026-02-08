"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
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
    setShowWelcome(false);
    // Beritahu ClientLayout agar memunculkan Navbar/Footer
    window.dispatchEvent(new Event("onboarding-finished"));
  };

  if (showWelcome === null) return null;

  if (showWelcome) {
    return <Onboarding onComplete={handleComplete} />;
  }

  return (
    <main className="flex-grow pt-4 md:pt-28 pb-32 bg-[#fafafa]">
      <div className="max-w-screen-md mx-auto px-4 md:px-6">
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
    </main>
  );
}
