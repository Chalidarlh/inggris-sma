/**
 * seed.ts — Isi tabel weeks dan rubrics dengan data awal
 * Jalankan: npx tsx scripts/seed.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ============================================================
// Seed: 24 Minggu Kurikulum
// ============================================================
const WEEKS = [
  // FASE 1
  { week_number: 1,  phase: 1, title: "Perkenalan & Simple Present Tense",        grammar_point: "To be, simple present tense, personal pronouns",         text_type: null,                    skill_focus: ["speaking","writing"] },
  { week_number: 2,  phase: 1, title: "Simple Past Tense & Descriptive Text",     grammar_point: "Simple past tense (reguler & irregular verbs)",           text_type: "descriptive",           skill_focus: ["reading","writing"] },
  { week_number: 3,  phase: 1, title: "Descriptive Text & Comparative/Superlative",grammar_point:"Comparative & superlative adjectives",                    text_type: "descriptive",           skill_focus: ["writing"] },
  { week_number: 4,  phase: 1, title: "Recount Text & Past Continuous",            grammar_point: "Past continuous, time connectives (then, after that)",   text_type: "recount",               skill_focus: ["speaking","writing"] },
  { week_number: 5,  phase: 1, title: "Recount Text Lanjutan & Question Tags",     grammar_point: "Question tags, WH-questions review",                     text_type: "recount",               skill_focus: ["writing","listening"] },
  { week_number: 6,  phase: 1, title: "Review Fase 1 + Mini Ulangan",              grammar_point: "Review semua grammar Fase 1",                            text_type: null,                    skill_focus: ["reading","writing"] },
  // FASE 2
  { week_number: 7,  phase: 2, title: "Narrative Text & Simple Past Review",       grammar_point: "Simple past + adverb of time",                           text_type: "narrative",             skill_focus: ["reading","writing"] },
  { week_number: 8,  phase: 2, title: "Narrative Text & Direct-Indirect Speech",   grammar_point: "Direct & reported speech dasar",                         text_type: "narrative",             skill_focus: ["writing"] },
  { week_number: 9,  phase: 2, title: "Procedure Text & Imperative Sentences",     grammar_point: "Imperative sentences, sequence connectors",              text_type: "procedure",             skill_focus: ["speaking","writing"] },
  { week_number: 10, phase: 2, title: "Procedure Text & Modal Verbs",              grammar_point: "Modal verbs (must, should, have to)",                    text_type: "procedure",             skill_focus: ["writing","listening"] },
  { week_number: 11, phase: 2, title: "Future Tense & Conditional Type 1",         grammar_point: "Will/going to, first conditional",                       text_type: null,                    skill_focus: ["writing"] },
  { week_number: 12, phase: 2, title: "Review Fase 2 + Mini Ulangan",              grammar_point: "Review grammar & 2 jenis teks (narrative, procedure)",   text_type: null,                    skill_focus: ["reading","writing","speaking"] },
  // FASE 3
  { week_number: 13, phase: 3, title: "Report Text & Passive Voice",               grammar_point: "Passive voice simple present/past",                      text_type: "report",                skill_focus: ["reading","writing"] },
  { week_number: 14, phase: 3, title: "Report Text & Passive Voice Lanjutan",      grammar_point: "Passive voice modal (can be, should be)",                text_type: "report",                skill_focus: ["writing"] },
  { week_number: 15, phase: 3, title: "News Item Text & Reported Speech",          grammar_point: "Reported speech untuk statement & question",             text_type: "news_item",             skill_focus: ["reading","writing"] },
  { week_number: 16, phase: 3, title: "Explanation Text & Cause-Effect Connectors",grammar_point: "Because, since, due to, as a result, so that",           text_type: "explanation",           skill_focus: ["speaking","writing"] },
  { week_number: 17, phase: 3, title: "Explanation Text & Relative Clauses",       grammar_point: "Relative pronouns (who, which, that, where)",            text_type: "explanation",           skill_focus: ["writing","listening"] },
  { week_number: 18, phase: 3, title: "Review Fase 3 + Mini Ulangan",              grammar_point: "Review grammar & 3 jenis teks (report, news, explanation)",text_type:null,                  skill_focus: ["reading","writing"] },
  // FASE 4
  { week_number: 19, phase: 4, title: "Analytical Exposition & Conjunctions",      grammar_point: "Conjunctions (however, therefore, in addition)",          text_type: "analytical_exposition", skill_focus: ["reading","writing"] },
  { week_number: 20, phase: 4, title: "Analytical Exposition & Expressing Opinion",grammar_point: "Expressions of opinion (I believe, in my opinion)",       text_type: "analytical_exposition", skill_focus: ["writing"] },
  { week_number: 21, phase: 4, title: "Hortatory Exposition & Modal untuk Saran",  grammar_point: "Should/must/need to untuk rekomendasi",                  text_type: "hortatory_exposition",  skill_focus: ["speaking","writing"] },
  { week_number: 22, phase: 4, title: "Discussion Text & Perbandingan Argumen",    grammar_point: "Comparative + connector kontras (although, whereas)",     text_type: "discussion",            skill_focus: ["writing"] },
  { week_number: 23, phase: 4, title: "Latihan Terintegrasi & Simulasi Ujian",     grammar_point: "Review semua grammar point",                             text_type: null,                    skill_focus: ["reading","writing","listening"] },
  { week_number: 24, phase: 4, title: "Review Total + Ujian Akhir Simulasi",       grammar_point: "Semua grammar point komprehensif",                       text_type: null,                    skill_focus: ["reading","writing","listening","speaking"] },
];

// ============================================================
// Seed: Rubrik 3 Genre MVP (Recount, Narrative, Report)
// ============================================================
const RUBRICS = [
  {
    text_type: "recount",
    criteria: {
      structure: { l1: "Hanya daftar kejadian tanpa struktur", l2: "Orientation atau reorientation lemah/hilang", l3: "Ketiga elemen ada, urutan cukup jelas", l4: "Ketiga elemen lengkap, urutan kronologis dan jelas" },
      grammar:   { l1: "Banyak kesalahan, mengganggu makna", l2: "Beberapa kesalahan, makna tertangkap", l3: "Sedikit kesalahan, tidak mengganggu makna", l4: "Grammar akurat, simple past dan time connectives tepat" },
      vocabulary:{ l1: "Kosakata sangat terbatas", l2: "Kosakata cukup, kurang variatif", l3: "Kosakata variatif dan sesuai konteks", l4: "Kosakata kaya dan tepat konteks" },
      coherence: { l1: "Kalimat tidak nyambung", l2: "Ada connector tapi kurang tepat", l3: "Connector cukup tepat", l4: "Alur runtut, connector waktu efektif" },
    },
    weights: { structure: 0.4, grammar: 0.3, vocabulary: 0.15, coherence: 0.15 },
  },
  {
    text_type: "narrative",
    criteria: {
      structure: { l1: "Tidak ada konflik yang jelas", l2: "Complication atau resolution lemah", l3: "Ketiga elemen ada, konflik kurang berkembang", l4: "Ketiga elemen lengkap, konflik dan resolusi jelas" },
      grammar:   { l1: "Banyak kesalahan, mengganggu makna", l2: "Beberapa kesalahan, makna tertangkap", l3: "Sedikit kesalahan, tidak mengganggu makna", l4: "Grammar akurat, past tense dan reported speech tepat" },
      vocabulary:{ l1: "Kosakata sangat terbatas", l2: "Kosakata cukup, kurang variatif", l3: "Kosakata variatif dan sesuai konteks", l4: "Kosakata kaya, mencerminkan genre narrative" },
      coherence: { l1: "Kalimat tidak nyambung", l2: "Ada connector tapi kurang tepat", l3: "Connector cukup tepat", l4: "Alur cerita runtut dan engaging" },
    },
    weights: { structure: 0.4, grammar: 0.3, vocabulary: 0.15, coherence: 0.15 },
  },
  {
    text_type: "report",
    criteria: {
      structure: { l1: "Tidak bisa dibedakan dari descriptive text", l2: "Klasifikasi tidak jelas, bersifat opini", l3: "Classification ada, description kurang sistematis", l4: "Classification jelas, description sistematis berdasar fakta" },
      grammar:   { l1: "Banyak kesalahan, mengganggu makna", l2: "Beberapa kesalahan, makna tertangkap", l3: "Sedikit kesalahan, tidak mengganggu makna", l4: "Grammar akurat, passive voice tepat" },
      vocabulary:{ l1: "Kosakata sangat terbatas", l2: "Kosakata cukup, kurang variatif", l3: "Kosakata ilmiah variatif", l4: "Kosakata ilmiah kaya dan dipakai benar" },
      coherence: { l1: "Paragraf tidak terorganisir", l2: "Ada struktur tapi transisi lemah", l3: "Transisi antar paragraf cukup baik", l4: "Informasi mengalir logis dari general ke specific" },
    },
    weights: { structure: 0.4, grammar: 0.3, vocabulary: 0.15, coherence: 0.15 },
  },
];

async function main() {
  console.log("🌱 Seeding database MCP Inggris...\n");

  // Seed weeks
  console.log("▶ Insert 24 minggu kurikulum...");
  const { data: weeksData, error: weeksError } = await supabase
    .from("weeks")
    .upsert(WEEKS, { onConflict: "week_number" })
    .select("week_number");

  if (weeksError) {
    console.error("❌ Weeks error:", weeksError.message);
  } else {
    console.log(`✅ ${weeksData?.length ?? 0} minggu berhasil diisi`);
  }

  // Seed rubrics
  console.log("▶ Insert 3 rubrik genre (recount, narrative, report)...");
  const { data: rubricsData, error: rubricsError } = await supabase
    .from("rubrics")
    .upsert(RUBRICS, { onConflict: "text_type" })
    .select("text_type");

  if (rubricsError) {
    console.error("❌ Rubrics error:", rubricsError.message);
  } else {
    console.log(`✅ ${rubricsData?.length ?? 0} rubrik berhasil diisi`);
  }

  // Verifikasi akhir
  console.log("\n📊 Verifikasi:");
  const { count: wCount } = await supabase.from("weeks").select("*", { count: "exact", head: true });
  const { count: rCount } = await supabase.from("rubrics").select("*", { count: "exact", head: true });
  console.log(`  weeks:   ${wCount} rows`);
  console.log(`  rubrics: ${rCount} rows`);
  console.log("\n✅ Seeding selesai!");
}

main().catch(console.error);
