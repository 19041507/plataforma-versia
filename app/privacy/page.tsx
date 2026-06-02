import Link from "next/link";
import { ArrowLeft, Database, Eye, LockKeyhole, ShieldCheck } from "lucide-react";
import { VersiaLogo } from "../../components/VersiaLogo";

const sections = [
  {
    title: "1. Dados que podemos coletar",
    content:
      "A Versia pode coletar dados de identificação e acesso, como e-mail, nome exibido no perfil, tipo de conta, empresa vinculada, progresso em cursos, certificados emitidos, preferências de uso e informações técnicas necessárias para funcionamento da plataforma.",
  },
  {
    title: "2. Finalidade do uso dos dados",
    content:
      "Os dados são utilizados para autenticar usuários, separar perfis pessoais e empresariais, liberar cursos, registrar progresso, emitir certificados, exibir relatórios, melhorar a experiência, oferecer suporte e garantir segurança da plataforma.",
  },
  {
    title: "3. Dados de contas empresariais",
    content:
      "Quando o acesso for empresarial, a empresa responsável poderá visualizar informações necessárias para acompanhar treinamentos, como usuários vinculados, progresso, cursos concluídos e certificados. A Versia limita esse uso à finalidade de gestão educacional e capacitação.",
  },
  {
    title: "4. Compartilhamento de informações",
    content:
      "A Versia não vende dados pessoais. Informações podem ser compartilhadas apenas quando necessário para operação da plataforma, cumprimento legal, segurança, suporte técnico, emissão de certificados ou execução de serviços vinculados ao funcionamento da Versia.",
  },
  {
    title: "5. Segurança",
    content:
      "A plataforma adota medidas razoáveis de proteção, controle de acesso e boas práticas de desenvolvimento para reduzir riscos de acesso indevido, perda, alteração ou uso não autorizado de informações.",
  },
  {
    title: "6. Cookies e sessão",
    content:
      "A Versia pode utilizar cookies ou tecnologias semelhantes para manter o usuário conectado, lembrar preferências, proteger a sessão e direcionar corretamente perfis pessoais ou empresariais.",
  },
  {
    title: "7. Direitos do usuário",
    content:
      "O usuário pode solicitar informações sobre seus dados, correção, atualização ou exclusão quando aplicável. Algumas informações podem precisar ser mantidas por obrigação legal, segurança, comprovação de certificado ou registro operacional.",
  },
  {
    title: "8. Retenção de dados",
    content:
      "Os dados são mantidos pelo tempo necessário para cumprir as finalidades da plataforma, obrigações legais, segurança, auditoria, suporte, histórico de aprendizagem e emissão de certificados.",
  },
  {
    title: "9. Alterações desta política",
    content:
      "A Política de Privacidade pode ser atualizada para refletir melhorias, novas funcionalidades, mudanças legais ou ajustes operacionais. A versão mais recente estará disponível dentro da plataforma.",
  },
  {
    title: "10. Contato",
    content:
      "Dúvidas sobre privacidade, dados pessoais ou solicitações relacionadas podem ser enviadas pelos canais oficiais informados pela Versia dentro da plataforma ou pela equipe responsável pelo projeto.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7A2CFF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#63E3FF]/10 rounded-full blur-3xl" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7A2CFF]/10 border border-[#7A2CFF]/20 mb-6">
            <LockKeyhole className="w-5 h-5 text-[#63E3FF]" />
            <span className="text-sm font-semibold text-[#63E3FF]">Privacidade e proteção de dados</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Política de Privacidade da Versia</h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-3xl">
            Esta política explica como a Versia coleta, utiliza, protege e organiza dados de usuários, alunos e empresas para entregar uma experiência segura de aprendizagem e gestão de treinamentos.
          </p>
          <p className="text-white/40 text-sm mt-6">Última atualização: 02/06/2026</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <Database className="w-6 h-6 text-[#63E3FF] mb-3" />
            <h2 className="font-bold mb-2">Dados necessários</h2>
            <p className="text-white/60 text-sm">Coletamos apenas informações úteis para login, cursos, certificados e relatórios.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <ShieldCheck className="w-6 h-6 text-green-400 mb-3" />
            <h2 className="font-bold mb-2">Proteção</h2>
            <p className="text-white/60 text-sm">Aplicamos medidas de segurança e controle para proteger as informações.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <Eye className="w-6 h-6 text-[#FFD700] mb-3" />
            <h2 className="font-bold mb-2">Transparência</h2>
            <p className="text-white/60 text-sm">Explicamos de forma clara como os dados são usados na experiência Versia.</p>
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
          <span>© 2026 Versia. Privacidade e segurança como parte da experiência.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-[#63E3FF]">Termos de Uso</Link>
            <Link href="/subscription" className="hover:text-[#63E3FF]">Planos Premium</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
