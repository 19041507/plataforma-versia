'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell, BellOff, BookOpen, Building2, Home, Menu, Save, Settings, User, X, Award } from 'lucide-react';
import { VersiaLogo } from '@/components/VersiaLogo';
import { UserProfileMini } from '@/components/UserProfileMini';
import { LogoutButton } from '@/components/LogoutButton';
import { getClientUser, type VersiaUser, DEFAULT_USER } from '@/lib/clientUser';

export default function SettingsPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [user, setUser] = useState<VersiaUser>(DEFAULT_USER);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [weeklyGoal, setWeeklyGoal] = useState('10 horas/semana');
  const [certificateVisibility, setCertificateVisibility] = useState('Privado');
  const [themeMode, setThemeMode] = useState('Escuro Versia');

  useEffect(() => {
    const saved = localStorage.getItem('versia_notifications_enabled');
    if (saved !== null) setNotificationsEnabled(saved === 'true');
    setWeeklyGoal(localStorage.getItem('versia_weekly_goal') ?? '10 horas/semana');
    setCertificateVisibility(localStorage.getItem('versia_certificate_visibility') ?? 'Privado');
    setThemeMode(localStorage.getItem('versia_theme_mode') ?? 'Escuro Versia');
    setUser(getClientUser());
  }, []);

  const saveSettings = () => {
    localStorage.setItem('versia_notifications_enabled', String(notificationsEnabled));
    localStorage.setItem('versia_weekly_goal', weeklyGoal);
    localStorage.setItem('versia_certificate_visibility', certificateVisibility);
    localStorage.setItem('versia_theme_mode', themeMode);
    setSavedMessage('Configurações salvas com sucesso!');
    setTimeout(() => setSavedMessage(null), 2500);
  };

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
          <Link href="/company" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 mb-2 transition-all">
            <Building2 className="w-5 h-5" />
            <span className="font-medium">Área da Empresa</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#63E3FF]/20 to-[#7A2CFF]/20 text-white mb-2">
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
        <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 relative">
          <div className="absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-[#050505]/30 pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Configurações</h1>
              <p className="text-white/60 text-xs md:text-sm mt-1">Ajuste preferências de aprendizado, notificações e segurança</p>
            </div>
            <button
              onClick={saveSettings}
              className="px-4 md:px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #63E3FF 0%, #2FA7FF 30%, #7A2CFF 65%, #E548FF 100%)' }}
            >
              <Save className="w-4 h-4" />
              Salvar
            </button>
          </div>
        </header>

        <section className="px-4 md:px-8 py-6 md:py-8">
          {savedMessage && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2">
              {savedMessage}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#63E3FF] to-[#7A2CFF] flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Notificações</h2>
                    <p className="text-white/60 text-sm">Controle alertas de aulas, certificados e novidades</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotificationsEnabled((prev) => !prev)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${notificationsEnabled ? 'bg-[#63E3FF]/10 border-[#63E3FF]/30 text-white' : 'bg-white/5 border-white/10 text-white/60'}`}
                >
                  <span className="font-medium">Receber notificações da Versia</span>
                  {notificationsEnabled ? <Bell className="w-5 h-5 text-[#63E3FF]" /> : <BellOff className="w-5 h-5" />}
                </button>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7A2CFF] to-[#E548FF] flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Aprendizado</h2>
                    <p className="text-white/60 text-sm">Defina metas e formato preferido</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Meta semanal</label>
                    <select value={weeklyGoal} onChange={(e) => setWeeklyGoal(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#63E3FF]/50">
                      <option className="bg-[#050505]">5 horas/semana</option>
                      <option className="bg-[#050505]">10 horas/semana</option>
                      <option className="bg-[#050505]">15 horas/semana</option>
                      <option className="bg-[#050505]">20 horas/semana</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Tema visual</label>
                    <select value={themeMode} onChange={(e) => setThemeMode(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#63E3FF]/50">
                      <option className="bg-[#050505]">Escuro Versia</option>
                      <option className="bg-[#050505]">Alto contraste</option>
                      <option className="bg-[#050505]">Modo foco</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E548FF] to-[#63E3FF] flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Certificados</h2>
                    <p className="text-white/60 text-sm">Controle como seus certificados aparecem na plataforma</p>
                  </div>
                </div>
                <select value={certificateVisibility} onChange={(e) => setCertificateVisibility(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#63E3FF]/50">
                  <option className="bg-[#050505]">Privado</option>
                  <option className="bg-[#050505]">Visível para gestores</option>
                  <option className="bg-[#050505]">Público com link</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#63E3FF] to-[#7A2CFF] flex items-center justify-center mb-4">
                  {user.role === 'company' ? <Building2 className="w-7 h-7 text-white" /> : <User className="w-7 h-7 text-white" />}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{user.role === 'company' ? user.company : user.name}</h3>
                <p className="text-white/60 text-sm mb-4">{user.email}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-white/50">Tipo de acesso</span>
                    <span className="text-white font-medium">{user.role === 'company' ? 'Empresa' : 'Aluno'}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-white/50">Departamento</span>
                    <span className="text-white font-medium">{user.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Membro desde</span>
                    <span className="text-white font-medium">{user.memberSince}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
