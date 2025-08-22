// app/layout.tsx
'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from 'sonner';
import ClientProviders from '@/components/context/ClientProviders';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
      router.replace('/auth');
    }
  }, [router]);

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
