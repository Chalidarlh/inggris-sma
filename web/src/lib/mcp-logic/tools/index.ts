/**
 * Tools index — daftarkan semua tools MCP di sini.
 * Di-import oleh server.ts untuk registrasi ke MCP server.
 *
 * Setiap tool punya:
 * - schema: Zod schema untuk validasi input
 * - handler: fungsi async yang menjalankan logika tool
 * - description: teks yang dibaca Claude untuk tahu kapan memanggil tool ini
 */

export { createMaterial, createMaterialSchema } from "./create-material";
export { getPendingMaterials, getPendingMaterialsSchema } from "./get-pending-materials";
export { publishMaterial, publishMaterialSchema } from "./publish-material";
export { gradeWritingSubmission, gradeWritingSchema } from "./grade-submission";
export { approveGrade, approveGradeSchema } from "./approve-grade";
