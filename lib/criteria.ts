import type { Jogador, Partida } from "./types";

export type CriterionId =
  | "vencedor"
  | "segundo_lugar"
  | "eliminacoes"
  | "eliminacoes_cd"
  | "maior_dano"
  | "boardwipe"
  | "primeiro_sangue"
  | "criaturas"
  | "vida_maxima"
  | "mana_gerada"
  | "magica_cara"
  | "primeira_morte";

export type Criterion = {
  id: CriterionId;
  /** Nome curto usado em tabelas e chips. */
  label: string;
  /** Nome completo usado em cards e títulos. */
  title: string;
  /** Regra do campeonato. */
  rule: string;
  /** Pontos concedidos por ocorrência. */
  points: number;
  /** Coluna correspondente na tabela `partidas`. */
  matchColumn: keyof Partida;
  /** Possíveis nomes da coluna acumulada na tabela `jogadores`. */
  playerColumns: (keyof Jogador)[];
};

/** Todos os critérios registrados por partida, na ordem de exibição. */
export const CRITERIA: Criterion[] = [
  {
    id: "vencedor",
    label: "Vitórias",
    title: "Vencedor da partida",
    rule: "Ganhar o jogo.",
    points: 5,
    matchColumn: "vencedor",
    playerColumns: ["vencedor"],
  },
  {
    id: "segundo_lugar",
    label: "2º lugares",
    title: "Segundo lugar",
    rule: "Terminar em segundo lugar na partida.",
    points: 3,
    matchColumn: "segundo_lugar",
    playerColumns: ["segundo_lugar"],
  },
  {
    id: "eliminacoes",
    label: "Eliminações",
    title: "Eliminações",
    rule: "Cada jogador que você tirou da partida.",
    points: 1,
    matchColumn: "eliminacoes",
    playerColumns: ["eliminacoes"],
  },
  {
    id: "eliminacoes_cd",
    label: "Elim. por CD",
    title: "Eliminação por commander damage",
    rule: "Bônus por eliminar alguém com dano de commander.",
    points: 1,
    matchColumn: "eliminacoes_cd",
    playerColumns: ["eliminacoes_cd"],
  },
  {
    id: "maior_dano",
    label: "Maior dano",
    title: "Maior dano em um único ataque",
    rule: "Causou o maior dano em um único ataque da partida.",
    points: 2,
    matchColumn: "maior_dano",
    playerColumns: ["maior_dano"],
  },
  {
    id: "boardwipe",
    label: "Boardwipe",
    title: "Maior boardwipe",
    rule: "Destruir ou exilar no mínimo 3 permanentes de outros jogadores com uma única mágica ou habilidade.",
    points: 2,
    matchColumn: "boardwipe",
    playerColumns: ["boardwipe"],
  },
  {
    id: "primeiro_sangue",
    label: "First blood",
    title: "First blood",
    rule: "Primeiro jogador a causar uma eliminação na mesa.",
    points: 1,
    matchColumn: "primeiro_sangue",
    playerColumns: ["primeiro_sangue"],
  },
  {
    id: "criaturas",
    label: "Criaturas",
    title: "Mais criaturas em um turno",
    rule: "Maior quantidade de criaturas no board em um turno.",
    points: 1,
    matchColumn: "criaturas",
    playerColumns: ["criaturas"],
  },
  {
    id: "vida_maxima",
    label: "Vida ganha",
    title: "Mais vida ganha em um turno",
    rule: "Maior quantidade de vida ganha em um turno.",
    points: 1,
    matchColumn: "vida_maxima",
    playerColumns: ["vida_maxima"],
  },
  {
    id: "mana_gerada",
    label: "Mana gerada",
    title: "Mais mana gerada em um turno",
    rule: "Maior quantidade de mana gerada em um turno.",
    points: 1,
    matchColumn: "mana_gerada",
    playerColumns: ["mana_gerada"],
  },
  {
    id: "magica_cara",
    label: "Mágica mais cara",
    title: "Mágica mais cara",
    rule: "Lançou a mágica de maior custo da partida.",
    points: 1,
    matchColumn: "magica_cara",
    playerColumns: ["magica_cara"],
  },
  {
    id: "primeira_morte",
    label: "1º a morrer",
    title: "Primeiro a morrer",
    rule: "Primeiro jogador eliminado da mesa. Registro de vergonha — não vale pontos.",
    points: 0,
    matchColumn: "primeira_morte",
    playerColumns: ["primeira_morte"],
  },
];

/** Critérios que valem pontos. */
export const SCORING_CRITERIA = CRITERIA.filter((c) => c.points > 0);

export const CRITERIA_BY_ID: Record<CriterionId, Criterion> = Object.fromEntries(
  CRITERIA.map((c) => [c.id, c]),
) as Record<CriterionId, Criterion>;
