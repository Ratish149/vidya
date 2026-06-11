"use client";

import { useState, useMemo } from "react";
import {
  Flame,
  Bookmark,
  Layers,
  BookOpen,
  AlertCircle,
} from "lucide-react";

import { Grade, ReelItem } from "@/components/types";
import { useSubjectLessons, useVideos } from "@/lib/hooks";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { ReelCard } from "@/components/ReelCard";
import { ReelPlayer } from "@/components/ReelPlayer";
import { VideoResponse } from "@/lib/types";

export default function LessonsPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  // Modal states for swiping reels
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [reelVideos, setReelVideos] = useState<ReelItem[] | null>(null);

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
    }
  };

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
        <ReelPlayer
          reels={reelVideos}
          initialIndex={activeReelIndex}
          onClose={() => {
            setActiveReelIndex(null);
            setReelVideos(null);
          }}
        />
      )}

      {/* Bottom Nav for handheld screens */}
      <BottomNav />
    </div>
  );
}
