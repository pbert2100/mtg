import type { ReactNode } from "react";
import { CriterionIcon } from "@/components/Icons";
import type { CriterionId } from "@/lib/criteria";

/**
 * Lista de critérios em linhas — usada na tabela de pontuação, nos destaques do grupo
 * e nos critérios de uma partida. Existe para que os três tenham exatamente o mesmo
 * espaçamento, divisor e tipografia.
 */
export function CriteriaList({ children }: { children: ReactNode }) {
  return <div className="panel divide-y divide-white/[0.05]">{children}</div>;
}

export function CriteriaRow({
  id,
  titulo,
  apagado = false,
  children,
}: {
  id: CriterionId;
  titulo: string;
  /** Critério sem registro: ícone e texto recuam, mas a linha continua no lugar. */
  apagado?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <CriterionIcon
          id={id}
          className={`size-5 shrink-0 ${apagado ? "text-mist-200/25" : "text-gold/75"}`}
        />
        <p className={`truncate text-sm ${apagado ? "text-mist-200/45" : "text-mist-200/90"}`}>
          {titulo}
        </p>
      </div>
      {children ? <div className="flex shrink-0 items-center gap-4">{children}</div> : null}
    </div>
  );
}
