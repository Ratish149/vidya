"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Atom,
  Flame,
  Bookmark,
  X,
  Heart,
  MessageCircle,
  AlertCircle,
  Play,
  Layers,
  BookOpen,
} from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";

import { Grade, ReelItem } from "@/components/types";
import { useSubjectLessons, useVideos } from "@/lib/hooks";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { ReelCard } from "@/components/ReelCard";
import { VideoResponse } from "@/lib/types";

export default function LessonsPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  // Modal states for swiping reels
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [reelVideos, setReelVideos] = useState<ReelItem[] | null>(null);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch hierarchical subjects and lessons
  const { data: subjects = [], isLoading: isLoadingSubjects } = useSubjectLessons();

  // Fetch filtered videos list
  const videoFilters = useMemo(() => {
    const filters: { subject?: number; lesson?: number } = {};
    if (selectedLessonId) {
      filters.lesson = selectedLessonId;
    } else if (selectedSubjectId) {
      filters.subject = selectedSubjectId;
    }
    return filters;
  }, [selectedSubjectId, selectedLessonId]);

  const { data: dbVideos = [], isLoading: isLoadingVideos } = useVideos(videoFilters);

  // Find active subject details
  const activeSubject = useMemo(() => {
    return subjects.find((s) => s.id === selectedSubjectId) || null;
  }, [subjects, selectedSubjectId]);

  // Reset lesson selection when subject changes
  const handleSelectSubject = (id: number | null) => {
    setSelectedSubjectId(id);
    setSelectedLessonId(null);
  };

  // Map backend videos to ReelItem format for the cards and player
  const reels = useMemo(() => {
    return (dbVideos as VideoResponse[]).map((video: VideoResponse) => {
      const sub = video.lesson_name || "General";
      const durationStr = video.video_duration
        ? `${Math.floor(video.video_duration / 60)}:${String(video.video_duration % 60).padStart(2, "0")}`
        : "1:30";

      return {
        id: `db-${video.id}`,
        grade: 10 as Grade,
        subject: sub,
        subjectColor: "text-blue-600",
        title: video.title,
        duration: durationStr,
        views: "1.2k",
        Icon: Atom,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
        progress: 0,
        playback_id: video.playback_id,
      };
    });
  }, [dbVideos]);

  const handlePlayReel = (clickedItem: ReelItem) => {
    const idx = reels.findIndex((r) => r.id === clickedItem.id);
    if (idx !== -1) {
      setReelVideos(reels);
      setActiveReelIndex(idx);
      setCurrentScrollIndex(idx);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const clientHeight = e.currentTarget.clientHeight;
    if (clientHeight > 0) {
      const newIndex = Math.round(scrollTop / clientHeight);
      if (newIndex !== currentScrollIndex && newIndex >= 0 && newIndex < (reelVideos?.length || 0)) {
        setCurrentScrollIndex(newIndex);
      }
    }
  };

  // Scroll to active index when modal opens
  useEffect(() => {
    if (activeReelIndex !== null && containerRef.current) {
      const children = containerRef.current.children;
      if (children[activeReelIndex]) {
        children[activeReelIndex].scrollIntoView({ behavior: "auto" });
      }
    }
  }, [activeReelIndex, reelVideos]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Sticky header nav */}
      <Navbar streak={14} />

      <main className="max-w-5xl mx-auto px-6 pt-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
            Course Explorer
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Select a subject and browse lessons to filter reels.
          </p>
        </div>

        {/* Subjects list grid */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 text-slate-700">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="font-display font-bold text-lg">Subjects</h2>
          </div>

          {isLoadingSubjects ? (
            <div className="flex items-center gap-2 py-4">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-slate-500">Loading subjects...</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleSelectSubject(null)}
                className={`px-5 py-2.5 rounded-full font-display text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                  selectedSubjectId === null
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                All Subjects
              </button>
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubject(sub.id)}
                  className={`px-5 py-2.5 rounded-full font-display text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                    selectedSubjectId === sub.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lessons list grid (only show if a subject is active) */}
        {activeSubject && (
          <div className="mb-8 p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-700">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h2 className="font-display font-bold text-lg">Lessons in {activeSubject.name}</h2>
            </div>
            
            {activeSubject.lessons.length === 0 ? (
              <p className="text-slate-400 text-sm">No lessons registered for this subject yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setSelectedLessonId(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer border ${
                    selectedLessonId === null
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  All Lessons
                </button>
                {activeSubject.lessons.map((les) => (
                  <button
                    key={les.id}
                    onClick={() => setSelectedLessonId(les.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer border ${
                      selectedLessonId === les.id
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {les.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reels/Videos grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2 text-slate-700">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className="font-display font-bold text-lg">
                {selectedLessonId 
                  ? "Lesson Reels" 
                  : selectedSubjectId 
                    ? `${activeSubject?.name} Reels` 
                    : "All Reels"}
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium tabular-nums">
              {reels.length} video{reels.length !== 1 && "s"} found
            </span>
          </div>

          {isLoadingVideos ? (
            <div className="flex items-center gap-2 py-8 justify-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-slate-500">Loading reels...</span>
            </div>
          ) : reels.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
              <AlertCircle className="w-10 h-10 text-slate-400 mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No Videos Found</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-xs leading-normal">
                Try selecting another subject/lesson or upload a video linked to this selection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {reels.map((item) => (
                <ReelCard
                  key={item.id}
                  item={item}
                  unlocked={true}
                  onPlay={handlePlayReel}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Vertical Reels Swiper Modal */}
      {activeReelIndex !== null && reelVideos !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => {
              setActiveReelIndex(null);
              setReelVideos(null);
            }}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Swipe Container resembling Mobile Device Screen */}
          <div className="relative w-full max-w-[360px] h-full max-h-[85vh] sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-800/80 bg-black">
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              id="reels-scroll-container"
            >
              {reelVideos.map((video, idx) => {
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
                        <div className="w-full h-full flex items-center justify-center bg-slate-950">
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white animate-pulse">
                            <Play className="w-5 h-5 fill-white text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 p-6 text-center">
                          <AlertCircle className="w-10 h-10 text-slate-500 animate-pulse" />
                          <p className="font-semibold text-sm">Streaming playback is not ready yet</p>
                        </div>
                      )}
                    </div>

                    {/* Side Interaction Rail Overlay */}
                    <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 z-10 text-white drop-shadow-md">
                      <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-slate-950/60 backdrop-blur-md flex items-center justify-center border border-white/10">
                          <Heart className="w-4 h-4 fill-white text-white" />
                        </div>
                        <span className="text-[10px] font-bold">12.4k</span>
                      </button>
                      <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-slate-950/60 backdrop-blur-md flex items-center justify-center border border-white/10">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold">342</span>
                      </button>
                      <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-slate-950/60 backdrop-blur-md flex items-center justify-center border border-white/10">
                          <Bookmark className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold">89</span>
                      </button>
                    </div>

                    {/* Bottom details Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 pt-16 z-10 text-white">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-white/95 text-slate-950 backdrop-blur-sm`}>
                        {video.subject}
                      </span>
                      <h3 className="font-display font-bold text-sm mt-2 leading-snug drop-shadow-sm line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-[10px] text-slate-300 mt-1 drop-shadow-sm font-medium">
                        Grade {video.grade} • Duration {video.duration}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav for handheld screens */}
      <BottomNav />
    </div>
  );
}
