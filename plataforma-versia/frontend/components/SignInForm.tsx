'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { getClientUser } from '@/lib/clientUser';
import { DEMO_LOGIN_ENABLED, isApiConfigured, loginWithBackend, loginWithDemo } from '@/lib/versiaApi';

interface SignInFormProps {
  buttonClass?: string;
}

export function SignInForm({ buttonClass }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const alreadyAuthenticated =
      document.cookie.includes('versia_session=1') ||
      localStorage.getItem('versia_session') === '1';

    if (alreadyAuthenticated) {
      const user = getClientUser();
      window.location.replace(user.role === 'company' ? '/company' : '/dashboard');
    }
  }, []);

  function finishLogin(redirectTo: string) {
    // Força uma navegação completa após salvar cookie/localStorage.
    // Isso evita o bug em produção onde o App Router só reconhecia a sessão após F5.
    window.setTimeout(() => {
      window.location.assign(redirectTo);
    }, 50);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    try {
      if (DEMO_LOGIN_ENABLED && lowerEmail === 'motiron@gmail.com') {
        const demoLogin = loginWithDemo(normalizedEmail, password);
        finishLogin(demoLogin.redirectTo);
        return;
      }

      const backendLogin = await loginWithBackend(normalizedEmail, password);
      if (backendLogin) {
        finishLogin(backendLogin.redirectTo);
        return;
      }

      if (!DEMO_LOGIN_ENABLED) {
        setError('Configure NEXT_PUBLIC_API_URL na Vercel para usar o backend da Versia.');
        return;
      }

      const demoLogin = loginWithDemo(normalizedEmail, password);
      finishLogin(demoLogin.redirectTo);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao entrar na plataforma.';
      const status = typeof error === 'object' && error !== null && 'status' in error
        ? Number((error as { status?: number }).status)
        : undefined;
      const isCredentialError = status === 400 || status === 401 || status === 403;
      const canFallbackToDemo = DEMO_LOGIN_ENABLED && (!isCredentialError || !isApiConfigured());

      if (canFallbackToDemo) {
        const demoLogin = loginWithDemo(normalizedEmail, password);
        finishLogin(demoLogin.redirectTo);
        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
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
