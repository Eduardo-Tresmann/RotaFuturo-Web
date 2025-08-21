// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from 'sonner';
import ClientProviders from '@/components/context/ClientProviders';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RotaFuturo - Planeje seu futuro',
  description:
    'Plataforma para planejamento de carreira e desenvolvimento profissional',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ClientProviders>
          <div className="min-h-screen bg-zinc-200 ">
            <main>{children}</main>
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={4000}
              expand={true}
              className="z-50"
            />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
