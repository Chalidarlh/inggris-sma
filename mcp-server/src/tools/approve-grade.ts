import { z } from "zod";
import { supabase } from "../lib/supabase.js";

/**
 * Tool: approve_grade
 * Guru menyetujui nilai AI — ubah status dari "draft" ke "approved".
 * Setelah approved, nilai baru resmi dan bisa dilihat siswa.
 */

export const approveGradeSchema = z.object({
  grade_id: z
    .string()
    .uuid()
    .describe("ID grade dari tabel grades yang akan di-approve (UUID)"),
});

export type ApproveGradeInput = z.infer<typeof approveGradeSchema>;

export async function approveGrade(input: ApproveGradeInput) {
  // Cek grade ada dan masih draft
  const { data: existing, error: fetchError } = await supabase
    .from("grades")
    .select("id, score, status, submission:submissions(student:students(full_name))")
    .eq("id", input.grade_id)
    .single();

  if (fetchError || !existing) {
    throw new Error(`Grade dengan ID ${input.grade_id} tidak ditemukan.`);
  }

  if (existing.status === "approved") {
    return {
      success: false,
      message: `Nilai ini sudah disetujui sebelumnya.`,
    };
  }

  // Update status ke approved
  const { error: updateError } = await supabase
    .from("grades")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
    })
    .eq("id", input.grade_id);

  if (updateError) {
    throw new Error(`Gagal menyetujui nilai: ${updateError.message}`);
  }

  const submission = (existing.submission as unknown) as {
    student: { full_name: string } | null;
  } | null;

  return {
    success: true,
    message: `Nilai untuk ${submission?.student?.full_name ?? "siswa"} (skor: ${existing.score}) berhasil disetujui. Siswa kini dapat melihat nilai dan feedback-nya.`,
    grade_id: input.grade_id,
    score: existing.score,
  };
}
