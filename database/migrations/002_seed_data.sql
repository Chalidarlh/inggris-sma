-- ============================================================
-- Seed: Data minggu contoh (Minggu 4, 7, 13) + Rubrik 3 genre
-- Sesuai Phase 0 implementation-plan.md
-- Jalankan SETELAH 001_create_tables.sql
-- ============================================================

-- ============================================================
-- SEED: weeks — 24 minggu kurikulum lengkap
-- Dari kurikulum-inggris.md bagian 4 (Rincian Mingguan)
-- ============================================================
INSERT INTO public.weeks (week_number, phase, title, grammar_point, text_type, skill_focus) VALUES
-- FASE 1: Fondasi (Minggu 1-6)
(1,  1, 'Perkenalan & Simple Present Tense',         'To be, simple present tense, personal pronouns',          NULL,          ARRAY['speaking', 'writing']),
(2,  1, 'Simple Past Tense & Descriptive Text',      'Simple past tense (reguler & irregular verbs)',            'descriptive', ARRAY['reading', 'writing']),
(3,  1, 'Descriptive Text & Comparative/Superlative','Comparative & superlative adjectives',                    'descriptive', ARRAY['writing']),
(4,  1, 'Recount Text & Past Continuous',            'Past continuous, time connectives (then, after that)',     'recount',     ARRAY['speaking', 'writing']),
(5,  1, 'Recount Text Lanjutan & Question Tags',     'Question tags, WH-questions review',                      'recount',     ARRAY['writing', 'listening']),
(6,  1, 'Review Fase 1 + Mini Ulangan',              'Review semua grammar Fase 1',                             NULL,          ARRAY['reading', 'writing']),
-- FASE 2: Bercerita (Minggu 7-12)
(7,  2, 'Narrative Text & Simple Past Review',       'Simple past + adverb of time',                            'narrative',   ARRAY['reading', 'writing']),
(8,  2, 'Narrative Text & Direct-Indirect Speech',   'Direct & reported speech dasar',                          'narrative',   ARRAY['writing']),
(9,  2, 'Procedure Text & Imperative Sentences',     'Imperative sentences, sequence connectors',               'procedure',   ARRAY['speaking', 'writing']),
(10, 2, 'Procedure Text & Modal Verbs',              'Modal verbs (must, should, have to)',                     'procedure',   ARRAY['writing', 'listening']),
(11, 2, 'Future Tense & Conditional Sentence Type 1','Will/going to, first conditional',                        NULL,          ARRAY['writing']),
(12, 2, 'Review Fase 2 + Mini Ulangan',              'Review grammar & 2 jenis teks (narrative, procedure)',    NULL,          ARRAY['reading', 'writing', 'speaking']),
-- FASE 3: Faktual & Informatif (Minggu 13-18)
(13, 3, 'Report Text & Passive Voice',               'Passive voice simple present/past',                       'report',      ARRAY['reading', 'writing']),
(14, 3, 'Report Text & Passive Voice Lanjutan',      'Passive voice modal (can be, should be)',                 'report',      ARRAY['writing']),
(15, 3, 'News Item Text & Reported Speech',          'Reported speech untuk statement & question',              'news_item',   ARRAY['reading', 'writing']),
(16, 3, 'Explanation Text & Cause-Effect Connectors','Because, since, due to, as a result, so that',            'explanation', ARRAY['speaking', 'writing']),
(17, 3, 'Explanation Text & Relative Clauses',       'Relative pronouns (who, which, that, where)',             'explanation', ARRAY['writing', 'listening']),
(18, 3, 'Review Fase 3 + Mini Ulangan',              'Review grammar & 3 jenis teks (report, news, explanation)',NULL,          ARRAY['reading', 'writing']),
-- FASE 4: Argumentatif & Persiapan Ujian (Minggu 19-24)
(19, 4, 'Analytical Exposition & Conjunctions',      'Conjunctions (however, therefore, in addition)',          'analytical_exposition', ARRAY['reading', 'writing']),
(20, 4, 'Analytical Exposition & Expressing Opinion','Expressions of opinion (I believe, in my opinion)',       'analytical_exposition', ARRAY['writing']),
(21, 4, 'Hortatory Exposition & Modal untuk Saran',  'Should/must/need to untuk rekomendasi',                   'hortatory_exposition',  ARRAY['speaking', 'writing']),
(22, 4, 'Discussion Text & Perbandingan Argumen',    'Comparative + connector kontras (although, whereas)',     'discussion',  ARRAY['writing']),
(23, 4, 'Latihan Terintegrasi & Simulasi Soal Ujian','Review semua grammar point',                              NULL,          ARRAY['reading', 'writing', 'listening']),
(24, 4, 'Review Total + Ujian Akhir Simulasi',       'Semua grammar point komprehensif',                        NULL,          ARRAY['reading', 'writing', 'listening', 'speaking'])
ON CONFLICT (week_number) DO NOTHING;

