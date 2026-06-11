"use client";

import { Play, Lock } from "lucide-react";
import { ReelItem } from "./types";

interface ReelCardProps {
  item: ReelItem;
  unlocked: boolean;
  onPlay?: (item: ReelItem) => void;
}

export function ReelCard({ item, unlocked, onPlay }: ReelCardProps) {
  const Icon = item.Icon || Play;

  return (
    <div 
      onClick={() => unlocked && onPlay && onPlay(item)}
      className="group relative flex-shrink-0 w-40 sm:w-44 md:w-48 aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer bg-zinc-950 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-zinc-800/30 hover:border-zinc-700/50"
    >
      {/* Cover representation */}
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105 bg-slate-900">
        {item.playback_id ? (
          <img 
            src={`https://image.mux.com/${item.playback_id}/thumbnail.webp?time=2`} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full ${item.iconBg || "bg-blue-50"} flex items-center justify-center`}>
            <Icon className={`w-14 h-14 ${item.iconColor || "text-blue-600"} opacity-80`} />
          </div>
        )}
      </div>

      {/* Top bar: subject tag + video duration */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 gap-2">
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-md truncate max-w-[100px]" title={item.lessonName || item.subject}>
          {item.lessonName || item.subject}
        </span>

      </div>

      {/* Bottom info overlay (Instagram-style dark gradient with white text) */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3 pb-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end">
        <div className="font-display font-bold text-white text-[12.5px] leading-snug line-clamp-2 mb-1.5 drop-shadow-md group-hover:text-blue-400 transition-colors">
          {item.title}
        </div>
        <div className="flex items-center justify-between text-[10.5px] text-zinc-300 font-semibold drop-shadow-sm">
          <span className="flex items-center gap-1 tabular-nums text-white">
            <Play className="w-3 h-3 fill-white text-white" />
            {item.views}
          </span>
          {typeof item.progress === "number" && item.progress > 0 && (
            <span className="font-bold text-blue-400 tabular-nums">{item.progress}%</span>
          )}
        </div>

        {/* Sleek edge-to-edge progress line at the very bottom */}
        {typeof item.progress === "number" && item.progress > 0 && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${item.progress}%` }} />
          </div>
        )}
      </div>

      {/* Center Play button overlay on hover */}
      {unlocked && (
        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/25 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
        </div>
      )}

      {/* Locked overlay for higher grade reels (Dark premium glassmorphism) */}
      {!unlocked && (
        <div className="absolute inset-0 z-20 bg-black/75 backdrop-blur-[3px] flex flex-col items-center justify-center text-center px-3">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-2 shadow-md">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <div className="font-display font-bold text-white text-xs">Grade {item.grade} only</div>
          <div className="text-[10px] text-zinc-400 mt-1 font-medium leading-normal">Switch grade above to unlock</div>
        </div>
      )}
    </div>
  );
}
