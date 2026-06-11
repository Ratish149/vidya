"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  seeAll?: boolean;
}

export function SectionHeader({ Icon, title, seeAll = true }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4.5">
      <h2 className="font-display font-bold text-gray-900 text-base flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-700" />
        <span>{title}</span>
      </h2>
      {seeAll && (
        <button className="text-gray-500 text-xs font-semibold hover:text-blue-600 transition-colors inline-flex items-center gap-0.5 cursor-pointer">
          <span>See all</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
