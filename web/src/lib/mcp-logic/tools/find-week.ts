import { z } from "zod";
import { supabase } from "../supabase";

export const findWeekSchema = z.object({
  week_number: z.number().int().min(1).max(24)
    .describe("Nomor urut minggu, contoh: 1 untuk minggu pertama, 22 untuk minggu ke-22"),
});

export type FindWeekInput = z.infer<typeof findWeekSchema>;

export async function findWeek(input: FindWeekInput) {
  const { data, error } = await supabase
    .from("weeks")
    .select("id, week_number, phase, title, grammar_point, text_type, skill_focus")
    .eq("week_number", input.week_number)
    .single();

  if (error || !data) {
    throw new Error(`Minggu ke-${input.week_number} tidak ditemukan di sistem.`);
  }

  return {
    week_id: data.id,
    week_number: data.week_number,
    phase: data.phase,
    title: data.title,
    grammar_point: data.grammar_point,
    text_type: data.text_type,
    skill_focus: data.skill_focus,
  };
}