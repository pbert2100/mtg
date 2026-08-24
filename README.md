# ARCANUM — Campeonato de Commander

Plataforma de acompanhamento de um campeonato caseiro de Magic: The Gathering (Commander),
construída com **Next.js 16 (App Router)**, **Tailwind CSS 4** e **Supabase**.

Todos os lançamentos são feitos direto no painel do Supabase — a plataforma é somente leitura.

## Rodando

```bash
npm install
npm run dev
```

Para medir velocidade de verdade, use o build de produção — o `next dev` compila sob
demanda e é várias vezes mais lento que o site publicado:

```bash
npm run build && npm start
```

## Cache e atualização dos dados

Todas as páginas são pré-renderizadas e revalidadas a cada **30 segundos**, e as consultas
ao Supabase ficam em cache pelo mesmo período. Na prática: um lançamento novo no Supabase
aparece no site em até ~30s, e navegar entre páginas é instantâneo.

- O intervalo das páginas fica no `export const revalidate = 30` de cada `page.tsx`.
- O das consultas fica em `CACHE_SEGUNDOS`, no topo de [`lib/data.ts`](lib/data.ts) —
  coloque `0` ali para ler o banco a cada requisição (mais lento, sempre atual).

As credenciais ficam em `.env.local` (já criado, e ignorado pelo git):

```
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
```

A leitura acontece só em Server Components, então a chave secreta **nunca chega ao
browser** — [`lib/supabase.ts`](lib/supabase.ts) importa `server-only`, o que faz o build
falhar se algum componente de cliente tentar usá-la. Com isso o banco pode continuar com
RLS ligado e sem nenhuma policy pública.

