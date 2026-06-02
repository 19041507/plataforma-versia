import { buildUserFromEmail, type VersiaUser, type VersiaUserRole } from './clientUser';

const ACCESS_TOKEN_KEY = 'versia_access_token';
const REFRESH_TOKEN_KEY = 'versia_refresh_token';
const SESSION_COOKIE_NAME = 'versia_session';
const USER_COOKIE_NAME = 'versia_user';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');
export const TENANT_SCHEMA = (process.env.NEXT_PUBLIC_TENANT_SCHEMA ?? 'demo').trim() || 'demo';
export const DEMO_LOGIN_ENABLED = process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED !== 'false';

export type BackendUser = {
  id?: number | string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  papel?: string;
  telefone?: string;
  foto_perfil?: string;
  empresa?: number | string | { nome?: string; name?: string; razao_social?: string };
  criado_em?: string;
};

type BackendLoginResponse = {
  token?: string;
  access?: string;
  refresh?: string;
  usuario?: BackendUser;
  user?: BackendUser;
  detail?: string;
  erro?: string;
  error?: string;
};

export type LoginResult = {
  user: VersiaUser;
  redirectTo: string;
  source: 'backend' | 'demo';
};

export function isApiConfigured() {
  return API_BASE_URL.length > 0;
}

function apiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

function authHeaders(includeAuth = false): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Tenant': TENANT_SCHEMA,
  };

  if (includeAuth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${value}; Path=/; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function getEmpresaName(empresa: BackendUser['empresa']) {
  if (!empresa) return undefined;
  if (typeof empresa === 'string') return empresa;
  if (typeof empresa === 'number') return undefined;
  return empresa.nome ?? empresa.name ?? empresa.razao_social;
}

function normalizeBackendUser(backendUser: BackendUser | undefined, fallbackEmail: string): VersiaUser {
  const email = backendUser?.email || fallbackEmail;
  const fullName = [backendUser?.first_name, backendUser?.last_name].filter(Boolean).join(' ').trim();
  const papel = (backendUser?.papel ?? '').toLowerCase();
  const role: VersiaUserRole =
    email.toLowerCase() === 'motiron@gmail.com' || papel.includes('empresa') || papel.includes('gestor') || papel.includes('admin')
      ? 'company'
      : 'student';

  const user = buildUserFromEmail(email, role);

  return {
    ...user,
    name: fullName || backendUser?.username || user.name,
    email,
    role,
    company: getEmpresaName(backendUser?.empresa) || user.company,
    phone: backendUser?.telefone || user.phone,
  };
}

export function saveClientAuth(user: VersiaUser, accessToken?: string, refreshToken?: string) {
  if (typeof window === 'undefined') return;

  const encodedUser = encodeURIComponent(JSON.stringify(user));
  setCookie(SESSION_COOKIE_NAME, '1');
  setCookie(USER_COOKIE_NAME, encodedUser);

  localStorage.setItem('versia_session', '1');
  localStorage.setItem('versia_user', JSON.stringify(user));

  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearClientAuth() {
  if (typeof window === 'undefined') return;

  deleteCookie(SESSION_COOKIE_NAME);
  deleteCookie(USER_COOKIE_NAME);
  localStorage.removeItem('versia_session');
  localStorage.removeItem('versia_user');
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.clear();
}

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function loginWithBackend(email: string, password: string): Promise<LoginResult | null> {
  if (!isApiConfigured()) return null;

  const response = await fetch(apiUrl('/api/auth/login/'), {
    method: 'POST',
    headers: authHeaders(false),
    body: JSON.stringify({
      usuario: email,
      username: email,
      email,
      senha: password,
      password,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as BackendLoginResponse;

  if (!response.ok) {
    const message = data.erro || data.error || data.detail || 'Não foi possível autenticar no backend.';
    throw new Error(message);
  }

  const accessToken = data.token || data.access;
  const refreshToken = data.refresh;
  const user = normalizeBackendUser(data.usuario || data.user, email);
  saveClientAuth(user, accessToken, refreshToken);

  return {
    user,
    redirectTo: user.role === 'company' ? '/company' : '/dashboard',
    source: 'backend',
  };
}

export function loginWithDemo(email: string, password: string): LoginResult {
  const normalizedEmail = email.trim();
  const lowerEmail = normalizedEmail.toLowerCase();

  if (lowerEmail === 'motiron@gmail.com' && password !== '123456') {
    throw new Error('Senha incorreta para o acesso empresarial da Motiron.');
  }

  const role: VersiaUserRole = lowerEmail === 'motiron@gmail.com' ? 'company' : 'student';
  const user = buildUserFromEmail(normalizedEmail, role);
  saveClientAuth(user);

  return {
    user,
    redirectTo: role === 'company' ? '/company' : '/dashboard',
    source: 'demo',
  };
}

export async function logoutFromBackend() {
  if (!isApiConfigured()) return;

  const refresh = getRefreshToken();
  if (!refresh) return;

  await fetch(apiUrl('/api/auth/logout/'), {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify({ refresh }),
  }).catch(() => undefined);
}

export async function fetchVersiaApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!isApiConfigured()) {
    throw new Error('NEXT_PUBLIC_API_URL não foi configurada no frontend.');
  }

  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      ...authHeaders(true),
      ...(init.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.erro || data?.error || data?.detail || 'Erro ao consultar a API da Versia.';
    throw new Error(message);
  }

  return data as T;
}
