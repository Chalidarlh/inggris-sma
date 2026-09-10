// =============================================================
// Core TypeScript Types
// Sesuai ERD di erd-dan-tools.md — 7 tabel utama
// =============================================================

// ----- Enums -----

export type SkillType = "reading" | "writing" | "listening";
export type MaterialStatus = "draft" | "published";
export type GradeStatus = "draft" | "approved";

export type TextType =
  | "descriptive"
  | "recount"
  | "narrative"
  | "procedure"
  | "report"
  | "news_item"
  | "explanation"
  | "analytical_exposition"
  | "hortatory_exposition"
  | "discussion";

// ----- Tabel: weeks -----

export interface Week {
  id: string;
  week_number: number; // 1–24
  phase: 1 | 2 | 3 | 4;
  title: string;
  grammar_point: string;
  text_type: TextType | null; // nullable — tidak semua minggu punya jenis teks
  skill_focus: SkillType[];
  created_at: string;
}

// ----- Tabel: classes -----

export interface Class {
  id: string;
  name: string; // contoh: "XI IPA 1"
  teacher_id: string; // referensi ke auth.users
  academic_year: string; // contoh: "2024/2025"
  created_at: string;
}

// ----- Tabel: students -----

export interface Student {
  id: string;
  user_id: string; // referensi ke auth.users
  class_id: string;
  full_name: string;
  student_number: string; // NIS
  created_at: string;
}

// ----- Tabel: materials -----

export interface Material {
  id: string;
  week_id: string;
  class_id: string;
  skill_type: SkillType;
  status: MaterialStatus;
  title: string;
  content: string; // konten materi/soal yang di-generate AI
  created_at: string;
  published_at: string | null;
  // join fields (optional, di-populate saat query dengan join)
  week?: Week;
  class?: Class;
}

// ----- Tabel: submissions -----

export interface Submission {
  id: string;
  material_id: string;
  student_id: string;
  answer: string; // jawaban teks siswa
  submitted_at: string;
  // join fields
  material?: Material;
  student?: Student;
}

// ----- Tabel: grades -----

export interface Grade {
  id: string;
  submission_id: string;
  status: GradeStatus;
  score: number; // 0–100
  feedback: string; // feedback teks dari AI
  score_breakdown: ScoreBreakdown; // detail per kriteria
  approved_at: string | null;
  created_at: string;
  // join fields
  submission?: Submission;
}

export interface ScoreBreakdown {
  structure: number; // 25/50/75/100 — bobot 40%
  grammar: number;   // 25/50/75/100 — bobot 30%
  vocabulary: number; // 25/50/75/100 — bobot 15%
  coherence: number; // 25/50/75/100 — bobot 15%
}

// ----- Tabel: rubrics -----

export interface Rubric {
  id: string;
  text_type: TextType;
  criteria: RubricCriteria;
  created_at: string;
}

export interface RubricCriteria {
  structure: RubricLevels;
  grammar: RubricLevels;
  vocabulary: RubricLevels;
  coherence: RubricLevels;
}

export interface RubricLevels {
  l1: string; // kurang
  l2: string; // cukup
  l3: string; // baik
  l4: string; // sangat baik
}

// ----- UI / Helper Types -----

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}
