import type { Metadata } from 'next';
import '../src/styles/index.css';

export const metadata: Metadata = {
  title: 'Versia — Plataforma de Treinamento Corporativo',
  description:
    'Plataforma premium de treinamento corporativo com experiência imersiva, certificados digitais e assinatura Premium.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#050505] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
