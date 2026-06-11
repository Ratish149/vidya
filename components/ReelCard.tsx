"use client";

import React from "react";
import { Play, Lock, Heart, MessageCircle, Bookmark } from "lucide-react";
import { ReelItem } from "./types";

interface ReelCardProps {
  item: ReelItem;
  unlocked: boolean;
  onPlay?: (item: ReelItem) => void;
}

export function ReelCard({ item, unlocked, onPlay }: ReelCardProps) {
  const { Icon } = item;

  return (
    <div 
      onClick={() => unlocked && onPlay && onPlay(item)}
      className="group relative flex-shrink-0 w-40 sm:w-44 aspect-[9/16] rounded-2xl overflow-hidden border border-gray-200/80 cursor-pointer bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-300"
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
          <div className={`w-full h-full ${item.iconBg} flex items-center justify-center`}>
            <Icon className={`w-14 h-14 ${item.iconColor} opacity-80`} />
          </div>
        )}
      </div>

      {/* Top bar: subject tag + video duration */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 gap-2">
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-sm shadow-sm ${item.subjectColor} truncate max-w-[100px]`} title={item.lessonName || item.subject}>
          {item.lessonName || item.subject}
        </span>
        <span className="text-[9px] font-semibold text-gray-700 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded-md shadow-sm tabular-nums flex-shrink-0">
          {item.duration}
        </span>
      </div>

      {/* Right side social/interaction rail (TikTok style overlay) */}
      <div className="absolute right-2.5 bottom-18 flex flex-col items-center gap-2.5 z-10 text-gray-700">
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="w-7.5 h-7.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:text-rose-600 active:scale-90 transition-all cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="w-7.5 h-7.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:text-blue-600 active:scale-90 transition-all cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="w-7.5 h-7.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:text-amber-500 active:scale-90 transition-all cursor-pointer"
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom info overlay: Title, Views count, Progress bar */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3 bg-white/95 backdrop-blur-sm border-t border-gray-100">
        <div className="font-display font-bold text-gray-900 text-[12.5px] leading-snug line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors">
          {item.title}
        </div>
        <div className="flex items-center justify-between text-[10.5px] text-gray-500 font-medium">
          <span className="tabular-nums">{item.views} views</span>
          {item.progress > 0 && (
            <span className="font-bold text-blue-600 tabular-nums">{item.progress}%</span>
          )}
        </div>
        {item.progress > 0 && (
          <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${item.progress}%` }} />
          </div>
        )}
      </div>

      {/* Center Play button overlay on hover */}
      {unlocked && (
        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
          <div className="w-12 h-12 rounded-full bg-white/95 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200">
            <Play className="w-5 h-5 fill-gray-900 text-gray-900 ml-0.5" />
          </div>
        </div>
      )}

      {/* Locked overlay for higher grade reels */}
      {!unlocked && (
        <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-[2px] flex flex-col items-center justify-center text-center px-3">
          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center mb-2 shadow-md">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <div className="font-display font-bold text-gray-950 text-xs">Grade {item.grade} only</div>
          <div className="text-[10px] text-gray-500 mt-1 font-medium leading-normal">Switch grade above to unlock</div>
        </div>
      )}
    </div>
  );
}
