/**
 * Rubrik penilaian untuk 10 jenis teks + reading + listening.
 * Sesuai rubrik.md — di-hardcode dulu untuk versi prototype.
 * Nanti bisa dipindah ke database (tabel rubrics) kalau diperlukan.
 *
 * Format: teks panduan yang akan dimasukkan ke dalam prompt AI
 * saat memanggil grade_writing_submission.
 */

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

interface RubricDefinition {
  name: string;
  structure_elements: string;
  criteria: {
    structure: { l1: string; l2: string; l3: string; l4: string };
    grammar: { l1: string; l2: string; l3: string; l4: string };
    vocabulary: { l1: string; l2: string; l3: string; l4: string };
    coherence: { l1: string; l2: string; l3: string; l4: string };
  };
  weights: {
    structure: number;
    grammar: number;
    vocabulary: number;
    coherence: number;
  };
}

export const RUBRICS: Record<TextType, RubricDefinition> = {
  descriptive: {
    name: "Descriptive Text",
    structure_elements: "identification (perkenalan objek) → description (ciri-ciri objek)",
    criteria: {
      structure: {
        l1: "Tidak ada identifikasi objek yang jelas",
        l2: "Identifikasi kurang jelas, ciri-ciri disebutkan sebagian",
        l3: "Identifikasi ada, ciri-ciri dijabarkan tapi kurang terorganisir",
        l4: "Identifikasi jelas + ciri-ciri dijabarkan detail dan terorganisir (fisik, sifat, dll)",
      },
      grammar: {
        l1: "Banyak kesalahan grammar, mengganggu makna",
        l2: "Beberapa kesalahan grammar, makna masih tertangkap",
        l3: "Sedikit kesalahan grammar, tidak mengganggu makna",
        l4: "Grammar akurat, sesuai grammar point minggu terkait",
      },
      vocabulary: {
        l1: "Kosakata sangat terbatas/berulang",
        l2: "Kosakata cukup, kurang variatif",
        l3: "Kosakata cukup variatif dan sesuai konteks",
        l4: "Kosakata kaya dan tepat konteks",
      },
      coherence: {
        l1: "Kalimat tidak nyambung satu sama lain",
        l2: "Ada connector tapi penggunaannya kurang tepat",
        l3: "Connector dipakai dengan cukup tepat",
        l4: "Alur ide runtut, connector dipakai efektif",
      },
    },
    weights: { structure: 0.4, grammar: 0.3, vocabulary: 0.15, coherence: 0.15 },
  },

  recount: {
    name: "Recount Text",
    structure_elements: "orientation (siapa, kapan, di mana) → events (urutan kejadian) → reorientation (penutup/kesan)",
    criteria: {
      structure: {
        l1: "Hanya berupa daftar kejadian tanpa struktur",
        l2: "Orientation atau reorientation lemah/hilang, events ada tapi tidak runtut",
        l3: "Ketiga elemen ada, urutan kejadian cukup jelas",
        l4: "Ketiga elemen lengkap, urutan kejadian kronologis dan jelas",
      },
      grammar: {
        l1: "Banyak kesalahan grammar, mengganggu makna",
        l2: "Beberapa kesalahan grammar, makna masih tertangkap",
        l3: "Sedikit kesalahan grammar, tidak mengganggu makna",
        l4: "Grammar akurat, penggunaan simple past dan time connectives tepat",
      },
      vocabulary: {
        l1: "Kosakata sangat terbatas/berulang",
        l2: "Kosakata cukup, kurang variatif",
        l3: "Kosakata cukup variatif dan sesuai konteks",
        l4: "Kosakata kaya dan tepat konteks",
      },
      coherence: {
        l1: "Kalimat tidak nyambung satu sama lain",
        l2: "Ada connector tapi penggunaannya kurang tepat",
        l3: "Connector dipakai dengan cukup tepat",
        l4: "Alur ide runtut, connector waktu (then, after that, finally) dipakai efektif",
      },
    },
    weights: { structure: 0.4, grammar: 0.3, vocabulary: 0.15, coherence: 0.15 },
  },

  narrative: {
    name: "Narrative Text",
    structure_elements: "orientation → complication (masalah/konflik) → resolution (penyelesaian)",
    criteria: {
      structure: {
        l1: "Cerita tidak memiliki konflik yang jelas",
        l2: "Complication atau resolution lemah/terburu-buru",
        l3: "Ketiga elemen ada, konflik/resolusi kurang berkembang",
        l4: "Ketiga elemen lengkap, konflik dan resolusi jelas dan logis",
      },
      grammar: {
        l1: "Banyak kesalahan grammar, mengganggu makna",
        l2: "Beberapa kesalahan grammar, makna masih tertangkap",
        l3: "Sedikit kesalahan grammar, tidak mengganggu makna",
        l4: "Grammar akurat, penggunaan past tense dan direct/indirect speech tepat",
      },
      vocabulary: {
        l1: "Kosakata sangat terbatas/berulang",
        l2: "Kosakata cukup, kurang variatif",
        l3: "Kosakata cukup variatif dan sesuai konteks",
        l4: "Kosakata kaya, tepat konteks, mencerminkan genre narrative",
      },
      coherence: {
        l1: "Kalimat tidak nyambung satu sama lain",
        l2: "Ada connector tapi penggunaannya kurang tepat",
        l3: "Connector dipakai dengan cukup tepat",
        l4: "Alur cerita runtut dan engaging, connector dipakai efektif",
      },
    },
    weights: { structure: 0.4, grammar: 0.3, vocabulary: 0.15, coherence: 0.15 },
  },

  procedure: {
    name: "Procedure Text",
    structure_elements: "goal (tujuan) → materials (bahan/alat) → steps (langkah berurutan)",
    criteria: {
      structure: {
        l1: "Langkah-langkah acak, tujuan tidak jelas",
        l2: "Materials tidak lengkap, atau steps tidak berurutan",
        l3: "Ketiga elemen ada, urutan steps cukup jelas",
        l4: "Goal jelas, materials lengkap, steps berurutan dan mudah diikuti",
      },
      grammar: {
        l1: "Banyak kesalahan grammar, mengganggu makna",
        l2: "Beberapa kesalahan grammar, makna masih tertangkap",
        l3: "Sedikit kesalahan grammar, tidak mengganggu makna",
        l4: "Grammar akurat, imperative sentences dan sequence connectors dipakai tepat",
      },
      vocabulary: {
        l1: "Kosakata sangat terbatas/berulang",
        l2: "Kosakata cukup, kurang variatif",
        l3: "Kosakata cukup variatif dan sesuai konteks",
        l4: "Kosakata instruksi kaya dan tepat (cut, mix, add, dll)",
      },
      coherence: {
        l1: "Langkah-langkah tidak nyambung",
        l2: "Sequence connectors ada tapi kurang tepat",
        l3: "Sequence connectors dipakai cukup tepat",
        l4: "Urutan langkah sangat jelas, connector (first, next, then, finally) dipakai efektif",
      },
    },
    weights: { structure: 0.4, grammar: 0.3, vocabulary: 0.15, coherence: 0.15 },
  },

  report: {
    name: "Report Text",
    structure_elements: "general classification (klasifikasi umum) → description (ciri, perilaku, fungsi secara sistematis)",
    criteria: {
      structure: {
        l1: "Tidak dapat dibedakan dari descriptive text (terlalu spesifik)",
        l2: "Klasifikasi tidak jelas, deskripsi bersifat opini bukan fakta",
        l3: "Klasifikasi ada, deskripsi kurang sistematis",
        l4: "Klasifikasi jelas, deskripsi sistematis dan berdasarkan fakta",
      },
      grammar: {
        l1: "Banyak kesalahan grammar, mengganggu makna",
        l2: "Beberapa kesalahan grammar, makna masih tertangkap",
        l3: "Sedikit kesalahan grammar, tidak mengganggu makna",
        l4: "Grammar akurat, penggunaan passive voice tepat",
      },
      vocabulary: {
        l1: "Kosakata sangat terbatas/berulang",
        l2: "Kosakata cukup, kurang variatif",
        l3: "Kosakata cukup variatif dan sesuai konteks",
        l4: "Kosakata ilmiah/teknis tepat dan dipakai dengan benar",
      },
      coherence: {
        l1: "Paragraf tidak terorganisir",
        l2: "Ada struktur tapi transisi antar paragraf lemah",
        l3: "Transisi antar paragraf cukup baik",
        l4: "Informasi mengalir logis dari umum ke spesifik",
      },
    },
    weights: { structure: 0.4, grammar: 0.3, vocabulary: 0.15, coherence: 0.15 },
  },

  news_item: {
    name: "News Item Text",
    structure_elements: "newsworthy event (peristiwa utama) → background events (latar belakang) → source (sumber informasi)",
    criteria: {
      structure: {
        l1: "Hanya berupa pernyataan peristiwa tanpa konteks",
        l2: "Source tidak disebutkan, atau background terlalu minim",
        l3: "Ketiga elemen ada, urutan penyampaian cukup logis",
        l4: "Ketiga elemen lengkap, informasi disusun dari penting ke detail (piramida terbalik)",
      },
      grammar: {
        l1: "Banyak kesalahan grammar, mengganggu makna",
        l2: "Beberapa kesalahan grammar, makna masih tertangkap",
        l3: "Sedikit kesalahan grammar, tidak mengganggu makna",
        l4: "Grammar akurat, reported speech dipakai dengan tepat",
      },
      vocabulary: {
        l1: "Kosakata sangat terbatas/berulang",
        l2: "Kosakata cukup, kurang variatif",
        l3: "Kosakata berita cukup variatif",
        l4: "Kosakata berita kaya dan tepat (headline, source, event, dll)",
      },
      coherence: {
        l1: "Paragraf tidak terorganisir",
        l2: "Ada struktur tapi kurang logis",
        l3: "Urutan penyampaian cukup logis",
        l4: "Informasi mengalir dari yang paling penting ke detail pendukung",
      },
    },
    weights: { structure: 0.4, grammar: 0.3, vocabulary: 0.15, coherence: 0.15 },
  },

  explanation: {
    name: "Explanation Text",
    structure_elements: "general statement (pernyataan umum fenomena) → sequenced explanation (penjelasan proses berurutan)",
    criteria: {
      structure: {
        l1: "Tidak menjelaskan proses, hanya pernyataan fakta acak",
        l2: "Proses dijelaskan tapi tidak berurutan/tidak lengkap",
        l3: "Kedua elemen ada, urutan proses cukup jelas",
        l4: "Pernyataan umum jelas, proses dijelaskan berurutan dan sebab-akibatnya logis",
      },
      grammar: {
        l1: "Banyak kesalahan grammar, mengganggu makna",
        l2: "Beberapa kesalahan grammar, makna masih tertangkap",
        l3: "Sedikit kesalahan grammar, tidak mengganggu makna",
        l4: "Grammar akurat, cause-effect connectors (because, therefore, as a result) dipakai tepat",
      },
      vocabulary: {
        l1: "Kosakata sangat terbatas/berulang",
        l2: "Kosakata cukup, kurang variatif",
        l3: "Kosakata proses cukup variatif",
        l4: "Kosakata ilmiah/teknis untuk menjelaskan proses dipakai dengan tepat",
      },
      coherence: {
        l1: "Paragraf tidak terorganisir",
        l2: "Hubungan sebab-akibat tidak jelas",
        l3: "Hubungan sebab-akibat cukup jelas",
        l4: "Alur penjelasan sangat logis dan mudah diikuti",
      },
    },
    weights: { structure: 0.4, grammar: 0.3, vocabulary: 0.15, coherence: 0.15 },
  },

  analytical_exposition: {
    name: "Analytical Exposition",
    structure_elements: "thesis (pernyataan posisi) → arguments (argumen pendukung) → reiteration (penegasan ulang)",
    criteria: {
      structure: {
        l1: "Tidak ada posisi/pendapat yang jelas disampaikan",
        l2: "Thesis tidak jelas, argumen tidak konsisten dengan posisi awal",
        l3: "Ketiga elemen ada, argumen kurang didukung bukti kuat",
        l4: "Thesis jelas, argumen didukung alasan/bukti logis, reiteration menegaskan kembali",
      },
      grammar: {
        l1: "Banyak kesalahan grammar, mengganggu makna",
        l2: "Beberapa kesalahan grammar, makna masih tertangkap",
        l3: "Sedikit kesalahan grammar, tidak mengganggu makna",
        l4: "Grammar akurat, conjunctions (however, therefore, in addition) dipakai tepat",
      },
      vocabulary: {
        l1: "Kosakata sangat terbatas/berulang",
        l2: "Kosakata cukup, kurang variatif",
        l3: "Kosakata argumentasi cukup variatif",
        l4: "Kosakata argumentasi kaya dan dipakai dengan tepat",
      },
      coherence: {
        l1: "Argumen tidak terorganisir",
        l2: "Ada argumen tapi tidak mendukung thesis dengan baik",
        l3: "Argumen cukup mendukung thesis",
        l4: "Argumen mengalir logis dan meyakinkan, reiteration memperkuat posisi",
      },
    },
    weights: { structure: 0.4, grammar: 0.3, vocabulary: 0.15, coherence: 0.15 },
  },

  hortatory_exposition: {
    name: "Hortatory Exposition",
    structure_elements: "thesis → arguments → recommendation (rekomendasi tindakan konkret)",
    criteria: {
      structure: {
        l1: "Tidak ada ajakan/rekomendasi tindakan sama sekali",
        l2: "Argumen ada tapi rekomendasi tidak jelas/tidak muncul",
        l3: "Ketiga elemen ada, rekomendasi kurang spesifik",
        l4: "Thesis jelas, argumen kuat, rekomendasi konkret dan actionable",
      },
      grammar: {
        l1: "Banyak kesalahan grammar, mengganggu makna",
        l2: "Beberapa kesalahan grammar, makna masih tertangkap",
        l3: "Sedikit kesalahan grammar, tidak mengganggu makna",
        l4: "Grammar akurat, modal verbs untuk rekomendasi (should, must, need to) dipakai tepat",
      },
      vocabulary: {
        l1: "Kosakata sangat terbatas/berulang",
        l2: "Kosakata cukup, kurang variatif",
        l3: "Kosakata persuasi cukup variatif",
        l4: "Kosakata persuasi dan rekomendasi kaya dan tepat",
      },
      coherence: {
        l1: "Tidak ada alur argumen yang jelas",
        l2: "Argumen ada tapi tidak mengarah ke rekomendasi",
        l3: "Argumen cukup mengarah ke rekomendasi",
        l4: "Argumen mengalir logis dan menguatkan rekomendasi di akhir",
      },
    },
    weights: { structure: 0.4, grammar: 0.3, vocabulary: 0.15, coherence: 0.15 },
  },

  discussion: {
    name: "Discussion Text",
    structure_elements: "issue (isu) → arguments for → arguments against → conclusion/recommendation",
    criteria: {
      structure: {
        l1: "Tidak ada perbandingan dua sisi argumen sama sekali",
        l2: "Hanya salah satu sisi (pro atau kontra) yang dibahas",
        l3: "Keempat elemen ada, argumen pro-kontra kurang seimbang",
        l4: "Keempat elemen lengkap dan seimbang, kesimpulan berdasar argumen yang disampaikan",
      },
      grammar: {
        l1: "Banyak kesalahan grammar, mengganggu makna",
        l2: "Beberapa kesalahan grammar, makna masih tertangkap",
        l3: "Sedikit kesalahan grammar, tidak mengganggu makna",
        l4: "Grammar akurat, connector kontras (although, whereas, while) dipakai tepat",
      },
      vocabulary: {
        l1: "Kosakata sangat terbatas/berulang",
        l2: "Kosakata cukup, kurang variatif",
        l3: "Kosakata pro-kontra cukup variatif",
        l4: "Kosakata pro-kontra kaya (on one hand, on the other hand, dll) dan tepat",
      },
      coherence: {
        l1: "Tidak ada struktur diskusi yang jelas",
        l2: "Ada dua sisi tapi transisi kurang jelas",
        l3: "Transisi antara dua sisi cukup jelas",
        l4: "Dua sisi argumen mengalir seimbang, kesimpulan merangkum dengan baik",
      },
    },
    weights: { structure: 0.4, grammar: 0.3, vocabulary: 0.15, coherence: 0.15 },
  },
};

