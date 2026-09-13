import fs from "fs";
import path from "path";
import { z } from "zod";
import { supabase } from "../supabase";

/**
 * Tool: create_material
 *
 * Ambil data minggu dari tabel `weeks`, generate konten materi/soal
 * berdasarkan text_type dan grammar_point minggu tersebut, simpan ke
 * tabel `materials` dengan status "draft".
 *
 * Ini adalah tool pertama di Vertical Slice (Phase 3) — yang paling
 * sederhana tapi membuktikan alur penuh: Claude → MCP → Supabase bekerja.
 */

export const createMaterialSchema = z.object({
  week_id: z.string().uuid().describe(
    "ID minggu (UUID). Jika user menyebutkan nomor minggu biasa (misalnya 'minggu pertama' atau 'minggu 5'), " +
    "panggil tool find_week terlebih dahulu untuk mendapatkan UUID yang sesuai."
  ),
  class_id: z.string().uuid().describe(
    "ID kelas (UUID). Jika user menyebutkan nama kelas biasa (misalnya 'XI IPA 1'), " +
    "panggil tool find_class terlebih dahulu untuk mendapatkan UUID yang sesuai."
  ),
  skill_type: z.enum(["reading", "writing", "listening"])
    .describe("Jenis skill: reading, writing, atau listening"),
});

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;

export async function createMaterial(input: CreateMaterialInput) {
  // 1. Ambil data minggu dari Supabase
  const { data: week, error: weekError } = await supabase
    .from("weeks")
    .select("*")
    .eq("id", input.week_id)
    .single();

  if (weekError || !week) {
    throw new Error(`Minggu dengan ID ${input.week_id} tidak ditemukan: ${weekError?.message}`);
  }

  // 2. Generate konten materi berdasarkan data minggu
  // Di Phase 3, konten di-generate oleh Claude sendiri (LLM call implisit
  // karena Claude adalah yang memanggil tool ini) — kita cukup sediakan
  // konteks yang cukup dalam respons tool, lalu Claude akan generate
  // konten tersebut dan memanggil tool ini lagi dengan konten yang sudah jadi.
  //
  // Untuk sekarang, title dan content dikirim langsung sebagai parameter
  // opsional agar bisa juga dipakai untuk menyimpan konten yang sudah dibuat.

  const title = `Materi ${week.skill_type || input.skill_type} — Minggu ${week.week_number}: ${week.title}`;
  // 2b. Baca kurikulum resmi dari file markdown sebagai referensi AI
  let curriculumReference: string | null = null;
  try {
    const curriculumPath = path.join(process.cwd(), "docs", "curriculum", "kurikulum-inggris.md");
    curriculumReference = fs.readFileSync(curriculumPath, "utf-8");
  } catch {
    // File tidak wajib ada — jika tidak ditemukan, lanjut tanpa referensi
    curriculumReference = null;
  }

  const contextInfo = {
    week_number: week.week_number,
    phase: week.phase,
    title: week.title,
    grammar_point: week.grammar_point,
    text_type: week.text_type,
    requested_skill: input.skill_type,
    curriculum_reference: curriculumReference,
  };

  // 3. Simpan ke tabel materials dengan status draft
  const { data: material, error: insertError } = await supabase
    .from("materials")
    .insert({
      week_id: input.week_id,
      class_id: input.class_id,
      skill_type: input.skill_type,
      status: "draft",
      title,
      content: `[Konten akan di-generate AI berdasarkan konteks minggu ini]`,
    })
    .select()
    .single();

  if (insertError || !material) {
    throw new Error(`Gagal menyimpan materi: ${insertError?.message}`);
  }

  return {
    success: true,
    message: `Materi berhasil dibuat dengan status DRAFT. ID: ${material.id}`,
    material_id: material.id,
    context: contextInfo,
    next_step: "Guru dapat mereview dan mengedit materi ini di dashboard, lalu publish ke kelas.",
  };
}
