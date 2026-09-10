import type { Metadata } from "next";
import { login } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "Masuk — MCP Inggris",
  description: "Login untuk mengakses sistem pembelajaran Bahasa Inggris SMA.",
};

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorMessage = params.error ? decodeURIComponent(params.error) : null;

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-ink mb-3">
            <span className="text-paper text-xl font-serif font-bold">E</span>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-ink">
            MCP Inggris
          </h1>
          <p className="text-ink/50 mt-1 text-sm">
            Sistem Pembelajaran Bahasa Inggris SMA
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface rounded-xl border border-ink/10 p-6">
          <h2 className="font-sans font-semibold text-ink mb-1">
            Masuk ke Akun
          </h2>
          <p className="text-ink/50 text-sm mb-5">
            Gunakan email dan password yang diberikan
          </p>

          {/* Error message */}
          {errorMessage && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-clay-light border border-clay/30 text-sm text-clay-dark">
              {errorMessage === "auth_callback_failed"
                ? "Login gagal. Silakan coba lagi."
                : errorMessage}
            </div>
          )}

          {/* Form dengan Server Action */}
          <form action={login} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-ink mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="nama@email.com"
                className="w-full px-3 py-2 rounded-lg border border-ink/20 bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink/30 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ink mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-ink/20 bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink/30 transition-colors"
              />
            </div>

            <button
              id="btn-login"
              type="submit"
              className="w-full py-2.5 bg-ink text-paper rounded-lg font-sans font-medium text-sm hover:bg-ink-800 transition-colors"
            >
              Masuk
            </button>
          </form>
        </div>

        <p className="text-center text-ink/40 text-xs mt-4">
          Hubungi guru untuk mendapatkan akun akses
        </p>
      </div>
    </main>
  );
}
