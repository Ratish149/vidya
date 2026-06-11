import React from "react";

export type Grade = 7 | 8 | 9 | 10;

export interface ReelItem {
  id: string;
  grade: Grade;
  subject: string;
  subjectColor: string;
  title: string;
  duration: string;
  views: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  progress: number;
  playback_id?: string | null;
  lessonName?: string;
}

export interface MoodItem {
  title: string;
  sub: string;
  Icon: React.ComponentType<{ className?: string }>;
  bg: string;
  color: string;
}

export interface FriendItem {
  initial: string;
  bg: string;
  color: string;
  name: string;
  time: string;
  text: string;
  highlight: string;
  tail: string;
}

export interface ExamPrepItem {
  tag: string;
  tagColor: string;
  title: string;
  meta: string;
  Icon: React.ComponentType<{ className?: string }>;
  bg: string;
  color: string;
  grade: Grade;
}
