import { notFound } from "next/navigation";
import { CommanderCard } from "@/components/CommanderCard";
import { CriteriaList, CriteriaRow } from "@/components/CriteriaList";
import { GroupIcon, ScrollIcon, SwordsIcon, TrophyIcon } from "@/components/Icons";
import { MatchCard } from "@/components/MatchCard";
import { PlayerChip } from "@/components/PlayerChip";
import { StandingsTable } from "@/components/StandingsTable";
import { BackLink, Empty, Num, PageHeader, Pill, SectionTitle } from "@/components/ui";
import { commandersOf, getChampionship, recordsFor } from "@/lib/data";

// Revalida a cada 30s: navegar entre páginas passa a ser instantâneo (ver CACHE_SEGUNDOS em lib/data.ts).
export const revalidate = 30;

/** Pré-renderiza os grupos existentes; grupos novos continuam sendo gerados sob demanda. */
export async function generateStaticParams() {
  const { groups } = await getChampionship();
  return groups.map((g) => ({ grupo: g.slug }));
}

export async function generateMetadata(props: PageProps<"/grupos/[grupo]">) {
  const { grupo } = await props.params;
  const { groups } = await getChampionship();
  const found = groups.find((g) => g.slug === grupo);
  return { title: found ? found.nome : "Grupo" };
}

export default async function GrupoPage(props: PageProps<"/grupos/[grupo]">) {
  const { grupo: slug } = await props.params;
  const { groups } = await getChampionship();

  const grupo = groups.find((g) => g.slug === slug);
  if (!grupo) notFound();

  const posicaoNaCorrida =
    [...groups].sort((a, b) => b.totalPontos - a.totalPontos).findIndex((g) => g.slug === slug) + 1;

  // Só é destaque quando alguém se separa do restante do grupo.
  const destaques = recordsFor(grupo.players).filter(
    (r) => r.leaders.length > 0 && r.leaders.length < Math.max(grupo.players.length, 2),
  );

  return (
    <div className="space-y-16">
      <div>
        <BackLink href="/grupos">Todos os grupos</BackLink>
        <PageHeader
          eyebrow={`${posicaoNaCorrida}º na corrida pela final`}
          title={grupo.nome}
          subtitle={
            <span className="inline-flex flex-wrap items-center justify-center gap-2">
              <Pill>
                <GroupIcon className="size-3.5" /> {grupo.players.length} jogadores
              </Pill>
              <Pill>
                <SwordsIcon className="size-3.5" /> {grupo.matches.length} partidas
              </Pill>
              <Pill tone="gold">
                <TrophyIcon className="size-3.5" /> {grupo.totalPontos} pontos
              </Pill>
            </span>
          }
        />
      </div>

      <section>
        <SectionTitle icon={<TrophyIcon className="size-5" />}>Classificação do grupo</SectionTitle>
        <StandingsTable rows={grupo.players} />
      </section>

      <section>
        <SectionTitle icon={<ScrollIcon className="size-5" />}>Destaques do grupo</SectionTitle>
        {destaques.length === 0 ? (
          <Empty title="Sem registros neste grupo ainda" />
        ) : (
          <CriteriaList>
            {destaques.map((record) => (
              <CriteriaRow
                key={record.criterion.id}
                id={record.criterion.id}
                titulo={record.criterion.title}
              >
                <PlayerChip player={record.leaders[0].player} size="sm" />
                <Num className="w-10 text-right text-2xl text-gold-200">{record.valor}</Num>
              </CriteriaRow>
            ))}
          </CriteriaList>
        )}
      </section>

      <section>
        <SectionTitle icon={<ScrollIcon className="size-5" />}>Commanders do grupo</SectionTitle>
        <div className="space-y-12">
          {grupo.players.map((stats) => {
            const commanders = commandersOf(stats.player);
            return (
              <div key={stats.player.id}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <PlayerChip player={stats.player} size="sm" subtitle={`${stats.points} pontos`} />
                </div>
                {commanders.length === 0 ? (
                  <p className="text-xs text-mist-200/35">Nenhum commander cadastrado.</p>
                ) : (
                  <div className="flex flex-wrap gap-x-3 gap-y-8 sm:gap-x-12 sm:gap-y-10">
                    {commanders.map((commander) => (
                      <CommanderCard key={commander.slot} commander={commander} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle icon={<SwordsIcon className="size-5" />}>Partidas do grupo</SectionTitle>
        {grupo.matches.length === 0 ? (
          <Empty title="Nenhuma partida registrada para este grupo" />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {[...grupo.matches].reverse().map((match) => (
              <MatchCard key={match.partida.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
