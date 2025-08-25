'use client';

import '../styles/globals.css';
import { Toaster } from 'sonner';
import ClientProviders from '@/components/context/ClientProviders';
import { ThemeProvider } from '@/components/context/ThemeContext';
import { useEffect, useState } from 'react';
import { SplashScreen } from '@/components/SplashScreen';

import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (pathname === '/') {
      setShowSplash(false);
      return;
    }
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showSplash, pathname]);

  return (
    <html lang="pt-BR">
      <body className={`antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50`}>
        {showSplash ? (
          <SplashScreen />
        ) : (
          <ThemeProvider>
            <ClientProviders>
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
            </ClientProviders>
          </ThemeProvider>
        )}
      </body>
    </html>
  );
}
