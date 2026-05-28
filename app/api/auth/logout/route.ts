import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAuthCookies().forEach((cookie) => response.headers.append('Set-Cookie', cookie));
  return response;
}
