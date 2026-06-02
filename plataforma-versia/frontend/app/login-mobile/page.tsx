import { SignInForm } from '@/components/SignInForm';
import { VersiaLoginLogo } from "../../components/VersiaLoginLogo";

export default function LoginMobilePage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col overflow-hidden">

      {/* Header with Branding */}
      <div className="relative overflow-hidden px-6 pt-16 pb-4">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#63E3FF]/20 via-[#7A2CFF]/20 to-[#E548FF]/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(99, 227, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(229, 72, 255, 0.2) 0%, transparent 50%)',
        }}></div>

        {/* Gradient separator - smooth transition to form section */}
        <div className="absolute left-0 right-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#050505] z-10"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <VersiaLoginLogo size="md" />
          </div>

          <div className="text-center max-w-sm mx-auto">
            <h1 className="text-xl font-bold text-white leading-tight">
              Transforme o aprendizado
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-2 overflow-y-auto">
        <div className="max-w-sm mx-auto">
          <div className="mb-3">
            <h2 className="text-xl font-bold text-white mb-1">Bem-vindo de volta</h2>
            <p className="text-white/60 text-sm">Entre na sua conta para continuar</p>
          </div>

          <SignInForm />
        </div>
      </div>
    </div>
  );
}