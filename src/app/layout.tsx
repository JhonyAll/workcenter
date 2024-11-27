// app/layout.tsx
import { Metadata } from "next";
import localFont from "next/font/local";
import { Roboto } from 'next/font/google';
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import ThemeRegistry from '@/components/ThemeRegistry';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme';
import Layout from "@/components/Layout";


const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "Worker Center",
  description: "Criado pelo grupo Z",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={roboto.variable + " max-w-screen"}
      >
        <ThemeRegistry>
          <ClientLayout>{children}</ClientLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
