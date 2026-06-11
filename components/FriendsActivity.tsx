"use client";

import React from "react";
import { User } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { FriendItem } from "./types";

const friends: FriendItem[] = [
  { initial: "S", bg: "bg-rose-100", color: "text-rose-700", name: "Sita", time: "2 min ago", text: "Completed", highlight: "Cell division", tail: "and scored 9/10" },
  { initial: "A", bg: "bg-emerald-100", color: "text-emerald-700", name: "Arjun", time: "15 min ago", text: "Watching", highlight: "Quadratics", tail: "- on a 21-day streak" },
  { initial: "P", bg: "bg-blue-100", color: "text-blue-700", name: "Priya", time: "1 hr ago", text: "Saved 12 flashcards from", highlight: "Newton's laws", tail: "" },
  { initial: "K", bg: "bg-amber-100", color: "text-amber-700", name: "Kiran", time: "3 hr ago", text: "Unlocked", highlight: "Chapter 5", tail: "in Chemistry" },
];

export function FriendsActivity() {
  return (
    <div className="mb-8">
      <SectionHeader Icon={User} title="What your friends just watched" />
      <div className="flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {friends.map((f) => (
          <div 
            key={f.name} 
            className="flex-shrink-0 w-56 bg-white border border-gray-200/80 rounded-2xl p-4.5 hover:border-blue-300 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full ${f.bg} flex items-center justify-center ${f.color} text-sm font-extrabold font-display flex-shrink-0 shadow-sm`}>
                {f.initial}
              </div>
              <div className="min-w-0">
                <div className="font-display font-semibold text-gray-900 text-sm truncate leading-none">
                  {f.name}
                </div>
                <div className="text-gray-400 text-[10.5px] mt-1 font-semibold leading-none">
                  {f.time}
                </div>
              </div>
            </div>
            <div className="text-gray-600 text-[12.5px] leading-relaxed font-medium">
              {f.text}{" "}
              <span className="font-bold text-gray-900 font-display">
                {f.highlight}
              </span>{" "}
              {f.tail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
