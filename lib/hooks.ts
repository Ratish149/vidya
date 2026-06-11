import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchLessons, 
  createMuxUpload, 
  fetchVideos, 
  fetchSubjectLessons,
  adminLogin,
  fetchCategories,
  createCategory,
  fetchSubjectsList,
  createSubject,
  fetchChaptersList,
  createChapter,
  createLesson,
  fetchLessonsAdmin,
  uploadVideo,
} from "./api";
import {
  CreateMuxUploadPayload,
  AdminLoginPayload,
  CreateCategoryPayload,
  CreateSubjectPayload,
  CreateChapterPayload,
  CreateLessonPayload,
  VideoResponse,
} from "./types";

export function useLessons() {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: fetchLessons,
  });
}

export function useCreateMuxUpload() {
  return useMutation({
    mutationFn: (payload: CreateMuxUploadPayload) => createMuxUpload(payload),
  });
}

export function useVideos(filters?: { subject?: number; lesson?: number }) {
  return useQuery({
    queryKey: ["videos", filters],
    queryFn: () => fetchVideos(filters),
  });
}

export function useSubjectLessons() {
  return useQuery({
    queryKey: ["subjectLessons"],
    queryFn: fetchSubjectLessons,
  });
}

// Administrative hooks
export function useAdminLogin() {
  return useMutation({
    mutationFn: (payload: AdminLoginPayload) => adminLogin(payload),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["adminCategories"],
    queryFn: fetchCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
  });
}

export function useSubjectsList() {
  return useQuery({
    queryKey: ["adminSubjects"],
    queryFn: fetchSubjectsList,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSubjectPayload) => createSubject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubjects"] });
    },
  });
}

export function useChaptersList() {
  return useQuery({
    queryKey: ["adminChapters"],
    queryFn: fetchChaptersList,
  });
}

export function useCreateChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateChapterPayload) => createChapter(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminChapters"] });
    },
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLessonPayload) => createLesson(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["adminLessons"] });
      queryClient.invalidateQueries({ queryKey: ["subjectLessons"] });
    },
  });
}

export function useLessonsAdmin() {
  return useQuery({
    queryKey: ["adminLessons"],
    queryFn: fetchLessonsAdmin,
  });
}

export function useUploadVideo() {
  return useMutation<
    VideoResponse,
    Error,
    { formData: FormData; onProgress?: (progress: number) => void }
  >({
    mutationFn: ({ formData, onProgress }) => uploadVideo(formData, onProgress),
  });
}
