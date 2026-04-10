import { Link } from "react-router";
import { VersiaLogo } from "../components/VersiaLogo";
import { Sparkles, Award, ArrowLeft } from "lucide-react";

export function LoginMobile() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Back Button */}
      <Link to="/" className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/60 hover:text-white hover:bg-black/60 transition-all">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Voltar</span>
      </Link>

      {/* Header with Branding */}
      <div className="relative overflow-hidden px-6 pt-12 pb-8">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#63E3FF]/20 via-[#7A2CFF]/20 to-[#E548FF]/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(99, 227, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(229, 72, 255, 0.2) 0%, transparent 50%)',
        }}></div>
        
        {/* Gradient separator - smooth transition to form section */}
        <div className="absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#050505] z-10"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <VersiaLogo size="md" />
          </div>
          
          <div className="text-center max-w-sm mx-auto">
            <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
              Transforme o aprendizado
            </h1>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-3 mt-8 max-w-sm mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#63E3FF] to-[#2FA7FF] flex items-center justify-center mb-2">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-white text-sm font-semibold mb-1">Aprofunde Sua Jornada</h3>
              <p className="text-white/60 text-xs">Eleve Seu Acesso</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7A2CFF] to-[#E548FF] flex items-center justify-center mb-2">
                <Award className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-white text-sm font-semibold mb-1">Aprendizagem</h3>
              <p className="text-white/60 text-xs">Engajamento garantido</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h2>
            <p className="text-white/60 text-sm">Entre na sua conta para continuar</p>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
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
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#63E3FF]/50 focus:border-[#63E3FF] transition-all"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 mt-0.5 rounded bg-white/5 border-white/20 text-[#63E3FF] focus:ring-[#63E3FF]/50"
              />
              <label htmlFor="terms" className="text-xs text-white/60">
                Aceito os{" "}
                <a href="#" className="text-[#63E3FF] hover:underline">
                  termos de uso
                </a>{" "}
                e{" "}
                <a href="#" className="text-[#63E3FF] hover:underline">
                  política de privacidade
                </a>
              </label>
            </div>

            <div className="space-y-3 pt-4">
              <Link to="/dashboard">
                <button
                  type="button"
                  className="w-full px-6 py-4 rounded-xl font-semibold text-white transition-all shadow-lg shadow-[#63E3FF]/20 hover:shadow-[#63E3FF]/40 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #63E3FF 0%, #2FA7FF 30%, #7A2CFF 65%, #E548FF 100%)',
                  }}
                >
                  Entrar na plataforma
                </button>
              </Link>

              <button
                type="button"
                className="w-full px-6 py-4 rounded-xl font-semibold text-white border-2 border-white/10 hover:border-[#63E3FF]/50 hover:bg-white/5 active:scale-95 transition-all"
              >
                Criar nova conta
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-[#63E3FF] hover:underline">
              Esqueceu sua senha?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}