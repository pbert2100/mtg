import type { CSSProperties } from "react";
import { PlayerChip } from "@/components/PlayerChip";
import { Num } from "@/components/ui";
import { ilustracaoDe, type RecordView } from "@/lib/data";

const GRID =
  "grid-cols-[minmax(0,1fr)_minmax(0,auto)_3rem_3.5rem] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_4rem_5rem]";

export function RecordsTable({ records }: { records: RecordView[] }) {
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <div className="md:min-w-[560px]">
          <div
            className={`grid items-center gap-x-2 border-b border-gold/15 px-4 py-3 text-[10px] tracking-[0.04em] text-mist-200/45 uppercase md:gap-x-3 md:tracking-[0.16em] ${GRID}`}
          >
            <span>Critério</span>
            <span>Líder</span>
            <span className="text-right">Recorde</span>
            <span className="text-right">Pontos</span>
          </div>

          {records.map((record) => {
            // Em caso de empate, fica o jogador melhor colocado na classificação geral.
            const lider = record.leaders[0] ?? null;
            const art = lider ? ilustracaoDe(lider.player) : null;
            // Pontos que o líder acumulou nesta categoria: peso do critério x vezes conquistado.
            const pontosAcumulados = record.valor * record.criterion.points;

            return (
              <div
                key={record.criterion.id}
                style={art ? ({ "--art": `url("${art}")` } as CSSProperties) : undefined}
                className={`grid items-center gap-x-2 border-b border-white/[0.04] px-4 py-3 transition-colors last:border-0 hover:bg-white/[0.03] md:gap-x-3 ${GRID} ${
                  art ? "art-layer" : ""
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm text-mist-200/90">
                    {record.criterion.title}
                  </span>
                  <span className="block truncate text-[11px] text-mist-200/40">
                    {record.criterion.points > 0
                      ? `${record.criterion.points} pt${record.criterion.points > 1 ? "s" : ""} por vez`
                      : "sem pontos"}
                  </span>
                </span>

                {lider ? (
                  <PlayerChip player={lider.player} size="sm" subtitle={lider.grupo} />
                ) : (
                  <span className="text-xs text-mist-200/25">sem registro</span>
                )}

                <span className="text-right">
                  <Num
                    className={
                      record.valor > 0 ? "text-2xl text-mist-200/90" : "text-2xl text-mist-200/20"
                    }
                  >
                    {record.valor}
                  </Num>
                </span>

                <span className="text-right">
                  <Num
                    className={
                      pontosAcumulados > 0 ? "text-2xl text-gold-200" : "text-2xl text-mist-200/20"
                    }
                  >
                    {pontosAcumulados}
                  </Num>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
