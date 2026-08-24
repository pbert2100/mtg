import { GroupCard } from "@/components/GroupCard";
import { Alert, Empty, PageHeader } from "@/components/ui";
import { getChampionship } from "@/lib/data";

// Revalida a cada 30s: navegar entre páginas passa a ser instantâneo (ver CACHE_SEGUNDOS em lib/data.ts).
export const revalidate = 30;

export const metadata = { title: "Grupos" };

export default async function GruposPage() {
  const { groups, error } = await getChampionship();
  const ordenados = [...groups].sort((a, b) => b.totalPontos - a.totalPontos);

  return (
    <div>
      <PageHeader eyebrow="Corrida pela final" title="Grupos" />

      {error ? <Alert>Erro ao ler o Supabase: {error}</Alert> : null}

      {ordenados.length === 0 ? (
        <Empty
          title="Nenhum grupo cadastrado"
          description="Preencha a coluna grupo na tabela jogadores do Supabase."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {ordenados.map((grupo, index) => (
            <GroupCard key={grupo.slug} grupo={grupo} posicao={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