Se preferir usar a chave publicável, defina `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no
lugar da secreta e libere a leitura no banco:

```sql
create policy "leitura publica" on jogadores for select to anon using (true);
create policy "leitura publica" on partidas  for select to anon using (true);
```

Sem uma das duas opções o Supabase responde com uma lista vazia (sem erro) e a plataforma
aparece sem jogadores.

Ao publicar (Vercel, por exemplo), cadastre as mesmas variáveis no painel do projeto.

## Páginas

| Rota | O que mostra |
| --- | --- |
| `/` | Classificação geral, corrida dos grupos, Hall dos Recordes (líder de cada critério) e últimas partidas |
| `/grupos` | Os três grupos com mini-classificação e total de pontos |
| `/grupos/[slug]` | Classificação do grupo, destaques por critério, commanders e partidas do grupo |
| `/partidas` | Todas as partidas separadas entre final e fase de grupos |
| `/partidas/[id]` | Placar da mesa e os doze critérios da partida com quem levou cada um |
| `/jogadores/[id]` | Perfil: commanders, decks, desempenho critério a critério e histórico |
| `/regras` | Formato do campeonato e tabela oficial de pontuação |

## Como os pontos são calculados

Cada linha de `partidas` guarda, em cada coluna de critério, o **id do jogador** que
conquistou aquele critério naquela partida. A plataforma varre todas as partidas, conta
quantas vezes cada jogador aparece em cada coluna e multiplica pelo peso do critério:

| Critério | Coluna | Pontos |
| --- | --- | --- |
| Vencedor da partida | `vencedor` | 5 |
| Segundo lugar | `segundo_lugar` | 3 |
| Eliminações | `eliminacoes` | 1 |
| Eliminação por commander damage | `eliminacoes_cd` | 1 |
| Maior dano em um único ataque | `maior_dano` | 2 |
| Maior boardwipe | `boardwipe` | 2 |
| First blood | `primeiro_sangue` | 1 |
| Mais criaturas em um turno | `criaturas` | 1 |
| Mais vida ganha em um turno | `vida_maxima` | 1 |
| Mais mana gerada em um turno | `mana_gerada` | 1 |
| Mágica mais cara | `magica_cara` | 1 |
| Primeiro a morrer | `primeira_morte` | 0 (registro de vergonha) |

Os pesos, nomes e descrições ficam em [`lib/criteria.ts`](lib/criteria.ts) — é o único
arquivo que precisa mudar para ajustar a pontuação ou incluir um critério novo (basta
criar a coluna correspondente em `partidas` e adicionar a entrada no array).

## Grupos, fases e commanders

- **Grupos da partida:** a plataforma lê **todas** as colunas `grupoN` de `partidas` —
  hoje `grupo1`, `grupo2` e `grupo3`. Criar uma `grupo4` no Supabase passa a funcionar
  sozinho, sem mexer no código. Valores vazios, repetidos ou nulos são ignorados.
- **Etapa:** vem da coluna opcional `fase` de `partidas` (veja abaixo). Se todas as
  colunas `grupoN` ficarem vazias, os grupos são deduzidos dos jogadores citados na linha.

## Etapas do campeonato

| Etapa | Formato | Como é |
| --- | --- | --- |
| Etapa 1 | 3v3 | Cada grupo enfrenta os outros dois com todos os jogadores. Três partidas. |
| Etapa 2 | 2v2v2 | Uma partida com três duplas na mesma mesa, dois sorteados de cada grupo. |
| Etapa 3 | 1v1v1 | Os três jogadores de maior pontuação individual, um de cada grupo. |
| Etapa Final | 3v3 | Os dois grupos com maior pontuação acumulada, três jogadores de cada lado. |

Todas as etapas cruzam grupos, então **não dá para deduzir a etapa contando grupos**:
Etapa 1 e Final têm dois grupos cada; Etapas 2 e 3 têm três. Por isso a etapa precisa
ser escrita numa coluna:

```sql
alter table partidas add column fase text;
```

Aceita `1`, `2`, `3`, `final`, `Etapa 1`, `Etapa Final`, `2v2v2`, `1v1v1` — maiúsculas e
acentos não importam. `3v3` sozinho não serve, porque é o formato da Etapa 1 e da Final.
Sem a coluna, as partidas aparecem juntas em "Todas as partidas", sem rótulo de etapa —
nada quebra, só não há separação por etapa. As etapas em si ficam em
[`lib/etapas.ts`](lib/etapas.ts).
- **Listagem por grupo:** uma partida aparece na página de um grupo quando ele está em
  alguma coluna `grupoN` **ou** quando algum jogador citado pertence a ele.

## Quem sentou na mesa (`partidas.jogadores`)

Coluna de texto com os ids de quem jogou, separados por vírgula: `1,2,3`. O leitor também
aceita `1 2 3`, `1;2;3` e `{1,2,3}` — trocar a coluna para `int8[]` no futuro funciona sem
alterar o código.

Com ela preenchida:

- o **placar da mesa** lista todo mundo que jogou, inclusive quem zerou;
- **"Partidas"** no perfil vira a contagem real, e não "partidas em que pontuei";
- o **histórico do jogador** inclui as mesas em que ele não marcou nada;
- a plataforma **avisa** quando um critério aponta para alguém fora da lista, ou quando a
  lista cita um id que não existe em `jogadores` — os dois casos são erro de lançamento.

Sem a coluna preenchida, os participantes continuam sendo deduzidos das colunas de
critério, como antes. Dá para preencher partida a partida: cada uma com a lista passa a
usar a lista, as outras seguem na dedução.
- **Corrida pela final:** os grupos são ranqueados pela soma dos pontos dos seus jogadores;
  os dois primeiros aparecem marcados como *zona da final*.
- **Commanders:** `commander1`/`image1`/`URL1` e `commander2`/`image2`/`URL2` são exibidos
  lado a lado, com link para o deck. A plataforma não distingue qual deles foi banido.

## As duas imagens de cada commander

Cada commander tem duas imagens, com papéis diferentes:

| Coluna | O que é | Onde aparece |
| --- | --- | --- |
| `image1` / `image2` | A **carta inteira**, com moldura e texto | Foto de perfil, pódio da home, cards de commander |
| `background1` / `background2` | Só a **ilustração** da carta | Fundo das linhas do ranking e dos recordes, fundo da página no hover do pódio |

Enquanto `backgroundN` estiver vazia, os fundos caem na carta inteira — funciona, mas o
recorte fica pior, porque a moldura entra no enquadramento. Os dois seletores ficam em
`ilustracaoDe()` e `cartaDe()`, em [`lib/data.ts`](lib/data.ts).

**Fallback:** enquanto não houver nenhuma linha em `partidas`, o ranking usa os contadores
acumulados da própria tabela `jogadores` (`vencedor`, `eliminacoes`, ...). Assim que a
primeira partida for lançada, `partidas` passa a ser a fonte da verdade.

## Design

### Responsividade

A plataforma é verificada de 320px a 1536px. Regras que não devem ser quebradas:

- **Nenhum alvo tocável abaixo de 44px de altura** — botões, links de navegação, chips de
  jogador e links de voltar usam `min-h-11`.
- **Nenhum overflow horizontal** em nenhuma largura. As tabelas rolam dentro do próprio
  contêiner, nunca a página.
- **Efeitos de hover ficam dentro de `@media (hover: hover)`** — em tela de toque o
  `:hover` gruda depois do tap e deixa o elemento travado no estado de destaque.
- **As cartas ficam lado a lado no celular**: três no pódio, duas nos commanders. As
  larguras estão em [`lib/card.ts`](lib/card.ts).
- Ao mexer no layout, cheque também **320px** (iPhone SE) e **640–768px**, onde o grid das
  tabelas troca de configuração — é onde os problemas costumam aparecer.

### Identidade

- Fontes: **Cinzel** (títulos), **Public Sans** (texto), **Grenze Gotisch** (números).
- Paleta: `#3A2555`, `#625974`, `#30346A`, `#AC8C3B` — definida em
  [`app/globals.css`](app/globals.css) via `@theme`.
- O nome do campeonato e os itens do menu ficam em [`lib/config.ts`](lib/config.ts).
