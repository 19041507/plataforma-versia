import { NextResponse } from 'next/server';
import { createAuthCookies } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!name || !email.includes('@') || password.length < 6) {
    return NextResponse.json(
      { error: 'Preencha nome, email válido e senha com pelo menos 6 caracteres.' },
      { status: 400 }
    );
  }

  const cookies = createAuthCookies(name, email.toLowerCase());
  const response = NextResponse.json({ success: true });
  cookies.forEach((cookie) => response.headers.append('Set-Cookie', cookie));

  return response;
}
