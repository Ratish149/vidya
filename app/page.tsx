"use client";

import { useMemo, useState } from "react";
import {
  Atom,
  Dna,
  Ruler,
  Landmark,
  Sprout,
  Microscope,
  FlaskConical,
  Hash,
  Leaf,
  Flame,
  Bookmark,
} from "lucide-react";

import { Grade, ReelItem } from "@/components/types";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SubjectFilter } from "@/components/SubjectFilter";
import { ReelRow } from "@/components/ReelRow";
import { SectionHeader } from "@/components/SectionHeader";
import { StudyVibes } from "@/components/StudyVibes";
import { FriendsActivity } from "@/components/FriendsActivity";
import { ExamPrep } from "@/components/ExamPrep";
import { BottomNav } from "@/components/BottomNav";
import { ReelPlayer } from "@/components/ReelPlayer";
import { useVideos } from "@/lib/hooks";
import { VideoResponse } from "@/lib/types";

const subjectIconMap: Record<string, any> = {
  Physics: Atom,
  Maths: Ruler,
  Chemistry: FlaskConical,
  Biology: Dna,
  History: Landmark,
  Science: Microscope,
};

const subjectColorMap: Record<string, string> = {
  Physics: "text-amber-600",
  Maths: "text-sky-600",
  Chemistry: "text-rose-600",
  Biology: "text-emerald-600",
  History: "text-violet-600",
};

const subjectBgMap: Record<string, string> = {
  Physics: "bg-amber-50",
  Maths: "bg-sky-50",
  Chemistry: "bg-rose-50",
  Biology: "bg-emerald-50",
  History: "bg-violet-50",
};

export default function Home() {
  const [grade, setGrade] = useState<Grade>(7);
  const [subject, setSubject] = useState<string>("All");

  // Fetch real videos from the backend using Tanstack Query
  const { data: dbVideos = [] } = useVideos();

  // Modal states for swiping reels
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [reelVideos, setReelVideos] = useState<ReelItem[] | null>(null);

  // Map backend videos to ReelItem format
  const dbReels = useMemo(() => {
    return (dbVideos as VideoResponse[]).map((video: VideoResponse) => {
      const sub = video.subject_name || "General";
      const IconComp = Atom;
      const durationStr = video.video_duration
        ? `${Math.floor(video.video_duration / 60)}:${String(video.video_duration % 60).padStart(2, "0")}`
        : "1:30";

      return {
        id: `db-${video.id}`,
        grade: grade,
        subject: sub,
        subjectColor: "text-blue-600",
        title: video.title,
        duration: durationStr,
        views: "1.2k",
        Icon: IconComp,
        iconBg: subjectBgMap[sub] || "bg-blue-50",
        iconColor: subjectColorMap[sub] || "text-blue-600",
        progress: 0,
        playback_id: video.playback_id,
        lessonName: video.lesson_name || "",
      };
    });
  }, [dbVideos, grade]);

  // Use backend reels as visible reels
  const visibleReels = useMemo(() => {
    return dbReels.filter((r: ReelItem) => (subject === "All" ? true : r.subject.toLowerCase() === subject.toLowerCase()));
  }, [dbReels, subject]);

  const trending = useMemo(
    () => visibleReels.filter((r: ReelItem) => r.grade === grade).slice(0, 6),
    [visibleReels, grade],
  );

  const recs = useMemo(() => {
    if (subject === "All") {
      return dbReels.slice(0, 6);
    }
    return dbReels.filter((r: ReelItem) => r.subject.toLowerCase() === subject.toLowerCase()).slice(0, 6);
  }, [dbReels, subject]);

  // Open clicked video in reel format
  const handlePlayReel = (clickedItem: ReelItem) => {
    const idx = visibleReels.findIndex((r) => r.id === clickedItem.id);
    if (idx !== -1) {
      setReelVideos(visibleReels);
      setActiveReelIndex(idx);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-24">
      {/* Sticky header nav */}
      <Navbar streak={14} />

      {/* Hero promo area */}
      {/* <Hero currentGrade={grade} onGradeChange={setGrade} streak={14} /> */}

      {/* Main dashboard list container */}
      <main className="max-w-5xl mx-auto px-6 pt-8">
        {/* Subject scroll selector */}
        <SubjectFilter currentSubject={subject} onSubjectChange={setSubject} />


        {/* Trending lessons list */}
        <div className="mb-8">
          <SectionHeader Icon={Flame} title={`Trending in Grade ${grade}`} />
          {trending.length > 0 ? (
            <ReelRow items={trending} currentGrade={grade} onPlay={handlePlayReel} />
          ) : (
            <div className="text-sm text-gray-500 bg-gray-50/50 border border-gray-200/60 rounded-2xl p-8 text-center font-medium">
              No reels for this subject in Grade {grade} yet.
            </div>
          )}
        </div>

        {/* Study music section */}
        {/* <StudyVibes /> */}

        <div className="h-px bg-gray-100/80 mb-8" />

        {/* Recommendations block */}
        <div className="mb-8">
          <SectionHeader Icon={Bookmark} title="Because you watched Cell division" />
          <ReelRow 
            items={recs.length ? recs : visibleReels.filter((r) => r.grade === grade)} 
            currentGrade={grade} 
            onPlay={handlePlayReel}
          />
        </div>

        {/* Classmates activity feed */}
        <FriendsActivity />

        <div className="h-px bg-gray-100/80 mb-8" />

        {/* Exam preparation season items */}
        {/* <ExamPrep currentGrade={grade} /> */}
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

      {/* Bottom nav for handheld screens */}
      <BottomNav />
    </div>
  );
}
