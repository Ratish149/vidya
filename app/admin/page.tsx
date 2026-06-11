"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  BookOpen,
  PlusCircle,
  Lock,
  Mail,
  CheckCircle,
  AlertCircle,
  FileText,
  FolderPlus,
  X,
  Video,
  ChevronRight,
  ChevronDown,
  Home,
  FileVideo,
  LogOut,
  LayoutDashboard,
  Plus,
  Play,
  Upload,
  Eye,
  Settings,
  Folder,
} from "lucide-react";
import {
  useAdminLogin,
  useCategories,
  useCreateCategory,
  useSubjectsList,
  useCreateSubject,
  useChaptersList,
  useCreateChapter,
  useCreateLesson,
  useLessonsAdmin,
  useCreateMuxUpload,
  useVideos,
} from "@/lib/hooks";
import MuxUploader from "@mux/mux-uploader-react";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tree Expansion States
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const [expandedSubjects, setExpandedSubjects] = useState<Record<number, boolean>>({});
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({});

  // Hierarchy Selection States (Current Node Selected)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  // Form states
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");

  const [subName, setSubName] = useState("");
  const [subDesc, setSubDesc] = useState("");
  const [subDifficulty, setSubDifficulty] = useState("beginner");

  const [chapName, setChapName] = useState("");
  const [chapDesc, setChapDesc] = useState("");
  const [chapOrder, setChapOrder] = useState(1);

  const [lesName, setLesName] = useState("");
  const [lesDesc, setLesDesc] = useState("");
  const [lesContent, setLesContent] = useState("");
  const [lesOrder, setLesOrder] = useState(1);

  // Video upload form states
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoOrder, setVideoOrder] = useState("1");
  const [uploadType, setUploadType] = useState<"standard" | "mux">("standard");
  const [isReel, setIsReel] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Success/Error messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Queries
  const { data: categories = [] } = useCategories();
  const { data: subjects = [] } = useSubjectsList();
  const { data: chapters = [] } = useChaptersList();
  const { data: lessons = [] } = useLessonsAdmin();
  const { data: videos = [], refetch: refetchVideos } = useVideos();

  // Mutations
  const loginMutation = useAdminLogin();
  const createCategoryMutation = useCreateCategory();
  const createSubjectMutation = useCreateSubject();
  const createChapterMutation = useCreateChapter();
  const createLessonMutation = useCreateLesson();
  const createMuxUploadMutation = useCreateMuxUpload();

  // Check login state on mount
  useEffect(() => {
    const adminSession = sessionStorage.getItem("admin_logged_in");
    if (adminSession === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    loginMutation.mutate(
      { username: email, password },
      {
        onSuccess: (data) => {
          if (data.success) {
            sessionStorage.setItem("admin_logged_in", "true");
            setIsLoggedIn(true);
          }
        },
        onError: (err: any) => {
          setLoginError(err.message || "Invalid admin credentials");
        },
      }
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_logged_in");
    setIsLoggedIn(false);
  };

  const clearAlerts = () => {
    setSuccessMsg("");
    setErrorMsg("");
  };

  // Form Submissions
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    if (!catName) return;

    createCategoryMutation.mutate(
      { name: catName, description: catDesc },
      {
        onSuccess: () => {
          setSuccessMsg(`Category "${catName}" created successfully!`);
          setCatName("");
          setCatDesc("");
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to create category");
        },
      }
    );
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    if (!selectedCategoryId) return;
    if (!subName) {
      setErrorMsg("Subject Name is required.");
      return;
    }

    createSubjectMutation.mutate(
      {
        name: subName,
        description: subDesc,
        course_sub_category: selectedCategoryId,
        difficulty_level: subDifficulty,
        is_published: true,
      },
      {
        onSuccess: () => {
          setSuccessMsg(`Subject "${subName}" created successfully!`);
          setSubName("");
          setSubDesc("");
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to create subject");
        },
      }
    );
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    if (!selectedSubjectId) return;
    if (!chapName) {
      setErrorMsg("Chapter Name is required.");
      return;
    }

    createChapterMutation.mutate(
      {
        name: chapName,
        description: chapDesc,
        subject: selectedSubjectId,
        order: chapOrder,
        is_published: true,
      },
      {
        onSuccess: () => {
          setSuccessMsg(`Chapter "${chapName}" created successfully!`);
          setChapName("");
          setChapDesc("");
          setChapOrder(1);
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to create chapter");
        },
      }
    );
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    if (!selectedChapterId) return;
    if (!lesName) {
      setErrorMsg("Lesson Name is required.");
      return;
    }

    createLessonMutation.mutate(
      {
        name: lesName,
        description: lesDesc,
        chapter: selectedChapterId,
        content: lesContent,
        order: lesOrder,
        is_published: true,
      },
      {
        onSuccess: () => {
          setSuccessMsg(`Lesson "${lesName}" created successfully!`);
          setLesName("");
          setLesDesc("");
          setLesContent("");
          setLesOrder(1);
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to create lesson");
        },
      }
    );
  };

  const getUploadUrl = async () => {
    if (!selectedLessonId) {
      throw new Error("Please select a lesson first.");
    }
    clearAlerts();

    try {
      const data = await createMuxUploadMutation.mutateAsync({
        lesson: selectedLessonId.toString(),
        title: videoTitle.trim() || "Untitled Reel",
        description: videoDescription,
        is_reel: isReel,
      });
      return data.upload_url;
    } catch (error: any) {
      throw new Error(error.message || "Failed to initiate Mux upload.");
    }
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLessonId) return;
    if (!file) {
      setErrorMsg("Please select a video file.");
      return;
    }
    if (!videoTitle.trim()) {
      setErrorMsg("Please provide a title.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    clearAlerts();

    const formData = new FormData();
    formData.append("lesson", selectedLessonId.toString());
    formData.append("title", videoTitle);
    formData.append("description", videoDescription);
    formData.append("order", videoOrder);
    formData.append("video_file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/api/reel/videos/upload/", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        setSuccessMsg(`Successfully uploaded "${videoTitle}" to the database!`);
        setVideoTitle("");
        setVideoDescription("");
        setFile(null);
        setUploadProgress(0);
        refetchVideos();
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          const errors = Object.entries(response)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
            .join(" | ");
          setErrorMsg(`Upload failed: ${errors}`);
        } catch {
          setErrorMsg("Upload failed. Please check backend server.");
        }
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setErrorMsg("Network error occurred during upload.");
    };

    xhr.send(formData);
  };

  // Helper toggle functions for tree explorer
  const toggleCategory = (id: number) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
    setSelectedCategoryId(id);
    setSelectedSubjectId(null);
    setSelectedChapterId(null);
    setSelectedLessonId(null);
  };

  const toggleSubject = (id: number, catId: number) => {
    setExpandedSubjects(prev => ({ ...prev, [id]: !prev[id] }));
    setSelectedCategoryId(catId);
    setSelectedSubjectId(id);
    setSelectedChapterId(null);
    setSelectedLessonId(null);
  };

  const toggleChapter = (id: number, subId: number, catId: number) => {
    setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
    setSelectedCategoryId(catId);
    setSelectedSubjectId(subId);
    setSelectedChapterId(id);
    setSelectedLessonId(null);
  };

  const selectLesson = (id: number, chapId: number, subId: number, catId: number) => {
    setSelectedCategoryId(catId);
    setSelectedSubjectId(subId);
    setSelectedChapterId(chapId);
    setSelectedLessonId(id);
  };

  // Helper selectors
  const activeCategory = categories.find((c) => c.id === selectedCategoryId);
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId);
  const activeChapter = chapters.find((ch) => ch.id === selectedChapterId);
  const activeLesson = lessons.find((l) => l.id === selectedLessonId);

  // Filter lists based on selection
  const filteredSubjects = subjects.filter((s) => s.course_sub_category === selectedCategoryId);
  const filteredChapters = chapters.filter((ch) => ch.subject === selectedSubjectId);
  const filteredLessons = lessons.filter((l) => l.chapter === selectedChapterId);
  const filteredVideos = videos.filter((v) => v.lesson === selectedLessonId);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight font-display">
              vid<span className="text-blue-500">ya</span> admin
            </h2>
            <p className="text-xs text-slate-400 mt-1 text-center">
              Sign in with your administrator credentials.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vidya.com"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-800 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-800 transition-all outline-none"
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-400 text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] cursor-pointer text-sm"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans">
      
      {/* Sleek Header Banner */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 flex-shrink-0 backdrop-blur-md bg-opacity-95">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold tracking-tight text-slate-950">
              vid<span className="text-blue-600">ya</span>
              <span className="ml-2 px-2 py-0.5 text-[9px] uppercase font-mono tracking-widest text-blue-650 bg-blue-50 rounded-md border border-blue-100 font-bold">
                console
              </span>
            </span>
          </div>

          {/* Breadcrumb Path Banner */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/70 px-3.5 py-1.5 rounded-xl border border-slate-200/60 max-w-lg lg:max-w-2xl truncate shadow-inner">
            <span className="font-bold text-slate-400 uppercase tracking-wide text-[9px] mr-1">Path:</span>
            <span className={`transition-colors cursor-pointer hover:text-blue-600 ${selectedCategoryId ? "text-slate-800 font-semibold" : "text-slate-450"}`}
                  onClick={() => { setSelectedCategoryId(null); setSelectedSubjectId(null); setSelectedChapterId(null); setSelectedLessonId(null); }}>
              Root
            </span>
            {selectedCategoryId && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-350" />
                <span className={`transition-colors cursor-pointer hover:text-blue-600 ${selectedSubjectId ? "text-slate-850 font-medium" : "text-blue-600 font-bold"}`}
                      onClick={() => { setSelectedSubjectId(null); setSelectedChapterId(null); setSelectedLessonId(null); }}>
                  {activeCategory?.name}
                </span>
              </>
            )}
            {selectedSubjectId && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-350" />
                <span className={`transition-colors cursor-pointer hover:text-blue-600 ${selectedChapterId ? "text-slate-850 font-medium" : "text-blue-600 font-bold"}`}
                      onClick={() => { setSelectedChapterId(null); setSelectedLessonId(null); }}>
                  {activeSubject?.name}
                </span>
              </>
            )}
            {selectedChapterId && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-350" />
                <span className={`transition-colors cursor-pointer hover:text-blue-600 ${selectedLessonId ? "text-slate-850 font-medium" : "text-blue-600 font-bold"}`}
                      onClick={() => { setSelectedLessonId(null); }}>
                  {activeChapter?.name}
                </span>
              </>
            )}
            {selectedLessonId && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-355" />
                <span className="text-blue-650 font-extrabold">
                  {activeLesson?.name}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden max-w-[1600px] w-full mx-auto">
        
        {/* LEFT PANEL: Course Explorer Tree (Darker Panel) */}
        <aside className="w-72 border-r border-slate-200 bg-[#1e293b] text-slate-300 flex flex-col flex-shrink-0 overflow-y-auto p-5 scrollbar-thin">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" /> Course Tree
            </h2>
            <button
              onClick={() => {
                setSelectedCategoryId(null);
                setSelectedSubjectId(null);
                setSelectedChapterId(null);
                setSelectedLessonId(null);
                clearAlerts();
              }}
              className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/60 shadow-sm"
            >
              <LayoutDashboard className="w-3 h-3" /> Dashboard
            </button>
          </div>

          {/* Hierarchy Tree Explorer */}
          <div className="space-y-1">
            {categories.map((cat) => {
              const isExpanded = !!expandedCategories[cat.id];
              const isSelected = selectedCategoryId === cat.id && !selectedSubjectId;
              const catSubjects = subjects.filter(s => s.course_sub_category === cat.id);

              return (
                <div key={cat.id} className="space-y-0.5">
                  {/* Category Node */}
                  <div
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all border group ${
                      isSelected
                        ? "bg-blue-600/10 text-blue-400 font-bold border-blue-500/20"
                        : "hover:bg-slate-800 text-slate-300 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-blue-400" : "text-slate-400"}`} />
                      <span className="text-sm truncate">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      )}
                    </div>
                  </div>

                  {/* Subject List (Expanded Category) */}
                  {isExpanded && (
                    <div className="pl-3.5 border-l border-slate-700 ml-4 space-y-0.5 py-0.5">
                      {catSubjects.map((sub) => {
                        const isSubExpanded = !!expandedSubjects[sub.id];
                        const isSubSelected = selectedSubjectId === sub.id && !selectedChapterId;
                        const subChapters = chapters.filter(ch => ch.subject === sub.id);

                        return (
                          <div key={sub.id} className="space-y-0.5">
                            {/* Subject Node */}
                            <div
                              onClick={() => toggleSubject(sub.id, cat.id)}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-all border ${
                                isSubSelected
                                  ? "bg-slate-800 text-white font-bold border-slate-750"
                                  : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <BookOpen className={`w-3 h-3 shrink-0 ${isSubSelected ? "text-slate-250" : "text-slate-500"}`} />
                                <span className="text-[13px] truncate">{sub.name}</span>
                              </div>
                              {isSubExpanded ? (
                                <ChevronDown className="w-3 h-3 opacity-60" />
                              ) : (
                                <ChevronRight className="w-3 h-3 opacity-60" />
                              )}
                            </div>

                            {/* Chapter List (Expanded Subject) */}
                            {isSubExpanded && (
                              <div className="pl-3 border-l border-slate-800 ml-3.5 space-y-0.5 py-0.5">
                                {subChapters.map((chap) => {
                                  const isChapExpanded = !!expandedChapters[chap.id];
                                  const isChapSelected = selectedChapterId === chap.id && !selectedLessonId;
                                  const chapLessons = lessons.filter(l => l.chapter === chap.id);

                                  return (
                                    <div key={chap.id} className="space-y-0.5">
                                      {/* Chapter Node */}
                                      <div
                                        onClick={() => toggleChapter(chap.id, sub.id, cat.id)}
                                        className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-all ${
                                          isChapSelected
                                            ? "bg-slate-800/60 text-blue-400 font-bold"
                                            : "hover:bg-slate-800/20 text-slate-450 hover:text-slate-300"
                                        }`}
                                      >
                                        <span className="text-xs truncate">{chap.name}</span>
                                        {isChapExpanded ? (
                                          <ChevronDown className="w-2.5 h-2.5 opacity-55" />
                                        ) : (
                                          <ChevronRight className="w-2.5 h-2.5 opacity-55" />
                                        )}
                                      </div>

                                      {/* Lesson List (Expanded Chapter) */}
                                      {isChapExpanded && (
                                        <div className="pl-2.5 border-l border-slate-700/50 ml-2 space-y-0.5 py-0.5">
                                          {chapLessons.map((les) => {
                                            const isLesSelected = selectedLessonId === les.id;
                                            return (
                                              <div
                                                key={les.id}
                                                onClick={() => selectLesson(les.id, chap.id, sub.id, cat.id)}
                                                className={`px-2 py-1 text-xs cursor-pointer transition-all truncate rounded ${
                                                  isLesSelected
                                                    ? "text-blue-400 font-bold bg-blue-500/10 border border-blue-500/15"
                                                    : "text-slate-500 hover:text-slate-350"
                                                }`}
                                              >
                                                {les.name}
                                              </div>
                                            );
                                          })}
                                          {chapLessons.length === 0 && (
                                            <div className="text-[11px] text-slate-550 italic pl-2 py-0.5">No lessons</div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                                {subChapters.length === 0 && (
                                  <div className="text-[11px] text-slate-550 italic pl-2 py-0.5">No chapters</div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {catSubjects.length === 0 && (
                        <div className="text-[11px] text-slate-550 italic pl-2 py-0.5">No subjects</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {categories.length === 0 && (
              <div className="text-center text-slate-500 italic py-10 text-xs">
                No categories found.
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PANEL: Workspace View (Clean Workspace) */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50 text-slate-800">
          
          {/* Action Notifications */}
          {successMsg && (
            <div className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 text-xs font-semibold animate-fadeIn shadow-sm">
              <CheckCircle className="w-4.5 h-4.5 flex-shrink-0 text-emerald-600" />
              <div className="flex-1">{successMsg}</div>
              <button onClick={clearAlerts} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-xs font-semibold animate-fadeIn shadow-sm">
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 text-rose-600" />
              <div className="flex-1">{errorMsg}</div>
              <button onClick={clearAlerts} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* VIEW 1: Dashboard Home */}
          {!selectedCategoryId && (
            <div className="space-y-8">
              {/* Stat layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "Categories", value: categories.length, color: "text-blue-600 bg-blue-50", icon: FolderPlus },
                  { label: "Subjects", value: subjects.length, color: "text-indigo-600 bg-indigo-50", icon: Layers },
                  { label: "Chapters", value: chapters.length, color: "text-purple-600 bg-purple-50", icon: BookOpen },
                  { label: "Videos / Reels", value: videos.length, color: "text-emerald-600 bg-emerald-50", icon: FileVideo },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex justify-between items-center group">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">{stat.label}</p>
                        <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stat.value}</h3>
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${stat.color}`}>Active</span>
                          <span className="text-[9px] text-slate-400">Production</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-slate-100/50 transition-all">
                        <Icon className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                  <form onSubmit={handleCreateCategory} className="space-y-5">
                    <h2 className="text-md font-bold text-slate-900 flex items-center gap-2 font-display">
                      <FolderPlus className="w-5 h-5 text-blue-600" /> Add Sub-Category
                    </h2>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                        Category Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Grade 7, High School"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm transition-all text-slate-800 placeholder-slate-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Brief summary..."
                        value={catDesc}
                        onChange={(e) => setCatDesc(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm transition-all text-slate-800 placeholder-slate-400 resize-none outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={createCategoryMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] cursor-pointer text-xs w-full flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col">
                  <h3 className="text-md font-bold text-slate-900 font-display flex items-center gap-2 mb-1">
                    <Folder className="w-5 h-5 text-amber-500" /> Root Categories
                  </h3>
                  <p className="text-xs text-slate-400 mb-5">Click a category in list or tree explorer to manage its subjects.</p>
                  
                  <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1 flex-1 scrollbar-thin">
                    {categories.map((cat) => {
                      const subjectsCount = subjects.filter((s) => s.course_sub_category === cat.id).length;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id)}
                          className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 transition-all cursor-pointer flex items-center justify-between group hover:scale-[1.01]"
                        >
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                              {cat.name}
                            </h4>
                            <p className="text-xs text-slate-450 mt-1 truncate">{cat.description || "No description provided."}</p>
                          </div>
                          <div className="flex items-center gap-2.5 ml-4 shrink-0">
                            <span className="text-[9px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                              {subjectsCount} {subjectsCount === 1 ? "Subject" : "Subjects"}
                            </span>
                            <span className="text-[9px] font-mono bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">ID: {cat.id}</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                    {categories.length === 0 && (
                      <div className="text-center text-slate-400 italic py-12 text-xs">No categories created yet. Add one on the left.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Category Selected */}
          {selectedCategoryId && !selectedSubjectId && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                <form onSubmit={handleCreateSubject} className="space-y-5">
                  <h2 className="text-md font-bold text-slate-900 flex items-center gap-2 font-display">
                    <PlusCircle className="w-5 h-5 text-blue-600" /> Add Subject to <span className="text-blue-600">"{activeCategory?.name}"</span>
                  </h2>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Physics, Chemistry"
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm transition-all text-slate-800 placeholder-slate-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={subDifficulty}
                      onChange={(e) => setSubDifficulty(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 bg-white transition-all outline-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Subject summary..."
                      value={subDesc}
                      onChange={(e) => setSubDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm transition-all text-slate-800 placeholder-slate-400 resize-none outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createSubjectMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] cursor-pointer text-xs w-full flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    {createSubjectMutation.isPending ? "Creating..." : "Create Subject"}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col">
                <h3 className="text-md font-bold text-slate-900 font-display flex items-center gap-2 mb-1">
                  <Layers className="w-5 h-5 text-indigo-500" /> Subjects in {activeCategory?.name}
                </h3>
                <p className="text-xs text-slate-400 mb-5">Click subject to manage its chapters.</p>
                
                <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1 scrollbar-thin flex-1">
                  {filteredSubjects.map((sub) => {
                    const chaptersCount = chapters.filter((c) => c.subject === sub.id).length;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => toggleSubject(sub.id, selectedCategoryId)}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl p-4 transition-all cursor-pointer flex items-center justify-between group hover:scale-[1.01]"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                              {sub.name}
                            </h4>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase ${
                              sub.difficulty_level === "advanced" ? "bg-red-50 text-red-650" :
                              sub.difficulty_level === "intermediate" ? "bg-amber-50 text-amber-650" :
                              "bg-emerald-50 text-emerald-650"
                            }`}>
                              {sub.difficulty_level}
                            </span>
                          </div>
                          {sub.description && <p className="text-xs text-slate-450 mt-1 truncate">{sub.description}</p>}
                        </div>
                        <div className="flex items-center gap-2.5 ml-4 shrink-0">
                          <span className="text-[9px] font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                            {chaptersCount} {chaptersCount === 1 ? "Chapter" : "Chapters"}
                          </span>
                          <span className="text-[9px] font-mono bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">ID: {sub.id}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                  {filteredSubjects.length === 0 && (
                    <div className="text-center text-slate-400 italic py-12 text-xs">No subjects created yet. Add a subject on the left.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: Subject Selected */}
          {selectedSubjectId && !selectedChapterId && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                <form onSubmit={handleCreateChapter} className="space-y-5">
                  <h2 className="text-md font-bold text-slate-900 flex items-center gap-2 font-display">
                    <PlusCircle className="w-5 h-5 text-blue-600" /> Add Chapter to <span className="text-blue-600">"{activeSubject?.name}"</span>
                  </h2>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                      Chapter Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Chapter 1: Kinetics"
                      value={chapName}
                      onChange={(e) => setChapName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm transition-all text-slate-800 placeholder-slate-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                      Chapter Order
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={chapOrder}
                      onChange={(e) => setChapOrder(parseInt(e.target.value) || 1)}
                      className="w-24 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-850 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Chapter summary..."
                      value={chapDesc}
                      onChange={(e) => setChapDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm transition-all text-slate-800 placeholder-slate-400 resize-none outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createChapterMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] cursor-pointer text-xs w-full flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    {createChapterMutation.isPending ? "Creating..." : "Create Chapter"}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col">
                <h3 className="text-md font-bold text-slate-900 font-display flex items-center gap-2 mb-1">
                  <BookOpen className="w-5 h-5 text-purple-500" /> Chapters in {activeSubject?.name}
                </h3>
                <p className="text-xs text-slate-400 mb-5">Click chapter to manage its lessons.</p>
                
                <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1 scrollbar-thin flex-1">
                  {filteredChapters.map((chap) => {
                    const lessonsCount = lessons.filter((l) => l.chapter === chap.id).length;
                    return (
                      <div
                        key={chap.id}
                        onClick={() => toggleChapter(chap.id, selectedSubjectId, selectedCategoryId!)}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl p-4 transition-all cursor-pointer flex items-center justify-between group hover:scale-[1.01]"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-850 text-sm group-hover:text-blue-600 transition-colors">
                            {chap.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-semibold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">Order: {chap.order}</span>
                            {chap.description && <span className="text-xs text-slate-400 truncate max-w-xs">{chap.description}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 ml-4 shrink-0">
                          <span className="text-[9px] font-semibold bg-purple-50 text-purple-650 px-2 py-0.5 rounded-full">
                            {lessonsCount} {lessonsCount === 1 ? "Lesson" : "Lessons"}
                          </span>
                          <span className="text-[9px] font-mono bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">ID: {chap.id}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                  {filteredChapters.length === 0 && (
                    <div className="text-center text-slate-400 italic py-12 text-xs">No chapters created yet. Add one on the left.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: Chapter Selected */}
          {selectedChapterId && !selectedLessonId && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                <form onSubmit={handleCreateLesson} className="space-y-5">
                  <h2 className="text-md font-bold text-slate-900 flex items-center gap-2 font-display">
                    <PlusCircle className="w-5 h-5 text-blue-600" /> Add Lesson to <span className="text-blue-600">"{activeChapter?.name}"</span>
                  </h2>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                      Lesson Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Calculating Velocity"
                      value={lesName}
                      onChange={(e) => setLesName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm transition-all text-slate-800 placeholder-slate-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                      Lesson Order
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={lesOrder}
                      onChange={(e) => setLesOrder(parseInt(e.target.value) || 1)}
                      className="w-24 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-850 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Lesson summary..."
                      value={lesDesc}
                      onChange={(e) => setLesDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm transition-all text-slate-800 placeholder-slate-400 resize-none outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                      Content / Notes
                    </label>
                    <textarea
                      rows={4}
                      placeholder="equations or detailed notes..."
                      value={lesContent}
                      onChange={(e) => setLesContent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm transition-all text-slate-800 font-mono resize-none outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createLessonMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] cursor-pointer text-xs w-full flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    {createLessonMutation.isPending ? "Creating..." : "Create Lesson"}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col">
                <h3 className="text-md font-bold text-slate-900 font-display flex items-center gap-2 mb-1">
                  <FileText className="w-5 h-5 text-teal-500" /> Lessons in {activeChapter?.name}
                </h3>
                <p className="text-xs text-slate-400 mb-5">Click lesson to publish video media assets.</p>
                
                <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1 scrollbar-thin flex-1">
                  {filteredLessons.map((les) => {
                    const videoCount = videos.filter((v) => v.lesson === les.id).length;
                    return (
                      <div
                        key={les.id}
                        onClick={() => selectLesson(les.id, selectedChapterId, selectedSubjectId!, selectedCategoryId!)}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl p-4 transition-all cursor-pointer flex items-center justify-between group hover:scale-[1.01]"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-850 text-sm group-hover:text-blue-600 transition-colors">
                            {les.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-semibold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">Order: {les.order}</span>
                            {les.description && <span className="text-xs text-slate-400 truncate max-w-xs">{les.description}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 ml-4 shrink-0">
                          <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                            {videoCount} {videoCount === 1 ? "Video" : "Videos"}
                          </span>
                          <span className="text-[9px] font-mono bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">ID: {les.id}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                  {filteredLessons.length === 0 && (
                    <div className="text-center text-slate-400 italic py-12 text-xs">No lessons created yet. Add a lesson on the left.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: Lesson Selected */}
          {selectedLessonId && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.015)] space-y-5">
                  <div>
                    <h2 className="text-md font-bold text-slate-900 flex items-center gap-2 font-display">
                      <Upload className="w-5 h-5 text-blue-600" /> Upload Video
                    </h2>
                    <p className="text-xs text-slate-450 mt-1">
                      Standard local file uploading or Direct Mux asset references.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                        Upload Method
                      </label>
                      <select
                        value={uploadType}
                        onChange={(e) => {
                          setUploadType(e.target.value as "standard" | "mux");
                          clearAlerts();
                        }}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all outline-none"
                      >
                        <option value="standard">Standard Database Video (Local File)</option>
                        <option value="mux">Mux Asset Reference (Direct Mux Uploader)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                        Video Title
                      </label>
                      <input
                        type="text"
                        required
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="e.g. Speed & Acceleration"
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 placeholder-slate-400 transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                        Description (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="Video description..."
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-850 placeholder-slate-400 resize-none transition-all outline-none"
                      />
                    </div>

                    {uploadType === "mux" ? (
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="is-reel-checkbox"
                            checked={isReel}
                            onChange={(e) => setIsReel(e.target.checked)}
                            className="w-4.5 h-4.5 text-blue-600 bg-white border-slate-300 focus:ring-blue-500 rounded cursor-pointer"
                          />
                          <label htmlFor="is-reel-checkbox" className="text-xs font-semibold text-slate-650 cursor-pointer">
                            Is this a vertical reel (9:16 aspect ratio)?
                          </label>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Upload File</label>
                          <div className="p-4 bg-slate-55 border border-slate-200 rounded-2xl shadow-inner">
                            <MuxUploader
                              endpoint={getUploadUrl}
                              onSuccess={() => {
                                setSuccessMsg(`Successfully uploaded "${videoTitle || "video"}" directly to Mux!`);
                                setVideoTitle("");
                                setVideoDescription("");
                                refetchVideos();
                              }}
                              onError={(error: any) => {
                                setErrorMsg(error.detail?.message || "Direct upload to Mux failed.");
                              }}
                              className="w-full text-slate-600 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleStandardSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                            Sort / Display Order
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={videoOrder}
                            onChange={(e) => setVideoOrder(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Select Video File</label>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none text-slate-600"
                          />
                          {file && (
                            <span className="text-xs text-slate-450 block mt-1">
                              File Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          )}
                        </div>

                        {isUploading && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold text-slate-500">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-150"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isUploading}
                          className={`w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all duration-300 ${
                            isUploading
                              ? "bg-slate-400 cursor-not-allowed shadow-none"
                              : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-[0.98]"
                          }`}
                        >
                          <Video className="w-4.5 h-4.5" />
                          Publish Video File
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col">
                <h3 className="text-md font-bold text-slate-900 font-display flex items-center gap-2 mb-1">
                  <FileVideo className="w-5 h-5 text-blue-600" /> Videos & Reels in {activeLesson?.name}
                </h3>
                <p className="text-xs text-slate-450 mb-5">List of all video assets mapped to this lesson.</p>
                
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin flex-1">
                  {filteredVideos.map((vid) => {
                    const isMux = !!vid.playback_id;
                    return (
                      <div key={vid.id} className="bg-slate-50 hover:bg-slate-100/60 border border-slate-200/80 rounded-2xl p-4 transition-all">
                        <div className="flex gap-4">
                          {isMux && vid.playback_id ? (
                            <img
                              src={`https://image.mux.com/${vid.playback_id}/thumbnail.jpg?width=160&height=90&fit_mode=preserve`}
                              alt={vid.title}
                              className="w-20 h-12 rounded-lg object-cover bg-slate-200 shrink-0 shadow-sm border border-slate-250"
                            />
                          ) : (
                            <div className="w-20 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                              <Video className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-bold text-slate-800 text-xs truncate">{vid.title}</h4>
                              <span className="text-[9px] font-mono bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded shrink-0">ID: {vid.id}</span>
                            </div>
                            <p className="text-[11px] text-slate-450 truncate mt-1">{vid.description || "No description."}</p>
                            <div className="flex items-center gap-4 mt-2.5">
                              <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                                isMux 
                                  ? "bg-purple-50 text-purple-650 border-purple-150" 
                                  : "bg-blue-50 text-blue-650 border-blue-150"
                              }`}>
                                {isMux ? "Mux Video" : "Local File"}
                              </span>
                              {vid.video_duration && (
                                <span className="text-[10px] font-mono text-slate-400">
                                  Duration: {Math.floor(vid.video_duration / 60)}m {vid.video_duration % 60}s
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredVideos.length === 0 && (
                    <div className="text-center text-slate-400 italic py-12 text-xs">No videos. Upload one above!</div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
