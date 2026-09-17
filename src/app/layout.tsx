import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const display = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Cormorant_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maison Karnstein — Comté de Karnstein",
    template: "%s · Maison Karnstein",
  },
  description:
    "Site de la maison Karnstein, lignée comtale de Kryta : la lignée, le domaine, sa carte et ses services.",
  openGraph: {
    title: "Maison Karnstein",
    description:
      "Onze générations de nuit ininterrompue. Le fief, ses lieux et ses services.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} min-h-dvh text-[1.05rem] leading-relaxed`}
      >
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        {/* Le site n'a pas de mode clair : on fige le thème des notifications. */}
        <Toaster position="top-center" theme="dark" />
      </body>
    </html>
  );
}
