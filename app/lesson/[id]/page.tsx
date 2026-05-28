'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
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
  CheckCircle2,
  Circle,
  FileText,
  Download,
  X,
  Menu
} from "lucide-react";
import { useState, useRef, useEffect, type MouseEvent } from "react";

export default function LessonPage() {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(900); // will be updated from video metadata
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const progress = totalTime ? (currentTime / totalTime) * 100 : 0;

  const lessons = [
    { id: 1, title: "Introdução à Liderança 4.0", duration: "10:53", completed: true, videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", poster: "https://peach.blender.org/wp-content/uploads/title_an_full.jpg" },
    { id: 2, title: "O Papel do Líder na Era Digital", duration: "12:12", completed: true, videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", poster: "https://mango.blender.org/wp-content/uploads/2012/05/01_vfx_preview_01.png" },
    { id: 3, title: "Estilos de Liderança Contemporâneos", duration: "14:48", completed: true, videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", poster: "https://durian.blender.org/wp-content/uploads/2010/05/sintel_poster_01.jpg" },
    { id: 4, title: "Autoconhecimento e Inteligência Emocional", duration: "09:56", completed: false, current: true, videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", poster: "https://peach.blender.org/wp-content/uploads/bbb-splash.png" },
    { id: 5, title: "Comunicação Assertiva", duration: "00:15", completed: false, videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", poster: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1080" },
    { id: 6, title: "Técnicas de Persuasão", duration: "25:00", completed: false },
  ];

  const materials = [
    { name: "Slides da Aula.pdf", size: "2.5 MB" },
    { name: "Exercícios Práticos.pdf", size: "1.2 MB" },
    { name: "Material Complementar.pdf", size: "3.8 MB" },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const lessonId = Number(id);
  const currentLesson = lessons.find((l) => l.id === lessonId) || lessons[0];

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => setCurrentTime(Math.floor(v.currentTime));
    const onMeta = () => setTotalTime(Math.floor(v.duration || 0));

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);

    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
    };
  }, [currentLesson.videoUrl]); // Re-anexa os eventos sempre que o vídeo mudar

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isPlaying) {
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Erro ao reproduzir vídeo:", error);
          }
        });
      }
    } else {
      v.pause();
    }
  }, [isPlaying, currentLesson.videoUrl]);

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
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top Bar */}
      <header className="bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
          <Link href="/course/1" className="text-white/60 hover:text-white transition-all flex-shrink-0">
            <X className="w-5 md:w-6 h-5 md:h-6" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-white font-semibold text-sm md:text-lg truncate">Autoconhecimento e Inteligência Emocional</h1>
            <p className="text-white/60 text-xs md:text-sm truncate">Liderança Estratégica 4.0 • Módulo 1</p>
          </div>
        </div>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-white/60 hover:text-white transition-all flex-shrink-0"
        >
          <Menu className="w-5 md:w-6 h-5 md:h-6" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col bg-black">
          {/* Video Player */}
          <div className="flex-1 flex items-center justify-center relative group">
            {/* Video Thumbnail/Player */}
            <div 
              ref={containerRef}
              className="relative w-full h-full max-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-[#050505] to-[#0a0a0a]"
            >
              {currentLesson.videoUrl ? (
                <video
                  key={currentLesson.videoUrl}
                  ref={videoRef}
                  poster={currentLesson.poster}
                  className="w-full h-full max-w-full max-h-full object-contain"
                  playsInline
                >
                  <source src={currentLesson.videoUrl} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={currentLesson.poster || "https://images.unsplash.com/photo-1770240366266-57290c83cd5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"}
                  alt="Video"
                  className="max-w-full max-h-full object-contain"
                />
              )}
              
              {/* Play Button Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center hover:scale-110 transition-all group"
                  >
                    <Play className="w-10 h-10 text-white ml-1" />
                  </button>
                </div>
              )}

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
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
              <button className="w-full md:w-auto px-4 md:px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center md:justify-start gap-2 text-sm md:text-base">
                <ChevronLeft className="w-4 md:w-5 h-4 md:h-5" />
                <span className="hidden sm:inline">Aula Anterior</span>
                <span className="sm:hidden">Anterior</span>
              </button>
              
              <button className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-white shadow-lg shadow-[#63E3FF]/20 hover:shadow-[#63E3FF]/40 hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                style={{
                  background: 'linear-gradient(135deg, #63E3FF 0%, #2FA7FF 30%, #7A2CFF 65%, #E548FF 100%)',
                }}
              >
                <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5" />
                <span className="hidden sm:inline">Marcar como Concluída</span>
                <span className="sm:hidden">Concluir</span>
              </button>

              <button className="w-full md:w-auto px-4 md:px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center md:justify-start gap-2 text-sm md:text-base">
                <span className="hidden sm:inline">Próxima Aula</span>
                <span className="sm:hidden">Próxima</span>
                <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
              </button>
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
                <button className="flex-1 px-6 py-4 text-white bg-white/5 border-b-2 border-[#63E3FF] font-medium">
                  Conteúdo
                </button>
                <button className="flex-1 px-6 py-4 text-white/60 hover:text-white hover:bg-white/5 transition-all">
                  Materiais
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                {/* Course Progress */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/60 text-sm">Progresso do Curso</span>
                    <span className="text-[#63E3FF] text-sm font-semibold">65%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#63E3FF] to-[#7A2CFF]"
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                  <p className="text-white/60 text-xs mt-2">3 de 16 aulas concluídas</p>
                </div>

                {/* Lessons List */}
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-4 px-2">Módulo 1: Fundamentos da Liderança Moderna</h3>
                  <div className="space-y-1">
                    {lessons.map((lesson) => (
                      <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                        <div className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                          lesson.current 
                            ? 'bg-gradient-to-r from-[#63E3FF]/20 to-[#7A2CFF]/20 border border-[#63E3FF]/30' 
                            : 'hover:bg-white/5'
                        }`}>
                          {lesson.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <Circle className={`w-5 h-5 flex-shrink-0 ${lesson.current ? 'text-[#63E3FF]' : 'text-white/40'}`} />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm line-clamp-2 ${lesson.current ? 'text-white font-medium' : 'text-white/80'}`}>
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

                {/* Materials Section */}
                <div className="p-6 border-t border-white/10 mt-4">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#63E3FF]" />
                    Materiais de Apoio
                  </h3>
                  <div className="space-y-3">
                    {materials.map((material, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all group cursor-pointer">
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
              </div>

              <div className="border-t border-white/10 p-4">
                <UserProfileMini />
                <LogoutButton />
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}