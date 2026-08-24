import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/Icons";

export function Num({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`num ${className}`}>{children}</span>;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <header className="rise mb-10 text-center">
      {eyebrow ? (
        <p className="tracking-arcane mb-3 text-[11px] text-gold/80 uppercase">{eyebrow}</p>
      ) : null}
      <h1 className="font-display gold-text text-3xl font-semibold tracking-[0.14em] uppercase sm:text-4xl">
        {title}
      </h1>
      <div className="mx-auto mt-4 flex max-w-xs items-center gap-3">
        <span className="rule-gold flex-1" />
        <span className="size-1.5 rotate-45 bg-gold/70" />
        <span className="rule-gold flex-1" />
      </div>
      {subtitle ? <div className="mt-4">{subtitle}</div> : null}
    </header>
  );
}

export function SectionTitle({
  icon,
  children,
  action,
}: {
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon ? <span className="text-gold/80">{icon}</span> : null}
        <h2 className="font-display text-lg tracking-[0.16em] text-gold-200 uppercase">
          {children}
        </h2>
      </div>
      {action}
    </div>
  );
}

/** Link de retorno no topo das páginas de detalhe. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="mb-4 -ml-2 inline-flex min-h-11 items-center gap-2 px-2 text-[11px] tracking-[0.14em] text-mist-200/45 uppercase transition-colors hover:text-gold-200 sm:mb-6"
    >
      <ArrowIcon className="size-3.5 rotate-180" />
      {children}
    </Link>
  );
}

/** Ação discreta ao lado de um título de seção. */
export function SectionAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="-mr-2 inline-flex min-h-11 items-center gap-1.5 px-2 text-[11px] tracking-[0.14em] text-gold-200/80 uppercase transition-colors hover:text-gold-200"
    >
      {children}
      <ArrowIcon className="size-3.5" />
    </Link>
  );
}

/** Botão com contorno dourado — a única variação de botão da plataforma. */
export function GoldButton({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  // `min-h-11` = 44px, o mínimo confortável para o dedo.
  const classe =
    "inline-flex min-h-11 items-center gap-2 rounded-md border border-gold/30 px-4 py-2 text-[11px] tracking-[0.14em] text-gold-200 uppercase transition-colors hover:border-gold/55 hover:bg-gold/10 active:bg-gold/15";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={classe}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classe}>
      {children}
    </Link>
  );
}

export function Pill({
  children,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  tone?: "default" | "gold" | "danger" | "muted";
  className?: string;
}) {
  const tones = {
    default: "border-abyss/80 bg-abyss/40 text-mist-200/85",
    gold: "border-gold/45 bg-gold/12 text-gold-200",
    danger: "border-red-400/35 bg-red-500/10 text-red-200/90",
    muted: "border-mist/30 bg-white/[0.03] text-mist-200/60",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] leading-none font-medium tracking-wide whitespace-nowrap ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Empty({ title, description }: { title: string; description?: string }) {
  return (
    <div className="panel panel-quiet flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <span className="size-2 rotate-45 bg-gold/50" />
      <p className="font-display mt-2 text-sm tracking-[0.14em] text-mist-200/80 uppercase">
        {title}
      </p>
      {description ? (
        <p className="max-w-sm text-xs leading-relaxed text-mist-200/50">{description}</p>
      ) : null}
    </div>
  );
}

export function Alert({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100/90">
      {children}
    </div>
  );
}
