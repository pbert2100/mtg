import type { CSSProperties } from "react";
import { CriterionIcon } from "@/components/Icons";
import { PlayerChip } from "@/components/PlayerChip";
import { Num } from "@/components/ui";
import { CRITERIA_BY_ID, type CriterionId } from "@/lib/criteria";
import { ilustracaoDe, type PlayerStats } from "@/lib/data";

const COMPACT_COLUMNS: CriterionId[] = [
  "vencedor",
  "segundo_lugar",
  "eliminacoes",
  "primeiro_sangue",
  "boardwipe",
];

const GRID =
  "grid-cols-[2.25rem_minmax(0,1fr)_3.25rem] md:grid-cols-[3rem_minmax(0,1fr)_repeat(5,2.75rem)_4.5rem]";

function Position({ index }: { index: number }) {
  const medal =
    index === 0
      ? "border-gold/70 bg-gold/15 text-gold-200"
      : index === 1
        ? "border-mist/50 bg-white/[0.06] text-mist-200"
        : index === 2
          ? "border-gold-700/60 bg-gold-700/15 text-gold/80"
          : "border-transparent text-mist-200/40";
  return (
    <span
      className={`inline-flex size-8 items-center justify-center rounded-full border text-sm ${medal}`}
    >
      <span className="num">{index + 1}</span>
    </span>
  );
}

export function StandingsTable({ rows }: { rows: PlayerStats[] }) {
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <div className="md:min-w-[560px]">
          <div
            className={`grid items-center gap-x-2 border-b border-gold/15 px-4 py-3 text-[10px] tracking-[0.04em] text-mist-200/45 uppercase md:gap-x-3 md:tracking-[0.16em] ${GRID}`}
          >
            <span>#</span>
            <span>Jogador</span>
            {COMPACT_COLUMNS.map((id) => (
              <span
                key={id}
                title={CRITERIA_BY_ID[id].title}
                className="hidden justify-center md:flex"
              >
                <CriterionIcon id={id} className="size-4 text-gold/60" />
              </span>
            ))}
            <span className="text-right">Pontos</span>
          </div>

          {rows.map((row, index) => {
            const art = ilustracaoDe(row.player);
            return (
              <div
                key={row.player.id}
                style={art ? ({ "--art": `url("${art}")` } as CSSProperties) : undefined}
                className={`grid items-center gap-x-2 border-b border-white/[0.04] px-4 py-3 transition-colors last:border-0 hover:bg-white/[0.03] md:gap-x-3 ${GRID} ${
                  art ? "art-layer" : ""
                }`}
              >
                <Position index={index} />
                <PlayerChip player={row.player} size="sm" />
                {COMPACT_COLUMNS.map((id) => (
                  <span key={id} className="hidden justify-center md:flex">
                    <Num
                      className={
                        row.counts[id] > 0
                          ? "text-base text-mist-200/90"
                          : "text-base text-mist-200/20"
                      }
                    >
                      {row.counts[id]}
                    </Num>
                  </span>
                ))}
                <span className="text-right">
                  <Num className="text-2xl text-gold-200">{row.points}</Num>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
