"use client";

import React from "react";
import { Home, Compass, Play, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const items = [
    { Icon: Home, label: "Home", href: "/" },
    { Icon: Compass, label: "Discover", href: "/lessons" },
    { Icon: Play, label: "Reels", href: "/reels" },
    { Icon: User, label: "Profile", href: "#" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] px-2 py-2">
      <div className="max-w-5xl mx-auto grid grid-cols-4">
        {items.map((i) => {
          const isActive = pathname === i.href;
          return (
            <Link
              key={i.label}
              href={i.href}
              className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive 
                  ? "text-blue-600 font-semibold scale-105" 
                  : "text-gray-400 hover:text-gray-900 active:scale-95"
              }`}
            >
              <i.Icon className="w-5 h-5 transition-transform" />
              <span className="text-[10px] font-display font-medium leading-none">{i.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
