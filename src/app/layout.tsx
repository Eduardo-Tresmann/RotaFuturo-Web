import type { Metadata } from "next";
import { ThemeProvider } from "@/components/context/ThemeContext";

export const metadata: Metadata = {
  title: "RotaFuturo",
  description: "Simulador de Carreira para o Ensino Médio!",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}