export type EtapaId = "etapa1" | "etapa2" | "etapa3" | "final";

export type Etapa = {
  id: EtapaId;
  nome: string;
  /** Formato da mesa, como aparece nos chips. */
  formato: string;
  descricao: string;
};

/** As quatro etapas do campeonato, na ordem em que acontecem. */
export const ETAPAS: Etapa[] = [
  {
    id: "etapa1",
    nome: "Etapa 1",
    formato: "3v3",
    descricao:
      "Cada grupo enfrenta os outros dois com todos os seus jogadores. Três partidas ao todo.",
  },
  {
    id: "etapa2",
    nome: "Etapa 2",
    formato: "2v2v2",
    descricao:
      "Uma partida única com três duplas na mesma mesa: dois jogadores sorteados de cada grupo. Seis jogadores, um de cada grupo fora.",
  },
  {
    id: "etapa3",
    nome: "Etapa 3",
    formato: "1v1v1",
    descricao:
      "Uma partida entre os três jogadores de maior pontuação individual, um representante de cada grupo.",
  },
  {
    id: "final",
    nome: "Etapa Final",
    formato: "3v3",
    descricao:
      "Os dois grupos com maior pontuação acumulada nas três etapas anteriores se enfrentam, com os três jogadores de cada lado.",
  },
];

const POR_ID = new Map(ETAPAS.map((e) => [e.id, e]));

/**
 * Converte o que estiver escrito na coluna `fase` do Supabase para uma etapa.
 * Aceita as formas mais prováveis de digitação: "1", "etapa 1", "Etapa1", "3v3",
 * "final", "etapa final", "2v2v2", "1v1v1".
 */
export function normalizarEtapa(valor: unknown): Etapa | null {
  if (typeof valor !== "string") return null;

  const chave = valor
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  if (!chave) return null;
  if (chave.includes("final")) return POR_ID.get("final") ?? null;
  if (chave === "2v2v2") return POR_ID.get("etapa2") ?? null;
  if (chave === "1v1v1") return POR_ID.get("etapa3") ?? null;
  // "3v3" é o formato tanto da Etapa 1 quanto da Final — sozinho não decide nada.
  if (/^\d(v\d)+$/.test(chave)) return null;

  const numero = chave.match(/(\d)/)?.[1];
  if (numero === "1") return POR_ID.get("etapa1") ?? null;
  if (numero === "2") return POR_ID.get("etapa2") ?? null;
  if (numero === "3") return POR_ID.get("etapa3") ?? null;

  return null;
}
