import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import "dotenv/config";

import {
  createMaterial,
  createMaterialSchema,
  getPendingMaterials,
  getPendingMaterialsSchema,
  publishMaterial,
  publishMaterialSchema,
  gradeWritingSubmission,
  gradeWritingSchema,
  approveGrade,
  approveGradeSchema,
} from "./tools/index.js";

/**
 * MCP Server — Sistem Pembelajaran Bahasa Inggris SMA
 *
 * Server ini berjalan via stdio dan dipanggil oleh Claude Desktop.
 * Berisi tools untuk:
 * - Pembuatan materi (create_material, publish_material)
 * - Review antrian (get_pending_materials)
 * - Penilaian tulisan siswa (grade_writing_submission)
 * - Persetujuan nilai (approve_grade)
 *
 * Untuk mendaftarkan ke Claude Desktop, tambahkan ke config:
 * {
 *   "mcpServers": {
 *     "mcp-inggris": {
 *       "command": "node",
 *       "args": ["/path/to/mcp-server/dist/server.js"]
 *     }
 *   }
 * }
 */

const server = new McpServer({
  name: "mcp-inggris",
  version: "0.1.0",
});

// ============================================================
// Kelompok 1: Pembuatan Materi (dipanggil guru)
// ============================================================

server.tool(
  "create_material",
  "Buat materi atau soal baru untuk minggu tertentu berdasarkan kurikulum. " +
  "Tool ini mengambil data grammar_point dan text_type dari tabel weeks, " +
  "lalu menyimpan draft materi ke database. " +
  "Gunakan setelah menentukan week_id, class_id, dan skill_type yang ingin dibuat.",
  createMaterialSchema.shape,
  async (input) => {
    const result = await createMaterial(input as Parameters<typeof createMaterial>[0]);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "get_pending_materials",
  "Ambil daftar materi dengan status DRAFT yang menunggu review dan persetujuan guru. " +
  "Filter berdasarkan class_id opsional. " +
  "Gunakan untuk mengetahui materi apa saja yang perlu ditinjau sebelum dipublikasikan.",
  getPendingMaterialsSchema.shape,
  async (input) => {
    const result = await getPendingMaterials(input as Parameters<typeof getPendingMaterials>[0]);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "publish_material",
  "Publikasikan materi yang sudah di-review guru dari status DRAFT ke PUBLISHED. " +
  "Setelah dipublikasikan, materi akan muncul di portal siswa kelas terkait. " +
  "Gunakan setelah guru selesai mereview dan menyetujui konten materi.",
  publishMaterialSchema.shape,
  async (input) => {
    const result = await publishMaterial(input as Parameters<typeof publishMaterial>[0]);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ============================================================
// Kelompok 2: Penilaian & Feedback (dipanggil guru)
// ============================================================

server.tool(
  "grade_writing_submission",
  "Nilai tulisan siswa berdasarkan rubrik penilaian yang sesuai dengan text_type materi. " +
  "CARA KERJA DUA LANGKAH: " +
  "(1) Panggil tool ini dengan submission_id saja → tool mengembalikan teks siswa + rubrik penilaian. " +
  "(2) Nilai teks tersebut berdasarkan rubrik, lalu panggil tool ini lagi dengan submission_id + ai_scores + ai_feedback untuk menyimpan hasilnya. " +
  "Nilai yang tersimpan akan berstatus DRAFT sampai guru menyetujuinya.",
  gradeWritingSchema.shape,
  async (input) => {
    const result = await gradeWritingSubmission(input as Parameters<typeof gradeWritingSubmission>[0]);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "approve_grade",
  "Setujui nilai tulisan siswa yang sudah dinilai AI (status DRAFT → APPROVED). " +
  "Setelah disetujui, siswa dapat melihat nilai dan feedback di portal mereka. " +
  "Gunakan setelah guru mereview nilai AI dan merasa nilainya sudah sesuai.",
  approveGradeSchema.shape,
  async (input) => {
    const result = await approveGrade(input as Parameters<typeof approveGrade>[0]);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ============================================================
// Start server via stdio transport
// ============================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Inggris server running via stdio...");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
