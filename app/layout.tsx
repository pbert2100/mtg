import type { Metadata } from "next";
import { Cinzel, Grenze_Gotisch, Public_Sans } from "next/font/google";
import { Backdrop } from "@/components/Backdrop";
import { SiteHeader } from "@/components/SiteHeader";
import { LIGA } from "@/lib/config";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  // Só os pesos realmente usados: 400 no corpo dos títulos, 600 no PageHeader.
  weight: ["400", "600"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const grenze = Grenze_Gotisch({
  variable: "--font-grenze",
  subsets: ["latin"],
  // Os números usam apenas o peso normal.
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${LIGA.nome} · ${LIGA.subtitulo}`,
    template: `%s · ${LIGA.nome}`,
  },
  description: LIGA.descricao,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${cinzel.variable} ${publicSans.variable} ${grenze.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col [padding-bottom:env(safe-area-inset-bottom)]">
        <Backdrop />
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-5 sm:py-14">{children}</main>
      </body>
    </html>
  );
}