/**
 * Buat prompt string rubrik untuk dikirim ke AI saat menilai tulisan.
 */
export function buildRubricPrompt(textType: TextType): string {
  const rubric = RUBRICS[textType];
  return `
Kamu adalah penilai tulisan Bahasa Inggris siswa SMA yang objektif dan konstruktif.
Nilai tulisan siswa berdasarkan rubrik berikut untuk jenis teks: **${rubric.name}**

Struktur teks yang dinilai: ${rubric.structure_elements}

**KRITERIA PENILAIAN:**

1. **Struktur Teks** (Bobot 40%)
   - Level 1 (skor 25): ${rubric.criteria.structure.l1}
   - Level 2 (skor 50): ${rubric.criteria.structure.l2}
   - Level 3 (skor 75): ${rubric.criteria.structure.l3}
   - Level 4 (skor 100): ${rubric.criteria.structure.l4}

2. **Grammar** (Bobot 30%)
   - Level 1 (skor 25): ${rubric.criteria.grammar.l1}
   - Level 2 (skor 50): ${rubric.criteria.grammar.l2}
   - Level 3 (skor 75): ${rubric.criteria.grammar.l3}
   - Level 4 (skor 100): ${rubric.criteria.grammar.l4}

3. **Vocabulary** (Bobot 15%)
   - Level 1 (skor 25): ${rubric.criteria.vocabulary.l1}
   - Level 2 (skor 50): ${rubric.criteria.vocabulary.l2}
   - Level 3 (skor 75): ${rubric.criteria.vocabulary.l3}
   - Level 4 (skor 100): ${rubric.criteria.vocabulary.l4}

4. **Koherensi** (Bobot 15%)
   - Level 1 (skor 25): ${rubric.criteria.coherence.l1}
   - Level 2 (skor 50): ${rubric.criteria.coherence.l2}
   - Level 3 (skor 75): ${rubric.criteria.coherence.l3}
   - Level 4 (skor 100): ${rubric.criteria.coherence.l4}

**FORMAT RESPONS (JSON):**
Balas HANYA dengan JSON berikut, tanpa teks tambahan:
{
  "scores": {
    "structure": <25|50|75|100>,
    "grammar": <25|50|75|100>,
    "vocabulary": <25|50|75|100>,
    "coherence": <25|50|75|100>
  },
  "final_score": <angka desimal hasil perhitungan berbobot>,
  "feedback": "<paragraf feedback konstruktif dalam Bahasa Indonesia, 3-5 kalimat, sebutkan hal yang sudah baik dan yang perlu diperbaiki>"
}
`.trim();
}
