import { HeroPodium, type Destaque } from "@/components/HeroPodium";
import { GroupCard } from "@/components/GroupCard";
import { GroupIcon, SwordsIcon, TrophyIcon } from "@/components/Icons";
import { MatchCard } from "@/components/MatchCard";
import { RecordsTable } from "@/components/RecordsTable";
import { StandingsTable } from "@/components/StandingsTable";
import { Alert, Empty, SectionAction, SectionTitle } from "@/components/ui";
import type { CriterionId } from "@/lib/criteria";
import { cartaDe, getChampionship, ilustracaoDe, type RecordView } from "@/lib/data";

// Revalida a cada 30s: navegar entre páginas passa a ser instantâneo (ver CACHE_SEGUNDOS em lib/data.ts).
export const revalidate = 30;

/** Os três commanders em destaque no topo da home. */
const PODIO: { id: CriterionId; label: string }[] = [
  { id: "vencedor", label: "Mais vitórias" },
  { id: "eliminacoes", label: "Mais eliminações" },
  { id: "primeiro_sangue", label: "Mais first blood" },
];

function montarDestaque(records: RecordView[], id: CriterionId, label: string): Destaque {
  const record = records.find((r) => r.criterion.id === id);
  const lider = record?.leaders[0] ?? null;
  const player = lider?.player ?? null;
  // A arte e o nome vem sempre do mesmo commander.
  const usaPrimeiro = Boolean(player?.image1);

  return {
    id,
    label,
    jogadorId: player?.id ?? null,
    jogador: lider?.nome ?? null,
    grupo: lider?.grupo ?? null,
    commander: (usaPrimeiro ? player?.commander1 : player?.commander2) ?? null,
    art: player ? cartaDe(player) : null,
    ilustracao: player ? ilustracaoDe(player) : null,
    valor: record?.valor ?? 0,
  };
}

export default async function Home() {
  const { standings, groups, matches, records, error } = await getChampionship();

  const gruposOrdenados = [...groups].sort((a, b) => b.totalPontos - a.totalPontos);
  const ultimasPartidas = matches.slice(0, 3);
  const destaques = PODIO.map(({ id, label }) => montarDestaque(records, id, label));

  return (
    <div className="space-y-16">
      <HeroPodium destaques={destaques} />

      {error ? <Alert>Erro ao ler o Supabase: {error}</Alert> : null}

      <section>
        <SectionTitle icon={<TrophyIcon className="size-5" />}>Classificação geral</SectionTitle>
        {standings.length === 0 ? (
          <Empty
            title="Nenhum jogador cadastrado"
            description="Cadastre os jogadores na tabela jogadores do Supabase para ver o ranking aqui."
          />
        ) : (
          <StandingsTable rows={standings} />
        )}
      </section>

      <section>
        <SectionTitle
          icon={<GroupIcon className="size-5" />}
          action={<SectionAction href="/grupos">Ver grupos</SectionAction>}
        >
          Corrida dos grupos
        </SectionTitle>
        {gruposOrdenados.length === 0 ? (
          <Empty title="Nenhum grupo definido" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gruposOrdenados.map((grupo, index) => (
              <GroupCard key={grupo.slug} grupo={grupo} posicao={index + 1} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle icon={<TrophyIcon className="size-5" />}>Hall dos recordes</SectionTitle>
        <RecordsTable records={records} />
      </section>

      <section>
        <SectionTitle
          icon={<SwordsIcon className="size-5" />}
          action={<SectionAction href="/partidas">Ver todas</SectionAction>}
        >
          Últimas partidas
        </SectionTitle>
        {ultimasPartidas.length === 0 ? (
          <Empty
            title="Nenhuma partida registrada"
            description="Lance as partidas na tabela partidas do Supabase — cada coluna guarda o id do jogador que ganhou aquele critério."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {ultimasPartidas.map((match) => (
              <MatchCard key={match.partida.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
