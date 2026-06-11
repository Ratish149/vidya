"use client";

import React from "react";
import { Play, Waves, Mic2, Leaf, Zap } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { MoodItem } from "./types";

const moods: MoodItem[] = [
  { title: "Deep focus", sub: "Lo-fi - 60-70 BPM", Icon: Waves, bg: "bg-blue-50", color: "text-blue-600" },
  { title: "Fact rap", sub: "Chapter beats - Nepali", Icon: Mic2, bg: "bg-amber-50", color: "text-amber-600" },
  { title: "Chill revision", sub: "Instrumental - calm", Icon: Leaf, bg: "bg-emerald-50", color: "text-emerald-600" },
  { title: "Exam mode", sub: "High focus - 80 BPM", Icon: Zap, bg: "bg-sky-50", color: "text-sky-600" },
];

export function StudyVibes() {
  return (
    <div className="mb-8">
      <SectionHeader Icon={Waves} title="Study vibes - pick your mood" seeAll={false} />
      <div className="flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {moods.map((m) => {
          const { Icon } = m;
          return (
            <div 
              key={m.title} 
              className="group flex-shrink-0 w-52 bg-white border border-gray-200/80 rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer hover:border-blue-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${m.bg} shadow-sm`}>
                <Icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-gray-900 text-sm truncate tracking-tight group-hover:text-blue-600 transition-colors">
                  {m.title}
                </div>
                <div className="text-gray-500 text-xs mt-0.5 font-medium truncate">
                  {m.sub}
                </div>
              </div>
              <button className="w-8 h-8 rounded-full border border-gray-200 bg-white group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white flex items-center justify-center text-gray-500 flex-shrink-0 shadow-sm transition-all duration-300 cursor-pointer">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
