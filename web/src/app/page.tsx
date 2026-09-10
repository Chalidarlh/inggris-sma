import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MCP Inggris — Sistem Pembelajaran Bahasa Inggris SMA",
  description:
    "Platform pembelajaran Bahasa Inggris berbasis AI untuk guru dan siswa SMA.",
};

/**
 * Landing / Login page ("/")
 * Entry point: user memilih masuk sebagai guru atau siswa.
 * Auth Supabase akan diimplementasi di Phase 2.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo / Brand */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink mb-4">
            <span className="text-paper text-2xl font-serif font-bold">E</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-ink">
            MCP Inggris
          </h1>
          <p className="text-ink/60 mt-2 text-sm">
            Sistem Pembelajaran Bahasa Inggris SMA berbasis AI
          </p>
        </div>

        {/* Login Options */}
        <div className="bg-surface rounded-xl border border-ink/10 p-6 space-y-3">
          <Link
            href="/dashboard"
            id="btn-masuk-guru"
            className="flex items-center gap-3 w-full px-5 py-4 bg-ink text-paper rounded-lg hover:bg-ink-800 transition-colors group"
          >
            <span className="text-xl">📋</span>
            <div className="text-left">
              <div className="font-sans font-medium">Masuk sebagai Guru</div>
              <div className="text-paper/60 text-xs">
                Dashboard &amp; manajemen materi
              </div>
            </div>
          </Link>

          <Link
            href="/portal"
            id="btn-masuk-siswa"
            className="flex items-center gap-3 w-full px-5 py-4 bg-surface text-ink rounded-lg border border-ink/20 hover:bg-paper transition-colors"
          >
            <span className="text-xl">📚</span>
            <div className="text-left">
              <div className="font-sans font-medium">Masuk sebagai Siswa</div>
              <div className="text-ink/50 text-xs">
                Portal belajar &amp; tugas
              </div>
            </div>
          </Link>
        </div>

        <p className="text-center text-ink/40 text-xs mt-6">
          Sistem ini menggunakan AI melalui Model Context Protocol (MCP)
        </p>
      </div>
    </main>
  );
}
