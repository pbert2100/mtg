import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CRITERIA, SCORING_CRITERIA, type Criterion, type CriterionId } from "./criteria";
import { normalizarEtapa, type Etapa } from "./etapas";
import { getSupabase } from "./supabase";
import type { Jogador, Partida } from "./types";

/**
 * Por quantos segundos as linhas do Supabase ficam em cache no servidor.
 * Cada ida ao Supabase custa ~300-500ms; sem cache isso acontecia em toda navegação.
 * Coloque 0 para voltar a ler o banco a cada requisição.
 */
export const CACHE_SEGUNDOS = 30;

export type CountMap = Record<CriterionId, number>;

export type PlayerStats = {
  player: Jogador;
  nome: string;
  grupo: string;
  grupoSlug: string;
  counts: CountMap;
  points: number;
  /** Partidas em que o jogador aparece em pelo menos um critério. */
  appearances: number;
};

export type MatchAward = {
  criterion: Criterion;
  player: Jogador | null;
  playerId: number | null;
};

export type MatchView = {
  partida: Partida;
  numero: number;
  data: string | null;
  awards: MatchAward[];
  /** Critérios efetivamente preenchidos. */
  filledAwards: MatchAward[];
  participants: Jogador[];
  /** A coluna `jogadores` estava preenchida — a lista da mesa é confiável. */
  participantesDeclarados: boolean;
  /** Levaram algum critério mas ficaram de fora da lista: erro de lançamento. */
  foraDaLista: Jogador[];
  /** Ids na lista que não existem na tabela jogadores. */
  idsDesconhecidos: number[];
  /** Grupos da partida — vem das colunas grupoN, ou dos jogadores quando elas estao vazias. */
  grupos: string[];
  /** Grupos declarados + grupos dos jogadores citados, usado para listar a partida no grupo. */
  gruposRelacionados: string[];
  /** Etapa lida da coluna `fase`. Null quando a coluna não existe ou está vazia. */
  etapa: Etapa | null;
  pontos: { player: Jogador; points: number; counts: CountMap }[];
  vencedor: Jogador | null;
};

export type GroupView = {
  nome: string;
  slug: string;
  players: PlayerStats[];
  matches: MatchView[];
  totalPontos: number;
};

export type RecordView = {
  criterion: Criterion;
  valor: number;
  leaders: PlayerStats[];
};

export type Championship = {
  players: Jogador[];
  standings: PlayerStats[];
  groups: GroupView[];
  matches: MatchView[];
  records: RecordView[];
  statsById: Map<number, PlayerStats>;
  /** De onde vieram os números: das partidas ou dos acumulados da tabela `jogadores`. */
  source: "partidas" | "jogadores" | "vazio";
  error: string | null;
};

export function emptyCounts(): CountMap {
  return Object.fromEntries(CRITERIA.map((c) => [c.id, 0])) as CountMap;
}

export function slugify(value: string): string {
  return (
    value
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "grupo"
  );
}

/**
 * Lê todas as colunas `grupoN` da partida (grupo1, grupo2, grupo3, ...) na ordem numérica.
 * Varrer as chaves em vez de listá-las evita que criar uma coluna nova no Supabase
 * exija mexer no código — uma partida pode reunir quantos grupos forem necessários.
 */
function gruposDeclaradosDe(partida: Partida): string[] {
  return Object.keys(partida)
    .filter((chave) => /^grupo\d+$/.test(chave))
    .sort((a, b) => Number(a.slice(5)) - Number(b.slice(5)))
    .map((chave) => (partida as unknown as Record<string, unknown>)[chave])
    .map((valor) => (typeof valor === "string" ? valor.trim() : ""))
    .filter(Boolean);
}

/**
 * Ids da coluna `jogadores`. Aceita o texto separado por vírgula que usamos hoje e
 * também array do Postgres — assim trocar a coluna de `text` para `int8[]` no futuro
 * não exige mexer aqui.
 */
