"use client";

import { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Play,
  ChevronUp,
  ChevronDown,
  Share2,
  X,
  AlertCircle,
} from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { ReelItem } from "./types";

interface ReelPlayerProps {
  reels: ReelItem[];
  initialIndex?: number;
  onClose?: () => void;
}

export function ReelPlayer({ reels, initialIndex = 0, onClose }: ReelPlayerProps) {
  const [currentScrollIndex, setCurrentScrollIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if initialIndex changes
  useEffect(() => {
    setCurrentScrollIndex(initialIndex);
  }, [initialIndex]);

  // Scroll to active index when it changes or when mounted
  useEffect(() => {
    if (containerRef.current) {
      const children = containerRef.current.children;
      if (children[currentScrollIndex]) {
        children[currentScrollIndex].scrollIntoView({ behavior: "auto" });
      }
    }
  }, [initialIndex, reels]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const clientHeight = e.currentTarget.clientHeight;
    if (clientHeight > 0) {
      const newIndex = Math.round(scrollTop / clientHeight);
      if (newIndex !== currentScrollIndex && newIndex >= 0 && newIndex < reels.length) {
        setCurrentScrollIndex(newIndex);
      }
    }
  };

  const scrollReel = (direction: "up" | "down") => {
    if (direction === "up" && currentScrollIndex > 0) {
      const newIdx = currentScrollIndex - 1;
      setCurrentScrollIndex(newIdx);
      if (containerRef.current) {
        const el = containerRef.current.children[newIdx] as HTMLElement;
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else if (direction === "down" && currentScrollIndex < reels.length - 1) {
      const newIdx = currentScrollIndex + 1;
      setCurrentScrollIndex(newIdx);
      if (containerRef.current) {
        const el = containerRef.current.children[newIdx] as HTMLElement;
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const playerContent = (
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 h-[calc(100dvh-130px)] md:h-full max-h-[calc(100dvh-130px)] md:max-h-[80vh] w-full max-w-2xl justify-center relative">
      {/* Clean, Full Height Video Card */}
      <div className="relative aspect-[9/16] h-full max-h-[calc(100dvh-130px)] md:max-h-[80vh] md:rounded-2xl overflow-hidden shadow-2xl md:border md:border-zinc-800 bg-[#0c0c0c] flex-shrink-0 w-auto">
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          id="reels-scroll-container"
        >
          {reels.map((video, idx) => {
            const isActive = idx === currentScrollIndex;
            return (
              <div 
                key={`${video.id}-${idx}`} 
                className="w-full h-full snap-start snap-always flex-shrink-0 relative flex flex-col justify-between bg-black"
              >
                {/* Mux Player Iframe */}
                <div className="absolute inset-0 w-full h-full z-0">
                  {video.playback_id && isActive ? (
                    <MuxPlayer
                      playbackId={video.playback_id}
                      streamType="on-demand"
                      autoPlay
                      muted={false}
                      loop
                      className="w-full h-full object-cover"
                    />
                  ) : video.playback_id ? (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white animate-pulse">
                        <Play className="w-5 h-5 fill-white text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2 p-6 text-center">
                      <AlertCircle className="w-10 h-10 text-zinc-500 animate-pulse" />
                      <p className="font-semibold text-sm">Streaming playback is not ready yet</p>
                      <p className="text-xs text-zinc-600 font-medium">The video is still processing on Mux or is missing a playback ID.</p>
                    </div>
                  )}
                </div>

                {/* Bottom details Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent p-5 pb-16 pt-16 z-10 text-white pointer-events-none">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md ${video.subjectColor || "text-blue-600"} bg-white/95 backdrop-blur-sm`}>
                    {video.lessonName || video.subject}
                  </span>
                  <h3 className="font-display font-bold text-sm mt-2 leading-snug drop-shadow-sm line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-[10px] text-zinc-350 mt-1 drop-shadow-sm font-medium">
                    Grade {video.grade} • Duration {video.duration}
                  </p>
                </div>

                {/* Mobile Action Controls Overlay — rendered inside the video card to overlay it correctly */}
                <div className="md:hidden absolute right-3 bottom-20 flex flex-col items-center gap-4 z-20">
                  {/* Profile Avatar */}
                  <div className="relative cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-10 h-10 rounded-full border border-white/20 bg-zinc-900/60 backdrop-blur-md flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                      {video.subject[0]?.toUpperCase() || "V"}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold border border-black">+</div>
                  </div>

                  {/* Like */}
                  <button className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-850/40 hover:bg-zinc-800/60 transition-all group-active:scale-90">
                      <Heart className="w-5 h-5 text-zinc-300 hover:text-rose-500 transition-colors" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-300 drop-shadow-md">
                      {video.views === "1.2k" ? "1.2M" : "12.4k"}
                    </span>
                  </button>

                  {/* Comment */}
                  <button className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-850/40 hover:bg-zinc-800/60 transition-all group-active:scale-90">
                      <MessageCircle className="w-5 h-5 text-zinc-300 hover:text-blue-400 transition-colors" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-300 drop-shadow-md">
                      {video.views === "1.2k" ? "45.2K" : "342"}
                    </span>
                  </button>

                  {/* Bookmark/Save */}
                  <button className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-850/40 hover:bg-zinc-800/60 transition-all group-active:scale-90">
                      <Bookmark className="w-5 h-5 text-zinc-300 hover:text-yellow-500 transition-colors" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-300 drop-shadow-md">
                      {video.views === "1.2k" ? "12K" : "89"}
                    </span>
                  </button>

                  {/* Share */}
                  <button className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-850/40 hover:bg-zinc-800/60 transition-all group-active:scale-90">
                      <Share2 className="w-5 h-5 text-zinc-300 hover:text-green-400 transition-colors" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-300 drop-shadow-md">Share</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Action Controls — static beside video on md+ */}
      <div className="hidden md:flex flex-col justify-between h-full md:max-h-[80vh] py-6 z-20">
        
        {/* Scroll Navigation Arrows (Up/Down) */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => scrollReel("up")}
            disabled={currentScrollIndex === 0}
            className="w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white flex items-center justify-center border border-zinc-850 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scrollReel("down")}
            disabled={currentScrollIndex === reels.length - 1}
            className="w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white flex items-center justify-center border border-zinc-850 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Social interaction icons (Avatar, Heart, Comment, Bookmark, Share) */}
        <div className="flex flex-col items-center gap-6 text-zinc-350">
          
          {/* Profile Avatar */}
          <div className="relative cursor-pointer hover:scale-105 transition-transform">
            <div className="w-11 h-11 rounded-full border border-white/20 bg-zinc-800 flex items-center justify-center text-sm font-bold text-white overflow-hidden">
              {reels[currentScrollIndex]?.subject[0]?.toUpperCase() || "V"}
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold border border-black">+</div>
          </div>

          {/* Like */}
          <button className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer group">
            <div className="w-11 h-11 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-800/50 hover:bg-zinc-800/60 transition-all group-active:scale-90">
              <Heart className="w-5 h-5 text-zinc-300 hover:text-rose-500 transition-colors" />
            </div>
            <span className="text-[10px] font-bold text-zinc-400">
              {reels[currentScrollIndex]?.views === "1.2k" ? "1.2M" : "12.4k"}
            </span>
          </button>

          {/* Comment */}
          <button className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer group">
            <div className="w-11 h-11 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-800/50 hover:bg-zinc-800/60 transition-all group-active:scale-90">
              <MessageCircle className="w-5 h-5 text-zinc-300 hover:text-blue-400 transition-colors" />
            </div>
            <span className="text-[10px] font-bold text-zinc-400">
              {reels[currentScrollIndex]?.views === "1.2k" ? "45.2K" : "342"}
            </span>
          </button>

          {/* Bookmark/Save */}
          <button className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer group">
            <div className="w-11 h-11 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-800/50 hover:bg-zinc-800/60 transition-all group-active:scale-90">
              <Bookmark className="w-5 h-5 text-zinc-300 hover:text-yellow-500 transition-colors" />
            </div>
            <span className="text-[10px] font-bold text-zinc-400">
              {reels[currentScrollIndex]?.views === "1.2k" ? "12K" : "89"}
            </span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer group">
            <div className="w-11 h-11 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-800/50 hover:bg-zinc-800/60 transition-all group-active:scale-90">
              <Share2 className="w-5 h-5 text-zinc-300 hover:text-green-400 transition-colors" />
            </div>
            <span className="text-[10px] font-bold text-zinc-400">Share</span>
          </button>
        </div>

      </div>
    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 bg-[#030303] text-white flex items-center justify-center p-0 md:p-4">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 md:top-6 md:left-6 z-50 p-2.5 rounded-full bg-black/40 backdrop-blur-md md:bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        {playerContent}
      </div>
    );
  }

  return playerContent;
}
