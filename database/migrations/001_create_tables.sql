-- ============================================================
-- Migration: Phase 2 — 7 Tabel Utama + RLS + Seed Data
-- Sistem Pembelajaran Bahasa Inggris SMA
-- Jalankan di Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- Aktifkan UUID extension (sudah aktif di Supabase by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABEL 1: weeks
-- 24 minggu kurikulum, tiap minggu punya grammar + text_type
-- ============================================================
CREATE TABLE IF NOT EXISTS public.weeks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_number   INTEGER NOT NULL UNIQUE CHECK (week_number BETWEEN 1 AND 24),
  phase         INTEGER NOT NULL CHECK (phase BETWEEN 1 AND 4),
  title         TEXT NOT NULL,
  grammar_point TEXT NOT NULL,
  text_type     TEXT CHECK (text_type IN (
    'descriptive', 'recount', 'narrative', 'procedure', 'report',
    'news_item', 'explanation', 'analytical_exposition',
    'hortatory_exposition', 'discussion'
  )),             -- nullable: tidak semua minggu punya jenis teks
  skill_focus   TEXT[] NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABEL 2: classes
-- Kelas siswa (misal "XI IPA 1")
-- ============================================================
CREATE TABLE IF NOT EXISTS public.classes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  teacher_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL DEFAULT '2024/2025',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABEL 3: students
-- Data siswa, terhubung ke satu kelas dan satu auth user
-- ============================================================
CREATE TABLE IF NOT EXISTS public.students (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id       UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  full_name      TEXT NOT NULL,
  student_number TEXT NOT NULL, -- NIS
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABEL 4: materials
-- Materi/soal yang di-generate AI per minggu + skill
-- ============================================================
CREATE TABLE IF NOT EXISTS public.materials (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_id      UUID NOT NULL REFERENCES public.weeks(id) ON DELETE CASCADE,
  class_id     UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  skill_type   TEXT NOT NULL CHECK (skill_type IN ('reading', 'writing', 'listening')),
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  title        TEXT NOT NULL,
  content      TEXT NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- ============================================================
-- TABEL 5: submissions
-- Jawaban siswa atas satu materi
-- ============================================================
CREATE TABLE IF NOT EXISTS public.submissions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id  UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  answer       TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(material_id, student_id) -- satu siswa satu jawaban per materi
);

-- ============================================================
-- TABEL 6: grades
-- Hasil penilaian AI per submission
-- ============================================================
CREATE TABLE IF NOT EXISTS public.grades (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id   UUID NOT NULL UNIQUE REFERENCES public.submissions(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved')),
  score           NUMERIC(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
  feedback        TEXT NOT NULL DEFAULT '',
  score_breakdown JSONB NOT NULL DEFAULT '{}',
  -- format: {"structure": 75, "grammar": 50, "vocabulary": 75, "coherence": 75}
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at     TIMESTAMPTZ
);

-- ============================================================
-- TABEL 7: rubrics
-- Kriteria penilaian per jenis teks (10 genre)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rubrics (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text_type  TEXT NOT NULL UNIQUE CHECK (text_type IN (
    'descriptive', 'recount', 'narrative', 'procedure', 'report',
    'news_item', 'explanation', 'analytical_exposition',
    'hortatory_exposition', 'discussion'
  )),
  criteria   JSONB NOT NULL DEFAULT '{}',
  -- format: {"structure": {"l1":..,"l2":..,"l3":..,"l4":..}, "grammar": {...}, ...}
  weights    JSONB NOT NULL DEFAULT '{"structure":0.4,"grammar":0.3,"vocabulary":0.15,"coherence":0.15}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEX untuk performa query umum
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_materials_week_id ON public.materials(week_id);
CREATE INDEX IF NOT EXISTS idx_materials_class_id ON public.materials(class_id);
CREATE INDEX IF NOT EXISTS idx_materials_status ON public.materials(status);
CREATE INDEX IF NOT EXISTS idx_submissions_material_id ON public.submissions(material_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_submission_id ON public.grades(submission_id);
CREATE INDEX IF NOT EXISTS idx_grades_status ON public.grades(status);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);

-- ============================================================
-- ROW LEVEL SECURITY — Aktifkan di semua tabel
-- ============================================================
ALTER TABLE public.weeks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rubrics    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES: weeks
-- Semua authenticated user boleh baca weeks (data publik kurikulum)
-- ============================================================
CREATE POLICY "weeks: semua user boleh baca"
  ON public.weeks FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- RLS POLICIES: classes
-- Guru hanya lihat kelas yang dia ampu
-- ============================================================
CREATE POLICY "classes: guru lihat kelas sendiri"
  ON public.classes FOR SELECT
  TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "classes: guru buat kelas"
  ON public.classes FOR INSERT
  TO authenticated
  WITH CHECK (teacher_id = auth.uid());

-- ============================================================
-- RLS POLICIES: students
-- Guru lihat semua siswa di kelasnya | Siswa lihat data diri sendiri
-- ============================================================
CREATE POLICY "students: guru lihat siswa di kelasnya"
  ON public.students FOR SELECT
  TO authenticated
  USING (
    class_id IN (
      SELECT id FROM public.classes WHERE teacher_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

-- ============================================================
-- RLS POLICIES: materials
-- Guru: CRUD materi kelas sendiri
-- Siswa: hanya baca materi yang sudah published di kelasnya
-- ============================================================
CREATE POLICY "materials: guru kelola materi kelasnya"
  ON public.materials FOR ALL
  TO authenticated
  USING (
    class_id IN (
      SELECT id FROM public.classes WHERE teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    class_id IN (
      SELECT id FROM public.classes WHERE teacher_id = auth.uid()
    )
  );

CREATE POLICY "materials: siswa baca yang published di kelasnya"
  ON public.materials FOR SELECT
  TO authenticated
  USING (
    status = 'published'
    AND class_id IN (
      SELECT class_id FROM public.students WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES: submissions
-- Siswa: insert & lihat jawaban sendiri
-- Guru: lihat semua submission di kelasnya
-- ============================================================
CREATE POLICY "submissions: siswa insert jawaban sendiri"
  ON public.submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "submissions: siswa lihat jawaban sendiri"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
    OR material_id IN (
      SELECT id FROM public.materials
      WHERE class_id IN (
        SELECT id FROM public.classes WHERE teacher_id = auth.uid()
      )
    )
  );

-- ============================================================
-- RLS POLICIES: grades
-- Siswa: lihat nilai approved milik sendiri
-- Guru: lihat & update semua nilai di kelasnya
-- ============================================================
CREATE POLICY "grades: siswa lihat nilai approved sendiri"
  ON public.grades FOR SELECT
  TO authenticated
  USING (
    (
      status = 'approved'
      AND submission_id IN (
        SELECT id FROM public.submissions
        WHERE student_id IN (
          SELECT id FROM public.students WHERE user_id = auth.uid()
        )
      )
    )
    OR submission_id IN (
      SELECT s.id FROM public.submissions s
      JOIN public.materials m ON s.material_id = m.id
      WHERE m.class_id IN (
        SELECT id FROM public.classes WHERE teacher_id = auth.uid()
      )
    )
  );

CREATE POLICY "grades: guru update nilai di kelasnya"
  ON public.grades FOR UPDATE
  TO authenticated
  USING (
    submission_id IN (
      SELECT s.id FROM public.submissions s
      JOIN public.materials m ON s.material_id = m.id
      WHERE m.class_id IN (
        SELECT id FROM public.classes WHERE teacher_id = auth.uid()
      )
    )
  );

CREATE POLICY "grades: guru insert nilai di kelasnya"
  ON public.grades FOR INSERT
  TO authenticated
  WITH CHECK (
    submission_id IN (
      SELECT s.id FROM public.submissions s
      JOIN public.materials m ON s.material_id = m.id
      WHERE m.class_id IN (
        SELECT id FROM public.classes WHERE teacher_id = auth.uid()
      )
    )
  );

-- ============================================================
-- RLS POLICIES: rubrics
-- Semua authenticated user boleh baca rubrik
-- ============================================================
CREATE POLICY "rubrics: semua user boleh baca"
  ON public.rubrics FOR SELECT
  TO authenticated
  USING (true);
