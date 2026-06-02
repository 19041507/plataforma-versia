export type VersiaUserRole = 'student' | 'company';

export interface VersiaUser {
  name: string;
  email: string;
  role: VersiaUserRole;
  company?: string;
  department?: string;
  position?: string;
  phone?: string;
  location?: string;
  memberSince?: string;
}

export const DEFAULT_USER: VersiaUser = {
  name: 'Daniel Augusto',
  email: 'daniel.augusto@empresa.com',
  role: 'student',
  company: 'Versia Learning Platform',
  department: 'Tecnologia da Informação',
  position: 'Analista de Dados',
  phone: '+55 11 99999-9999',
  location: 'São Paulo, Brasil',
  memberSince: 'Jan 2025',
};

export const MOTIRON_USER: VersiaUser = {
  name: 'Motiron',
  email: 'Motiron@gmail.com',
  role: 'company',
  company: 'Motiron',
  department: 'Gestão Corporativa',
  position: 'Administrador da Empresa',
  phone: '+55 81 9264-1658',
  location: 'Recife, Brasil',
  memberSince: 'Jun 2026',
};

export function buildUserFromEmail(email: string, role: VersiaUserRole = 'student'): VersiaUser {
  const normalizedEmail = email.trim();
  const lowerEmail = normalizedEmail.toLowerCase();

  if (lowerEmail === 'motiron@gmail.com') {
    return MOTIRON_USER;
  }

  const rawName = normalizedEmail.split('@')[0] || 'Usuário Versia';
  const inferredName = rawName
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

  return {
    ...DEFAULT_USER,
    name: inferredName || DEFAULT_USER.name,
    email: normalizedEmail || DEFAULT_USER.email,
    role,
  };
}

export function getClientUser(): VersiaUser {
  if (typeof document === 'undefined') return DEFAULT_USER;

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith('versia_user='));

  if (!cookie) return DEFAULT_USER;

  try {
    const value = decodeURIComponent(cookie.split('=')[1] ?? '');
    const parsed = JSON.parse(value) as Partial<VersiaUser>;
    const baseUser = buildUserFromEmail(parsed.email || DEFAULT_USER.email, parsed.role === 'company' ? 'company' : 'student');

    return {
      ...baseUser,
      ...parsed,
      role: parsed.role === 'company' ? 'company' : 'student',
      name: parsed.name || baseUser.name,
      email: parsed.email || baseUser.email,
    };
  } catch {
    return DEFAULT_USER;
  }
}

export function getUserInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'VS';
}
