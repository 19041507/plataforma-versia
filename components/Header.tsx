'use client';

import { Bell, BellOff, Menu } from "lucide-react";
import { UserProfileMini } from "./UserProfileMini";
import { LogoutButton } from "./LogoutButton";
import { useNotifications } from "@/hooks/useNotifications";

interface HeaderProps {
  children?: React.ReactNode;
  showSidebarToggle?: boolean;
  onToggleSidebar?: () => void;
  className?: string;
}

export function Header({ children, showSidebarToggle, onToggleSidebar, className = "" }: HeaderProps) {
  const { notificationsEnabled, notificationTooltip, toggleNotifications } = useNotifications();

  return (
    <header className={`sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Slot para conteúdo da esquerda (Busca, Breadcrumbs, etc) */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Lado Direito Unificado */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2 md:gap-4 pr-2 md:pr-4 border-r border-white/10">
            <UserProfileMini />
            <LogoutButton variant="header" />
          </div>

          {/* Botão de Notificações Centralizado */}
          <div className="relative">
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

          {showSidebarToggle && (
            <button onClick={onToggleSidebar} className="text-white/60 hover:text-white transition-all">
              <Menu className="w-5 md:w-6 h-5 md:h-6" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}