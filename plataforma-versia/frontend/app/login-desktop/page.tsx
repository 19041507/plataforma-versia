'use client';

import { SignInForm } from '@/components/SignInForm';
import { VersiaLoginLogo } from '../../components/VersiaLoginLogo';

export default function LoginDesktopPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#63E3FF]/20 via-[#7A2CFF]/20 to-[#E548FF]/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 227, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(229, 72, 255, 0.15) 0%, transparent 50%)',
        }}></div>

        {/* Gradient separator - smooth transition to right side */}
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-r from-transparent to-[#050505] z-10"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-16 w-full">
          <div>
            <VersiaLoginLogo size="lg" />

            <div className="mt-12 max-w-md">
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Transforme o aprendizado da sua empresa
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                Plataforma com experiência imersiva e foco em retenção de conhecimento.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12 flex justify-center">
            <VersiaLoginLogo size="md" />
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-3">Bem-vindo de volta</h2>
            <p className="text-white/60">Entre na sua conta para continuar aprendendo</p>
          </div>

          <SignInForm />

          <div className="mt-8 text-center">
            <a href="#" className="text-sm text-[#63E3FF] hover:underline">
              Esqueceu sua senha?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
