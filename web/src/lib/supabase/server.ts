import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client untuk digunakan di Server (Server Components, Server Actions, Route Handlers).
 * Membaca cookie session dari request headers untuk autentikasi.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll dapat dipanggil dari Server Component — abaikan error ini
            // karena middleware sudah menangani refresh session
          }
        },
      },
    }
  );
}
