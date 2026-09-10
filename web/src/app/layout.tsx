import type { Metadata } from "next";
import { Public_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

/**
 * Public Sans — font body/UI (humanis, terbaca di ukuran kecil)
 * Sesuai design-system.md bagian 2: Tipografi
 */
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-public-sans",
  display: "swap",
});

/**
 * Source Serif 4 — font heading/judul (akademis, seperti buku pelajaran)
 * Pakai weight "variable" agar bisa memakai semua weight + axes opsz.
 * Sesuai design-system.md bagian 2: Tipografi
 */
const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-source-serif-4",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MCP Inggris — Sistem Pembelajaran Bahasa Inggris SMA",
  description:
    "Platform pembelajaran Bahasa Inggris berbasis AI untuk guru dan siswa SMA. Generate materi, nilai tulisan, dan pantau progres belajar.",
};

/**
 * Root Layout — berlaku untuk semua route.
 * Font dimuat via next/font (self-hosted otomatis, tanpa @import di CSS).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${publicSans.variable} ${sourceSerif4.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
