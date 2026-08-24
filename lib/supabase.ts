import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * As variáveis são lidas dentro da função, e não no topo do módulo, porque nomes sem o
 * prefixo `NEXT_PUBLIC_` chegam pelo ambiente em tempo de execução. Assim, mudar uma
 * variável no painel da Vercel passa a valer na próxima revalidação, sem exigir um
 * novo build — o que não acontece com `NEXT_PUBLIC_*`, que o Next embute no código
 * durante o build e congela naquele valor.
 */
function ler(...nomes: string[]): string | undefined {
  for (const nome of nomes) {
    const valor = process.env[nome];
    if (valor) return valor;
  }
  return undefined;
}

export function getSupabase() {
  const url = ler("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL");

  /**
   * A leitura acontece só no servidor, então preferimos a chave secreta: assim o banco
   * pode ficar com RLS ligado e sem nenhuma policy pública. Sem ela, caímos na chave
   * publicável — que exige uma policy de SELECT para `anon`.
   */
  const key = ler("SUPABASE_SECRET_KEY", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
