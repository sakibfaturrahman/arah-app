"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import LocationPermission from "@/components/common/locationModal";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locked, setLocked] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const finished = localStorage.getItem("finished-onboarding");
    if (finished === "true") {
      setLocked(false);
    }
  }, []);

  return (
    <>
      {/* Navbar & Footer HANYA muncul jika sudah Mounted dan onboarding selesai */}
      {isMounted && !locked && <Navbar />}

      <main className="flex-grow pt-15 md:pt-13 overflow-x-hidden">
        {children}
      </main>

      {isMounted && !locked && <Footer />}

      {/* Global Location Modal */}
      <LocationPermission />
    </>
  );
}