function idsDeJogadoresDe(partida: Partida): number[] {
  const bruto = (partida as unknown as Record<string, unknown>).jogadores;
  const texto = Array.isArray(bruto) ? bruto.join(",") : typeof bruto === "string" ? bruto : "";
  if (!texto.trim()) return [];

  return [
    ...new Set(
      texto
        .replace(/[{}[\]"']/g, " ")
        .split(/[\s,;|]+/)
        .map((parte) => Number(parte))
        .filter((n) => Number.isInteger(n) && n > 0),
    ),
  ];
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function pointsFromCounts(counts: CountMap): number {
  return SCORING_CRITERIA.reduce((total, c) => total + counts[c.id] * c.points, 0);
}

function sortStandings(a: PlayerStats, b: PlayerStats): number {
  return (
    b.points - a.points ||
    b.counts.vencedor - a.counts.vencedor ||
    b.counts.segundo_lugar - a.counts.segundo_lugar ||
    b.counts.eliminacoes - a.counts.eliminacoes ||
    a.nome.localeCompare(b.nome, "pt-BR")
  );
}

/** Lê o acumulado guardado na própria linha do jogador (fallback quando não há partidas). */
function countsFromPlayerRow(player: Jogador): CountMap {
  const counts = emptyCounts();
  for (const criterion of CRITERIA) {
    for (const column of criterion.playerColumns) {
      const value = toNumber(player[column]);
      if (value !== null) {
        counts[criterion.id] = value;
        break;
      }
    }
  }
  return counts;
}

type Linhas = { jogadores: Jogador[]; partidas: Partida[]; error: string | null };

async function buscarLinhas(): Promise<Linhas> {
  const supabase = getSupabase();

  if (!supabase) {
    return {
      jogadores: [],
      partidas: [],
      error:
        "Supabase nao configurado: defina SUPABASE_URL e SUPABASE_SECRET_KEY. Na Vercel, refaca o deploy depois de criar as variaveis.",
    };
  }

  const [jogadoresRes, partidasRes] = await Promise.all([
    supabase.from("jogadores").select("*").order("id", { ascending: true }),
    supabase.from("partidas").select("*").order("id", { ascending: true }),
  ]);

  return {
    jogadores: (jogadoresRes.data ?? []) as Jogador[],
    partidas: (partidasRes.data ?? []) as Partida[],
    error: jogadoresRes.error?.message ?? partidasRes.error?.message ?? null,
  };
}

/** Cache compartilhado entre requisições — só guarda dados serializáveis. */
const carregarLinhas =
  CACHE_SEGUNDOS > 0
    ? unstable_cache(buscarLinhas, ["campeonato"], {
        revalidate: CACHE_SEGUNDOS,
        tags: ["campeonato"],
      })
    : buscarLinhas;

/**
 * `cache` da React garante que, dentro da mesma requisição, `generateMetadata` e a
 * página compartilhem o mesmo resultado em vez de montar tudo duas vezes.
 */
export const getChampionship = cache(async (): Promise<Championship> => {
  const { jogadores, partidas, error } = await carregarLinhas();
  return buildChampionship(jogadores, partidas, error);
});

export function buildChampionship(
  jogadores: Jogador[],
  partidas: Partida[],
  error: string | null = null,
): Championship {
  const playersById = new Map<number, Jogador>();
  for (const p of jogadores) playersById.set(p.id, p);

  const source: Championship["source"] =
    partidas.length > 0 ? "partidas" : jogadores.length > 0 ? "jogadores" : "vazio";

  // ---- Partidas -------------------------------------------------------
  const matches: MatchView[] = partidas.map((partida, index) => {
    const awards: MatchAward[] = CRITERIA.map((criterion) => {
      const playerId = toNumber(partida[criterion.matchColumn]);
      return {
        criterion,
        playerId,
        player: playerId !== null ? (playersById.get(playerId) ?? null) : null,
      };
    });

    const filledAwards = awards.filter((a) => a.playerId !== null);

    // Quem levou algum critério esteve na mesa, obrigatoriamente.
    const comCriterio: Jogador[] = [];
    const vistos = new Set<number>();
    for (const award of filledAwards) {
      if (award.player && !vistos.has(award.player.id)) {
        vistos.add(award.player.id);
        comCriterio.push(award.player);
      }
    }

    // A coluna `jogadores` traz quem sentou na mesa, inclusive quem não pontuou.
    const idsDeclarados = idsDeJogadoresDe(partida);
    const declarados = idsDeclarados
      .map((id) => playersById.get(id))
      .filter((p): p is Jogador => Boolean(p));
    const idsDesconhecidos = idsDeclarados.filter((id) => !playersById.has(id));

    // A lista manda, mas ninguém com critério fica de fora — some os dois.
    const participants: Jogador[] = [...declarados];
    const naMesa = new Set(participants.map((p) => p.id));
    for (const player of comCriterio) {
      if (!naMesa.has(player.id)) {
        naMesa.add(player.id);
        participants.push(player);
      }
    }

    // Levou critério mas não está na lista: quase sempre é erro de lançamento.
    const foraDaLista =
      idsDeclarados.length > 0 ? comCriterio.filter((p) => !idsDeclarados.includes(p.id)) : [];

    const gruposDeclarados = gruposDeclaradosDe(partida);
    const gruposDosJogadores = participants.map((p) => p.grupo?.trim() || "Sem grupo");
    const grupos = [
      ...new Set(gruposDeclarados.length > 0 ? gruposDeclarados : gruposDosJogadores),
    ];
    const gruposRelacionados = [...new Set([...grupos, ...gruposDosJogadores])];
    // Nada de adivinhar a etapa: neste formato todas as etapas cruzam grupos, então
    // contar grupos não distingue Etapa 1 da Final nem a Etapa 2 da 3.
    const etapa = normalizarEtapa(partida.fase);

    // Todo mundo da mesa entra no placar, mesmo zerado.
    const pontosMap = new Map<number, { player: Jogador; points: number; counts: CountMap }>();
    for (const player of participants) {
      pontosMap.set(player.id, { player, points: 0, counts: emptyCounts() });
    }
    for (const award of filledAwards) {
      if (!award.player) continue;
      const entry = pontosMap.get(award.player.id);
      if (!entry) continue;
      entry.counts[award.criterion.id] += 1;
      entry.points += award.criterion.points;
    }

    return {
      partida,
      numero: index + 1,
      data: partida.created_at ?? null,
      awards,
      filledAwards,
      participants,
      participantesDeclarados: idsDeclarados.length > 0,
      foraDaLista,
      idsDesconhecidos,
      grupos,
      gruposRelacionados,
      etapa,
      pontos: [...pontosMap.values()].sort((a, b) => b.points - a.points),
      vencedor: awards.find((a) => a.criterion.id === "vencedor")?.player ?? null,
    };
  });

  // ---- Estatísticas por jogador ---------------------------------------
  const statsById = new Map<number, PlayerStats>();
  for (const player of jogadores) {
    const grupo = player.grupo?.trim() || "Sem grupo";
    statsById.set(player.id, {
      player,
      nome: player.jogador?.trim() || `Jogador #${player.id}`,
      grupo,
      grupoSlug: slugify(grupo),
      counts: source === "partidas" ? emptyCounts() : countsFromPlayerRow(player),
      points: 0,
      appearances: 0,
    });
  }

  if (source === "partidas") {
    for (const match of matches) {
      for (const award of match.filledAwards) {
        if (!award.player) continue;
        const stats = statsById.get(award.player.id);
        if (stats) stats.counts[award.criterion.id] += 1;
      }
      for (const participant of match.participants) {
        const stats = statsById.get(participant.id);
        if (stats) stats.appearances += 1;
      }
    }
  }

  for (const stats of statsById.values()) {
    stats.points = pointsFromCounts(stats.counts);
  }

  const standings = [...statsById.values()].sort(sortStandings);

  // ---- Grupos ---------------------------------------------------------
  const groupNames = [...new Set(standings.map((s) => s.grupo))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );

  const groups: GroupView[] = groupNames.map((nome) => {
    const slug = slugify(nome);
    const players = standings.filter((s) => s.grupo === nome);
    return {
      nome,
      slug,
      players,
      matches: matches.filter((m) => m.gruposRelacionados.includes(nome)),
      totalPontos: players.reduce((sum, p) => sum + p.points, 0),
    };
  });

  // ---- Recordes por critério ------------------------------------------
  const records: RecordView[] = CRITERIA.map((criterion) => {
    const valor = standings.reduce((max, s) => Math.max(max, s.counts[criterion.id]), 0);
    return {
      criterion,
      valor,
      leaders: valor > 0 ? standings.filter((s) => s.counts[criterion.id] === valor) : [],
    };
  });

  return {
    players: jogadores,
    standings,
    groups,
    matches: [...matches].reverse(),
    records,
    statsById,
    source,
    error,
  };
}

/**
 * Imagem usada como fundo (linhas do ranking, recordes, hover da hero): a ilustração
 * do commander, sem a moldura da carta. Cai para a carta inteira enquanto as colunas
 * `backgroundN` não estiverem preenchidas.
 */
export function ilustracaoDe(player: Jogador): string | null {
  return player.background1 || player.background2 || player.image1 || player.image2 || null;
}

/** Imagem da carta inteira — perfil, pódio da home e cards de commander. */
export function cartaDe(player: Jogador): string | null {
  return player.image1 || player.image2 || null;
}

/** Commanders cadastrados de um jogador. */
export function commandersOf(player: Jogador) {
  return [
    {
      slot: 1 as const,
      nome: player.commander1,
      imagem: player.image1,
      ilustracao: player.background1 || player.image1,
      deck: player.URL1,
    },
    {
      slot: 2 as const,
      nome: player.commander2,
      imagem: player.image2,
      ilustracao: player.background2 || player.image2,
      deck: player.URL2,
    },
  ].filter((c) => c.nome || c.imagem);
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Recordes calculados dentro de um subconjunto de jogadores (ex.: um grupo). */
export function recordsFor(players: PlayerStats[]): RecordView[] {
  return CRITERIA.map((criterion) => {
    const valor = players.reduce((max, s) => Math.max(max, s.counts[criterion.id]), 0);
    return {
      criterion,
      valor,
      leaders: valor > 0 ? players.filter((s) => s.counts[criterion.id] === valor) : [],
    };
  });
}
