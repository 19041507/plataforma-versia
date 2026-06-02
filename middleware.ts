import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'versia_session';
const USER_COOKIE_NAME = 'versia_user';
const PUBLIC_PATHS = ['/', '/login-desktop', '/login-mobile', '/terms', '/privacy', '/favicon.ico', '/robots.txt'];

function isAuthenticated(request: NextRequest) {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value === '1';
}

function getAuthRole(request: NextRequest): 'student' | 'company' | null {
  const rawUser = request.cookies.get(USER_COOKIE_NAME)?.value;
  if (!rawUser) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(rawUser)) as { role?: string };
    return parsed.role === 'company' ? 'company' : 'student';
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/auth') ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    if (isAuthenticated(request) && (pathname === '/login-desktop' || pathname === '/login-mobile' || pathname === '/')) {
      const destination = getAuthRole(request) === 'company' ? '/company' : '/dashboard';
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated(request)) {
    const loginUrl = new URL('/login-desktop', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
