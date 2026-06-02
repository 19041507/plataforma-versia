import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, Shield } from "lucide-react";
import { VersiaLogo } from "../../components/VersiaLogo";

const sections = [
  {
    title: "1. Aceitação dos termos",
    content:
      "Ao acessar ou utilizar a Versia, o usuário declara que leu, compreendeu e concorda com estes Termos de Uso. Caso não concorde com alguma condição, o uso da plataforma deve ser interrompido.",
  },
  {
    title: "2. Objetivo da plataforma",
    content:
      "A Versia é uma plataforma digital de aprendizagem e treinamento corporativo, com cursos, aulas, materiais de apoio, certificados, planos pagos e recursos de acompanhamento de progresso.",
  },
  {
    title: "3. Cadastro, login e responsabilidade da conta",
    content:
      "O usuário deve informar dados verdadeiros e manter a confidencialidade de sua senha. Toda atividade realizada na conta será considerada de responsabilidade do titular, salvo comprovação de falha de segurança da plataforma.",
  },
  {
    title: "4. Uso permitido",
    content:
      "A plataforma deve ser utilizada para fins educacionais, profissionais e corporativos. É proibido copiar, revender, distribuir, tentar burlar acessos, compartilhar credenciais, explorar vulnerabilidades ou utilizar a Versia para fins ilícitos.",
  },
  {
    title: "5. Conteúdos, cursos e certificados",
    content:
      "Os cursos, materiais, vídeos, textos, certificados, layouts e recursos visuais pertencem à Versia ou a seus parceiros. Certificados digitais comprovam a conclusão dentro da plataforma, mas não substituem certificações oficiais externas quando exigidas por lei ou por instituições específicas.",
  },
  {
    title: "6. Planos pagos e cancelamento",
    content:
      "Planos como Premium e Premium Max podem oferecer recursos adicionais, conforme descrição apresentada na página de assinatura. O usuário pode cancelar o plano a qualquer momento, mantendo o acesso até o fim do período contratado, quando aplicável.",
  },
  {
    title: "7. Área da empresa",
    content:
      "Contas empresariais podem ter acesso a painel próprio, acompanhamento de colaboradores, métricas de progresso e recursos administrativos. A empresa é responsável por autorizar corretamente seus usuários internos e utilizar os dados apenas para finalidades legítimas de treinamento.",
  },
  {
    title: "8. Disponibilidade e alterações",
    content:
      "A Versia pode receber melhorias, ajustes de conteúdo, manutenção técnica e alterações de funcionalidades. A plataforma buscará manter a melhor disponibilidade possível, mas não garante funcionamento ininterrupto em todos os momentos.",
  },
  {
    title: "9. Limitação de responsabilidade",
    content:
      "A Versia não se responsabiliza por perdas causadas por uso indevido da conta, compartilhamento de senha, instabilidade de internet do usuário, decisões tomadas exclusivamente com base nos conteúdos ou uso da plataforma fora de sua finalidade educacional.",
  },
  {
    title: "10. Contato",
    content:
      "Dúvidas sobre estes Termos de Uso podem ser enviadas pelos canais oficiais informados pela Versia dentro da plataforma ou pela equipe responsável pelo projeto.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#63E3FF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7A2CFF]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <header className="flex items-center justify-between gap-4 mb-10">
          <VersiaLogo size="md" />
          <Link href="/login-desktop" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </header>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-sm mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#63E3FF]/10 border border-[#63E3FF]/20 mb-6">
            <FileText className="w-5 h-5 text-[#63E3FF]" />
            <span className="text-sm font-semibold text-[#63E3FF]">Documento oficial da plataforma</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Termos de Uso da Versia</h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-3xl">
            Estes termos definem as regras de acesso, uso, responsabilidades e limites aplicáveis à plataforma Versia, incluindo contas pessoais, contas empresariais, cursos, certificados e planos de assinatura.
          </p>
          <p className="text-white/40 text-sm mt-6">Última atualização: 02/06/2026</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <CheckCircle2 className="w-6 h-6 text-green-400 mb-3" />
            <h2 className="font-bold mb-2">Uso educacional</h2>
            <p className="text-white/60 text-sm">A Versia deve ser usada para aprendizagem, capacitação e evolução profissional.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <Shield className="w-6 h-6 text-[#63E3FF] mb-3" />
            <h2 className="font-bold mb-2">Conta protegida</h2>
            <p className="text-white/60 text-sm">O usuário é responsável por manter e-mail, senha e acessos em segurança.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <FileText className="w-6 h-6 text-[#FFD700] mb-3" />
            <h2 className="font-bold mb-2">Conteúdo protegido</h2>
            <p className="text-white/60 text-sm">Cursos, materiais e certificados seguem as regras de propriedade intelectual.</p>
          </div>
        </section>

        <section className="space-y-4">
          {sections.map((section) => (
            <article key={section.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all">
              <h2 className="text-xl font-bold mb-3">{section.title}</h2>
              <p className="text-white/70 leading-relaxed">{section.content}</p>
            </article>
          ))}
        </section>

        <footer className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-white/10 text-sm text-white/50">
          <span>© 2026 Versia. Todos os direitos reservados.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#63E3FF]">Política de Privacidade</Link>
            <Link href="/subscription" className="hover:text-[#63E3FF]">Planos Premium</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
