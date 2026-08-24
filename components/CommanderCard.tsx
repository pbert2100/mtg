import type { CSSProperties } from "react";
import { LinkIcon } from "@/components/Icons";
import { TiltCard } from "@/components/TiltCard";
import { GoldButton } from "@/components/ui";
import { CARD_WIDTH } from "@/lib/card";

export type CommanderInfo = {
  slot: 1 | 2;
  nome: string | null;
  /** Carta inteira, mostrada no card. */
  imagem: string | null;
  /** Ilustração, usada como fundo da página no hover. */
  ilustracao: string | null;
  deck: string | null;
};

export function CommanderCard({ commander }: { commander: CommanderInfo }) {
  return (
    <article className={`spotlight-card flex flex-col items-center ${CARD_WIDTH}`}>
      {/* Cobre o fundo da página com a ilustração desta carta enquanto o cursor está nela. */}
      {commander.ilustracao ? (
        <div
          aria-hidden="true"
          className="spotlight-layer"
          style={{ "--art": `url("${commander.ilustracao}")` } as CSSProperties}
        />
      ) : null}

      {/* `min-h` mantém as cartas alinhadas quando um nome ocupa duas linhas e o outro não. */}
      <h3 className="font-display mb-4 flex min-h-10 items-end justify-center text-center text-sm tracking-[0.12em] text-gold-200 uppercase">
        {commander.nome ?? "Commander sem nome"}
      </h3>

      <TiltCard art={commander.imagem} nome={commander.nome} />

      {commander.deck ? (
        <div className="mt-5">
          <GoldButton href={commander.deck} external>
            <LinkIcon className="size-3.5" />
            Deck
          </GoldButton>
        </div>
      ) : null}
    </article>
  );
}
