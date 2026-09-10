import { z } from "zod";
import { supabase } from "../supabase";

/**
 * Tool: publish_material
 * Ubah status materi dari "draft" ke "published" agar muncul di portal siswa.
 */

export const publishMaterialSchema = z.object({
  material_id: z
    .string()
    .uuid()
    .describe("ID materi yang akan dipublikasikan (UUID)"),
});

export type PublishMaterialInput = z.infer<typeof publishMaterialSchema>;

export async function publishMaterial(input: PublishMaterialInput) {
  // Cek materi ada dan masih draft
  const { data: existing, error: fetchError } = await supabase
    .from("materials")
    .select("id, title, status, class_id")
    .eq("id", input.material_id)
    .single();

  if (fetchError || !existing) {
    throw new Error(`Materi dengan ID ${input.material_id} tidak ditemukan.`);
  }

  if (existing.status === "published") {
    return {
      success: false,
      message: `Materi "${existing.title}" sudah dipublikasikan sebelumnya.`,
    };
  }

  // Update status ke published
  const { error: updateError } = await supabase
    .from("materials")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", input.material_id);

  if (updateError) {
    throw new Error(`Gagal mempublikasikan materi: ${updateError.message}`);
  }

  return {
    success: true,
    message: `Materi "${existing.title}" berhasil dipublikasikan. Siswa di kelas terkait kini dapat mengaksesnya.`,
    material_id: input.material_id,
  };
}
