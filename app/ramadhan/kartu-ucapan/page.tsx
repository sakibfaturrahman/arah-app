"use client";
import React, { useState } from "react";
import { toPng } from "html-to-image";
import { Download, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import CardPreview from "./cardPreview";
import EditorForm from "./editorForm";
import DesignSelector from "./designSelector";

export default function KartuUcapanPage() {
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState("blue");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById("ucapan-card");
    if (!element) return;

    setIsGenerating(true);
    try {
      // pixelRatio 2 agar gambar tajam (HD)
      const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `ARAH-Ramadhan-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal generate gambar", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-6 md:pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header Navigasi */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Kartu <span className="text-[#5465ff]">Ucapan</span>
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Ramadhan Edition
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Sisi Kiri: Preview */}
          <div className="flex flex-col items-center gap-6">
            <div className="scale-90 md:scale-100 origin-top">
              <CardPreview
                id="ucapan-card"
                sender={sender}
                message={message}
                theme={theme}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium italic">
              *Preview di atas sesuai dengan hasil unduhan.
            </p>
          </div>

          {/* Sisi Kanan: Editor (Logic di Parent) */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <EditorForm
              sender={sender}
              setSender={setSender}
              message={message}
              setMessage={setMessage}
            />

            <DesignSelector currentTheme={theme} setTheme={setTheme} />

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full py-4 bg-[#5465ff] text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Unduh Gambar (PNG)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
