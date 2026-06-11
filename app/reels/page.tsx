"use client";

import { useMemo, useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  AlertCircle,
  Play,
  ChevronUp,
  ChevronDown,
  Share2,
} from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";

import { Grade } from "@/components/types";
import { useVideos } from "@/lib/hooks";
import { VideoResponse } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

export default function ReelsPage() {
  // Fetch real videos from the backend using Tanstack Query
  const { data: dbVideos = [], isLoading } = useVideos();
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Map backend videos to standard format
  const reels = useMemo(() => {
    return (dbVideos as VideoResponse[]).map((video) => {
      const sub = video.subject_name || "General";
      const durationStr = video.video_duration
        ? `${Math.floor(video.video_duration / 60)}:${String(video.video_duration % 60).padStart(2, "0")}`
        : "1:30";

      return {
        id: `db-${video.id}`,
        grade: 7 as Grade,
        subject: sub,
        subjectColor: "text-blue-600",
        title: video.title,
        duration: durationStr,
        views: "1.2k",
        playback_id: video.playback_id,
        lessonName: video.lesson_name || "",
      };
    });
  }, [dbVideos]);

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

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans pb-16 md:pb-0 flex flex-col">
      {/* Sticky header nav */}
      <Navbar streak={14} />

      {/* Main reels area */}
      <main className="flex-1 flex items-center justify-center py-4 md:py-8 bg-[#030303]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm font-semibold">Loading Reels...</p>
          </div>
        ) : reels.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 text-center px-6">
            <AlertCircle className="w-12 h-12 text-slate-600 animate-pulse" />
            <h3 className="font-bold text-lg">No Reels Available</h3>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              Upload some videos in the Upload section to populate this reels feed!
            </p>
          </div>
        ) : (
          /* Container for Video + Outside Controls side by side */
          <div className="flex items-center gap-6 h-[75vh] sm:h-[80vh] w-full max-w-2xl justify-center relative">
            
            {/* Clean, Full Height Video Card */}
            <div className="relative aspect-[9/16] h-[75vh] sm:h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-zinc-850 bg-[#0c0c0c] flex-shrink-0">
              <div
                ref={containerRef}
                onScroll={handleScroll}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                id="reels-feed-container"
              >
                {reels.map((video, idx) => {
                  const isActive = idx === currentScrollIndex;
                  return (
                    <div
                      key={`${video.id}-${idx}`}
                      className="w-full h-full snap-start snap-always flex-shrink-0 relative flex flex-col justify-between bg-black"
                    >
                      {/* Mux Player */}
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
                          </div>
                        )}
                      </div>

                      {/* Bottom details Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent p-5 pb-16 pt-16 z-10 text-white pointer-events-none">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md ${video.subjectColor} bg-white/95 backdrop-blur-sm`}>
                          {video.lessonName || video.subject}
                        </span>
                        <h3 className="font-display font-bold text-sm mt-2 leading-snug drop-shadow-sm line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-[10px] text-zinc-350 mt-1 drop-shadow-sm font-medium">
                          Grade {video.grade} • Duration {video.duration}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Outside Action Controls (to the right of the video) */}
            <div className="flex flex-col justify-between h-[75vh] sm:h-[80vh] py-6 z-10">
              
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
                  <span className="text-[10px] font-bold text-zinc-400">1.2M</span>
                </button>

                {/* Comment */}
                <button className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer group">
                  <div className="w-11 h-11 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-800/50 hover:bg-zinc-800/60 transition-all group-active:scale-90">
                    <MessageCircle className="w-5 h-5 text-zinc-300 hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400">45.2K</span>
                </button>

                {/* Bookmark/Save */}
                <button className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer group">
                  <div className="w-11 h-11 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center border border-zinc-800/50 hover:bg-zinc-800/60 transition-all group-active:scale-90">
                    <Bookmark className="w-5 h-5 text-zinc-300 hover:text-yellow-500 transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400">12K</span>
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
        )}
      </main>

      {/* Bottom Nav for handheld devices */}
      <BottomNav />
    </div>
  );
}
