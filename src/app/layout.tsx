
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/context/ThemeContext';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import ClientProviders from '@/components/context/ClientProviders';
import ClientOnlyLoader from '@/components/ui/ClientOnlyLoader';

export const metadata: Metadata = {
  title: 'RotaFuturo',
  description: 'Simulador de Carreira para o Ensino Médio!',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
  },
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
        <ClientProviders>
          <ClientOnlyLoader />
          <ThemeProvider>{children}</ThemeProvider>
        </ClientProviders>
        <Toaster richColors />
      </body>
    </html>
  );
}
