'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { buildUserFromEmail, getClientUser } from '@/lib/clientUser';

interface SignInFormProps {
  buttonClass?: string;
}

export function SignInForm({ buttonClass }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.cookie.includes('versia_session=1')) {
      const user = getClientUser();
      router.replace(user.role === 'company' ? '/company' : '/dashboard');
    }
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.trim();
    const lowerEmail = normalizedEmail.toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      setError('Por favor, insira um e-mail corporativo válido.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (lowerEmail === 'motiron@gmail.com' && password !== '123456') {
      setError('Senha incorreta para o acesso empresarial da Motiron.');
      return;
    }
    if (!acceptedTerms) {
      setError('Você deve aceitar os termos de uso para continuar.');
      return;
    }

    setLoading(true);

    const role = lowerEmail === 'motiron@gmail.com' ? 'company' : 'student';
    const user = buildUserFromEmail(normalizedEmail, role);
    const maxAge = 60 * 60 * 24 * 30;
    const encodedUser = encodeURIComponent(JSON.stringify(user));

    document.cookie = `versia_session=1; Path=/; SameSite=Lax; Max-Age=${maxAge}`;
    document.cookie = `versia_user=${encodedUser}; Path=/; SameSite=Lax; Max-Age=${maxAge}`;
    localStorage.setItem('versia_session', '1');
    localStorage.setItem('versia_user', JSON.stringify(user));

    router.push(role === 'company' ? '/company' : '/dashboard');
  }


  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
          Email corporativo
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="seu.email@empresa.com"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#63E3FF]/50 focus:border-[#63E3FF] transition-all"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#63E3FF]/50 focus:border-[#63E3FF] transition-all"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="terms"
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
          className="w-4 h-4 rounded bg-white/5 border-white/20 text-[#63E3FF] focus:ring-[#63E3FF]/50 cursor-pointer"
        />
        <label htmlFor="terms" className="text-sm text-white/60 cursor-pointer select-none">
          Aceito os{' '}
          <Link href="/terms" className="text-[#63E3FF] hover:underline">
            termos de uso
          </Link>{' '}
          e{' '}
          <Link href="/privacy" className="text-[#63E3FF] hover:underline">
            política de privacidade
          </Link>
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-400 animate-in fade-in slide-in-from-top-1" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={loading || !acceptedTerms}
          className={buttonClass ?? 'w-full px-6 py-4 rounded-xl font-semibold text-white transition-all shadow-lg shadow-[#63E3FF]/20 hover:shadow-[#63E3FF]/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'}
          style={
            buttonClass
              ? undefined
              : {
                  background: 'linear-gradient(135deg, #63E3FF 0%, #2FA7FF 30%, #7A2CFF 65%, #E548FF 100%)',
                }
          }
        >
          {loading ? 'Entrando...' : 'Entrar na plataforma'}
        </button>
      </div>

      <div className="mt-8 text-center">
        <a href="#" className="text-sm text-[#63E3FF] hover:underline">
          Esqueceu sua senha?
        </a>
      </div>
    </form>
  );
}
