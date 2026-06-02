'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { getCourseById } from "@/lib/courseCatalog";
import { VersiaLogo } from "@/components/VersiaLogo";
import { UserProfileMini } from "@/components/UserProfileMini";
import { LogoutButton } from "@/components/LogoutButton";
import {
  Home,
  BookOpen,
  Award,
  Settings,
  Search,
  Bell,
  User,
  Building2,
  Clock,
  Play,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Star,
  Users,
  FileText,
  Download,
  Menu,
  X,
  Lock,
  BellOff
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function CourseClientPage() {
  const { id } = useParams();
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<{ name: string, progress: number } | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTooltip, setNotificationTooltip] = useState("");
  const courseId = Array.isArray(id) ? id[0] : String(id ?? '1');
  const courseData = getCourseById(courseId) ?? getCourseById(1)!;
  const progressKey = `versia_progress_${courseData.id}`;

  useEffect(() => {
    const saved = localStorage.getItem(progressKey);
    if (saved) setCompletedIds(JSON.parse(saved));
    else setCompletedIds(courseData.modules.flatMap((module) => module.lessons).filter((lesson) => lesson.completed).map((lesson) => lesson.id));
  }, [progressKey, courseData]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleModule = (index: number) => {
    setExpandedModules(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const materials = [
    { name: "Slides da Aula.pdf", size: "2.5 MB" },
    { name: "Exercícios Práticos.pdf", size: "1.2 MB" },
    { name: "Material Complementar.pdf", size: "3.8 MB" },
  ];

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem('versia_notifications_enabled', String(newState));
    setNotificationTooltip(newState ? "Notificações ativadas" : "Notificações desativadas");
    setTimeout(() => setNotificationTooltip(""), 2000);
    setToast({
      message: newState ? "Notificações ativadas!" : "Notificações desativadas!",
      type: 'info'
    });
  };

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

  // Mapeia as aulas para incluir o estado real de conclusão e bloqueio
  const allLessons = courseData.modules.flatMap(m => m.lessons);
  const lessonOrder = new Map(allLessons.map((lesson, index) => [lesson.id, index]));
  const totalLessons = allLessons.length;
  const completedCount = completedIds.filter((completedId) => lessonOrder.has(completedId)).length;
  const dynamicProgress = Math.round((completedCount / totalLessons) * 100);

  const modulesWithStatus = courseData.modules.map(module => ({
    ...module,
    lessons: module.lessons.map(lesson => {
      const isCompleted = completedIds.includes(lesson.id);
      const order = lessonOrder.get(lesson.id) ?? 0;
      const previousLesson = allLessons[order - 1];
      const isLocked = order > 0 && previousLesson ? !completedIds.includes(previousLesson.id) : false;
      return { ...lesson, completed: isCompleted, locked: isLocked };
    })
  }));

  const nextLessonId = allLessons.find(l => !completedIds.includes(l.id))?.id || allLessons[0]?.id || 1;

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Mobile Menu Backdrop */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        ></div>
      )}

      {/* Sidebar - Hidden on mobile, slides in with menu */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col z-50 transition-transform duration-300 ${
        showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Gradient transition to main content */}
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-[#050505]/50 pointer-events-none"></div>

        {/* Close button for mobile */}
        <button
          onClick={() => setShowMobileMenu(false)}
          className="md:hidden absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <VersiaLogo size="sm" />

        <nav className="mt-12 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 mb-2 transition-all">
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#63E3FF]/20 to-[#7A2CFF]/20 text-white mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Catálogo de Cursos</span>
          </Link>
          <Link href="/certificate" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 mb-2 transition-all">
            <Award className="w-5 h-5" />
            <span className="font-medium">Certificados</span>
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 mb-2 transition-all">
            <User className="w-5 h-5" />
            <span className="font-medium">Perfil</span>
          </Link>
          <Link href="/company" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 mb-2 transition-all">
            <Building2 className="w-5 h-5" />
            <span className="font-medium">Área da Empresa</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 mb-2 transition-all">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </Link>
        </nav>

        <div className="border-t border-white/5 pt-4">
          <UserProfileMini />
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 relative">
          {/* Gradient transition to content below */}
          <div className="absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-[#050505]/30 pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link href="/courses" className="flex items-center gap-2 text-white/60 hover:text-white transition-all">
                <ArrowLeft className="w-4 md:w-5 h-4 md:h-5" />
                <span className="text-sm md:text-base hidden sm:inline">Voltar para cursos</span>
                <span className="text-sm md:text-base sm:hidden">Voltar</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <button 
                  onClick={toggleNotifications}
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all ${
                    notificationsEnabled ? 'text-[#63E3FF] hover:bg-[#63E3FF]/10' : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </button>
        
        {Boolean(notificationTooltip) && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg text-[10px] text-white animate-in fade-in slide-in-from-top-1 duration-200 whitespace-nowrap z-[60] shadow-2xl">
            {notificationTooltip}
          </div>
        )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-4 md:px-8 py-6 md:py-8">
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl h-[300px] md:h-[400px]">
            <img
              src={courseData.thumbnail}
              alt={courseData.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

            <div className="relative h-full flex flex-col justify-end p-6 md:p-12">
              <div className="inline-flex items-center gap-2 bg-[#7A2CFF]/20 backdrop-blur-sm border border-[#7A2CFF]/30 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-3 md:mb-4 w-fit">
                <BookOpen className="w-3 md:w-4 h-3 md:h-4 text-[#7A2CFF]" />
                <span className="text-xs md:text-sm font-semibold text-white">Liderança</span>
              </div>
              <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4">{courseData.title}</h1>
              <p className="text-sm md:text-xl text-white/80 mb-4 md:mb-6 max-w-3xl line-clamp-2 md:line-clamp-none">
                {courseData.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 md:gap-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 md:w-5 h-4 md:h-5 text-white/60" />
                  <span className="text-sm md:text-base text-white/80">{courseData.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 md:w-5 h-4 md:h-5 text-white/60" />
                  <span className="text-sm md:text-base text-white/80">{courseData.students} alunos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 md:w-5 h-4 md:h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm md:text-base text-white/80">{courseData.rating} ({courseData.reviews})</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="px-4 md:px-8 py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Course Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Progress Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-1">Seu Progresso</h3>
                  <p className="text-white/60 text-xs md:text-sm">{completedCount} de {totalLessons} aulas concluídas</p>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">{dynamicProgress}%</div>
              </div>
              <div className="w-full h-2 md:h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#63E3FF] via-[#2FA7FF] to-[#7A2CFF] transition-all duration-700"
                  style={{ width: `${dynamicProgress}%` }}
                ></div>
              </div>
              <Link href={`/lesson/${nextLessonId}`}>
                <button className="mt-4 md:mt-6 w-full px-5 md:px-6 py-3 md:py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg shadow-[#63E3FF]/20 hover:shadow-[#63E3FF]/40 hover:scale-105 transition-all text-sm md:text-base"
                  style={{
                    background: 'linear-gradient(135deg, #63E3FF 0%, #2FA7FF 30%, #7A2CFF 65%, #E548FF 100%)',
                  }}
                >
                  <Play className="w-4 md:w-5 h-4 md:h-5" />
                  {completedCount === 0 ? 'Começar Curso' : 'Continuar Curso'}
                </button>
              </Link>
            </div>

            {/* Course Modules */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Conteúdo do Curso</h3>
              <div className="space-y-3 md:space-y-4">
                {modulesWithStatus.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border border-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleModule(moduleIndex)}
                      className="w-full flex items-center justify-between p-3 md:p-5 bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#63E3FF] to-[#7A2CFF] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm md:text-base">{moduleIndex + 1}</span>
                        </div>
                        <div className="text-left min-w-0">
                          <h4 className="text-white font-semibold text-sm md:text-base truncate">{module.title}</h4>
                          <p className="text-white/60 text-xs md:text-sm">{module.lessons.length} aulas • {module.duration}</p>
                        </div>
                      </div>
                      {expandedModules.includes(moduleIndex) ? (
                        <ChevronUp className="w-4 md:w-5 h-4 md:h-5 text-white/60 flex-shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 md:w-5 h-4 md:h-5 text-white/60 flex-shrink-0 ml-2" />
                      )}
                    </button>

                    {expandedModules.includes(moduleIndex) && (
                      <div className="bg-black/20 p-1 md:p-2">
                        {module.lessons.map((lesson) => (
                          <Link 
                            key={lesson.id} 
                            href={lesson.locked ? "#" : `/lesson/${lesson.id}`}
                            onClick={(e) => lesson.locked && e.preventDefault()}
                            className={lesson.locked ? "cursor-not-allowed" : "cursor-pointer"}
                          >
                            <div className={`flex items-center justify-between p-3 md:p-4 hover:bg-white/5 rounded-lg transition-all group ${lesson.locked ? 'opacity-40' : ''}`}>
                              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                                {lesson.completed ? (
                                  <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-green-400 flex-shrink-0" />
                                ) : lesson.locked ? (
                                  <Lock className="w-4 md:w-5 h-4 md:h-5 text-white/20 flex-shrink-0" />
                                ) : (
                                  <Circle className="w-4 md:w-5 h-4 md:h-5 text-white/40 group-hover:text-white/60 flex-shrink-0" />
                                )}
                                <span className={`${lesson.completed ? 'text-white/80' : lesson.locked ? 'text-white/40' : 'text-white'} group-hover:text-white transition-all text-sm md:text-base truncate`}>
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="text-white/60 text-xs md:text-sm flex-shrink-0 ml-2">{lesson.duration}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Instructor & Info */}
          <div className="space-y-4 md:space-y-6">
            {/* Instructor Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Instrutor</h3>
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <img
                  src={courseData.instructor.avatar}
                  alt={courseData.instructor.name}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-[#63E3FF]"
                />
                <div>
                  <h4 className="text-white font-semibold text-sm md:text-base">{courseData.instructor.name}</h4>
                  <p className="text-white/60 text-xs md:text-sm">{courseData.instructor.role}</p>
                </div>
              </div>
              <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                Especialista em desenvolvimento de liderança com mais de 15 anos de experiência em coaching executivo e consultoria organizacional.
              </p>
            </div>

            {/* Course Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Informações do Curso</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between pb-2 md:pb-3 border-b border-white/10">
                  <span className="text-white/60 text-xs md:text-sm">Duração Total</span>
                  <span className="text-white font-medium text-xs md:text-sm">{courseData.duration}</span>
                </div>
                <div className="flex items-center justify-between pb-2 md:pb-3 border-b border-white/10">
                  <span className="text-white/60 text-xs md:text-sm">Aulas</span>
                  <span className="text-white font-medium text-xs md:text-sm">{totalLessons} aulas</span>
                </div>
                <div className="flex items-center justify-between pb-2 md:pb-3 border-b border-white/10">
                  <span className="text-white/60 text-xs md:text-sm">Alunos</span>
                  <span className="text-white font-medium text-xs md:text-sm">{courseData.students}</span>
                </div>
                <div className="flex items-center justify-between pb-2 md:pb-3 border-b border-white/10">
                  <span className="text-white/60 text-xs md:text-sm">Nível</span>
                  <span className="text-white font-medium text-xs md:text-sm">Avançado</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs md:text-sm">Certificado</span>
                  <span className="text-green-400 font-medium flex items-center gap-1 text-xs md:text-sm">
                    <Award className="w-3 md:w-4 h-3 md:h-4" />
                    Incluído
                  </span>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">O que você vai aprender</h3>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-[#63E3FF] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80 text-xs md:text-sm">Desenvolver estilos de liderança eficazes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-[#63E3FF] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80 text-xs md:text-sm">Técnicas avançadas de comunicação</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-[#63E3FF] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80 text-xs md:text-sm">Gestão de equipes de alto desempenho</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-[#63E3FF] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80 text-xs md:text-sm">Tomada de decisão estratégica</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-[#63E3FF] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80 text-xs md:text-sm">Inteligência emocional aplicada</span>
                </li>
              </ul>
            </div>

            {/* Support Materials Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                <FileText className="w-4 md:w-5 h-4 md:h-5 text-[#63E3FF]" />
                Materiais de Apoio
              </h3>
              <div className="space-y-3">
                {materials.map((material, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleDownload(material.name)}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 hover:bg-white/10 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#63E3FF] to-[#7A2CFF] flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 md:w-5 h-4 md:h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-xs md:text-sm font-medium truncate">{material.name}</p>
                          <p className="text-white/40 text-[10px] md:text-xs">{material.size}</p>
                        </div>
                      </div>
                      <Download className="w-4 md:w-5 h-4 md:h-5 text-white/60 group-hover:text-[#63E3FF] transition-all flex-shrink-0 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

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
