import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Belajar — MCP Inggris",
  description: "Daftar materi mingguan kelas dan progres belajarmu.",
};

/**
 * Halaman Portal Siswa (/portal)
 * Menampilkan:
 * - Kartu progres per minggu (1–24)
 * - Status per minggu: belum dikerjakan / selesai
 * - Link ke materi dan tugas
 *
 * UI sesuai design system: kartu grid, ramah visual, indikator ● / ○
 * Akan diimplementasi penuh di Phase 6 dengan komponen PortalSiswa.
 */
export default function PortalPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-ink mb-2">
        Portal Belajar
      </h1>
      <p className="text-ink/60 mb-8">
        Selamat datang! Pilih materi minggu ini untuk memulai.
      </p>

      {/* Placeholder — akan diisi komponen PortalSiswa di Phase 6 */}
      <div className="rounded-xl border border-ink/10 bg-white p-8 text-center text-ink/40">
        Kartu materi mingguan akan muncul di sini (Phase 6)
      </div>
    </div>
  );
}
