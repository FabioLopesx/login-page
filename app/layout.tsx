import type { Metadata } from "next";
import { Bungee } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Seja bem vindo!",
  description: "Seja bem vindo!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${bungee.className} antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
