"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import LocationPermission from "@/components/common/locationModal";
import { cn } from "@/lib/utils";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locked, setLocked] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Fungsi untuk cek status
    const checkStatus = () => {
      const finished = localStorage.getItem("finished-onboarding");
      if (finished === "true") setLocked(false);
    };

    checkStatus();

    // Listen event jika onboarding selesai di halaman Home
    window.addEventListener("onboarding-finished", checkStatus);
    return () => window.removeEventListener("onboarding-finished", checkStatus);
  }, []);

  return (
    <>
      {isMounted && !locked && <Navbar />}
      <main
        className={cn(
          "flex-grow overflow-x-hidden",
          !locked && "pt-15 md:pt-13",
        )}
      >
        {children}
      </main>
      {isMounted && !locked && <Footer />}
      <LocationPermission />
    </>
  );
}
