"use client";

import React from "react";
import { Flame, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  streak?: number;
}

export function Navbar({ streak = 14 }: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Reels", href: "/reels" },
    { label: "Subjects", href: "/lessons" },
    { label: "Live", href: "#" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/80 transition-all duration-300">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-14">
        {/* Logo */}
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-gray-900 hover:opacity-90 transition-opacity">
          vid<span className="text-blue-600">ya</span>
        </Link>

        {/* Navigation items (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`font-display text-sm px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm"
                    : "text-gray-500 font-medium hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Streak badge */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 rounded-full px-3 py-1.5 text-amber-700 text-sm font-semibold font-display shadow-sm hover:scale-105 transition-transform">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>{streak}</span>
          </div>

          {/* Search (mobile only) */}
          <button className="md:hidden w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100 hover:bg-gray-100 transition-colors">
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-sm font-bold font-display cursor-pointer hover:shadow-md transition-shadow">
            R
          </div>
        </div>
      </div>
    </nav>
  );
}
