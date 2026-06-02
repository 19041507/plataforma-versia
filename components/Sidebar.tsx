import Link from "next/link";
import { VersiaLogo } from "./VersiaLogo";
import { Home, BookOpen, Award, Settings, User, Building2 } from "lucide-react";
import { UserProfileMini } from "./UserProfileMini";
import { LogoutButton } from "./LogoutButton";

interface SidebarProps {
  currentPage: "dashboard" | "courses" | "certificate" | "lesson" | "settings" | "company" | "profile";
  showMobile: boolean;
}

export function Sidebar({ currentPage, showMobile }: SidebarProps) {
  return (
    <aside className={`fixed left-0 top-0 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col z-50 transform transition-transform duration-300 lg:transform-none ${showMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Gradient transition to main content */}
      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-[#050505]/50 pointer-events-none"></div>
      
      <VersiaLogo size="md" />
      
      <nav className="mt-12 flex-1">
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
            currentPage === "dashboard" 
              ? "bg-gradient-to-r from-[#63E3FF]/20 to-[#7A2CFF]/20 text-white" 
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link 
          href="/courses" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
            currentPage === "courses" || currentPage === "lesson"
              ? "bg-gradient-to-r from-[#63E3FF]/20 to-[#7A2CFF]/20 text-white" 
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">Catálogo de Cursos</span>
        </Link>
        <Link 
          href="/certificate" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
            currentPage === "certificate" 
              ? "bg-gradient-to-r from-[#63E3FF]/20 to-[#7A2CFF]/20 text-white" 
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="font-medium">Certificados</span>
        </Link>
        <Link 
          href="/profile" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
            currentPage === "profile" 
              ? "bg-gradient-to-r from-[#63E3FF]/20 to-[#7A2CFF]/20 text-white" 
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Perfil</span>
        </Link>
        <Link 
          href="/company" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
            currentPage === "company" 
              ? "bg-gradient-to-r from-[#63E3FF]/20 to-[#7A2CFF]/20 text-white" 
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="font-medium">Área da Empresa</span>
        </Link>
        <Link 
          href="/settings" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
            currentPage === "settings" 
              ? "bg-gradient-to-r from-[#63E3FF]/20 to-[#7A2CFF]/20 text-white" 
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configurações</span>
        </Link>
      </nav>

      <div className="border-t border-white/5 pt-4">
        <UserProfileMini />
        <LogoutButton />
      </div>
    </aside>
  );
}