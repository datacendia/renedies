import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase admin client (server-only). Uses service role for server ops
 * like writing favorites on behalf of a verified user.
 *
 * Schema (run once in Supabase SQL editor):
 *
 *   create table public.favorites (
 *     user_id uuid not null,
 *     slug text not null,
 *     created_at timestamptz default now(),
 *     primary key (user_id, slug)
 *   );
 *   create index on public.favorites(user_id);
 *
 *   -- optional: row-level security
 *   alter table public.favorites enable row level security;
 *   create policy "own rows" on public.favorites
 *     for all using (auth.uid() = user_id);
 */

let _client: SupabaseClient | null = null;

export function supabaseServer(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // dev without supabase: feature disabled
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}
