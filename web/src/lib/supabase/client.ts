import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk digunakan di Browser (Client Components).
 * Pakai anon key + RLS untuk keamanan data per user.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
