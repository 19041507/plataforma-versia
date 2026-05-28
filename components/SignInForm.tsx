'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Importação do Link adicionada aqui

interface SignInFormProps {
  buttonClass?: string;
}

export function SignInForm({ buttonClass }: SignInFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.cookie.includes('versia_session=1')) {
      router.replace('/dashboard');
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail corporativo válido.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!acceptedTerms) {
      setError('Você deve aceitar os termos de uso para continuar.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? 'Falha ao autenticar.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Erro ao conectar. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
          Nome completo
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Seu nome"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#63E3FF]/50 focus:border-[#63E3FF] transition-all"
        />
      </div>

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