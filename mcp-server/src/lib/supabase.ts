import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client untuk MCP server.
 * Pakai service role key — akses penuh, bypass Row Level Security.
 *
 * PENTING: Key ini TIDAK BOLEH bocor ke /web atau client-side code.
 * MCP server adalah proses tepercaya yang berjalan secara lokal via stdio.
 */

function createSupabaseClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diisi di file .env"
    );
  }

  return createClient(url, key, {
    auth: {
      // Service role tidak butuh session management
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Export singleton — satu client untuk semua tools
export const supabase = createSupabaseClient();
