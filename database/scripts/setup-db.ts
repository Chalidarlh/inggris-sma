/**
 * setup-db.ts — Script setup database Phase 2
 *
 * Menjalankan migration SQL via Supabase service role key.
 * Jalankan dengan: npx tsx scripts/setup-db.ts
 *
 * Pastikan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY sudah diisi di .env
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("❌ Set SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env terlebih dahulu");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runSQL(filePath: string, label: string) {
  console.log(`\n▶ Menjalankan: ${label}...`);
  const sql = readFileSync(filePath, "utf-8");

  const { error } = await supabase.rpc("exec_sql", { sql_query: sql }).single();

  // Supabase tidak expose raw SQL exec via JS client langsung —
  // kita split per statement dan jalankan via REST API
  if (error && error.message.includes("exec_sql")) {
    // Fallback: print instruksi manual
    console.warn(`⚠️  Jalankan file ini manual di Supabase SQL Editor:`);
    console.warn(`   ${filePath}`);
    return;
  }

  if (error) {
    console.error(`❌ Error: ${error.message}`);
    return;
  }

  console.log(`✅ ${label} berhasil`);
}

async function verifyTables() {
  console.log("\n▶ Verifikasi tabel yang ada...");
  const tables = ["weeks", "classes", "students", "materials", "submissions", "grades", "rubrics"];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    if (error) {
      console.log(`  ❌ ${table}: ${error.message}`);
    } else {
      console.log(`  ✅ ${table}: ${count ?? 0} rows`);
    }
  }
}

async function main() {
  console.log("🚀 Setup Database Phase 2 — MCP Inggris");
  console.log(`📡 Supabase URL: ${url}`);

  // Verifikasi koneksi
  const { data, error: connError } = await supabase
    .from("weeks")
    .select("count", { count: "exact", head: true });

  if (connError && !connError.message.includes("does not exist")) {
    console.error("❌ Koneksi ke Supabase gagal:", connError.message);
    process.exit(1);
  }

  if (connError?.message.includes("does not exist")) {
    console.log("\n⚠️  Tabel belum ada. Silakan jalankan SQL berikut di Supabase SQL Editor:");
    console.log("   1. mcp-server/migrations/001_create_tables.sql");
    console.log("   2. mcp-server/migrations/002_seed_data.sql");
    console.log("\n   URL: https://supabase.com/dashboard/project/_/sql/new");
  } else {
    // Tabel sudah ada — verifikasi isi
    await verifyTables();
  }
}

main().catch(console.error);
