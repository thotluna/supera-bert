import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Background } from "@/app/components/background";
import { Header } from "@/app/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz Electric · Preparación REBT Profesional",
  description: "Plataforma avanzada de simulacros para la certificación REBT.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full relative" suppressHydrationWarning>
        <Background />
        <div className="flex flex-col min-h-full md:h-full max-w-5xl mx-auto gap-2 p-4 md:p-0">
          <Header />
          <main className="flex-1 flex flex-col items-center">
            <div className="my-auto w-full flex flex-col items-center">
              {children}
            </div>
          </main>
          <footer className="py-2 w-full mx-auto">
            <p className="text-[8px] font-bold text-center text-foreground/60 uppercase tracking-[0.3em]">
              Powered by Thot Luna · 2026
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