-- ============================================================
-- SEED: rubrics — 3 genre untuk MVP (Recount, Narrative, Report)
-- Sesuai Phase 0: pilih 3 contoh yang mewakili Fase 1, 2, 3
-- ============================================================
INSERT INTO public.rubrics (text_type, criteria, weights) VALUES
(
  'recount',
  '{
    "structure": {
      "l1": "Hanya berupa daftar kejadian tanpa struktur orientation-events-reorientation",
      "l2": "Orientation atau reorientation lemah/hilang, events ada tapi tidak runtut",
      "l3": "Ketiga elemen ada (orientation, events, reorientation), urutan kejadian cukup jelas",
      "l4": "Ketiga elemen lengkap, urutan kejadian kronologis dan jelas, reorientation berkesan"
    },
    "grammar": {
      "l1": "Banyak kesalahan grammar, mengganggu makna",
      "l2": "Beberapa kesalahan grammar, makna masih tertangkap",
      "l3": "Sedikit kesalahan grammar, tidak mengganggu makna",
      "l4": "Grammar akurat, penggunaan simple past dan time connectives (then, after that, finally) tepat"
    },
    "vocabulary": {
      "l1": "Kosakata sangat terbatas/berulang",
      "l2": "Kosakata cukup, kurang variatif",
      "l3": "Kosakata cukup variatif dan sesuai konteks pengalaman",
      "l4": "Kosakata kaya, tepat konteks, mencerminkan genre recount"
    },
    "coherence": {
      "l1": "Kalimat tidak nyambung satu sama lain",
      "l2": "Ada connector tapi penggunaannya kurang tepat",
      "l3": "Connector dipakai dengan cukup tepat",
      "l4": "Alur cerita runtut, connector waktu (then, after that, finally) dipakai efektif"
    }
  }',
  '{"structure": 0.4, "grammar": 0.3, "vocabulary": 0.15, "coherence": 0.15}'
),
(
  'narrative',
  '{
    "structure": {
      "l1": "Cerita tidak memiliki konflik yang jelas, tidak ada orientation-complication-resolution",
      "l2": "Complication atau resolution lemah/terburu-buru",
      "l3": "Ketiga elemen ada (orientation, complication, resolution), konflik/resolusi kurang berkembang",
      "l4": "Ketiga elemen lengkap, konflik dan resolusi jelas dan logis, cerita mengalir"
    },
    "grammar": {
      "l1": "Banyak kesalahan grammar, mengganggu makna",
      "l2": "Beberapa kesalahan grammar, makna masih tertangkap",
      "l3": "Sedikit kesalahan grammar, tidak mengganggu makna",
      "l4": "Grammar akurat, penggunaan past tense dan direct/indirect speech tepat"
    },
    "vocabulary": {
      "l1": "Kosakata sangat terbatas/berulang",
      "l2": "Kosakata cukup, kurang variatif",
      "l3": "Kosakata cukup variatif dan sesuai konteks cerita",
      "l4": "Kosakata kaya, tepat konteks, mencerminkan genre narrative (dongeng/cerita)"
    },
    "coherence": {
      "l1": "Kalimat tidak nyambung satu sama lain",
      "l2": "Ada connector tapi penggunaannya kurang tepat",
      "l3": "Connector dipakai dengan cukup tepat",
      "l4": "Alur cerita runtut dan engaging, connector temporal dan kausal dipakai efektif"
    }
  }',
  '{"structure": 0.4, "grammar": 0.3, "vocabulary": 0.15, "coherence": 0.15}'
),
(
  'report',
  '{
    "structure": {
      "l1": "Tidak dapat dibedakan dari descriptive text (terlalu spesifik, bukan general classification)",
      "l2": "Klasifikasi tidak jelas, deskripsi bersifat opini bukan fakta",
      "l3": "General classification ada, description kurang sistematis",
      "l4": "General classification jelas, description sistematis dan berdasarkan fakta (ciri, perilaku, fungsi)"
    },
    "grammar": {
      "l1": "Banyak kesalahan grammar, mengganggu makna",
      "l2": "Beberapa kesalahan grammar, makna masih tertangkap",
      "l3": "Sedikit kesalahan grammar, tidak mengganggu makna",
      "l4": "Grammar akurat, penggunaan simple present dan passive voice tepat"
    },
    "vocabulary": {
      "l1": "Kosakata sangat terbatas/berulang",
      "l2": "Kosakata cukup, kurang variatif",
      "l3": "Kosakata ilmiah/teknis cukup variatif",
      "l4": "Kosakata ilmiah/teknis kaya, tepat, dan dipakai dengan benar"
    },
    "coherence": {
      "l1": "Paragraf tidak terorganisir, informasi acak",
      "l2": "Ada struktur tapi transisi antar paragraf lemah",
      "l3": "Transisi antar paragraf cukup baik",
      "l4": "Informasi mengalir logis dari general ke specific, sangat mudah dipahami"
    }
  }',
  '{"structure": 0.4, "grammar": 0.3, "vocabulary": 0.15, "coherence": 0.15}'
)
ON CONFLICT (text_type) DO NOTHING;
