import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TextType, SkillType, MaterialStatus, GradeStatus } from "@/lib/types";

/**
 * Utility untuk merge Tailwind class — gabungan clsx + twMerge.
 * Dipakai di komponen shadcn/ui dan seluruh project.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----- Format helpers -----

/**
 * Format tanggal ke format Indonesia: "09 Sep 2026"
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

/**
 * Format tanggal + waktu: "09 Sep 2026, 15.30"
 */
export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

// ----- Label helpers -----

const TEXT_TYPE_LABELS: Record<TextType, string> = {
  descriptive: "Descriptive Text",
  recount: "Recount Text",
  narrative: "Narrative Text",
  procedure: "Procedure Text",
  report: "Report Text",
  news_item: "News Item Text",
  explanation: "Explanation Text",
  analytical_exposition: "Analytical Exposition",
  hortatory_exposition: "Hortatory Exposition",
  discussion: "Discussion Text",
};

export function getTextTypeLabel(textType: TextType): string {
  return TEXT_TYPE_LABELS[textType];
}

const SKILL_TYPE_LABELS: Record<SkillType, string> = {
  reading: "Reading",
  writing: "Writing",
  listening: "Listening",
};

export function getSkillTypeLabel(skillType: SkillType): string {
  return SKILL_TYPE_LABELS[skillType];
}

const MATERIAL_STATUS_LABELS: Record<MaterialStatus, string> = {
  draft: "Draft",
  published: "Dipublikasikan",
};

export function getMaterialStatusLabel(status: MaterialStatus): string {
  return MATERIAL_STATUS_LABELS[status];
}

const GRADE_STATUS_LABELS: Record<GradeStatus, string> = {
  draft: "Menunggu Approve",
  approved: "Disetujui",
};

export function getGradeStatusLabel(status: GradeStatus): string {
  return GRADE_STATUS_LABELS[status];
}

// ----- Score helpers -----

/**
 * Hitung skor akhir dari breakdown per kriteria.
 * Bobot: struktur 40%, grammar 30%, vocabulary 15%, koherensi 15%
 */
export function calculateFinalScore(breakdown: {
  structure: number;
  grammar: number;
  vocabulary: number;
  coherence: number;
}): number {
  return (
    breakdown.structure * 0.4 +
    breakdown.grammar * 0.3 +
    breakdown.vocabulary * 0.15 +
    breakdown.coherence * 0.15
  );
}

/**
 * Konversi level rubrik (1–4) ke skor angka (25/50/75/100)
 */
export function levelToScore(level: 1 | 2 | 3 | 4): number {
  const map = { 1: 25, 2: 50, 3: 75, 4: 100 };
  return map[level];
}
