"use client";
import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Sparkles,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-28 md:pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-white shadow-md">
                <Image
                  src="/logo.jpg"
                  alt="Arah Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase">
                ARAH<span className="text-[#5465ff]">.</span>
              </h2>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Pendamping ibadah digital modern untuk membantu Anda tetap
              istiqomah dalam menjalankan kewajiban setiap hari dengan antarmuka
              yang menenangkan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black text-gray-900 mb-6 uppercase tracking-[0.2em]">
              Fitur Utama
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Waktu Sholat", href: "/waktu-sholat" },
                { name: "Al-Quran Digital", href: "/al-quran" },
                { name: "Kumpulan Doa", href: "/doa" },
                { name: "Kumpulan Hadits", href: "/hadits" },
                { name: "Asmaul Husna", href: "/asmaul-husna" },
                { name: "Dzikir", href: "/dzikir" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-[#5465ff] font-bold transition-all flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#5465ff] transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-black text-gray-900 mb-6 uppercase tracking-[0.2em]">
              Bantuan
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[#5465ff]">
                  <Mail className="w-4 h-4" />
                </div>
                support@arah.id
              </li>
              <li className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[#5465ff]">
                  <MapPin className="w-4 h-4" />
                </div>
                Tasikmalaya, Indonesia
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="text-xs font-black text-gray-900 mb-6 uppercase tracking-[0.2em]">
              Ikuti Kami
            </h3>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Facebook, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#5465ff] hover:text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="mt-6 p-4 bg-[#5465ff]/5 rounded-2xl border border-[#5465ff]/10">
              <p className="text-[10px] font-bold text-[#5465ff] flex items-center gap-2 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Update Terupdate
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              © 2026 ARAH Project
            </p>
            <span className="text-gray-200">|</span>
            <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-widest">
              Dibuat untuk menemani perjalanan spiritualmu, setiap hari
              <Heart className="w-3 h-3 text-red-500" />
            </p>
          </div>

          <div className="flex gap-8">
            <a
              href="#"
              className="text-[11px] font-black text-gray-400 hover:text-[#5465ff] uppercase tracking-widest transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[11px] font-black text-gray-400 hover:text-[#5465ff] uppercase tracking-widest transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
