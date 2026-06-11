import {
  Lesson,
  MuxAssetResponse,
  CreateMuxUploadPayload,
  VideoResponse,
  SubjectDetailResponse,
  Category,
  Subject,
  Chapter,
  LessonAdmin,
  AdminLoginPayload,
  AdminLoginResponse,
  CreateCategoryPayload,
  CreateSubjectPayload,
  CreateChapterPayload,
  CreateLessonPayload,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/reel";

export async function fetchVideos(filters?: { subject?: number; lesson?: number }): Promise<VideoResponse[]> {
  const params = new URLSearchParams();
  if (filters?.subject) params.append("subject", String(filters.subject));
  if (filters?.lesson) params.append("lesson", String(filters.lesson));

  const res = await fetch(`${BASE_URL}/videos/?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch videos");
  return res.json();
}

export async function fetchSubjectLessons(): Promise<SubjectDetailResponse[]> {
  const res = await fetch(`${BASE_URL}/subjects/lessons/`);
  if (!res.ok) throw new Error("Failed to fetch subjects and lessons");
  return res.json();
}

export async function fetchLessons(): Promise<Lesson[]> {
  const res = await fetch(`${BASE_URL}/lessons/`);
  if (!res.ok) throw new Error("Failed to fetch lessons");
  return res.json();
}

export async function createMuxUpload(payload: CreateMuxUploadPayload): Promise<MuxAssetResponse> {
  const res = await fetch(`${BASE_URL}/mux/assets/create-upload/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Failed to initiate Mux upload.");
  }

  return res.json();
}

// Administrative API calls
export async function adminLogin(payload: AdminLoginPayload): Promise<AdminLoginResponse> {
  const res = await fetch(`${BASE_URL}/admin/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/admin/category/`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  const res = await fetch(`${BASE_URL}/admin/category/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}

export async function fetchSubjectsList(): Promise<Subject[]> {
  const res = await fetch(`${BASE_URL}/admin/subject/`);
  if (!res.ok) throw new Error("Failed to fetch subjects");
  return res.json();
}

export async function createSubject(payload: CreateSubjectPayload): Promise<Subject> {
  const res = await fetch(`${BASE_URL}/admin/subject/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create subject");
  return res.json();
}

export async function fetchChaptersList(): Promise<Chapter[]> {
  const res = await fetch(`${BASE_URL}/admin/chapter/`);
  if (!res.ok) throw new Error("Failed to fetch chapters");
  return res.json();
}

export async function createChapter(payload: CreateChapterPayload): Promise<Chapter> {
  const res = await fetch(`${BASE_URL}/admin/chapter/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create chapter");
  return res.json();
}

export async function createLesson(payload: CreateLessonPayload): Promise<LessonAdmin> {
  const res = await fetch(`${BASE_URL}/admin/lesson/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create lesson");
  return res.json();
}

export async function fetchLessonsAdmin(): Promise<LessonAdmin[]> {
  const res = await fetch(`${BASE_URL}/admin/lesson/`);
  if (!res.ok) throw new Error("Failed to fetch admin lessons");
  return res.json();
}

/**
 * Standard video file upload with progress tracking via XMLHttpRequest
 */
export function uploadVideo(
  formData: FormData,
  onProgress?: (progress: number) => void
): Promise<VideoResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/videos/upload/`, true);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve({} as VideoResponse);
        }
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          reject(response);
        } catch {
          reject(new Error("Upload failed."));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error occurred during upload."));
    };

    xhr.send(formData);
  });
}
