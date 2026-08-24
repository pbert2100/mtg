/** Linha da tabela `jogadores` no Supabase. */
export type Jogador = {
  id: number;
  created_at: string;
  jogador: string | null;
  grupo: string | null;
  commander1: string | null;
  /** Imagem da carta inteira do commander 1. */
  image1: string | null;
  /** Ilustração (arte sem moldura) do commander 1. */
  background1: string | null;
  URL1: string | null;
  commander2: string | null;
  /** Imagem da carta inteira do commander 2. */
  image2: string | null;
  /** Ilustração (arte sem moldura) do commander 2. */
  background2: string | null;
  URL2: string | null;
  vencedor: number | null;
  segundo_lugar: number | null;
  primeiro_sangue: number | null;
  eliminacoes: number | null;
  eliminacoes_cd: number | null;
  maior_dano: number | null;
  mana_gerada: number | null;
  magica_cara: number | null;
  boardwipe: number | null;
  vida_maxima: number | null;
  criaturas: number | null;
  primeira_morte: number | null;
};

/** Linha da tabela `partidas` no Supabase. Cada coluna de critério guarda o id do jogador. */
export type Partida = {
  id: number;
  created_at: string;
  grupo1: string | null;
  grupo2: string | null;
  grupo3: string | null;
  /** Opcional: etapa do campeonato. Só existe se a coluna for criada no Supabase. */
  fase?: string | null;
  /** Ids de quem sentou na mesa. Texto com os ids separados por vírgula. */
  jogadores: string | null;
  vencedor: number | null;
  segundo_lugar: number | null;
  primeiro_sangue: number | null;
  eliminacoes: number | null;
  eliminacoes_cd: number | null;
  maior_dano: number | null;
  mana_gerada: number | null;
  magica_cara: number | null;
  boardwipe: number | null;
  vida_maxima: number | null;
  criaturas: number | null;
  primeira_morte: number | null;
};
