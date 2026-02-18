"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface DesignProps {
  currentTheme: string;
  setTheme: (theme: string) => void;
}

export default function DesignSelector({
  currentTheme,
  setTheme,
}: DesignProps) {
  const options = [
    {
      id: "blue",
      name: "Classic Blue",
      accent: "from-[#5465ff] to-[#3a47d5]",
      svg: "/assets-svg/islamic-1-svgrepo-com.svg",
    },
    {
      id: "emerald",
      name: "Islamic Emerald",
      accent: "from-emerald-500 to-teal-700",
      svg: "/assets-svg/mosque-svgrepo-com.svg",
    },
    {
      id: "sunset",
      name: "Warm Sunset",
      accent: "from-orange-400 to-red-600",
      svg: "/assets-svg/islamic-lantern-svgrepo-com.svg",
    },
    {
      id: "olive",
      name: "Fresh Olive",
      accent: "from-olive-500 to-lime-800",
      svg: "/assets-svg/mun-mashhad-svgrepo-com.svg",
    },
    {
      id: "gold",
      name: "Royal Gold",
      accent: "from-amber-300 to-yellow-600",
      svg: "/assets-svg/arabic-art-svgrepo-com.svg",
    },
  ];

  return (
    <div className="space-y-4 p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
          Visual Style
        </span>
        <h3 className="text-sm font-semibold text-slate-700">
          Pilih Tema Kartu
        </h3>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {options.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className="group flex flex-col items-center gap-2 outline-none"
          >
            <div
              className={cn(
                "relative w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center overflow-hidden bg-gradient-to-br shadow-inner",
                t.accent,
                currentTheme === t.id
                  ? "ring-2 ring-offset-2 ring-slate-800 scale-110"
                  : "opacity-80 hover:opacity-100",
              )}
            >
              <Image
                src={t.svg}
                alt={t.name}
                width={24}
                height={24}
                className="brightness-0 invert opacity-80"
              />
            </div>
            <span
              className={cn(
                "text-[9px] font-medium transition-colors capitalize",
                currentTheme === t.id
                  ? "text-slate-900 font-bold"
                  : "text-slate-400",
              )}
            >
              {t.id}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
