import { notFound } from "next/navigation";
import { CriteriaList, CriteriaRow } from "@/components/CriteriaList";
import { CriterionIcon, ScrollIcon, TrophyIcon } from "@/components/Icons";
import { PlayerChip } from "@/components/PlayerChip";
import { Alert, BackLink, Empty, Num, PageHeader, Pill, SectionTitle } from "@/components/ui";
import { formatDate, getChampionship } from "@/lib/data";

// Revalida a cada 30s: navegar entre páginas passa a ser instantâneo (ver CACHE_SEGUNDOS em lib/data.ts).
export const revalidate = 30;

/** Pré-renderiza as partidas já lançadas; novas continuam sendo geradas sob demanda. */
export async function generateStaticParams() {
  const { matches } = await getChampionship();
  return matches.map((m) => ({ id: String(m.partida.id) }));
}

export async function generateMetadata(props: PageProps<"/partidas/[id]">) {
  const { id } = await props.params;
  return { title: `Partida #${id}` };
}

export default async function PartidaPage(props: PageProps<"/partidas/[id]">) {
  const { id } = await props.params;
  const { matches, error } = await getChampionship();

  const match = matches.find((m) => String(m.partida.id) === id);
  if (!match) notFound();

  const totalPontos = match.pontos.reduce((sum, p) => sum + p.points, 0);

  return (
    <div className="space-y-16">
      <div>
        <BackLink href="/partidas">Todas as partidas</BackLink>
        <PageHeader
          eyebrow={formatDate(match.data)}
          title={`Partida #${match.partida.id}`}
          subtitle={
            <span className="inline-flex flex-wrap items-center justify-center gap-2">
              {match.etapa ? (
                <Pill tone={match.etapa.id === "final" ? "gold" : "default"}>
                  {match.etapa.nome} · {match.etapa.formato}
                </Pill>
              ) : null}
              {match.grupos.map((grupo) => (
                <Pill key={grupo} tone="muted">
                  {grupo}
                </Pill>
              ))}
              <Pill tone="muted">
                {match.participants.length} jogador{match.participants.length === 1 ? "" : "es"}
              </Pill>
              <Pill tone="muted">{totalPontos} pontos distribuídos</Pill>
            </span>
          }
        />
      </div>

      {error ? <Alert>Erro ao ler o Supabase: {error}</Alert> : null}

      {match.foraDaLista.length > 0 ? (
        <Alert>
          {match.foraDaLista.map((p) => p.jogador).join(", ")} levou algum critério mas não está
          na coluna <code>jogadores</code> desta partida.
        </Alert>
      ) : null}

      {match.idsDesconhecidos.length > 0 ? (
        <Alert>
          A coluna <code>jogadores</code> cita id {match.idsDesconhecidos.join(", ")}, que não
          existe na tabela de jogadores.
        </Alert>
      ) : null}

      <section>
        <SectionTitle icon={<TrophyIcon className="size-5" />}>Placar da mesa</SectionTitle>
        {match.pontos.length === 0 ? (
          <Empty title="Nenhum critério preenchido nesta partida" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {match.pontos.map((entry, index) => {
              const conquistas = match.filledAwards.filter((a) => a.player?.id === entry.player.id);
              return (
                <article
                  key={entry.player.id}
                  className={`panel flex flex-col gap-4 p-5 ${
                    index === 0 && entry.points > 0 ? "border-gold/45" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <PlayerChip
                      player={entry.player}
                      size="md"
                      subtitle={entry.player.grupo ?? undefined}
                      className="min-w-0"
                    />
                    <div className="text-right leading-none">
                      <Num
                        className={`text-3xl ${entry.points > 0 ? "text-gold-200" : "text-mist-200/25"}`}
                      >
                        {entry.points}
                      </Num>
                      <p className="mt-1 text-[10px] tracking-[0.12em] text-mist-200/40 uppercase">
                        pts
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {conquistas.length === 0 ? (
                      <span className="text-[11px] text-mist-200/30">Nenhum critério</span>
                    ) : null}
                    {conquistas.map((award) => (
                      <Pill key={award.criterion.id} tone={award.criterion.points > 0 ? "gold" : "muted"}>
                        <CriterionIcon id={award.criterion.id} className="size-3" />
                        {award.criterion.label}
                      </Pill>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <SectionTitle icon={<ScrollIcon className="size-5" />}>Critérios da partida</SectionTitle>
        <CriteriaList>
          {match.awards.map((award) => (
            <CriteriaRow
              key={award.criterion.id}
              id={award.criterion.id}
              titulo={award.criterion.title}
              apagado={!award.player}
            >
              {award.player ? (
                <PlayerChip player={award.player} size="sm" />
              ) : award.playerId !== null ? (
                <span className="text-xs text-red-200/70">id {award.playerId} não encontrado</span>
              ) : (
                <span className="text-xs text-mist-200/25">não registrado</span>
              )}
              <Pill tone={award.player && award.criterion.points > 0 ? "gold" : "muted"}>
                {award.criterion.points > 0 ? `+${award.criterion.points}` : "0"}
              </Pill>
            </CriteriaRow>
          ))}
        </CriteriaList>
      </section>
    </div>
  );
}
