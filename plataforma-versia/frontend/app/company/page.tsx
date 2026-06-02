'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Award, BarChart3, Bell, BellOff, BookOpen, Building2, CheckCircle2, Clock, Download, Home, Menu, Search, Settings, TrendingUp, User, Users, X } from 'lucide-react';
import { VersiaLogo } from '@/components/VersiaLogo';
import { UserProfileMini } from '@/components/UserProfileMini';
import { LogoutButton } from '@/components/LogoutButton';
import { PaginationControls } from '@/components/PaginationControls';
import { DEFAULT_USER, getClientUser, type VersiaUser } from '@/lib/clientUser';

export default function CompanyPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTooltip, setNotificationTooltip] = useState<string | null>(null);
  const [user, setUser] = useState<VersiaUser>(DEFAULT_USER);
  const [employeePage, setEmployeePage] = useState(1);
  const [coursePage, setCoursePage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('versia_notifications_enabled');
    if (saved !== null) setNotificationsEnabled(saved === 'true');
    const currentUser = getClientUser();
    setUser(currentUser);

    if (currentUser.role !== 'company') {
      router.replace('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    setEmployeePage(1);
  }, [searchQuery]);

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem('versia_notifications_enabled', String(newState));
    setNotificationTooltip(newState ? 'Notificações ativadas' : 'Notificações desativadas');
    setTimeout(() => setNotificationTooltip(null), 2000);
  };

  const companyStats = [
    { label: 'Colaboradores ativos', value: '126', change: '+18 este mês', icon: Users },
    { label: 'Cursos concluídos', value: '342', change: '+47 este mês', icon: CheckCircle2 },
    { label: 'Certificados emitidos', value: '89', change: '+12 este mês', icon: Award },
    { label: 'Horas estudadas', value: '1.248h', change: '+210h este mês', icon: Clock },
  ];

  const employees = [
    { name: 'Carla Mendes', email: 'carla@motiron.com', area: 'Comercial', progress: 78, status: 'Ativo' },
    { name: 'Rafael Souza', email: 'rafael@motiron.com', area: 'Operações', progress: 92, status: 'Ativo' },
    { name: 'Juliana Rocha', email: 'juliana@motiron.com', area: 'Financeiro', progress: 64, status: 'Ativo' },
    { name: 'Bruno Lima', email: 'bruno@motiron.com', area: 'Tecnologia', progress: 38, status: 'Pendente' },
    { name: 'Fernanda Alves', email: 'fernanda@motiron.com', area: 'RH', progress: 100, status: 'Concluído' },
    { name: 'Thiago Costa', email: 'thiago@motiron.com', area: 'Jurídico', progress: 55, status: 'Ativo' },
  ];

  const companyCourses = [
    { title: 'Compliance e Ética Empresarial', required: true, completion: 86, enrolled: 126 },
    { title: 'Liderança Estratégica 4.0', required: false, completion: 64, enrolled: 48 },
    { title: 'Trabalho em Equipe e Colaboração', required: true, completion: 72, enrolled: 126 },
    { title: 'Cibersegurança Corporativa', required: true, completion: 51, enrolled: 126 },
    { title: 'Data Analytics Avançado', required: false, completion: 34, enrolled: 32 },
  ];

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const employeesPerPage = 3;
  const coursesPerPage = 3;
  const totalEmployeePages = Math.max(1, Math.ceil(filteredEmployees.length / employeesPerPage));
  const totalCoursePages = Math.max(1, Math.ceil(companyCourses.length / coursesPerPage));
  const paginatedEmployees = filteredEmployees.slice((employeePage - 1) * employeesPerPage, employeePage * employeesPerPage);
  const paginatedCourses = companyCourses.slice((coursePage - 1) * coursesPerPage, coursePage * coursesPerPage);

  return (
    <div className="min-h-screen bg-[#050505]">
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="fixed top-4 left-4 z-50 lg:hidden w-12 h-12 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white"
      >
        {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className={`fixed left-0 top-0 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col z-50 transform transition-transform duration-300 lg:transform-none ${showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-[#050505]/50 pointer-events-none"></div>
        <VersiaLogo size="md" />
        <nav className="mt-12 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 mb-2 transition-all">
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 mb-2 transition-all">
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
          <Link href="/company" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#63E3FF]/20 to-[#7A2CFF]/20 text-white mb-2">
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

      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setShowMobileMenu(false)}></div>
      )}

      <main className="lg:ml-64">
        <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/5 pl-20 pr-4 md:px-8 py-4 relative">
          <div className="absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-[#050505]/30 pointer-events-none"></div>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">Área da Empresa</h1>
              <p className="text-white/60 text-xs md:text-sm mt-1">Painel exclusivo da {user.company ?? 'empresa'} para acompanhar equipes, trilhas e certificados</p>
            </div>
            <div className="relative flex-shrink-0">
              <button
                onClick={toggleNotifications}
                className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all ${notificationsEnabled ? 'text-[#63E3FF] hover:bg-[#63E3FF]/10' : 'text-white/40 hover:text-white/60'}`}
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
        </header>

        <section className="px-4 md:px-8 py-6 md:py-8">
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#0a0a0a] via-[#07121a] to-[#0a0a0a] border border-white/10 p-6 md:p-10 mb-6 md:mb-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#63E3FF]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#63E3FF]/10 border border-[#63E3FF]/20 mb-4">
                  <Building2 className="w-4 h-4 text-[#63E3FF]" />
                  <span className="text-white text-sm font-semibold">Acesso empresarial</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">{user.company ?? 'Motiron'}</h2>
                <p className="text-white/70 max-w-2xl">Acompanhe progresso por colaborador, distribua cursos obrigatórios e visualize certificados emitidos sem misturar este perfil com contas pessoais.</p>
              </div>
              <div className="flex items-end gap-3">
                <button className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar relatório
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {companyStats.map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 hover:bg-white/10 transition-all group">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#63E3FF] to-[#7A2CFF] flex items-center justify-center">
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                </div>
                <p className="text-white/60 text-xs md:text-sm mb-1">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">{stat.value}</p>
                <p className="text-xs text-green-400">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            <div className="xl:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Colaboradores</h3>
                  <p className="text-white/60 text-sm">Perfis separados por pessoa e por empresa</p>
                </div>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar colaborador..."
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#63E3FF]/50"
                  />
                </div>
              </div>
              <div className="space-y-3">
                {paginatedEmployees.map((employee) => (
                  <div key={employee.email} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#63E3FF] to-[#7A2CFF] flex items-center justify-center text-white font-bold flex-shrink-0">
                          {employee.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold truncate">{employee.name}</p>
                          <p className="text-white/50 text-sm truncate">{employee.email} • {employee.area}</p>
                        </div>
                      </div>
                      <div className="w-full md:w-52">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/60 text-xs">Progresso</span>
                          <span className="text-[#63E3FF] text-xs font-bold">{employee.progress}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#63E3FF] to-[#7A2CFF]" style={{ width: `${employee.progress}%` }}></div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${employee.status === 'Concluído' ? 'bg-green-500/10 text-green-400' : employee.status === 'Pendente' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-[#63E3FF]/10 text-[#63E3FF]'}`}>{employee.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <PaginationControls page={employeePage} totalPages={totalEmployeePages} onPageChange={setEmployeePage} label="Colaboradores" />
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-[#63E3FF]" />
                  <h3 className="text-xl font-bold text-white">Cursos da empresa</h3>
                </div>
                <div className="space-y-3">
                  {paginatedCourses.map((course) => (
                    <div key={course.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <h4 className="text-white font-semibold text-sm leading-tight">{course.title}</h4>
                        {course.required && <span className="px-2 py-1 rounded-full bg-[#E548FF]/10 text-[#E548FF] text-[10px] font-bold">Obrigatório</span>}
                      </div>
                      <p className="text-white/50 text-xs mb-3">{course.enrolled} inscritos</p>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#63E3FF] to-[#7A2CFF]" style={{ width: `${course.completion}%` }}></div>
                      </div>
                      <p className="text-[#63E3FF] text-xs font-bold mt-2">{course.completion}% de conclusão</p>
                    </div>
                  ))}
                </div>
                <PaginationControls page={coursePage} totalPages={totalCoursePages} onPageChange={setCoursePage} label="Trilhas" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
