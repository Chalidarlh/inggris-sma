import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Guru — MCP Inggris",
  description: "Ringkasan materi menunggu review dan nilai menunggu approve.",
};

/**
 * Halaman Dashboard Guru (/dashboard)
 * Menampilkan:
 * - Daftar materi dengan status "draft" (menunggu review)
 * - Daftar nilai dengan status "draft" (menunggu approve)
 *
 * UI sesuai design system: gradebook style, baris bukan kartu grid.
 * Akan diimplementasi penuh di Phase 5.
 */
export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-semibold text-ink mb-8">
        Dashboard Guru
      </h1>

      {/* Placeholder — akan diisi komponen di Phase 5 */}
      <section className="mb-8">
        <h2 className="font-sans text-sm font-medium text-ink/60 uppercase tracking-wider mb-3">
          Materi Menunggu Review
        </h2>
        <div className="rounded-lg border border-ink/10 bg-white p-6 text-center text-ink/40">
          Belum ada data — setup database terlebih dahulu (Phase 2)
        </div>
      </section>

      <section>
        <h2 className="font-sans text-sm font-medium text-ink/60 uppercase tracking-wider mb-3">
          Nilai Menunggu Approve
        </h2>
        <div className="rounded-lg border border-ink/10 bg-white p-6 text-center text-ink/40">
          Belum ada data — setup database terlebih dahulu (Phase 2)
        </div>
      </section>
    </div>
  );
}
