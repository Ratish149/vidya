"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle, Settings, Video } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import MuxUploader from "@mux/mux-uploader-react";
import { useLessons, useCreateMuxUpload } from "@/lib/hooks";

export default function UploadPage() {
  const { data: lessons = [], isLoading: loadingLessons } = useLessons();
  const createMuxUploadMutation = useCreateMuxUpload();

  // Form states
  const [lessonId, setLessonId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("1");
  const [uploadType, setUploadType] = useState<"standard" | "mux">("standard");
  const [isReel, setIsReel] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Upload progress/status states for standard upload
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Set initial default lessonId once lessons are fetched
  useEffect(() => {
    if (lessons.length > 0 && !lessonId) {
      setLessonId(lessons[0].id.toString());
    }
  }, [lessons, lessonId]);

  // Async endpoint fetcher for MuxUploader
  const getUploadUrl = async () => {
    if (!lessonId) {
      throw new Error("Please select a lesson first.");
    }
    
    setStatusMessage(null);

    try {
      const data = await createMuxUploadMutation.mutateAsync({
        lesson: lessonId,
        title: title.trim() || "Untitled Asset",
        description: description,
        is_reel: isReel,
      });
      return data.upload_url;
    } catch (error: any) {
      throw new Error(error.message || "Failed to initiate Mux upload.");
    }
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonId) {
      setStatusMessage({ type: "error", text: "Please select a lesson." });
      return;
    }
    if (!file) {
      setStatusMessage({ type: "error", text: "Please select a video file." });
      return;
    }
    if (!title.trim()) {
      setStatusMessage({ type: "error", text: "Please provide a title." });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("lesson", lessonId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("order", order);
    formData.append("video_file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/api/reel/videos/upload/", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        setStatusMessage({
          type: "success",
          text: `Successfully uploaded "${title}" to the database!`,
        });
        setTitle("");
        setDescription("");
        setFile(null);
        setProgress(0);
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          const errors = Object.entries(response)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
            .join(" | ");
          setStatusMessage({ type: "error", text: `Upload failed: ${errors}` });
        } catch {
          setStatusMessage({ type: "error", text: "Upload failed. Please check backend server." });
        }
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setStatusMessage({ type: "error", text: "Network error occurred during upload." });
    };

    xhr.send(formData);
  };


  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans pb-24">
      <Navbar streak={14} />

      <main className="max-w-3xl mx-auto px-6 pt-10">
        {/* Navigation & Title */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
            id="back-to-home-link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Settings className="w-3 h-3 animate-spin" /> Admin Console
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-display">
            Upload Learning Video
          </h1>
          <p className="text-gray-500 mt-1">
            Publish high-quality educational videos or Mux streaming assets directly to the Vidya library database.
          </p>
        </div>

        {/* Form Panel */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-xl shadow-slate-100/50 p-8">
          {statusMessage && (
            <div
              className={`mb-6 p-4 rounded-2xl flex items-start gap-3 border ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                  : "bg-rose-50 border-rose-100 text-rose-800"
              }`}
              id="status-feedback-alert"
            >
              {statusMessage.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="text-sm font-medium">{statusMessage.text}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Lesson */}
              <div className="space-y-2">
                <label htmlFor="lesson-select" className="text-sm font-semibold text-gray-700 block">
                  Associated Lesson
                </label>
                {loadingLessons ? (
                  <div className="h-11 bg-slate-100 animate-pulse rounded-xl" />
                ) : (
                  <select
                    id="lesson-select"
                    value={lessonId}
                    onChange={(e) => setLessonId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white"
                  >
                    {lessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.subject_name} • {lesson.chapter_name} • {lesson.name}
                      </option>
                    ))}
                    {lessons.length === 0 && <option value="">No lessons available</option>}
                  </select>
                )}
              </div>

              {/* Upload Destination Type */}
              <div className="space-y-2">
                <label htmlFor="type-select" className="text-sm font-semibold text-gray-700 block">
                  Storage Destination / Type
                </label>
                <select
                  id="type-select"
                  value={uploadType}
                  onChange={(e) => {
                    setUploadType(e.target.value as "standard" | "mux");
                    setStatusMessage(null);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white"
                >
                  <option value="standard">Standard Database Video (Local File)</option>
                  <option value="mux">Mux Asset Reference (Official Mux Uploader)</option>
                </select>
              </div>
            </div>

            {/* Video Title & Description */}
            <div className="space-y-2">
              <label htmlFor="video-title" className="text-sm font-semibold text-gray-700 block">
                Video Title
              </label>
              <input
                type="text"
                id="video-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to Quadratic Equations"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="video-description" className="text-sm font-semibold text-gray-700 block">
                Description (Optional)
              </label>
              <textarea
                id="video-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a summary of what students will learn in this video..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
              />
            </div>

            {/* Upload Type Specific Forms */}
            {uploadType === "mux" ? (
              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is-reel-checkbox"
                    checked={isReel}
                    onChange={(e) => setIsReel(e.target.checked)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="is-reel-checkbox" className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Is this video a vertical reel (9:16 aspect ratio)?
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">Upload File via Mux Uploader</label>
                  <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-2xl shadow-inner">
                    <MuxUploader
                      endpoint={getUploadUrl}
                      onSuccess={() => {
                        setStatusMessage({
                          type: "success",
                          text: `Successfully uploaded "${title || "video"}" directly to Mux!`,
                        });
                        setTitle("");
                        setDescription("");
                      }}
                      onError={(error: any) => {
                        setStatusMessage({
                          type: "error",
                          text: error.detail?.message || "Direct upload to Mux failed.",
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleStandardSubmit} className="space-y-6 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="video-order" className="text-sm font-semibold text-gray-700 block">
                      Sort/Display Order
                    </label>
                    <input
                      type="number"
                      id="video-order"
                      min="1"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* File picker */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">Select Video File</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm bg-white"
                  />
                  {file && (
                    <span className="text-xs text-gray-400 block mt-1">
                      File Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Uploading to local server...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-150"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all duration-300 ${
                    isUploading
                      ? "bg-slate-400 cursor-not-allowed shadow-none"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/20"
                  }`}
                >
                  <Video className="w-5 h-5" />
                  Publish Video to Local Database
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
