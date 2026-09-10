import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Siswa — MCP Inggris",
  description: "Portal belajar: akses materi mingguan dan pantau progresmu.",
};

/**
 * Layout untuk area siswa — route group (siswa).
 * Semua halaman siswa berbagi layout ini.
 * Lebih longgar dan visual dibanding layout guru — sesuai design system.
 */
export default function SiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      {/* Header siswa akan diimplementasi di Phase 6 */}
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
