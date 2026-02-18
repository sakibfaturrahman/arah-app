"use client";
import React from "react";

interface EditorProps {
  sender: string;
  setSender: (val: string) => void;
  message: string;
  setMessage: (val: string) => void;
}

export default function EditorForm({
  sender,
  setSender,
  message,
  setMessage,
}: EditorProps) {
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
          Nama Pengirim
        </span>
        <input
          type="text"
          maxLength={25}
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="Contoh: Abdzin"
          className="mt-2 w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#5465ff] transition-all outline-none"
        />
      </label>

      <label className="block">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
          Pesan Singkat
        </span>
        <textarea
          rows={3}
          maxLength={120}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan keberkahan..."
          className="mt-2 w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#5465ff] transition-all resize-none outline-none"
        />
      </label>
    </div>
  );
}
