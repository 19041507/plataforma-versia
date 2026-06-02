'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Award, BookOpen, Building2, Home, Menu, Settings, User, X } from 'lucide-react';
import { VersiaLogo } from './VersiaLogo';
import { UserProfileMini } from './UserProfileMini';
import { LogoutButton } from './LogoutButton';
import { DEFAULT_USER, getClientUser, type VersiaUser } from '@/lib/clientUser';

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
  { href: '/courses', label: 'Catálogo de Cursos', icon: <BookOpen className="w-5 h-5" /> },
  { href: '/certificate', label: 'Certificados', icon: <Award className="w-5 h-5" /> },
  { href: '/profile', label: 'Perfil', icon: <User className="w-5 h-5" /> },
  { href: '/company', label: 'Área da Empresa', icon: <Building2 className="w-5 h-5" /> },
  { href: '/settings', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<VersiaUser>(DEFAULT_USER);

  useEffect(() => {
    setUser(getClientUser());
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <button
        onClick={() => setOpen((value) => !value)}
        className="fixed top-4 left-4 z-50 lg:hidden w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-white"
        aria-label="Abrir menu"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-black/50 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col z-40 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-center">
          <div className="scale-125 origin-center">
            <VersiaLogo size="sm" />
          </div>
        </div>

        <nav className="mt-12 flex-1 space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-r from-[#63E3FF]/20 to-[#7A2CFF]/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="rounded-xl bg-white/5 border border-white/10 p-3 mb-4 text-xs text-white/60">
          {user.role === 'company'
            ? `Perfil empresarial: ${user.company ?? user.name}`
            : `Perfil individual: ${user.company ?? 'Versia'}`}
        </div>

        <div className="border-t border-white/10 pt-4">
          <UserProfileMini />
          <LogoutButton />
        </div>
      </aside>

      {open && (
        <button
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        />
      )}

      <main className="lg:ml-64 min-h-screen">{children}</main>
    </div>
  );
}
