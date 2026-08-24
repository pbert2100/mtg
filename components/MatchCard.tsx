import Link from "next/link";
import { ArrowIcon, CriterionIcon } from "@/components/Icons";
import { PlayerAvatar } from "@/components/PlayerChip";
import { Num, Pill } from "@/components/ui";
import { formatDate, type MatchView } from "@/lib/data";

export function MatchCard({ match }: { match: MatchView }) {
  const segundo = match.awards.find((a) => a.criterion.id === "segundo_lugar")?.player ?? null;
  const totalPontos = match.pontos.reduce((sum, p) => sum + p.points, 0);

  return (
    <Link
      href={`/partidas/${match.partida.id}`}
      className="panel panel-hover group flex flex-col gap-4 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-xs tracking-[0.18em] text-mist-200/50 uppercase">
            Partida <Num className="text-sm text-gold-200">#{match.partida.id}</Num>
          </p>
          <p className="mt-1 text-[11px] text-mist-200/40">{formatDate(match.data)}</p>
        </div>
        {match.etapa ? (
          <Pill tone={match.etapa.id === "final" ? "gold" : "default"}>
            {match.etapa.nome} · {match.etapa.formato}
          </Pill>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {match.grupos.map((grupo) => (
          <span
            key={grupo}
            className="rounded border border-mist/25 px-2 py-0.5 text-[10px] tracking-[0.12em] text-mist-200/55 uppercase"
          >
            {grupo}
          </span>
        ))}
      </div>

      <div className="rule-gold opacity-40" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {match.vencedor ? (
            <>
              <PlayerAvatar player={match.vencedor} size="md" />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-gold/70 uppercase">
                  <CriterionIcon id="vencedor" className="size-3.5" />
                  Vencedor
                </p>
                <p className="truncate text-sm font-medium text-mist-200">
                  {match.vencedor.jogador}
                </p>
                {segundo ? (
                  <p className="truncate text-[11px] text-mist-200/40">2º {segundo.jogador}</p>
                ) : null}
              </div>
            </>
          ) : (
            <p className="text-xs text-mist-200/40">Sem vencedor registrado</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right leading-none">
            <Num className="text-2xl text-gold-200">{totalPontos}</Num>
            <p className="mt-1 text-[10px] tracking-[0.12em] text-mist-200/40 uppercase">
              pts na mesa
            </p>
          </div>
          <ArrowIcon className="size-4 text-mist-200/30 transition-all group-hover:translate-x-0.5 group-hover:text-gold-200" />
        </div>
      </div>
    </Link>
  );
}
