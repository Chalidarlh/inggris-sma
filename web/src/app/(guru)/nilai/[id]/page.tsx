import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Nilai — MCP Inggris",
  description: "Lihat skor dan feedback AI, lalu approve nilai siswa.",
};

interface NilaiDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Halaman Detail Nilai Guru (/nilai/[id])
 * Guru dapat:
 * - Melihat skor AI + breakdown per kriteria rubrik
 * - Membaca feedback teks dari AI
 * - Menekan tombol "Approve" untuk mengesahkan nilai
 *
 * Akan diimplementasi penuh di Phase 5 dengan komponen NilaiReview.
 */
export default async function NilaiDetailPage({ params }: NilaiDetailPageProps) {
  const { id } = await params;

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold text-ink mb-2">
        Detail Nilai
      </h1>
      <p className="text-ink/50 text-sm mb-8">ID: {id}</p>

      {/* Placeholder — akan diisi komponen NilaiReview di Phase 5 */}
      <div className="rounded-lg border border-ink/10 bg-white p-6 text-center text-ink/40">
        Komponen NilaiReview akan diimplementasi di Phase 5
      </div>
    </div>
  );
}
