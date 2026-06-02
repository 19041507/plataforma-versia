import { NextResponse } from 'next/server';
import { createAuthCookies } from '@/lib/auth';
import { buildUserFromEmail } from '@/lib/clientUser';

const COMPANY_EMAIL = 'motiron@gmail.com';
const COMPANY_PASSWORD = '123456';

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const normalizedEmail = email.toLowerCase();

  if (!email.includes('@') || password.length < 6) {
    return NextResponse.json(
      { error: 'Preencha um email válido e senha com pelo menos 6 caracteres.' },
      { status: 400 }
    );
  }

  if (normalizedEmail === COMPANY_EMAIL && password !== COMPANY_PASSWORD) {
    return NextResponse.json(
      { error: 'Senha incorreta para o acesso empresarial da Motiron.' },
      { status: 401 }
    );
  }

  const role = normalizedEmail === COMPANY_EMAIL ? 'company' : 'student';
  const user = buildUserFromEmail(email, role);
  const redirectTo = role === 'company' ? '/company' : '/dashboard';
  const cookies = createAuthCookies(user);
  const response = NextResponse.json({ success: true, redirectTo, user });
  cookies.forEach((cookie) => response.headers.append('Set-Cookie', cookie));

  return response;
}
