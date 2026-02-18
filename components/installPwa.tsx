"use client";
import { useEffect, useState } from "react";
import { DownloadCloud, X } from "lucide-react";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Cek apakah aplikasi sudah berjalan dalam mode PWA (sudah terinstall)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://");

      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // 2. Logic untuk menangkap prompt install
    const handler = (e: any) => {
      // Jangan jalankan logic jika sudah dalam mode standalone
      if (window.matchMedia("(display-mode: standalone)").matches) return;

      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // 3. Tambahan: Sembunyikan jika user berhasil install (event appinstalled)
    window.addEventListener("appinstalled", () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      console.log("PWA Berhasil diinstall");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Jika sudah terinstall (standalone), jangan tampilkan apapun
  if (isStandalone || !isVisible) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setIsVisible(false);
      }
    }
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[9999] md:left-auto md:right-6 md:w-80">
      <div className="bg-white border border-slate-100 p-4 rounded-[2rem] shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#5465ff]/10 rounded-xl text-[#5465ff]">
            <DownloadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#5465ff]">
              Arah App
            </p>
            <p className="text-xs font-bold text-slate-700">
              Pasang di Layar Utama
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstall}
            className="bg-[#5465ff] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-[#5465ff]/20"
          >
            Instal
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
