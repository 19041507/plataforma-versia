'use client';

import Link from "next/link";
import { VersiaLogo } from "../../components/VersiaLogo";
import { UserProfileMini } from "../../components/UserProfileMini";
import { LogoutButton } from "../../components/LogoutButton";
import { 
  Home, 
  BookOpen, 
  Award, 
  Settings, 
  Search, 
  Bell,
  BellOff, 
  User,
  Clock,
  Filter,
  Grid3x3,
  List,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTooltip, setNotificationTooltip] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('versia_notifications_enabled');
    if (saved !== null) setNotificationsEnabled(saved === 'true');
  }, []);

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem('versia_notifications_enabled', String(newState));
    setNotificationTooltip(newState ? "Notificações ativadas" : "Notificações desativadas");
    setTimeout(() => setNotificationTooltip(null), 2000);
  };

  const allCourses = [
    {
      id: 1,
      title: "Liderança Estratégica 4.0",
      instructor: "Ana Silva",
      progress: 65,
      duration: "8h",
      thumbnail: "https://images.unsplash.com/photo-1770240366266-57290c83cd5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFkZXJzaGlwJTIwZGV2ZWxvcG1lbnQlMjBtZW50b3IlMjBjb2FjaGluZ3xlbnwxfHx8fDE3NzQyMzQ0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Liderança",
      level: "Avançado",
      students: 1240,
    },
    {
      id: 2,
      title: "Data Analytics Avançado",
      instructor: "Carlos Mendes",
      progress: 30,
      duration: "12h",
      thumbnail: "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzQxNzc3NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Tecnologia",
      level: "Intermediário",
      students: 890,
    },
    {
      id: 3,
      title: "Cibersegurança Corporativa",
      instructor: "Roberto Costa",
      progress: 0,
      duration: "10h",
      thumbnail: "https://images.unsplash.com/photo-1768224656445-33d078c250b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwZGlnaXRhbCUyMG5ldHdvcmslMjBzZWN1cml0eXxlbnwxfHx8fDE3NzQyMzQ0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Segurança",
      level: "Avançado",
      students: 654,
    },
    {
      id: 4,
      title: "Compliance e Ética Empresarial",
      instructor: "Juliana Oliveira",
      progress: 100,
      duration: "4h",
      thumbnail: "https://images.unsplash.com/photo-1758691736067-b309ee3ef7b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBidXNpbmVzcyUyMHRyYWluaW5nJTIwcHJlc2VudGF0aW9ufGVufDF8fHx8MTc3NDIzNDQ4NHww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Compliance",
      level: "Básico",
      students: 2100,
    },
    {
      id: 5,
      title: "Trabalho em Equipe e Colaboração",
      instructor: "Marcos Santos",
      progress: 45,
      duration: "6h",
      thumbnail: "https://images.unsplash.com/photo-1769740333462-9a63bfa914bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NzQyMDI4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Soft Skills",
      level: "Intermediário",
      students: 1560,
    },
    {
      id: 6,
      title: "Inteligência Artificial para Negócios",
      instructor: "Patricia Lima",
      progress: 0,
      duration: "15h",
      thumbnail: "https://images.unsplash.com/photo-1760629863094-5b1e8d1aae74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3QlMjBmdXR1cmlzdGljfGVufDF8fHx8MTc3NDE2NDEyMXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "IA",
      level: "Avançado",
      students: 780,
    },
    {
      id: 7,
      title: "Desenvolvimento Full Stack",
      instructor: "Fernando Rocha",
      progress: 0,
      duration: "20h",
      thumbnail: "https://images.unsplash.com/photo-1672385277648-85eddc237a2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BtZW50JTIwY29kaW5nJTIwcHJvZ3JhbW1pbmd8ZW58MXx8fHwxNzc0MjM0NDg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Tecnologia",
      level: "Intermediário",
      students: 1120,
    },
    {
      id: 8,
      title: "Gestão de Projetos Ágeis",
      instructor: "Beatriz Alves",
      progress: 15,
      duration: "9h",
      thumbnail: "https://images.unsplash.com/photo-1764025130362-0162c3dd2035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwd29ya3NwYWNlJTIwZGlnaXRhbCUyMGxlYXJuaW5nfGVufDF8fHx8MTc3NDIzNDQ4NHww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Gestão",
      level: "Intermediário",
      students: 945,
    },
  ];

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = activeCategory === "Todos" 
      ? true 
      : activeCategory === "Meus Cursos" 
        ? course.progress > 0 
        : course.category === activeCategory;

    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Função para destacar o termo pesquisado
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-[#63E3FF] font-bold">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="fixed top-4 left-4 z-50 lg:hidden w-12 h-12 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white"
      >
        {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col z-50 transform transition-transform duration-300 lg:transform-none ${showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Gradient transition to main content */}
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-[#050505]/50 pointer-events-none"></div>
        
        <VersiaLogo size="md" />
        
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
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 mb-2 transition-all w-full">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </button>
        </nav>

        <div className="border-t border-white/5 pt-4">
          <UserProfileMini />
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 relative">
          {/* Gradient transition to content below */}
          <div className="absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-[#050505]/30 pointer-events-none"></div>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar cursos..."
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#63E3FF]/50 focus:border-[#63E3FF] transition-all text-sm md:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all p-1"
                    aria-label="Limpar pesquisa"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all ${
                    notificationsEnabled ? 'text-[#63E3FF] hover:bg-[#63E3FF]/10' : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </button>
                {notificationTooltip && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg text-[10px] text-white animate-in fade-in slide-in-from-top-1 duration-200 whitespace-nowrap z-[60] shadow-2xl">
                    {notificationTooltip}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Header */}
        <div className="px-4 md:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Catálogo de Cursos</h1>
              <p className="text-white/60 text-sm md:text-base">Explore todos os cursos disponíveis na plataforma</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center gap-2 text-sm">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtros</span>
              </button>
              <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 md:px-4 py-2 transition-all ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 md:px-4 py-2 transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 overflow-x-auto pb-2">
            {["Meus Cursos", "Todos", "Tecnologia", "Liderança", "Soft Skills", "IA"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-[#63E3FF]/20 to-[#7A2CFF]/20 border-[#63E3FF]/30 text-white font-medium"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          {filteredCourses.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" : "space-y-4"}>
            {filteredCourses.map((course) => (
              <Link key={course.id} href={`/course/${course.id}`}>
                {viewMode === "grid" ? (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all group cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#7A2CFF]/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
                          {course.category}
                        </span>
                      </div>
                      {course.progress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                          <div 
                            className="h-full bg-gradient-to-r from-[#63E3FF] to-[#7A2CFF]"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {highlightText(course.title, searchQuery)}
                      </h4>
                      <p className="text-white/60 text-sm mb-4">{course.instructor}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span className="text-white/60">{course.students} alunos</span>
                      </div>
                      {course.progress === 100 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <span className="text-green-400 text-sm flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            Concluído
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all group cursor-pointer flex flex-col md:flex-row">
                    <div className="relative w-full md:w-64 h-48 md:h-40 overflow-hidden flex-shrink-0">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {course.progress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                          <div 
                            className="h-full bg-gradient-to-r from-[#63E3FF] to-[#7A2CFF]"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-[#7A2CFF]/20 text-[#7A2CFF] px-3 py-1 rounded-md text-xs font-semibold">
                            {course.category}
                          </span>
                          <span className="text-white/40 text-xs">{course.level}</span>
                        </div>
                        <h4 className="text-xl font-semibold text-white mb-2">
                          {highlightText(course.title, searchQuery)}
                        </h4>
                        <p className="text-white/60 text-sm mb-3">{course.instructor}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                          <span>{course.students} alunos</span>
                        </div>
                        {course.progress === 100 ? (
                          <span className="text-green-400 text-sm flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            Concluído
                          </span>
                        ) : course.progress > 0 ? (
                          <span className="text-[#63E3FF] text-sm font-semibold">
                            {course.progress}% completo
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 md:mb-6 border border-white/10">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-white/20" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Nenhum curso encontrado</h2>
              <div className="text-white/60 max-w-sm mx-auto text-sm md:text-base px-4 space-y-1">
                <p>Não encontramos resultados para sua busca.</p>
                {searchQuery && <p>Pesquisa: <span className="text-[#63E3FF]">"{searchQuery}"</span></p>}
                {activeCategory !== "Todos" && <p>Categoria: <span className="text-[#63E3FF]">"{activeCategory}"</span></p>}
              </div>
              <button 
                onClick={() => {
                  setActiveCategory("Todos");
                  setSearchQuery("");
                }}
                className="mt-6 md:mt-8 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium text-sm md:text-base"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}