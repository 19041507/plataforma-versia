import type { Metadata } from 'next';
import '../src/styles/index.css';
import { AuthGate } from '@/components/AuthGate';

export const metadata: Metadata = {
  title: 'Versia — Plataforma de Treinamento Corporativo',
  description:
    'Plataforma premium de treinamento corporativo com experiência imersiva, ' +
    'certificados digitais e planos Premium a partir de R$ 14,90/mês.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body><AuthGate />{children}</body>
    </html>
  );
}
