'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const PUBLIC_PATHS = ['/', '/login-desktop', '/login-mobile', '/terms', '/privacy'];

function hasSession() {
  if (typeof window === 'undefined') return false;

  return (
    document.cookie.includes('versia_session=1') ||
    localStorage.getItem('versia_session') === '1'
  );
}

export function AuthGate() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;

    const isPublic = PUBLIC_PATHS.includes(pathname);
    if (isPublic) return;

    if (!hasSession()) {
      router.replace('/login-desktop');
    }
  }, [pathname, router]);

  return null;
}
