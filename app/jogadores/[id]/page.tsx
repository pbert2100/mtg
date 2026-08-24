import Link from "next/link";
import { notFound } from "next/navigation";
import { CommanderCard } from "@/components/CommanderCard";
import { CriterionIcon, SwordsIcon, TrophyIcon } from "@/components/Icons";
import { MatchCard } from "@/components/MatchCard";
import { PlayerAvatar } from "@/components/PlayerChip";
import { Alert, BackLink, Empty, Num, Pill, SectionTitle } from "@/components/ui";
import { CRITERIA } from "@/lib/criteria";
import { commandersOf, getChampionship } from "@/lib/data";

// Revalida a cada 30s: navegar entre páginas passa a ser instantâneo (ver CACHE_SEGUNDOS em lib/data.ts).
export const revalidate = 30;

/** Pré-renderiza os jogadores cadastrados; ids novos continuam sendo gerados sob demanda. */
export async function generateStaticParams() {
  const { players } = await getChampionship();
  return players.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata(props: PageProps<"/jogadores/[id]">) {
  const { id } = await props.params;
  const { statsById } = await getChampionship();
  const stats = statsById.get(Number(id));
  return { title: stats ? stats.nome : "Jogador" };
}

export default async function JogadorPage(props: PageProps<"/jogadores/[id]">) {
  const { id } = await props.params;
  const { statsById, standings, groups, matches, error } = await getChampionship();

  const stats = statsById.get(Number(id));
  if (!stats) notFound();

  const posicaoGeral = standings.findIndex((s) => s.player.id === stats.player.id) + 1;
  const grupo = groups.find((g) => g.slug === stats.grupoSlug);
  const posicaoGrupo = grupo
    ? grupo.players.findIndex((p) => p.player.id === stats.player.id) + 1
    : 0;

  const commanders = commandersOf(stats.player);
  const historico = matches.filter((m) =>
    m.participants.some((p) => p.id === stats.player.id),
  );

  const resumo = [
    { label: "Pontos", value: stats.points, destaque: true },
    { label: "Posição geral", value: posicaoGeral },
    { label: "Posição no grupo", value: posicaoGrupo },
    { label: "Partidas", value: stats.appearances || historico.length },
  ];

  return (
    <div className="space-y-16">
      <div>
        <BackLink href="/">Classificação geral</BackLink>
        <section className="panel rise flex flex-col flex-wrap items-center gap-5 p-5 text-center sm:flex-row sm:gap-6 sm:p-8 sm:text-left">
          <PlayerAvatar player={stats.player} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display gold-text text-2xl tracking-[0.12em] uppercase sm:text-3xl">
              {stats.nome}
            </h1>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Link
                href={`/grupos/${stats.grupoSlug}`}
                className="inline-flex min-h-11 items-center"
              >
                <Pill tone="gold">{stats.grupo}</Pill>
              </Link>
              <Pill tone="muted">{posicaoGeral}º no geral</Pill>
            </div>
          </div>
          <div className="grid w-full min-w-0 shrink grid-cols-2 gap-2 min-[400px]:grid-cols-4 sm:gap-3 lg:w-auto">
            {resumo.map((item) => (
              <div key={item.label} className="rounded-lg bg-white/[0.03] px-2 py-2.5 sm:min-w-20 sm:px-3 sm:py-3">
                <Num className={`text-2xl ${item.destaque ? "text-gold-200" : "text-mist-200/80"}`}>
                  {item.value}
                </Num>
                <p className="mt-1 text-[10px] leading-tight tracking-[0.06em] text-mist-200/40 uppercase sm:tracking-[0.1em]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {error ? <Alert>Erro ao ler o Supabase: {error}</Alert> : null}

      <section>
        {commanders.length === 0 ? (
          <Empty title="Nenhum commander cadastrado" />
        ) : (
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-8 sm:gap-x-12 sm:gap-y-10">
            {commanders.map((commander) => (
              <CommanderCard key={commander.slot} commander={commander} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle icon={<TrophyIcon className="size-5" />}>Desempenho por critério</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CRITERIA.map((criterion) => {
            const quantidade = stats.counts[criterion.id];
            const pontos = quantidade * criterion.points;
            return (
              <div
                key={criterion.id}
                className="panel flex items-center justify-between gap-4 px-4 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <CriterionIcon
                    id={criterion.id}
                    className={`size-5 shrink-0 ${quantidade > 0 ? "text-gold/75" : "text-mist-200/25"}`}
                  />
                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm ${quantidade > 0 ? "text-mist-200/90" : "text-mist-200/45"}`}
                    >
                      {criterion.label}
                    </p>
                    <p className="text-[11px] text-mist-200/40">
                      {criterion.points > 0
                        ? `${criterion.points} pt${criterion.points > 1 ? "s" : ""} por vez`
                        : "sem pontos"}
                    </p>
                  </div>
                </div>
                <div className="text-right leading-none">
                  <Num className={`text-2xl ${quantidade > 0 ? "text-mist-200/90" : "text-mist-200/25"}`}>
                    {quantidade}
                  </Num>
                  {pontos > 0 ? (
                    <Num className="mt-1 block text-[13px] text-gold-200">+{pontos}</Num>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle icon={<SwordsIcon className="size-5" />}>Histórico de partidas</SectionTitle>
        {historico.length === 0 ? (
          <Empty title="Nenhuma partida registrada para este jogador" />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {historico.map((match) => (
              <MatchCard key={match.partida.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
