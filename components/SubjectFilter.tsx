"use client";

import React from "react";
import { useSubjectsList } from "@/lib/hooks";

const dotColorMap: Record<string, string> = {
  All: "bg-blue-600",
  Biology: "bg-emerald-500",
  Physics: "bg-amber-500",
  Chemistry: "bg-rose-500",
  Maths: "bg-sky-500",
  History: "bg-violet-500",
  Geography: "bg-yellow-600",
  English: "bg-pink-500",
  Science: "bg-teal-500",
};

interface SubjectFilterProps {
  currentSubject: string;
  onSubjectChange: (subject: string) => void;
}

export function SubjectFilter({ currentSubject, onSubjectChange }: SubjectFilterProps) {
  const { data: backendSubjects = [] } = useSubjectsList();

  // Construct subjects list with "All" first, then backend subjects
  const subjectsList = [
    { name: "All", dot: "bg-blue-600" },
    ...backendSubjects.map((s: any) => ({
      name: s.name,
      dot: dotColorMap[s.name] || "bg-indigo-500",
    })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1.5 mb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {subjectsList.map((s) => {
        const active = currentSubject === s.name;
        return (
          <button
            key={s.name}
            onClick={() => onSubjectChange(s.name)}
            className={`flex items-center gap-2 flex-shrink-0 text-sm font-display px-4 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
              active
                ? "bg-blue-50 border-blue-200/80 text-blue-700 font-semibold shadow-sm shadow-blue-500/5"
                : "bg-white border-gray-200 text-gray-500 font-medium hover:border-gray-300 hover:text-gray-900 hover:shadow-sm"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${s.dot} transition-transform duration-300 ${active ? "scale-125" : ""}`} />
            {s.name}
          </button>
        );
      })}
    </div>
  );
}
