"use client";

import type { ReactNode } from "react";
import Tilt from "react-parallax-tilt";
import { CARD_RADIUS } from "@/lib/card";

/**
 * Carta em tamanho proporcional ao real, com inclinação 3D no hover.
 * `badge` recebe `translateZ` para flutuar acima da superfície durante o efeito.
 */
export function TiltCard({
  art,
  nome,
  badge,
  eager = false,
}: {
  art: string | null;
  nome: string | null;
  badge?: ReactNode;
  eager?: boolean;
}) {
  return (
    <Tilt
      className="w-full"
      style={{ transformStyle: "preserve-3d" }}
      tiltMaxAngleX={13}
      tiltMaxAngleY={13}
      perspective={900}
      scale={1.05}
      transitionSpeed={1200}
      glareEnable
      glareMaxOpacity={0.28}
      glareColor="#E7D5A3"
      glarePosition="all"
      glareBorderRadius={CARD_RADIUS}
    >
      <div className="relative aspect-[5/7] w-full" style={{ transformStyle: "preserve-3d" }}>
        <div
          className="absolute inset-0 overflow-hidden bg-arcane-800 shadow-[0_34px_70px_-30px_#000]"
          style={{ borderRadius: CARD_RADIUS }}
        >
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs text-mist-200/30">
            {nome ?? "sem imagem"}
          </div>
          {art ? (
            <img
              src={art}
              alt={nome ?? "Commander"}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
          ) : null}
          <span
            className="pointer-events-none absolute inset-0 ring-1 ring-gold/25 ring-inset"
            style={{ borderRadius: CARD_RADIUS }}
          />
        </div>

        {badge}
      </div>
    </Tilt>
  );
}

export function CartaVazia({ texto }: { texto: string }) {
  return (
    <div
      className="flex aspect-[5/7] w-full items-center justify-center border border-dashed border-mist/25 bg-white/[0.02] px-4 text-center text-xs text-mist-200/30"
      style={{ borderRadius: CARD_RADIUS }}
    >
      {texto}
    </div>
  );
}
