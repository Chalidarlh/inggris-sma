import { z } from "zod";
import { supabase } from "../lib/supabase.js";
import { buildRubricPrompt, type TextType } from "../lib/rubrics.js";

/**
 * Tool: grade_writing_submission
 *
 * Tool paling kompleks — ambil jawaban siswa, ambil rubrik yang sesuai
 * dengan text_type materi, lalu instruksikan Claude untuk menilai
 * berdasarkan rubrik tersebut dan menyimpan hasilnya ke tabel grades.
 */

export const gradeWritingSchema = z.object({
  submission_id: z
    .string()
    .uuid()
    .describe("ID submission dari tabel submissions (UUID)"),
  ai_scores: z
    .object({
      structure: z.union([z.literal(25), z.literal(50), z.literal(75), z.literal(100)]),
      grammar: z.union([z.literal(25), z.literal(50), z.literal(75), z.literal(100)]),
      vocabulary: z.union([z.literal(25), z.literal(50), z.literal(75), z.literal(100)]),
      coherence: z.union([z.literal(25), z.literal(50), z.literal(75), z.literal(100)]),
    })
    .optional()
    .describe(
      "Skor per kriteria dari AI (25/50/75/100). Jika tidak diisi, tool akan mengembalikan rubrik dan teks siswa agar AI dapat menilai terlebih dahulu."
    ),
  ai_feedback: z
    .string()
    .optional()
    .describe("Feedback teks dari AI dalam Bahasa Indonesia (3-5 kalimat)."),
});

export type GradeWritingInput = z.infer<typeof gradeWritingSchema>;

export async function gradeWritingSubmission(input: GradeWritingInput) {
  // 1. Ambil submission beserta materi dan minggu terkait
  const { data: submission, error: subError } = await supabase
    .from("submissions")
    .select(
      "*, material:materials(*, week:weeks(text_type, grammar_point, week_number, title)), student:students(full_name)"
    )
    .eq("id", input.submission_id)
    .single();

  if (subError || !submission) {
    throw new Error(`Submission dengan ID ${input.submission_id} tidak ditemukan.`);
  }

  const material = submission.material as {
    skill_type: string;
    title: string;
    week: { text_type: string | null; grammar_point: string; week_number: number; title: string } | null;
  } | null;

  const textType = material?.week?.text_type as TextType | null;

  if (!textType) {
    throw new Error(
      "Minggu ini tidak memiliki text_type — tidak bisa menilai dengan rubrik writing. Periksa data tabel weeks."
    );
  }

  // 2. Jika skor belum diberikan, kembalikan rubrik + teks siswa untuk dinilai
  if (!input.ai_scores || !input.ai_feedback) {
    const rubricPrompt = buildRubricPrompt(textType);
    const student = submission.student as { full_name: string } | null;

    return {
      action: "PERLU_PENILAIAN",
      message: `Berikut adalah jawaban siswa dan rubrik penilaian. Nilai tulisan ini, lalu panggil tool grade_writing_submission lagi dengan skor dan feedback yang sudah kamu tentukan.`,
      student_name: student?.full_name ?? "Tidak diketahui",
      material_title: material?.title ?? "-",
      week_info: `Minggu ${material?.week?.week_number} — ${material?.week?.title}`,
      text_type: textType,
      student_answer: submission.answer,
      rubric: rubricPrompt,
    };
  }

  // 3. Hitung skor akhir berbobot
  const finalScore =
    input.ai_scores.structure * 0.4 +
    input.ai_scores.grammar * 0.3 +
    input.ai_scores.vocabulary * 0.15 +
    input.ai_scores.coherence * 0.15;

  // 4. Simpan grade ke database dengan status "draft" (menunggu approve guru)
  const { data: grade, error: gradeError } = await supabase
    .from("grades")
    .insert({
      submission_id: input.submission_id,
      status: "draft",
      score: Math.round(finalScore),
      feedback: input.ai_feedback,
      score_breakdown: input.ai_scores,
    })
    .select()
    .single();

  if (gradeError || !grade) {
    throw new Error(`Gagal menyimpan nilai: ${gradeError?.message}`);
  }

  return {
    success: true,
    action: "NILAI_TERSIMPAN",
    message: `Nilai berhasil disimpan dengan status DRAFT (menunggu persetujuan guru).`,
    grade_id: grade.id,
    score: Math.round(finalScore),
    breakdown: input.ai_scores,
    feedback: input.ai_feedback,
    next_step: "Guru dapat mereview nilai ini di dashboard dan klik Approve untuk mengesahkan.",
  };
}
