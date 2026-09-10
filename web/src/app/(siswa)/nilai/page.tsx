import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nilai & Feedback — MCP Inggris",
  description: "Lihat nilai dan feedback AI untuk tugas-tugasmu.",
};

/**
 * Halaman Nilai Siswa (/nilai)
 * Siswa dapat:
 * - Melihat semua nilai yang sudah di-approve guru
 * - Membaca feedback AI per tugas
 * - Melihat breakdown skor per kriteria
 *
 * Akan diimplementasi di Phase 6.
 */
export default function NilaiSiswaPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-ink mb-2">
        Nilai & Feedback
      </h1>
      <p className="text-ink/60 mb-8">
        Nilai yang sudah disetujui guru akan muncul di sini.
      </p>

      {/* Placeholder — akan diisi daftar nilai di Phase 6 */}
      <div className="rounded-xl border border-ink/10 bg-white p-8 text-center text-ink/40">
        Daftar nilai dan feedback akan diimplementasi di Phase 6
      </div>
    </div>
  );
}
