"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/config";

export function SiteHeader() {
  const pathname = usePathname();
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    // Listener passivo e barato: só lê o scroll e compara um booleano. O React ignora
    // o setState quando o valor não muda, então não há re-render a cada quadro.
    const atualizar = () => setRolou(window.scrollY > 8);
    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
    return () => window.removeEventListener("scroll", atualizar);
  }, []);

  // No topo não há filtro nenhum: blur e saturação alterariam o fundo da página
  // (estrelas e linhas douradas) mesmo sem nenhuma cor aplicada por cima.
  const vidro = rolou ? "backdrop-blur-xl backdrop-saturate-150" : "";

  return (
    <header
      data-rolou={rolou}
      className={`site-header sticky top-0 z-40 [padding-top:env(safe-area-inset-top)] ${vidro}`}
    >
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-center gap-0 px-1 sm:gap-2 sm:px-5">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative inline-flex min-h-11 items-center rounded-md px-2 text-[11px] tracking-[0.08em] uppercase transition-colors sm:px-4 sm:tracking-[0.16em] ${
                active
                  ? "text-gold-200"
                  : "text-mist-200/60 hover:bg-white/[0.04] hover:text-mist-200"
              }`}
            >
              {item.label}
              {active ? (
                <span className="absolute inset-x-2 bottom-1.5 h-px bg-gradient-to-r from-transparent via-gold to-transparent sm:inset-x-4" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
