import { GroupIcon } from "@/components/Icons";
import { PlayerChip } from "@/components/PlayerChip";
import { GoldButton, Num, Pill } from "@/components/ui";
import type { GroupView } from "@/lib/data";

/**
 * Card de grupo usado na home e na página de grupos.
 * É uma `<section>`, e não um link envolvendo tudo, porque os jogadores da lista já
 * são links — âncora dentro de âncora é HTML inválido.
 */
export function GroupCard({ grupo, posicao }: { grupo: GroupView; posicao: number }) {
  const naZonaDaFinal = posicao <= 2 && grupo.totalPontos > 0;

  return (
    <section className="panel panel-hover flex flex-col p-4 sm:p-5">
      {/* `flex-wrap` deixa a pílula cair para a linha de baixo em telas estreitas,
          em vez de esticar o card além da coluna. */}
      <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/8 text-gold-200">
            <GroupIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.16em] text-mist-200/40 uppercase">
              {posicao}º na corrida
            </p>
            <h3 className="font-display truncate text-lg tracking-[0.12em] text-gold-200 uppercase">
              {grupo.nome}
            </h3>
          </div>
        </div>
        {naZonaDaFinal ? <Pill tone="gold">Zona da final</Pill> : null}
      </div>

      <div className="rule-gold my-4 opacity-40" />

      <ol className="space-y-3">
        {grupo.players.map((player, pos) => (
          <li key={player.player.id} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Num className="w-4 shrink-0 text-sm text-mist-200/35">{pos + 1}</Num>
              <PlayerChip player={player.player} size="sm" />
            </div>
            <Num className="text-xl text-gold-200">{player.points}</Num>
          </li>
        ))}
      </ol>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <div>
          <p className="text-[10px] tracking-[0.14em] text-mist-200/40 uppercase">Total do grupo</p>
          <Num className="text-3xl text-gold-200">{grupo.totalPontos}</Num>
        </div>
        <GoldButton href={`/grupos/${grupo.slug}`}>Detalhes</GoldButton>
      </div>
    </section>
  );
}
