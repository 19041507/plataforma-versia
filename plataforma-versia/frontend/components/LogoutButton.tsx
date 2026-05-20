'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";

interface LogoutButtonProps {
  variant?: "sidebar" | "header";
}

export function LogoutButton({ variant = "sidebar" }: LogoutButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleLogout() {
    try {
      localStorage.removeItem("versia_user");
      localStorage.removeItem("versia_session");
      sessionStorage.clear();
    } catch {
      // Mantém a saída funcionando mesmo se o armazenamento estiver indisponível.
    }

    router.push("/login-desktop");
  }

  const buttonClass = variant === "header"
    ? "px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 text-sm md:text-base"
    : "mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 mb-2 transition-all w-full";

  const iconClass = variant === "header" ? "w-4 h-4 md:w-5 md:h-5" : "w-5 h-5";

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className={buttonClass}
      >
        <LogOut className={iconClass} />
        <span className="font-medium">Sair</span>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />

          <div className="relative w-full max-w-md rounded-2xl bg-[#0B0B0F] border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#63E3FF]/10 via-transparent to-[#7A2CFF]/10 pointer-events-none" />

            <div className="relative p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Sair do sistema?</h3>
                  <p className="text-white/60 text-sm mt-2">
                    Você deseja encerrar sua sessão na Versia agora?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#63E3FF] to-[#7A2CFF] text-white hover:opacity-90 transition-all font-semibold"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
