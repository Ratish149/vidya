"use client";

import React from "react";
import { Library, BarChart3, Brain, Hash, Microscope } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Grade, ExamPrepItem } from "./types";

const examPrep: ExamPrepItem[] = [
  { tag: "Physics", tagColor: "text-amber-600", title: "All formulas, one place", meta: "Quick review - flashcard set", Icon: BarChart3, bg: "bg-amber-50", color: "text-amber-600", grade: 10 },
  { tag: "Biology", tagColor: "text-emerald-600", title: "Diagrams you must draw", meta: "Practice set - 15 min", Icon: Brain, bg: "bg-emerald-50", color: "text-emerald-600", grade: 10 },
  { tag: "Maths", tagColor: "text-sky-600", title: "Past paper questions", meta: "Mock quiz - 20 Qs", Icon: Hash, bg: "bg-sky-50", color: "text-sky-600", grade: 10 },
  { tag: "Biology", tagColor: "text-emerald-600", title: "Chapter recap quiz", meta: "Quiz - 10 Qs", Icon: Microscope, bg: "bg-emerald-50", color: "text-emerald-600", grade: 9 },
];

interface ExamPrepProps {
  currentGrade: Grade;
}

export function ExamPrep({ currentGrade }: ExamPrepProps) {
  const filteredPrep = examPrep.filter((e) => e.grade === currentGrade);

  return (
    <div className="mb-10">
      <SectionHeader Icon={Library} title={`Exam season - Grade ${currentGrade} prep`} />
      {filteredPrep.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrep.map((e) => {
            const { Icon } = e;
            return (
              <div 
                key={e.title} 
                className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md hover:scale-[1.005] active:scale-[0.995] transition-all duration-300 cursor-pointer flex"
              >
                <div className={`w-20 flex-shrink-0 flex items-center justify-center ${e.bg} transition-colors duration-300`}>
                  <Icon className={`w-7 h-7 ${e.color} transition-transform duration-300`} />
                </div>
                <div className="p-4 flex-1 min-w-0">
                  <div className={`text-[10px] font-bold font-display tracking-widest uppercase mb-1 ${e.tagColor}`}>
                    {e.tag}
                  </div>
                  <div className="font-display font-semibold text-gray-950 text-sm leading-snug mb-1 truncate">
                    {e.title}
                  </div>
                  <div className="text-gray-500 text-xs font-medium">
                    {e.meta}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-gray-500 bg-gray-50/50 border border-gray-200/60 rounded-2xl p-8 text-center font-medium">
          No prep packs for Grade {currentGrade} yet - try switching grades to see what's available.
        </div>
      )}
    </div>
  );
}
