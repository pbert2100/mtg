import "server-only";

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * A leitura acontece só no servidor (Server Components), então usamos a chave secreta
 * quando ela existe: assim o banco pode ficar com RLS ligado e sem nenhuma policy
 * pública, e mesmo assim a plataforma enxerga os dados. Se a chave secreta não estiver
 * configurada, caímos na chave publicável — que exige uma policy de SELECT para `anon`.
 */
const key =
  process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function getSupabase() {
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
