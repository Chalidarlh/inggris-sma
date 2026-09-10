import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Materi — MCP Inggris",
  description: "Review dan edit draf materi sebelum dipublikasikan ke kelas.",
};

interface MateriDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Halaman Detail Materi Guru (/materi/[id])
 * Guru dapat:
 * - Melihat konten materi yang di-generate AI
 * - Mengedit jika diperlukan
 * - Menekan tombol "Publish" untuk mempublikasikan ke kelas
 *
 * Akan diimplementasi penuh di Phase 5 dengan komponen MateriReview.
 */
export default async function MateriDetailPage({ params }: MateriDetailPageProps) {
  const { id } = await params;

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold text-ink mb-2">
        Detail Materi
      </h1>
      <p className="text-ink/50 text-sm mb-8">ID: {id}</p>

      {/* Placeholder — akan diisi komponen MateriReview di Phase 5 */}
      <div className="rounded-lg border border-ink/10 bg-white p-6 text-center text-ink/40">
        Komponen MateriReview akan diimplementasi di Phase 5
      </div>
    </div>
  );
}
