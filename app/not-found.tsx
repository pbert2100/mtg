import { GoldButton, PageHeader } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="py-16">
      <PageHeader
        eyebrow="404"
        title="Portal inexistente"
        subtitle="A página que você procura não faz parte deste campeonato."
      />
      <div className="mt-8 text-center">
        <GoldButton href="/">Voltar ao ranking</GoldButton>
      </div>
    </div>
  );
}
