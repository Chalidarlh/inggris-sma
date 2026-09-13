import { z } from "zod";
import { supabase } from "../supabase";

export const findClassSchema = z.object({
  class_name: z.string()
    .describe("Nama kelas, contoh: 'XI IPA 1', boleh tidak persis sama asal mendekati"),
});

export type FindClassInput = z.infer<typeof findClassSchema>;

export async function findClass(input: FindClassInput) {
  const { data, error } = await supabase
    .from("classes")
    .select("id, name, academic_year")
    .ilike("name", `%${input.class_name}%`);

  if (error || !data || data.length === 0) {
    throw new Error(`Kelas "${input.class_name}" tidak ditemukan di sistem.`);
  }

  if (data.length > 1) {
    // Kalau ketemu lebih dari satu, kembalikan daftar biar Claude bisa nanya klarifikasi ke guru
    return {
      multiple_matches: true,
      options: data.map(c => ({ class_id: c.id, name: c.name, academic_year: c.academic_year })),
    };
  }

  return {
    class_id: data[0].id,
    name: data[0].name,
    academic_year: data[0].academic_year,
  };
}