import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Tugas — MCP Inggris",
  description: "Kerjakan dan kumpulkan tugas menulismu di sini.",
};

interface TugasPageProps {
  params: Promise<{ materiId: string }>;
}

/**
 * Halaman Submit Tugas Siswa (/tugas/[materiId])
 * Siswa dapat:
 * - Membaca instruksi/soal materi
 * - Menulis jawaban di text area
 * - Mengumpulkan tugas
 *
 * Akan diimplementasi di Phase 6.
 */
export default async function TugasPage({ params }: TugasPageProps) {
  const { materiId } = await params;

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-ink mb-2">
        Kerjakan Tugas
      </h1>
      <p className="text-ink/50 text-sm mb-8">Materi ID: {materiId}</p>

      {/* Placeholder — akan diisi form submit di Phase 6 */}
      <div className="rounded-xl border border-ink/10 bg-white p-8 text-center text-ink/40">
        Form pengumpulan tugas akan diimplementasi di Phase 6
      </div>
    </div>
  );
}
