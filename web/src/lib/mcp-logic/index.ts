import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

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
  findWeek,              // <- tambahan
  findWeekSchema,        // <- tambahan
  findClass,             // <- tambahan
  findClassSchema,
} from "./tools";

/**
 * Membuat dan mengkonfigurasi instance MCP Server.
 * Diekspor untuk digunakan oleh transport apapun (stdio/SSE/HTTP).
 */
export function createMcpServer() {
  const server = new McpServer({
    name: "mcp-inggris",
    version: "0.2.0",
  });

  // ============================================================
  // Kelompok 0: Pencarian/Lookup (dipanggil otomatis oleh Claude
  // untuk menerjemahkan nomor minggu/nama kelas menjadi UUID)
  // ============================================================

  server.tool(
    "find_week",
    "Cari data minggu berdasarkan nomor urutnya (misalnya 1 untuk minggu pertama). " +
    "Mengembalikan week_id (UUID) beserta detail grammar_point dan text_type minggu tersebut. " +
    "WAJIB dipanggil dulu sebelum create_material jika user menyebutkan nomor minggu biasa, " +
    "bukan UUID langsung.",
    findWeekSchema.shape,
    async (input) => {
      const result = await findWeek(input as Parameters<typeof findWeek>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "find_class",
    "Cari data kelas berdasarkan nama kelasnya (misalnya 'XI IPA 1'). " +
    "Mengembalikan class_id (UUID) yang sesuai. " +
    "WAJIB dipanggil dulu sebelum create_material atau tool lain yang butuh class_id, " +
    "jika user menyebutkan nama kelas biasa, bukan UUID langsung.",
    findClassSchema.shape,
    async (input) => {
      const result = await findClass(input as Parameters<typeof findClass>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ============================================================
  // Kelompok 1: Pembuatan Materi (dipanggil guru)
  // ============================================================

  server.tool(
    "create_material",
    "Buat materi atau soal baru untuk minggu tertentu berdasarkan kurikulum. " +
    "Tool ini mengambil data grammar_point dan text_type dari tabel weeks, " +
    "lalu menyimpan draft materi ke database. " +
    "PENTING: week_id dan class_id harus berupa UUID. Jika user menyebutkan nomor minggu " +
    "biasa (misalnya 'minggu pertama') atau nama kelas biasa (misalnya 'XI IPA 1'), " +
    "panggil find_week dan find_class terlebih dahulu untuk mendapatkan UUID yang sesuai.",
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

  return server;
}
