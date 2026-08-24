import type { CriterionId } from "@/lib/criteria";

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const PATHS: Record<CriterionId, React.ReactNode> = {
  vencedor: (
    <>
      <path d="M3 17.2 4.9 6.8l4.2 4.6L12 4.6l2.9 6.8 4.2-4.6L21 17.2Z" />
      <path d="M4.4 20.2h15.2" />
    </>
  ),
  segundo_lugar: (
    <>
      <path d="M8.4 3.2 10.6 10M15.6 3.2 13.4 10" />
      <circle cx="12" cy="15.2" r="5.4" />
      <path d="M10.4 13.8h3.2l-3.2 3.4h3.2" />
    </>
  ),
  eliminacoes: (
    <>
      <path d="M12 2.8c-4.4 0-7 3-7 6.6 0 2.2 1 3.7 2.2 4.7v3.6h9.6v-3.6c1.2-1 2.2-2.5 2.2-4.7 0-3.6-2.6-6.6-7-6.6Z" />
      <circle cx="9.4" cy="9.8" r="1.4" />
      <circle cx="14.6" cy="9.8" r="1.4" />
      <path d="M9.4 17.7v3.5M14.6 17.7v3.5M12 17.7v3.5" />
    </>
  ),
  eliminacoes_cd: (
    <>
      <path d="M12 2.4 14.3 6.6V13.4H9.7V6.6Z" />
      <path d="M6.8 13.4h10.4M12 13.4v6.2M9.6 21h4.8" />
    </>
  ),
  maior_dano: (
    <>
      <path d="M13.6 2.4 5.4 13.6h5.4L10 21.6l8.4-11.4h-5.6Z" />
    </>
  ),
  boardwipe: (
    <>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 2v3.2M12 18.8V22M2 12h3.2M18.8 12H22M4.9 4.9 7.2 7.2M16.8 16.8l2.3 2.3M19.1 4.9 16.8 7.2M7.2 16.8l-2.3 2.3" />
    </>
  ),
  primeiro_sangue: (
    <path d="M12 2.8s-6.6 7.2-6.6 11.4a6.6 6.6 0 0 0 13.2 0C18.6 10 12 2.8 12 2.8Z" />
  ),
  criaturas: (
    <>
      <circle cx="6.8" cy="8.4" r="2.1" />
      <circle cx="12" cy="6.4" r="2.1" />
      <circle cx="17.2" cy="8.4" r="2.1" />
      <path d="M12 21c-3.4 0-5.9-1.9-5.9-4.4 0-2.4 2.5-4.4 5.9-4.4s5.9 2 5.9 4.4S15.4 21 12 21Z" />
    </>
  ),
  vida_maxima: (
    <path d="M20.8 6.9a5 5 0 0 0-8.8-1.7A5 5 0 0 0 3.2 6.9c-1 2.6.4 5.3 2.6 7.4l6.2 5.6 6.2-5.6c2.2-2.1 3.6-4.8 2.6-7.4Z" />
  ),
  mana_gerada: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 7.2s-3.1 3.5-3.1 5.4a3.1 3.1 0 0 0 6.2 0c0-1.9-3.1-5.4-3.1-5.4Z" />
    </>
  ),
  magica_cara: (
    <path d="M12 2.4 14.1 9.4 21 11.6l-6.9 2.2L12 20.8 9.9 13.8 3 11.6l6.9-2.2Z" />
  ),
  primeira_morte: (
    <>
      <path d="M5.8 21V10.2a6.2 6.2 0 0 1 12.4 0V21Z" />
      <path d="M12 7.6v6.6M9.4 10.2h5.2" />
    </>
  ),
};

export function CriterionIcon({ id, className }: IconProps & { id: CriterionId }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      {PATHS[id]}
    </svg>
  );
}

export function TrophyIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M7 3.6h10v5.2a5 5 0 0 1-10 0Z" />
      <path d="M7 5.2H4.2v1.6A3.6 3.6 0 0 0 7.8 10.4M17 5.2h2.8v1.6a3.6 3.6 0 0 1-3.6 3.6" />
      <path d="M12 13.8V17M8.6 20.4h6.8" />
    </svg>
  );
}

export function GroupIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="6" r="2.6" />
      <circle cx="5.6" cy="16.4" r="2.6" />
      <circle cx="18.4" cy="16.4" r="2.6" />
      <path d="M12 8.6v3.2M10.2 12.6 7.2 14.6M13.8 12.6l3 2" />
    </svg>
  );
}

export function SwordsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3.4 3.4h3.2l11 11-3.2 3.2-11-11Z" />
      <path d="M20.6 3.4h-3.2l-4 4 3.2 3.2 4-4Z" />
      <path d="M4.6 20.6 8 17.2M19.4 20.6 16 17.2" />
    </svg>
  );
}

export function ScrollIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M6.4 3.4h11.2v14a3.2 3.2 0 0 1-3.2 3.2H6.4a2.4 2.4 0 0 0 2.4-2.4V5.8a2.4 2.4 0 0 0-2.4-2.4Z" />
      <path d="M10.4 8h4.8M10.4 12h4.8M10.4 16h3.2" />
    </svg>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M13.6 4.4h6v6M19.6 4.4 11 13" />
      <path d="M18 14v4.8a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 18.8V8a1.6 1.6 0 0 1 1.6-1.6H10" />
    </svg>
  );
}

export function BanIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.6" />
      <path d="M5.9 5.9l12.2 12.2" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}
