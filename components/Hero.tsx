"use client";

import React from "react";
import { Play, Plus, Info, Lock } from "lucide-react";
import { Grade } from "./types";

interface HeroProps {
  currentGrade: Grade;
  onGradeChange: (grade: Grade) => void;
  streak: number;
}

export function Hero({ currentGrade, onGradeChange, streak }: HeroProps) {
  return (
    <section className="relative border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white">
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-12 md:pt-14 md:pb-16 relative">
        {/* Grade badge & restriction message */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="inline-flex items-center gap-3">
            <span className="text-xs font-display font-bold tracking-widest uppercase text-gray-400">Grade</span>
            <div className="flex items-center bg-white shadow-sm border border-gray-200/80 rounded-full px-4.5 py-1.5 text-xs font-display font-semibold text-blue-600">
              Grade 7
            </div>
          </div>
          <span className="text-xs text-gray-500 inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            You only see Grade 7 content
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-8">
          {/* Main content */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-emerald-700 text-xs font-bold font-display tracking-widest uppercase">
                Continue watching
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight mb-3">
              Photosynthesis -<br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                How plants make food
              </span>
            </h1>

            <div className="flex items-center gap-2 text-gray-500 text-sm mb-5 flex-wrap">
              <span className="text-emerald-600 font-bold text-xs font-display uppercase tracking-wide">Biology</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
              <span>Chapter 4</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
              <span>3 min reel</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
              <span className="text-blue-600 font-semibold">Grade {currentGrade}</span>
            </div>

            {/* Watch Progress */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 max-w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" />
              </div>
              <span className="text-gray-600 text-xs font-semibold">65% watched</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-display font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer">
                <Play className="w-4 h-4 fill-current" />
                Resume
              </button>
              <button className="flex items-center gap-2 bg-white hover:bg-gray-50 active:scale-98 text-gray-700 font-display font-semibold text-sm px-5 py-3 rounded-xl border border-gray-200/80 shadow-sm transition-all cursor-pointer">
                <Plus className="w-4 h-4" />
                My list
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 active:scale-98 text-sm px-4 py-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                <Info className="w-4 h-4" />
                More info
              </button>
            </div>
          </div>

          {/* Stats widgets */}
          <div className="flex gap-3 md:flex-col md:min-w-[150px]">
            {[
              { v: `${streak}`, l: "Day streak", c: "text-gray-900" },
              { v: "84%", l: "Chapter done", c: "text-blue-600" },
              { v: "12", l: "Notes saved", c: "text-emerald-600" },
            ].map((s) => (
              <div key={s.l} className="flex-1 md:flex-none bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-4 text-center hover:shadow-md transition-shadow">
                <div className={`font-display text-2xl font-extrabold tracking-tight ${s.c}`}>{s.v}</div>
                <div className="text-gray-500 text-xs mt-1 font-medium">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
