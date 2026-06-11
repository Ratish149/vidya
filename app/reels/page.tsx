"use client";

import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { Grade } from "@/components/types";
import { useVideos } from "@/lib/hooks";
import { VideoResponse } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { ReelPlayer } from "@/components/ReelPlayer";

export default function ReelsPage() {
  // Fetch real videos from the backend using Tanstack Query
  const { data: dbVideos = [], isLoading } = useVideos();

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

  return (
    <div className="h-[100dvh] bg-[#030303] text-white font-sans flex flex-col overflow-hidden">
      {/* Sticky header nav */}
      <Navbar streak={14} />

      {/* Main reels area */}
      <main className="flex-1 flex items-center justify-center bg-[#030303] overflow-hidden pb-[56px] md:pb-0">
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
          <ReelPlayer reels={reels} />
        )}
      </main>

      {/* Bottom Nav for handheld devices */}
      <BottomNav />
    </div>
  );
}
