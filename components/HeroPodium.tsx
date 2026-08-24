import type { CSSProperties } from "react";
import Link from "next/link";
import { CartaVazia, TiltCard } from "@/components/TiltCard";
import { CARD_WIDTH_PODIO } from "@/lib/card";

export type Destaque = {
  id: string;
  label: string;
  jogadorId: number | null;
  jogador: string | null;
  grupo: string | null;
  commander: string | null;
  /** Carta inteira, mostrada no pódio. */
  art: string | null;
  /** Ilustração, usada como fundo da página no hover. */
  ilustracao: string | null;
  valor: number;
};

export function HeroPodium({ destaques }: { destaques: Destaque[] }) {
  return (
    <section className="flex flex-wrap items-start justify-center gap-x-2 gap-y-10 py-4 sm:gap-x-8 sm:py-8">
      {destaques.map((destaque) => (
        <article
          key={destaque.id}
          className={`spotlight-card flex flex-col items-center ${CARD_WIDTH_PODIO}`}
        >
          {/* Cobre o fundo da página com a arte desta carta enquanto o cursor está nela. */}
          {destaque.ilustracao ? (
            <div
              aria-hidden="true"
              className="spotlight-layer"
              style={{ "--art": `url("${destaque.ilustracao}")` } as CSSProperties}
            />
          ) : null}

          <p className="font-display mb-3 text-center text-[10px] leading-tight tracking-[0.16em] text-gold/80 uppercase sm:mb-4 sm:text-[11px] sm:tracking-[0.22em]">
            {destaque.label}
          </p>

          {destaque.art || destaque.jogador ? (
            <TiltCard
              art={destaque.art}
              nome={destaque.commander}
              eager
              badge={
                <span
                  className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full border border-gold/50 bg-arcane-950/90 text-base text-gold-200 shadow-[0_10px_24px_-10px_#000] sm:-top-3 sm:-right-3 sm:size-11 sm:text-xl"
                  style={{ transform: "translateZ(34px)" }}
                >
                  <span className="num">{destaque.valor}</span>
                </span>
              }
            />
          ) : (
            <CartaVazia texto="Sem registro ainda" />
          )}

          <div className="mt-5 text-center">
            {destaque.jogadorId ? (
              <Link
                href={`/jogadores/${destaque.jogadorId}`}
                className="font-display inline-flex min-h-11 items-center text-xs tracking-[0.1em] text-gold-200 uppercase transition-colors hover:text-gold-200/70 sm:text-sm sm:tracking-[0.12em]"
              >
                {destaque.jogador}
              </Link>
            ) : (
              <span className="font-display text-sm tracking-[0.12em] text-mist-200/30 uppercase">
                —
              </span>
            )}
            {destaque.commander ? (
              <p className="hidden text-[11px] text-mist-200/45 sm:block">{destaque.commander}</p>
            ) : null}
          </div>
        </article>
      ))}
    </section>
  );
}
