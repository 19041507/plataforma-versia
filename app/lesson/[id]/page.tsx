'use client';

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getCourseByLessonId, getFlatLessons } from "@/lib/courseCatalog";
import { UserProfileMini } from "@/components/UserProfileMini";
import { LogoutButton } from "@/components/LogoutButton";
import { 
  Play,
  Pause,
  Volume2,
  Maximize,
  Settings,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  X,
  Menu,
  Lock,
  Trophy,
  Sparkles,
  Bell,
  BellOff
} from "lucide-react";
import { useState, useRef, useEffect, type MouseEvent, useMemo, useCallback } from "react";

export default function LessonPage() {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(900); // will be updated from video metadata
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [resumeTime, setResumeTime] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showUnmarkModal, setShowUnmarkModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "materials">("content");
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<{ name: string, progress: number } | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  
  const progress = totalTime ? (currentTime / totalTime) * 100 : 0;

  const lessonId = Number(id);
  const courseData = getCourseByLessonId(lessonId) ?? getCourseByLessonId(1)!;
  const progressKey = `versia_progress_${courseData.id}`;
  const flatCourseLessons = useMemo(() => getFlatLessons(courseData), [courseData]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    setToast({
      message: newState ? "Notificações ativadas!" : "Notificações desativadas!",
      type: 'info'
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem(progressKey);
    if (saved) setCompletedIds(JSON.parse(saved));
    else setCompletedIds(flatCourseLessons.filter((lesson) => lesson.completed).map((lesson) => lesson.id));
  }, [progressKey, flatCourseLessons]);

  useEffect(() => {
    setVideoReady(false);
    setVideoFailed(false);
    setIsPlaying(false);
    setCurrentTime(0);
    const savedTime = localStorage.getItem(`versia_lesson_time_${lessonId}`);
    if (savedTime && parseFloat(savedTime) > 5) {
      setResumeTime(parseFloat(savedTime));
    } else {
      setResumeTime(null);
    }
  }, [lessonId]);

  const toggleLessonCompletion = (targetId: number, forceComplete = false) => {
    const isCompleted = completedIds.includes(targetId);
    
    if (isCompleted && !forceComplete) {
      setShowUnmarkModal(true);
      return;
    } else if (!isCompleted) {
      const newCompleted = [...completedIds, targetId];
      setCompletedIds(newCompleted);
      localStorage.setItem(progressKey, JSON.stringify(newCompleted));
      localStorage.removeItem(`versia_lesson_time_${targetId}`);
      const isLast = targetId === lessons[lessons.length - 1].id;
      if (isLast) setShowCelebration(true);
    }
  };

  const confirmUnmark = () => {
    const newCompleted = completedIds.filter(id => id !== lessonId);
    setCompletedIds(newCompleted);
    localStorage.setItem(progressKey, JSON.stringify(newCompleted));
    setShowUnmarkModal(false);
  };

  const lessons = useMemo(() => flatCourseLessons.map((lesson, index) => {
    const previousLesson = flatCourseLessons[index - 1];
    return {
      ...lesson,
      completed: completedIds.includes(lesson.id),
      current: lesson.id === lessonId,
      locked: index > 0 && previousLesson ? !completedIds.includes(previousLesson.id) : false,
    };
  }), [completedIds, flatCourseLessons, lessonId]);

  const currentLesson = lessons.find((l) => l.id === lessonId) || lessons[0];
  const currentModule = courseData.modules.find((module) => module.lessons.some((lesson) => lesson.id === currentLesson.id));
  const isLocked = currentLesson.locked;

  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const prevLesson = lessons[currentIndex - 1];
  const nextLesson = lessons[currentIndex + 1];

  const materials = [
    { name: "Slides da Aula.pdf", size: "2.5 MB" },
    { name: "Exercícios Práticos.pdf", size: "1.2 MB" },
    { name: "Material Complementar.pdf", size: "3.8 MB" },
  ];

  const handleDownload = useCallback((fileName: string) => {
    if (downloadingFile) return;
    
    setDownloadingFile({ name: fileName, progress: 0 });
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setDownloadingFile(prev => prev ? { ...prev, progress: p } : null);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDownloadingFile(null);
          setToast({ message: `Download de "${fileName}" concluído!`, type: 'success' });
        }, 500);
      }
    }, 300);
  }, [downloadingFile]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => {
      const time = Math.floor(v.currentTime);
      setCurrentTime(time);
      // Persiste o tempo atual no localStorage
      localStorage.setItem(`versia_lesson_time_${lessonId}`, time.toString());
    };

    const onMeta = () => {
      setTotalTime(Math.floor(v.duration || 0));
    };

    const onEnded = () => {
      toggleLessonCompletion(lessonId, true);
      localStorage.removeItem(`versia_lesson_time_${lessonId}`);
      setIsPlaying(false);

      // Avanço automático após 2.5 segundos se houver uma próxima aula
      if (nextLesson && !nextLesson.locked) {
        setTimeout(() => {
          router.push(`/lesson/${nextLesson.id}`);
        }, 2500);
      }
    };

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('ended', onEnded);

    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('ended', onEnded);
    };
  }, [currentLesson.videoUrl, lessonId]); // Re-anexa os eventos sempre que o vídeo ou aula mudar

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isPlaying && !isLocked) {
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Erro ao reproduzir vídeo:", error);
          }
        });
      }
    } else if (!isPlaying || isLocked) {
      v.pause();
    }
  }, [isPlaying, currentLesson.videoUrl, isLocked]);

  const seekVideo = (event: MouseEvent<HTMLDivElement>) => {
    const bar = event.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newTime = (clickX / rect.width) * totalTime;
    const v = videoRef.current;
    if (v) {
      v.currentTime = newTime;
      setCurrentTime(Math.floor(newTime));
    }
  };

  const handleResume = () => {
    const v = videoRef.current;
    if (v && resumeTime) {
      v.currentTime = resumeTime;
      setCurrentTime(Math.floor(resumeTime));
      setIsPlaying(true);
      setResumeTime(null);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Erro ao tentar ativar modo tela cheia: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Top Bar */}
      <header className="bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
          <Link href={`/course/${courseData.id}`} className="text-white/60 hover:text-white transition-all flex-shrink-0">
            <X className="w-5 md:w-6 h-5 md:h-6" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-white font-semibold text-sm md:text-lg truncate">{currentLesson.title}</h1>
            <p className="text-white/60 text-xs md:text-sm truncate">{courseData.title} • {currentModule?.title ?? "Módulo"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-2 md:gap-4 pr-2 md:pr-4 border-r border-white/10">
            <UserProfileMini />
            <LogoutButton variant="header" />
          </div>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-white/60 hover:text-white transition-all flex-shrink-0"
          >
            <Menu className="w-5 md:w-6 h-5 md:h-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col bg-[#050505]">
          {/* Video Player */}
          <div className="flex-1 flex items-center justify-center relative group">
            {/* Video Thumbnail/Player */}
            <div 
              ref={containerRef}
              className="relative w-full h-full max-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-[#08111f] via-[#11112b] to-[#050505] overflow-hidden"
            >
              <img
                src={currentLesson.poster || courseData.thumbnail}
                alt="Plano de fundo da aula"
                className="absolute inset-0 w-full h-full object-cover opacity-55 blur-[2px] scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-[#11112b]/35 to-[#7A2CFF]/25"></div>
              {isLocked ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                    <Lock className="w-10 h-10 text-white/40" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Aula Bloqueada</h2>
                  <p className="text-white/60 max-w-sm">Você precisa concluir a aula anterior para liberar este conteúdo.</p>
                </div>
              ) : currentLesson.videoUrl && !videoFailed ? (
                  <video
                    key={currentLesson.videoUrl}
                    ref={videoRef}
                    poster={currentLesson.poster || courseData.thumbnail}
                    className={`relative z-[1] w-full h-full max-w-full max-h-full object-contain transition-opacity duration-500 ${videoReady && isPlaying ? 'opacity-100' : 'opacity-0'}`}
                    playsInline
                    preload="metadata"
                    onCanPlay={() => setVideoReady(true)}
                    onError={() => {
                      setVideoFailed(true);
                      setIsPlaying(false);
                    }}
                  >
                    <source src={currentLesson.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <div className="relative z-[1] w-[min(92%,980px)] aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5">
                    <img 
                      src={currentLesson.poster || courseData.thumbnail}
                      alt="Aula demonstrativa"
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-[#11112b]/30 to-[#7A2CFF]/30"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <Sparkles className="w-10 h-10 text-[#63E3FF] mb-3" />
                      <p className="text-white/70 text-sm mb-2">Player visual da Versia</p>
                      <h2 className="text-white text-2xl md:text-4xl font-bold max-w-2xl">{currentLesson.title}</h2>
                    </div>
                  </div>
                )}
              
              {/* Play Button Overlay */}
              {(!isPlaying || !videoReady || videoFailed) && !isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black/10 via-transparent to-[#7A2CFF]/15 gap-4 p-6 text-center z-10">
                  <div className="flex flex-col items-center gap-6">
                    <button
                      onClick={() => {
                        setIsPlaying(true);
                        setResumeTime(null);
                      }}
                      className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/30 flex items-center justify-center hover:scale-110 transition-all group shadow-2xl shadow-[#63E3FF]/20"
                    >
                      <Play className="w-10 h-10 text-white ml-1" />
                    </button>
                    
                    <div>
                      <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-xl">{currentLesson.title}</h2>
                      <p className="text-white/70 text-sm md:text-base">{courseData.title}</p>
                    </div>

                    {resumeTime !== null && (
                      <button
                        onClick={handleResume}
                        className="px-6 py-3 rounded-xl bg-[#63E3FF] text-black font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl animate-in fade-in slide-in-from-bottom-4"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Retomar de {formatTime(Math.floor(resumeTime))}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Video Controls */}
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 transition-opacity ${isLocked ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}>
                {/* Progress Bar */}
                <div className="mb-4">
                  <div onClick={seekVideo} className="w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all">
                    <div 
                      className="h-full bg-gradient-to-r from-[#63E3FF] to-[#7A2CFF]"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      )}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleMute}
                        className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                      >
                        <Volume2 className="w-4 h-4 text-white" />
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          setVolume(Number(e.target.value));
                          if (isMuted && Number(e.target.value) > 0) {
                            setIsMuted(false);
                          }
                        }}
                        className="w-24 h-1 bg-white/20 accent-[#63E3FF]"
                      />
                    </div>
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(totalTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all">
                      <Settings className="w-5 h-5 text-white" />
                    </button>
                    <button 
                      onClick={toggleFullscreen}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                    >
                      <Maximize className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="bg-[#050505] border-t border-white/5 px-4 md:px-8 py-4 md:py-6">
            <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-3 md:gap-0">
              {prevLesson ? (
                <Link 
                  href={`/lesson/${prevLesson.id}`}
                  className="w-full md:w-auto px-4 md:px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center md:justify-start gap-2 text-sm md:text-base"
                >
                  <ChevronLeft className="w-4 md:w-5 h-4 md:h-5" />
                  <span className="hidden sm:inline">Aula Anterior</span>
                  <span className="sm:hidden">Anterior</span>
                </Link>
              ) : (
                <div className="w-full md:w-auto md:min-w-[140px]"></div>
              )}
              
              <button 
                onClick={() => toggleLessonCompletion(lessonId)}
                className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-white shadow-lg shadow-[#63E3FF]/20 hover:shadow-[#63E3FF]/40 hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #63E3FF 0%, #2FA7FF 30%, #7A2CFF 65%, #E548FF 100%)',
                }}
                disabled={isLocked}
              >
                {currentLesson.completed ? <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5" /> : <Circle className="w-4 md:w-5 h-4 md:h-5" />}
                <span className="hidden sm:inline">{currentLesson.completed ? 'Concluída (Desmarcar)' : 'Marcar como Concluída'}</span>
                <span className="sm:hidden">{currentLesson.completed ? 'Desmarcar' : 'Concluir'}</span>
              </button>

              {nextLesson ? (
                <Link 
                  href={nextLesson.locked ? "#" : `/lesson/${nextLesson.id}`}
                  onClick={(e) => nextLesson.locked && e.preventDefault()}
                  className={`w-full md:w-auto px-4 md:px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center md:justify-start gap-2 text-sm md:text-base ${nextLesson.locked ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <span className="hidden sm:inline">Próxima Aula</span>
                  <span className="sm:hidden">Próxima</span>
                  <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
                </Link>
              ) : (
                <div className="w-full md:w-auto md:min-w-[140px]"></div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Mobile Overlay */}
        {showSidebar && (
          <>
            {/* Mobile backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setShowSidebar(false)}
            ></div>
            
            <aside className="fixed md:relative right-0 top-0 bottom-0 w-full max-w-sm md:max-w-none md:w-96 bg-[#050505] border-l border-white/5 flex flex-col overflow-hidden z-50">
              {/* Gradient separator - smooth transition from main content */}
              <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-l from-transparent to-black/50 pointer-events-none z-10"></div>
              
              {/* Close button for mobile */}
              <button
                onClick={() => setShowSidebar(false)}
                className="md:hidden absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Tabs */}
              <div className="flex border-b border-white/10">
                <button 
                  onClick={() => setActiveTab("content")}
                  className={`flex-1 px-6 py-4 font-medium transition-all ${
                    activeTab === "content" 
                      ? "text-white bg-white/5 border-b-2 border-[#63E3FF]" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Conteúdo
                </button>
                <button 
                  onClick={() => setActiveTab("materials")}
                  className={`flex-1 px-6 py-4 font-medium transition-all ${
                    activeTab === "materials" 
                      ? "text-white bg-white/5 border-b-2 border-[#63E3FF]" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Materiais
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === "content" ? (
                  <>
                    {/* Course Progress */}
                    <div className="p-6 border-b border-white/10">
                      {(() => {
                        const total = lessons.length;
                        const done = lessons.filter(l => l.completed).length;
                        const pct = Math.round((done / total) * 100);
                        return (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-white/60 text-sm">Progresso do Curso</span>
                              <span className="text-[#63E3FF] text-sm font-semibold">{pct}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#63E3FF] to-[#7A2CFF] transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                            <p className="text-white/60 text-xs mt-2">{done} de {total} aulas concluídas</p>
                          </>
                        );
                      })()}
                    </div>

                    {/* Lessons List */}
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-4 px-2">{currentModule?.title ?? courseData.title}</h3>
                      <div className="space-y-1">
                        {lessons.map((lesson) => (
                          <Link 
                            key={lesson.id} 
                            href={lesson.locked ? "#" : `/lesson/${lesson.id}`}
                            onClick={(e) => lesson.locked && e.preventDefault()}
                            className={lesson.locked ? "cursor-not-allowed" : "cursor-pointer"}
                          >
                            <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                              lesson.current 
                                ? 'bg-gradient-to-r from-[#63E3FF]/20 to-[#7A2CFF]/20 border border-[#63E3FF]/30' 
                                : lesson.locked ? 'opacity-40' : 'hover:bg-white/5'
                            }`}>
                              {lesson.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                              ) : lesson.locked ? (
                                <Lock className="w-5 h-5 text-white/20 flex-shrink-0" />
                              ) : (
                                <Circle className={`w-5 h-5 flex-shrink-0 ${lesson.current ? 'text-[#63E3FF]' : 'text-white/40'}`} />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm line-clamp-2 ${lesson.current ? 'text-white font-medium' : lesson.locked ? 'text-white/40' : 'text-white/80'}`}>
                                  {lesson.title}
                                </p>
                                <p className="text-white/40 text-xs mt-0.5">{lesson.duration}</p>
                              </div>
                              {lesson.current && (
                                <Play className="w-4 h-4 text-[#63E3FF] flex-shrink-0" />
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Materials Section */
                  <div className="p-6 animate-in fade-in duration-300">
                    <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#63E3FF]" />
                      Materiais de Apoio
                    </h3>
                    <div className="space-y-3">
                      {materials.map((material, index) => (
                        <div 
                          key={index} 
                          onClick={() => handleDownload(material.name)}
                          className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all group cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#63E3FF] to-[#7A2CFF] flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-white text-sm font-medium truncate">{material.name}</p>
                                <p className="text-white/40 text-xs">{material.size}</p>
                              </div>
                            </div>
                            <Download className="w-5 h-5 text-white/60 group-hover:text-[#63E3FF] transition-all flex-shrink-0 ml-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </>
        )}
      </div>

      {/* Celebration Overlay - Exibido ao concluir a última aula */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500 p-4">
          <div className="relative">
            {/* Efeito de brilho ao fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#63E3FF] via-[#7A2CFF] to-[#E548FF] blur-3xl opacity-30 animate-pulse"></div>
            
            <div className="relative bg-[#050505] border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl max-w-sm mx-auto transform animate-in zoom-in-95 duration-500">
              <button 
                onClick={() => setShowCelebration(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FF8C00] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#FFD700]/20">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Curso Concluído!</h2>
              <p className="text-white/60 mb-8">Parabéns! Você finalizou com sucesso a trilha de {courseData.title}.</p>
              
              <Link href="/certificate">
                <button className="w-full py-4 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition-all bg-gradient-to-r from-[#63E3FF] via-[#2FA7FF] to-[#7A2CFF]">
                  Ver meu Certificado
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Unmark Confirmation Modal */}
      {showUnmarkModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
          <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-xl font-bold text-white mb-2">Desmarcar aula?</h3>
            <p className="text-white/60 mb-6 text-sm md:text-base">
              Ao desmarcar esta aula, as aulas seguintes que dependem dela serão bloqueadas novamente. Tem certeza?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUnmarkModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={confirmUnmark}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all font-bold text-sm md:text-base"
              >
                Sim, desmarcar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Download Progress */}
      {downloadingFile && (
        <div className="fixed bottom-8 right-8 z-[200] w-72 bg-[#0B0B0F] border border-white/10 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#63E3FF]" />
              <span className="text-white text-xs font-medium truncate max-w-[150px]">{downloadingFile.name}</span>
            </div>
            <span className="text-[#63E3FF] text-xs font-bold">{downloadingFile.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#63E3FF] to-[#7A2CFF] transition-all duration-300"
              style={{ width: `${downloadingFile.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`px-6 py-3 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-[#63E3FF]/20 text-[#63E3FF]'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}