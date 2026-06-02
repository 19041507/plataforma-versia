'use client';

import Link from "next/link";
import { VersiaLogo } from "../../components/VersiaLogo";
import { PremiumBadge } from "../../components/PremiumBadge";
import { LogoutButton } from "../../components/LogoutButton";
import { 
  Crown,
  Check,
  X as XIcon,
  Zap,
  Star,
  Award,
  Download,
  Users,
  Headphones,
  TrendingUp,
  Sparkles,
  Shield,
  Rocket,
  Home,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
 const plans = [
    {
      name: "Gratuito",
      price: "0,00",
      period: "para sempre",
      description: "Para conhecer a plataforma e iniciar seus primeiros cursos",
      icon: Star,
      color: "from-gray-400 to-gray-600",
      features: [
        { text: "Acesso a cursos introdutórios", included: true },
        { text: "Certificados digitais padrão", included: true },
        { text: "Até 3 cursos simultâneos", included: true },
        { text: "Histórico básico de progresso", included: true },
        { text: "Suporte via email em até 48h", included: true },
        { text: "Cursos premium e trilhas avançadas", included: false },
        { text: "Downloads ilimitados", included: false },
        { text: "Relatórios personalizados", included: false },
        { text: "Mentorias e encontros ao vivo", included: false },
      ],
      cta: "Plano Atual",
      popular: false,
    },
    {
      name: "Premium",
      price: "14,90",
      period: "por mês",
      annualPrice: "149,00",
      annualPeriod: "por ano",
      description: "O plano com mais valor para estudar mais pagando pouco",
      icon: Crown,
      color: "from-[#FFD700] to-[#FF8C00]",
      features: [
        { text: "Tudo do plano gratuito", included: true },
        { text: "Acesso a trilhas premium selecionadas", included: true },
        { text: "Certificados digitais valorizados", included: true },
        { text: "Downloads ilimitados de PDFs e materiais", included: true },
        { text: "Até 8 cursos simultâneos", included: true },
        { text: "Aulas práticas e exercícios guiados", included: true },
        { text: "Relatório mensal de evolução", included: true },
        { text: "Suporte prioritário em até 24h", included: true },
        { text: "Comunidade de alunos Premium", included: true },
        { text: "Conteúdos novos adicionados mensalmente", included: true },
        { text: "Mentoria individual 1:1", included: false },
        { text: "Suporte 24/7 com prioridade máxima", included: false },
      ],
      cta: "Começar com Premium",
      popular: true,
      savings: billingCycle === "annual" ? "Economize R$ 29,80/ano" : undefined,
    },
    {
      name: "Premium Max",
      price: "24,90",
      period: "por mês",
      annualPrice: "249,00",
      annualPeriod: "por ano",
      description: "Para quem quer acompanhamento, prioridade e recursos avançados",
      icon: Zap,
      color: "from-blue-400 to-blue-600",
      features: [
        { text: "Tudo do plano Premium", included: true },
        { text: "Acesso a 100% dos cursos premium", included: true },
        { text: "Certificados com selo Premium Max", included: true },
        { text: "Cursos simultâneos ilimitados", included: true },
        { text: "Mentoria 1:1 mensal com especialista", included: true },
        { text: "Suporte 24/7 com prioridade máxima", included: true },
        { text: "Relatórios avançados e recomendações", included: true },
        { text: "Acesso antecipado a novos cursos", included: true },
        { text: "Webinars ao vivo e networking exclusivo", included: true },
        { text: "Plano de estudos personalizado", included: true },
      ],
      cta: "Assinar Premium Max",
      popular: false,
      savings: billingCycle === "annual" ? "Economize R$ 49,80/ano" : undefined,
    },
  ];
  const premiumBenefits = [
    {
      icon: Zap,
      title: "Melhor custo-benefício",
      description: "O Premium entrega materiais ilimitados, trilhas premium selecionadas e relatórios por um preço acessível.",
      color: "from-[#63E3FF] to-[#2FA7FF]",
    },
    {
      icon: Award,
      title: "Certificados que valorizam o aluno",
      description: "Certificados digitais para comprovar evolução e fortalecer currículo ou treinamento interno.",
      color: "from-[#FFD700] to-[#FFA500]",
    },
    {
      icon: Download,
      title: "Materiais sem travar o estudo",
      description: "Downloads ilimitados de PDFs, exercícios e materiais de apoio para estudar dentro e fora da plataforma.",
      color: "from-[#7A2CFF] to-[#E548FF]",
    },
    {
      icon: TrendingUp,
      title: "Evolução visível",
      description: "Relatórios mensais mostram progresso, cursos em andamento e próximos passos recomendados.",
      color: "from-[#2FA7FF] to-[#7A2CFF]",
    },
    {
      icon: Users,
      title: "Comunidade Premium",
      description: "Ambiente para acompanhar novidades, trocar experiências e se manter motivado durante os estudos.",
      color: "from-[#E548FF] to-[#63E3FF]",
    },
    {
      icon: Rocket,
      title: "Upgrade para quem precisa de mais",
      description: "O Premium Max adiciona mentorias, suporte máximo, todos os cursos e plano de estudos personalizado.",
      color: "from-[#63E3FF] to-[#7A2CFF]",
    },
  ];

  const testimonials = [
    {
      name: "Mariana Santos",
      role: "Gerente de Projetos",
      company: "Tech Solutions",
      photo: "MS",
      text: "O Premium foi o plano ideal para minha rotina: preço acessível, materiais completos e certificados para comprovar cada etapa.",
      rating: 5,
    },
    {
      name: "Roberto Almeida",
      role: "Desenvolvedor Senior",
      company: "Innovation Labs",
      photo: "RA",
      text: "A diferença do gratuito para o Premium vale muito. Consegui estudar mais cursos, baixar materiais e acompanhar meu progresso.",
      rating: 5,
    },
    {
      name: "Juliana Costa",
      role: "Líder de Equipe",
      company: "Digital Corp",
      photo: "JC",
      text: "Uso o Premium Max quando preciso de acompanhamento mais próximo, mas o Premium já entrega o essencial para evoluir rápido.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Qual plano é mais indicado para a maioria dos alunos?",
      answer: "O Premium é o principal plano da Versia porque entrega trilhas premium selecionadas, downloads ilimitados, certificados e relatórios por um preço mais acessível.",
    },
    {
      question: "Qual a diferença entre Premium e Premium Max?",
      answer: "O Premium Max inclui tudo do Premium e adiciona recursos para quem precisa de acompanhamento mais forte: todos os cursos premium, mentoria 1:1, suporte 24/7, relatórios avançados e plano de estudos personalizado.",
    },
    {
      question: "Posso cancelar a assinatura a qualquer momento?",
      answer: "Sim. Você pode cancelar quando quiser, sem taxas ou multas. O acesso permanece ativo até o fim do período contratado.",
    },
    {
      question: "Os certificados são digitais?",
      answer: "Sim. A Versia oferece certificados digitais para comprovar conclusão. No Premium Max, os certificados recebem selo especial do plano.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#E548FF]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#63E3FF]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <VersiaLogo size="md" />
              <div className="flex items-center gap-3 md:gap-4">
                <Link href="/dashboard">
                  <button className="px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 text-sm md:text-base">
                    <Home className="w-4 h-4 md:w-5 h-5" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                </Link>
                <LogoutButton variant="header" />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-4 md:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#FF8C00]/20 border border-[#FFD700]/30">
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
              <span className="text-sm font-semibold text-white">Planos pensados para cada fase</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Acelere sua carreira com
              <br />
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] bg-clip-text text-transparent">
                Versia Premium
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Escolha entre o Premium com melhor custo-benefício e o Premium Max para quem precisa de acompanhamento avançado
            </p>

            <div className="flex items-center justify-center gap-4 mb-12">
              <Shield className="w-6 h-6 text-green-400" />
              <span className="text-white/80 text-sm"></span>
            </div>
          </div>
        </section>

        {/* Billing Toggle */}
        <section className="px-4 md:px-8 pb-8">
          <div className="max-w-lg mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2 flex items-center gap-2">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-[#63E3FF] to-[#7A2CFF] text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all relative ${
                  billingCycle === "annual"
                    ? "bg-gradient-to-r from-[#63E3FF] to-[#7A2CFF] text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Anual
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  -17%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="px-4 md:px-8 pb-16 md:pb-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white/5 backdrop-blur-sm border rounded-3xl p-6 md:p-8 transition-all ${
                  plan.popular
                    ? "border-[#FFD700] shadow-2xl shadow-[#FFD700]/20 scale-105"
                    : "border-white/10 hover:bg-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] px-6 py-2 rounded-full font-bold text-sm text-white shadow-lg">
                      🔥 MELHOR CUSTO-BENEFÍCIO
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} items-center justify-center mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/60 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-white">
                      R$ {billingCycle === "annual" && plan.annualPrice ? plan.annualPrice : plan.price}
                    </span>
                    <span className="text-white/60 text-lg ml-2">
                      /{billingCycle === "annual" && plan.annualPeriod ? plan.annualPeriod : plan.period}
                    </span>
                  </div>
                  
                  {plan.savings && billingCycle === "annual" && (
                    <p className="text-green-400 text-sm font-semibold">{plan.savings}</p>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XIcon className="w-5 h-5 text-white/20 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-white text-sm" : "text-white/40 text-sm line-through"}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                    plan.popular
                      ? "text-white shadow-lg hover:scale-105"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  style={
                    plan.popular
                      ? {
                          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                        }
                      : undefined
                  }
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Premium Benefits */}
        <section className="px-4 md:px-8 py-16 md:py-20 bg-gradient-to-b from-transparent via-black/40 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Por que o Premium é o principal chamariz?
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Benefícios fortes, úteis e com preço acessível para convencer o aluno a sair do gratuito
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {premiumBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-white/70 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-4 md:px-8 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex mb-4">
                <PremiumBadge variant="large" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                O que dizem nossos alunos Premium
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Profissionais que evoluíram com os planos pagos da Versia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
                    ))}
                  </div>
                  
                  <p className="text-white/80 mb-6 leading-relaxed">"{testimonial.text}"</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#63E3FF] to-[#7A2CFF] flex items-center justify-center font-bold text-white">
                      {testimonial.photo}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-white/60 text-sm">{testimonial.role}</p>
                      <p className="text-white/40 text-xs">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 md:px-8 py-16 md:py-20 bg-gradient-to-b from-transparent via-black/40 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-white/70 text-lg">
                Tire suas dúvidas sobre os planos Premium e Premium Max
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                >
                  <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                  <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 md:px-8 py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505] border border-[#FFD700]/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-8 left-8 w-32 h-32 border-2 border-[#FFD700] rounded-full"></div>
                <div className="absolute bottom-8 right-8 w-40 h-40 border-2 border-[#FF8C00] rounded-full"></div>
              </div>
              
              <div className="relative z-10">
                <Crown className="w-16 h-16 text-[#FFD700] mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Pronto para desbloquear o Premium?
                </h2>
                <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                  Comece pelo plano com melhor custo-benefício e faça upgrade para o Premium Max quando precisar de recursos avançados
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    className="px-8 py-4 rounded-xl font-bold text-lg text-white shadow-2xl hover:scale-105 transition-all w-full sm:w-auto"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                    }}
                  >
                    Assinar Premium - R$ 14,90/mês
                  </button>
                  
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <button className="px-8 py-4 rounded-xl font-bold text-lg text-white bg-white/10 hover:bg-white/20 transition-all w-full">
                      Continuar Gratuito
                    </button>
                  </Link>
                </div>
                
                <p className="text-white/60 text-sm mt-6">
                  💳 Sem compromisso • Cancele quando quiser • Garantia de 7 dias
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <p className="text-white/60 text-sm">
                © 2026 Versia. Plataforma de treinamento corporativo premium.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-white/40 text-sm">
                <Link href="/terms" className="hover:text-[#63E3FF] transition-all">Termos de Uso</Link>
                <Link href="/privacy" className="hover:text-[#63E3FF] transition-all">Política de Privacidade</Link>
                <span>Transformando carreiras através do conhecimento</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
