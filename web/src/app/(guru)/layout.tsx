import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Guru — MCP Inggris",
  description: "Area manajemen guru: review materi, approve nilai, kelola kelas.",
};

/**
 * Layout untuk area guru — route group (guru).
 * Semua halaman guru berbagi layout ini (sidebar, header bar).
 * URL tetap bersih: /dashboard, /materi/[id], /nilai/[id]
 */
export default function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper flex">
      {/* Sidebar akan diimplementasi di Phase 5 */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
