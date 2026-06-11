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
  Volume2,
  VolumeX,
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
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [prevScrollIndex, setPrevScrollIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  // Sync state if initialIndex changes during render (standard React pattern)
  if (initialIndex !== prevInitialIndex) {
    setPrevInitialIndex(initialIndex);
    setCurrentScrollIndex(initialIndex);
  }

  // Reset play state when changing reel index during render
  if (currentScrollIndex !== prevScrollIndex) {
    setPrevScrollIndex(currentScrollIndex);
    setIsPlaying(true);
  }

  // Reset and sync seek state when active player ref or scroll index changes
  useEffect(() => {
    if (playerRef.current) {
      const dur = playerRef.current.duration;
      setDuration(dur && !isNaN(dur) ? dur : 0);
      setCurrentTime(playerRef.current.currentTime || 0);
    } else {
      setDuration(0);
      setCurrentTime(0);
    }
  }, [currentScrollIndex]);

  const handleSeek = (newTime: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Scroll to active index when it changes or when mounted
  useEffect(() => {
    if (containerRef.current) {
      const children = containerRef.current.children;
      if (children[initialIndex]) {
        children[initialIndex].scrollIntoView({ behavior: "auto" });
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
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 h-full w-full max-w-2xl justify-center relative md:max-h-[80vh]">
      {/* Clean, Full Height Video Card */}
      <div className="relative w-full md:w-auto h-full md:max-h-[80vh] md:aspect-[9/16] md:rounded-2xl overflow-hidden shadow-2xl md:border md:border-zinc-800 bg-[#0c0c0c] flex-shrink-0">
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          id="reels-scroll-container"
        >
          {reels.map((video, idx) => {
            const isActive = idx === currentScrollIndex;
            const isNext = idx === currentScrollIndex + 1;
            const shouldRenderPlayer = video.playback_id && (isActive || isNext);
            return (
              <div 
                key={`${video.id}-${idx}`} 
                className="w-full h-full snap-start snap-always flex-shrink-0 relative flex flex-col justify-between bg-black"
              >
                {/* Mux Player Iframe */}
                <div className="absolute inset-0 w-full h-full z-0">
                  {shouldRenderPlayer ? (
                    <MuxPlayer
                      ref={isActive ? playerRef : undefined}
                      playbackId={video.playback_id!}
                      streamType="on-demand"
                      autoPlay="any"
                      paused={!isActive || !isPlaying}
                      muted={isActive ? isMuted : true}
                      loop={isActive}
                      preload="auto"
                      onTimeUpdate={(e) => {
                        if (isActive) {
                          const target = e.target as HTMLVideoElement;
                          if (target) {
                            setCurrentTime(target.currentTime);
                          }
                        }
                      }}
                      onLoadedMetadata={(e) => {
                        if (isActive) {
                          const target = e.target as HTMLVideoElement;
                          if (target) {
                            setDuration(target.duration);
                          }
                        }
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        "--media-object-fit": "contain",
                        "--media-object-position": "center",
                        "--controls": "none",
                      } as React.CSSProperties & { [key: string]: string }}
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

                {/* Tap to Play/Pause Overlay */}
                <div 
                  onClick={() => {
                    if (isActive) {
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  className="absolute inset-0 z-10 cursor-pointer"
                />

                {/* Play Icon Overlay when paused */}
                {isActive && !isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/20">
                    <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm scale-110 transition-transform duration-200">
                      <Play className="w-8 h-8 fill-white text-white translate-x-0.5" />
                    </div>
                  </div>
                )}

                {/* Mute/Unmute toggle button */}
                {isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent toggling play/pause
                      setIsMuted(!isMuted);
                    }}
                    className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white transition-colors cursor-pointer border border-white/10"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                )}

                {/* Bottom details Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent p-5 pb-6 pt-20 z-10 text-white pointer-events-none">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md ${video.subjectColor || "text-blue-600"} bg-white/95 backdrop-blur-sm`}>
                    {video.lessonName || video.subject}
                  </span>
                  <h3 className="font-display font-bold text-sm mt-2 leading-snug drop-shadow-sm line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-[10px] text-zinc-350 mt-1 drop-shadow-sm font-medium">
                    Grade {video.grade} • Duration {video.duration}
                  </p>

                  {/* Desktop seek slider (below duration text) */}
                  {isActive && duration > 0 && (
                    <div className="hidden md:flex relative mt-3 h-1.5 w-full bg-white/20 rounded-full overflow-hidden items-center pointer-events-auto cursor-pointer z-30">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-75" 
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                      <input 
                        type="range" 
                        min={0} 
                        max={duration} 
                        value={currentTime} 
                        step="any"
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        onClick={(e) => e.stopPropagation()} // Prevent play/pause toggle
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-40 pointer-events-auto"
                      />
                    </div>
                  )}
                </div>

                {/* Mobile seek slider (above bottom navbar) */}
                {isActive && duration > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-30 flex md:hidden items-center">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-75" 
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <input 
                      type="range" 
                      min={0} 
                      max={duration} 
                      value={currentTime} 
                      step="any"
                      onChange={(e) => handleSeek(Number(e.target.value))}
                      onClick={(e) => e.stopPropagation()} // Prevent play/pause toggle
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-40"
                    />
                  </div>
                )}                 {/* Mobile Action Controls Overlay — rendered inside the video card to overlay it correctly */}
                <div className="md:hidden absolute right-3 bottom-20 flex flex-col items-center gap-3.5 z-20">
                  {/* Profile Avatar */}
                  <div className="relative cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-9 h-9 rounded-full border border-white/20 bg-zinc-900/60 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                      {video.subject[0]?.toUpperCase() || "V"}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-rose-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold border border-black">+</div>
                  </div>

                  {/* Like */}
                  <button className="flex flex-col items-center gap-0.5 hover:text-white transition-colors cursor-pointer group">
                    <div className="w-9 h-9 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-850/40 hover:bg-zinc-800/60 transition-all group-active:scale-90">
                      <Heart className="w-4.5 h-4.5 text-zinc-300 hover:text-rose-500 transition-colors" />
                    </div>
                    <span className="text-[9px] font-bold text-zinc-300 drop-shadow-md">
                      {video.views === "1.2k" ? "1.2M" : "12.4k"}
                    </span>
                  </button>

                  {/* Comment */}
                  <button className="flex flex-col items-center gap-0.5 hover:text-white transition-colors cursor-pointer group">
                    <div className="w-9 h-9 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-850/40 hover:bg-zinc-800/60 transition-all group-active:scale-90">
                      <MessageCircle className="w-4.5 h-4.5 text-zinc-300 hover:text-blue-400 transition-colors" />
                    </div>
                    <span className="text-[9px] font-bold text-zinc-300 drop-shadow-md">
                      {video.views === "1.2k" ? "45.2K" : "342"}
                    </span>
                  </button>

                  {/* Bookmark/Save */}
                  <button className="flex flex-col items-center gap-0.5 hover:text-white transition-colors cursor-pointer group">
                    <div className="w-9 h-9 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-850/40 hover:bg-zinc-800/60 transition-all group-active:scale-90">
                      <Bookmark className="w-4.5 h-4.5 text-zinc-300 hover:text-yellow-500 transition-colors" />
                    </div>
                    <span className="text-[9px] font-bold text-zinc-300 drop-shadow-md">
                      {video.views === "1.2k" ? "12K" : "89"}
                    </span>
                  </button>

                  {/* Share */}
                  <button className="flex flex-col items-center gap-0.5 hover:text-white transition-colors cursor-pointer group">
                    <div className="w-9 h-9 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-850/40 hover:bg-zinc-800/60 transition-all group-active:scale-90">
                      <Share2 className="w-4.5 h-4.5 text-zinc-300 hover:text-green-400 transition-colors" />
                    </div>
                    <span className="text-[9px] font-bold text-zinc-300 drop-shadow-md">Share</span>
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
        <div className="flex flex-col items-center gap-5 text-zinc-350">
          
          {/* Profile Avatar */}
          <div className="relative cursor-pointer hover:scale-105 transition-transform">
            <div className="w-10 h-10 rounded-full border border-white/20 bg-zinc-800 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
              {reels[currentScrollIndex]?.subject[0]?.toUpperCase() || "V"}
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-rose-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold border border-black">+</div>
          </div>

          {/* Like */}
          <button className="flex flex-col items-center gap-0.5 hover:text-white transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-800/50 hover:bg-zinc-800/60 transition-all group-active:scale-90">
              <Heart className="w-4.5 h-4.5 text-zinc-300 hover:text-rose-500 transition-colors" />
            </div>
            <span className="text-[9px] font-bold text-zinc-400">
              {reels[currentScrollIndex]?.views === "1.2k" ? "1.2M" : "12.4k"}
            </span>
          </button>

          {/* Comment */}
          <button className="flex flex-col items-center gap-0.5 hover:text-white transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-800/50 hover:bg-zinc-800/60 transition-all group-active:scale-90">
              <MessageCircle className="w-4.5 h-4.5 text-zinc-300 hover:text-blue-400 transition-colors" />
            </div>
            <span className="text-[9px] font-bold text-zinc-400">
              {reels[currentScrollIndex]?.views === "1.2k" ? "45.2K" : "342"}
            </span>
          </button>

          {/* Bookmark/Save */}
          <button className="flex flex-col items-center gap-0.5 hover:text-white transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-800/50 hover:bg-zinc-800/60 transition-all group-active:scale-90">
              <Bookmark className="w-4.5 h-4.5 text-zinc-300 hover:text-yellow-500 transition-colors" />
            </div>
            <span className="text-[9px] font-bold text-zinc-400">
              {reels[currentScrollIndex]?.views === "1.2k" ? "12K" : "89"}
            </span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center gap-0.5 hover:text-white transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-800/50 hover:bg-zinc-800/60 transition-all group-active:scale-90">
              <Share2 className="w-4.5 h-4.5 text-zinc-300 hover:text-green-400 transition-colors" />
            </div>
            <span className="text-[9px] font-bold text-zinc-400">Share</span>
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
