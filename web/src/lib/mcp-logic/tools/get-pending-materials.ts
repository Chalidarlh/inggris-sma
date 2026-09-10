import { z } from "zod";
import { supabase } from "../supabase";

/**
 * Tool: get_pending_materials
 * Ambil daftar materi dengan status "draft" yang menunggu review guru.
 */

export const getPendingMaterialsSchema = z.object({
  class_id: z
    .string()
    .uuid()
    .optional()
    .describe("Filter berdasarkan kelas (opsional). Kalau tidak diisi, ambil semua kelas."),
});

export type GetPendingMaterialsInput = z.infer<typeof getPendingMaterialsSchema>;

export async function getPendingMaterials(input: GetPendingMaterialsInput) {
  let query = supabase
    .from("materials")
    .select("*, week:weeks(week_number, title, text_type, grammar_point), class:classes(name)")
    .eq("status", "draft")
    .order("created_at", { ascending: false });

  if (input.class_id) {
    query = query.eq("class_id", input.class_id);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Gagal mengambil data materi: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return {
      count: 0,
      message: "Tidak ada materi yang menunggu review.",
      materials: [],
    };
  }

  return {
    count: data.length,
    message: `Terdapat ${data.length} materi menunggu review.`,
    materials: data.map((m) => ({
      id: m.id,
      title: m.title,
      skill_type: m.skill_type,
      class_name: (m.class as { name: string } | null)?.name ?? "-",
      week_number: (m.week as { week_number: number } | null)?.week_number ?? "-",
      text_type: (m.week as { text_type: string | null } | null)?.text_type ?? "-",
      created_at: m.created_at,
    })),
  };
}
