import Link from "next/link";
import { cartaDe } from "@/lib/data";
import type { Jogador } from "@/lib/types";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const SIZES = {
  sm: "size-8 text-[11px]",
  md: "size-10 text-xs",
  lg: "size-16 text-base",
} as const;

export function PlayerAvatar({
  player,
  size = "md",
}: {
  player: Jogador;
  size?: keyof typeof SIZES;
}) {
  const nome = player.jogador?.trim() || `#${player.id}`;
  // A foto de perfil usa a carta inteira, não a ilustração.
  const art = cartaDe(player);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/35 bg-arcane-700 ${SIZES[size]}`}
    >
      <span className="font-display absolute inset-0 flex items-center justify-center tracking-widest text-gold-200/80">
        {initials(nome)}
      </span>
      {art ? (
        <img
          src={art}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover object-[center_22%] opacity-90"
        />
      ) : null}
    </span>
  );
}

export function PlayerChip({
  player,
  size = "md",
  subtitle,
  className = "",
}: {
  player: Jogador;
  size?: keyof typeof SIZES;
  subtitle?: string;
  className?: string;
}) {
  const nome = player.jogador?.trim() || `Jogador #${player.id}`;
  return (
    <Link
      href={`/jogadores/${player.id}`}
      className={`group inline-flex min-h-11 items-center gap-2.5 sm:gap-3 ${className}`}
    >
      <PlayerAvatar player={player} size={size} />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-mist-200 transition-colors group-hover:text-gold-200">
          {nome}
        </span>
        {subtitle ? (
          <span className="block truncate text-[11px] text-mist-200/45">{subtitle}</span>
        ) : null}
      </span>
    </Link>
  );
}
