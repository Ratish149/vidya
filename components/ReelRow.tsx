"use client";

import React from "react";
import { ReelCard } from "./ReelCard";
import { ReelItem, Grade } from "./types";

interface ReelRowProps {
  items: ReelItem[];
  currentGrade: Grade;
  onPlay?: (item: ReelItem) => void;
}

export function ReelRow({ items, currentGrade, onPlay }: ReelRowProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {items.map((item) => (
        <ReelCard 
          key={item.id} 
          item={item} 
          unlocked={item.grade === currentGrade} 
          onPlay={onPlay}
        />
      ))}
    </div>
  );
}
