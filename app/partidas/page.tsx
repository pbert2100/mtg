import { SwordsIcon } from "@/components/Icons";
import { MatchCard } from "@/components/MatchCard";
import { Alert, Empty, PageHeader, SectionTitle } from "@/components/ui";
import { getChampionship, type MatchView } from "@/lib/data";
import { ETAPAS } from "@/lib/etapas";

// Revalida a cada 30s: navegar entre páginas passa a ser instantâneo (ver CACHE_SEGUNDOS em lib/data.ts).
export const revalidate = 30;

export const metadata = { title: "Partidas" };

export default async function PartidasPage() {
  const { matches, error } = await getChampionship();

  // Uma seção por etapa, na ordem oficial. Partidas sem a coluna `fase` preenchida
  // caem num bloco próprio no fim, em vez de serem rotuladas por adivinhação.
  const porEtapa = ETAPAS.map((etapa) => ({
    etapa,
    partidas: matches.filter((m) => m.etapa?.id === etapa.id),
  })).filter((secao) => secao.partidas.length > 0);

  const semEtapa: MatchView[] = matches.filter((m) => !m.etapa);

  return (
    <div className="space-y-16">
      <PageHeader eyebrow={`${matches.length} registradas`} title="Partidas" />

      {error ? <Alert>Erro ao ler o Supabase: {error}</Alert> : null}

      {matches.length === 0 ? (
        <Empty
          title="Nenhuma partida registrada"
          description="Cada linha da tabela partidas guarda, em cada coluna, o id do jogador que conquistou aquele critério."
        />
      ) : (
        <>
          {porEtapa.map(({ etapa, partidas }) => (
            <section key={etapa.id}>
              <SectionTitle icon={<SwordsIcon className="size-5" />}>
                {etapa.nome} · {etapa.formato}
              </SectionTitle>
              <div className="grid gap-4 lg:grid-cols-2">
                {partidas.map((match) => (
                  <MatchCard key={match.partida.id} match={match} />
                ))}
              </div>
            </section>
          ))}

          {semEtapa.length > 0 ? (
            <section>
              <SectionTitle icon={<SwordsIcon className="size-5" />}>
                {porEtapa.length > 0 ? "Sem etapa definida" : "Todas as partidas"}
              </SectionTitle>
              <div className="grid gap-4 lg:grid-cols-2">
                {semEtapa.map((match) => (
                  <MatchCard key={match.partida.id} match={match} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
