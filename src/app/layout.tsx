'use client';

import '../styles/globals.css';
import { Toaster } from 'sonner';
import ClientProviders from '@/components/context/ClientProviders';
import { ThemeProvider } from '@/components/context/ThemeContext';
import { useEffect, useState } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import AuthSplashWrapper from '@/components/context/AuthSplashWrapper';

import { usePathname } from 'next/navigation';
import Head from 'next/head';



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <>
    <html lang="pt-BR">
      <Head>
        <title>Nome da Página</title>
        <meta name="description" content="Descrição da página" />
      </Head>
      <body className={`antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50`}>
          <ThemeProvider>
            <ClientProviders>
              <AuthSplashWrapper pathname={pathname}>
                <div className="min-h-screen">
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
              </AuthSplashWrapper>
            </ClientProviders>
          </ThemeProvider>
      </body>
    </html>
    </>
  );
}
