"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CardProps {
  sender: string;
  message: string;
  theme: string;
  id: string;
}

export default function CardPreview({ sender, message, theme, id }: CardProps) {
  // Mapping Style Visual
  const themes: Record<string, string> = {
    blue: "bg-gradient-to-br from-[#5465ff] to-[#3a47d5] text-white",
    emerald: "bg-gradient-to-br from-emerald-500 to-teal-700 text-white",
    sunset: "bg-gradient-to-br from-orange-400 to-red-600 text-white",
    olive: "bg-gradient-to-br from-emerald-600 to-lime-900 text-white",
    gold: "bg-gradient-to-br from-amber-300 to-yellow-600 text-amber-950",
  };

  // Mapping SVG Lokal berdasarkan Tema
  const themeSvgs: Record<string, string> = {
    blue: "/assets-svg/islamic-1-svgrepo-com.svg",
    emerald: "/assets-svg/mosque-svgrepo-com.svg",
    sunset: "/assets-svg/islamic-lantern-svgrepo-com.svg",
    olive: "/assets-svg/mun-mashhad-svgrepo-com.svg",
    gold: "/assets-svg/arabic-art-svgrepo-com.svg",
  };

  const selectedSvg = themeSvgs[theme] || themeSvgs.blue;

  return (
    <div
      id={id}
      className={cn(
        "w-[350px] h-[450px] md:w-[400px] md:h-[500px] p-8 rounded-[3rem] flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl transition-all duration-500",
        themes[theme] || themes.blue,
      )}
    >
      {/* Background Decor - Menggunakan SVG Lokal */}
      <div className="absolute top-6 right-6 w-32 h-32 opacity-15 rotate-12 transition-all duration-700">
        <Image
          src={selectedSvg}
          alt="decoration"
          fill
          className={cn(
            "object-contain",
            theme === "gold" ? "brightness-0" : "brightness-0 invert",
          )}
        />
      </div>

      {/* Dekorasi Tambahan */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

      <div className="relative z-10 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-black tracking-tight">
            Selamat Ramadhan
          </h1>
          <div
            className={cn(
              "h-1 w-12 mx-auto rounded-full",
              theme === "gold" ? "bg-amber-950/20" : "bg-white/30",
            )}
          />
        </div>

        <p className="text-sm leading-relaxed font-medium opacity-90 px-4 italic">
          "
          {message ||
            "Semoga bulan suci ini membawa keberkahan, kedamaian, dan kebahagiaan bagi kita semua."}
          "
        </p>

        <div className="pt-8">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 font-bold mb-1">
            Salam Hangat,
          </p>
          <p className="text-xl font-bold tracking-tight">
            {sender || "Nama Anda"}
          </p>
        </div>
      </div>

      <p className="absolute bottom-8 text-[9px] font-black tracking-[0.4em] opacity-40 uppercase">
        ARAH - Pendamping Ibadah
      </p>
    </div>
  );
}
