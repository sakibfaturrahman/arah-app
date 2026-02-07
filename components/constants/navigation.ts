import {
  Home,
  BookOpen,
  Sparkles,
  ScrollText,
  Clock,
  Users2,
  LucideHeartHandshake,
} from "lucide-react";

export const navItems = [
  { name: "Beranda", icon: Home, href: "/" },
  { name: "Al-Qur'an", icon: BookOpen, href: "/al-quran" },
  { name: "Dzikir", icon: Sparkles, href: "/dzikir" },
  { name: "Hadits", icon: ScrollText, href: "/hadits" },
  { name: "Waktu Shalat", icon: Clock, href: "/waktu-shalat" },
  { name: "Asmaul Husna", icon: Users2, href: "/asmaul-husna" },
  { name: "Hisnul Muslim", icon: LucideHeartHandshake, href: "/hisnul-muslim" },
];

export const bottomNavItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Hadits", icon: ScrollText, href: "/hadits" },
  { name: "Quran", icon: BookOpen, href: "/al-quran" },
  { name: "Doa", icon: LucideHeartHandshake, href: "/hisnul-muslim" },
  { name: "Waktu", icon: Clock, href: "/waktu-shalat" },
];
