import { CriteriaList, CriteriaRow } from "@/components/CriteriaList";
import { BanIcon, GroupIcon, ScrollIcon, SwordsIcon, TrophyIcon } from "@/components/Icons";
import { Num, PageHeader, SectionTitle } from "@/components/ui";
import { CRITERIA } from "@/lib/criteria";
import { ETAPAS } from "@/lib/etapas";

export const metadata = { title: "Regras" };

const FORMATO = [
  {
    icon: <GroupIcon className="size-5" />,
    titulo: "Três grupos e três jogadores",
    texto: "O campeonato é disputado por 3 grupos de 3 jogadores cada.",
  },
  {
    icon: <ScrollIcon className="size-5" />,
    titulo: "Dois commanders por jogador",
    texto:
      "Cada jogador escolhe dois commanders com combinações de cores diferentes entre si.",
  },
  {
    icon: <BanIcon className="size-5" />,
    titulo: "Banimento cruzado",
    texto:
      "Cada jogador bane um commander de um jogador sorteado de outro grupo. As etapas anteriores à final são jogadas com o commander que sobrou.",
  },
  {
    icon: <TrophyIcon className="size-5" />,
    titulo: "Na final, o commander banido",
    texto: "Os dois grupos que chegarem à final jogam com os commanders que haviam sido banidos.",
  },
];

export default function RegrasPage() {
  return (
    <div className="space-y-16">
      <PageHeader eyebrow="Como funciona" title="Regras" />

      <section>
        <SectionTitle icon={<ScrollIcon className="size-5" />}>Formato</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {FORMATO.map((item) => (
            <article key={item.titulo} className="panel flex gap-4 p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/8 text-gold-200">
                {item.icon}
              </span>
              <div>
                <h3 className="font-display text-sm tracking-[0.1em] text-gold-200 uppercase">
                  {item.titulo}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mist-200/65">{item.texto}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle icon={<SwordsIcon className="size-5" />}>Etapas</SectionTitle>
        <div className="panel divide-y divide-white/[0.05]">
          {ETAPAS.map((etapa, index) => (
            <div key={etapa.id} className="flex gap-4 px-5 py-4">
              <Num className="w-6 shrink-0 text-2xl text-gold-200">{index + 1}</Num>
              <div className="min-w-0">
                <h3 className="font-display text-sm tracking-[0.1em] text-gold-200 uppercase">
                  {etapa.nome} · {etapa.formato}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-mist-200/60">{etapa.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle icon={<TrophyIcon className="size-5" />}>Tabela de pontuação</SectionTitle>
        <CriteriaList>
          {CRITERIA.map((criterion) => (
            <CriteriaRow key={criterion.id} id={criterion.id} titulo={criterion.title}>
              <Num
                className={`w-10 text-right text-2xl ${criterion.points > 0 ? "text-gold-200" : "text-mist-200/25"}`}
              >
                {criterion.points > 0 ? `+${criterion.points}` : "0"}
              </Num>
            </CriteriaRow>
          ))}
        </CriteriaList>
      </section>
    </div>
  );
}
