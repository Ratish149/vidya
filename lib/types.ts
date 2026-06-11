export interface Lesson {
  id: number;
  name: string;
  chapter_name: string;
  subject_name: string;
}

export interface MuxAssetResponse {
  id: number;
  lesson: number;
  title: string;
  description: string;
  upload_id: string;
  upload_url: string;
  asset_id: string;
  playback_id: string;
  status: string;
  duration: number | null;
  aspect_ratio: string | null;
  is_reel: boolean;
  max_stored_resolution: string | null;
  created_at: string;
  updated_at: string;
}

export interface VideoResponse {
  id: number;
  lesson: number;
  lesson_name: string | null;
  subject_name: string | null;
  title: string;
  description: string;
  video_url: string | null;
  video_file: string | null;
  video_thumbnail: string | null;
  video_duration: number | null;
  playback_id: string | null;
  asset_id: string | null;
  upload_id: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMuxUploadPayload {
  lesson: string;
  title: string;
  description?: string;
  is_reel?: boolean;
}

export interface SubjectLesson {
  id: number;
  name: string;
}

export interface SubjectDetailResponse {
  id: number;
  name: string;
  lessons: SubjectLesson[];
}
