/**
 * run-migration.ts — Jalankan migration SQL via Supabase REST API
 * Menggunakan pg-based approach via Supabase direct connection
 *
 * Jalankan: npx tsx scripts/run-migration.ts
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Pastikan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY sudah diisi di .env");
  process.exit(1);
}

/**
 * Jalankan query SQL via Supabase REST API (pg endpoint)
 * Supabase menyediakan endpoint /rest/v1/rpc atau langsung via postgres connection
 */
async function runSQL(sql: string): Promise<{ success: boolean; error?: string }> {
  // Gunakan Supabase's built-in query endpoint (service role bypass)
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    // Fallback: coba endpoint lain
    return { success: false, error: `HTTP ${response.status}: ${await response.text()}` };
  }

  return { success: true };
}

async function main() {
  console.log("🚀 Menjalankan migration database...\n");

  // Baca file migration
  const migration1Path = join(__dirname, "../migrations/001_create_tables.sql");
  const migration2Path = join(__dirname, "../migrations/002_seed_data.sql");

  const sql1 = readFileSync(migration1Path, "utf-8");

  console.log("▶ Migration 001: Create Tables + RLS...");
  const result1 = await runSQL(sql1);

  if (!result1.success) {
    console.error(`❌ Migration gagal: ${result1.error}`);
    console.log("\n⚠️  Supabase tidak mengizinkan DDL via REST API.");
    console.log("Gunakan salah satu cara berikut:\n");
    console.log("CARA 1 — Supabase SQL Editor (Recommended):");
    console.log(`  1. Buka: ${SUPABASE_URL.replace(".supabase.co", "").replace("https://", "https://supabase.com/dashboard/project/")}/sql/new`);
    console.log("  2. Copy-paste isi file: mcp-server/migrations/001_create_tables.sql");
    console.log("  3. Klik Run");
    console.log("  4. Ulangi untuk: mcp-server/migrations/002_seed_data.sql\n");
    console.log("CARA 2 — Supabase CLI:");
    console.log("  brew install supabase/tap/supabase");
    console.log(`  supabase db push --db-url "${SUPABASE_URL.replace("https://", "postgresql://postgres:")}"`)
  } else {
    console.log("✅ Migration 001 berhasil!\n");
  }
}

main().catch(console.error);
