// app/layout.tsx
'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from 'sonner';
import ClientProviders from '@/components/context/ClientProviders';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SplashScreen } from '@/components/SplashScreen';

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
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        router.replace('/auth');
      }, 5400);
      return () => clearTimeout(timer);
    }
  }, [showSplash, router]);

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {showSplash ? (
          <SplashScreen />
        ) : (
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
        )}
      </body>
    </html>
  );
};