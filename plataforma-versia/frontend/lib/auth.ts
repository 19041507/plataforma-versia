import type { NextRequest } from 'next/server';
import type { VersiaUser } from './clientUser';

export const SESSION_COOKIE_NAME = 'versia_session';
export const USER_COOKIE_NAME = 'versia_user';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias
const secureAttribute = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
const defaultCookieAttributes = `Path=/; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}; ${secureAttribute}`;

export function createAuthCookies(user: VersiaUser) {
  const userValue = encodeURIComponent(JSON.stringify(user));

  return [
    `${SESSION_COOKIE_NAME}=1; ${defaultCookieAttributes}`,
    `${USER_COOKIE_NAME}=${userValue}; ${defaultCookieAttributes}`,
  ];
}

export function clearAuthCookies() {
  return [
    `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax;`,
    `${USER_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax;`,
  ];
}

export function isAuthenticated(request: NextRequest) {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value === '1';
}

export function getAuthUser(request: NextRequest): Partial<VersiaUser> | null {
  const rawUser = request.cookies.get(USER_COOKIE_NAME)?.value;
  if (!rawUser) return null;

  try {
    return JSON.parse(decodeURIComponent(rawUser)) as Partial<VersiaUser>;
  } catch {
    return null;
  }
}
