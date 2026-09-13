# Implementation Plan — Sistem Berbasis MCP untuk Pembelajaran Bahasa Inggris SMA

Plan ini menyambung dokumen-dokumen sebelumnya: `project_structure_rules.md`, `erd_dan_tools_mcp.md`, `rubrik_10_jenis_teks.md`, `design_system.md`. Disusun mengikuti prinsip **vertical slice dulu** — satu alur penuh jalan sebelum melebar ke fitur lain — sesuai yang sudah dibahas di rencana teknis awal.

---

## Phase 0: Persiapan Data & Konten (sebelum coding)

- [ ] Finalisasi rubrik untuk **2-3 jenis teks contoh saja** dulu (saran: Recount, Narrative, Report — mewakili Fase 1, 2, 3 kurikulum), pakai draft rubrik yang sudah dibuat sebagai basis
- [ ] Pilih **3 minggu contoh** dari 24 minggu kurikulum untuk jadi data uji (saran: Minggu 4, 7, 13 — sesuai 3 jenis teks di atas)
- [ ] Siapkan 2-3 contoh jawaban siswa dummy per jenis teks (bisa kamu tulis sendiri, kualitas bervariasi — ada yang bagus, ada yang banyak salah) untuk uji coba `grade_writing_submission` nanti

*(Ini penting dikerjakan duluan — tanpa data contoh, Phase 4 dan seterusnya nggak bisa diuji dengan berarti.)*

---

## Phase 1: Environment & Scaffolding

- [ ] Inisialisasi `/web` — Next.js (App Router, TypeScript) pakai `create-next-app`
- [ ] Inisialisasi `/mcp-server` — Node.js/TypeScript project terpisah, install `@modelcontextprotocol/sdk`
- [ ] Setup akun & project Supabase, catat URL + anon key + service role key
- [ ] Setup `tailwind.config.ts` di `/web` dengan token warna dari `design_system.md` (Ink, Paper, Gold, Sage, Clay)
- [ ] Install & setup shadcn/ui di `/web`
- [ ] Setup `.env.local` (`/web`) dan `.env` (`/mcp-server`) sesuai `project_structure_rules.md` — pastikan masuk `.gitignore`
- [ ] Inisialisasi repo Git, buat struktur folder sesuai `project_structure_rules.md`

---

## Phase 2: Database & Auth

- [ ] Buat 7 tabel di Supabase sesuai ERD (`weeks`, `classes`, `students`, `materials`, `submissions`, `grades`, `rubrics`)
- [ ] Isi tabel `weeks` dengan data 3 minggu contoh dari Phase 0
- [ ] Isi tabel `rubrics` dengan rubrik dari Phase 0 (format JSON sesuai kriteria di `rubrik_10_jenis_teks.md`)
- [ ] Aktifkan Row Level Security di semua tabel
- [ ] Setup kebijakan RLS dasar (siswa akses data sendiri, guru akses kelas yang diampu)
- [ ] Implementasi Supabase Auth di `/web` — halaman login guru & siswa
- [ ] Buat 1 akun guru dummy + 2-3 akun siswa dummy untuk testing

---

## Phase 3: MCP Server — Vertical Slice Pertama

Fokus **satu tool paling sederhana dulu**, buktikan alur penuh nyambung sebelum lanjut ke tool lain.

- [ ] Tulis tool `create_material` di `/mcp-server` (ambil `week_id`, generate materi via LLM call, simpan ke tabel `materials` dengan status `draft`)
- [ ] Daftarkan `/mcp-server` ke Claude Desktop (file config lokal)
- [ ] Uji: chat ke Claude Desktop "buatkan materi untuk minggu 4", pastikan data benar-benar masuk ke Supabase
- [ ] Buat halaman sederhana di `/web` (`/dashboard`) yang menampilkan isi tabel `materials` — cukup tabel HTML polos dulu, belum perlu didesain rapi
- [ ] **Checkpoint:** pastikan satu alur ini benar-benar jalan end-to-end sebelum lanjut ke Phase 4. Kalau ada bagian yang gagal (misal koneksi Supabase dari MCP server bermasalah), selesaikan dulu di sini — jangan lanjut dengan fondasi yang belum solid

---

## Phase 4: Lengkapi Tools MCP

- [ ] `get_pending_materials`
- [ ] `publish_material`
- [ ] `generate_writing_prompt`
- [ ] `get_pending_submissions`
- [ ] `grade_writing_submission` (pakai rubrik dari Phase 0 — ini tool paling kompleks, uji pakai data dummy dari Phase 0)
- [ ] `approve_grade`
- [ ] Uji tiap tool satu-satu lewat chat Claude Desktop, cek datanya di Supabase tiap kali

*(Tools lain seperti `grade_reading_comprehension`, `grade_listening_summary`, `track_grammar_mastery` bisa ditunda ke iterasi berikutnya kalau waktu terbatas — catat sebagai target lanjutan.)*

---

## Phase 5: Dashboard Guru (UI Sesuai Design System)

- [ ] Bangun halaman `/dashboard` versi rapi — gaya "baris/gradebook" sesuai `design_system.md`
- [ ] Halaman detail materi (`/materi/[id]`) — review & edit draf, tombol "Publish"
- [ ] Halaman detail nilai (`/nilai/[id]`) — lihat skor & feedback AI, tombol "Approve"
- [ ] Terapkan status badge (Clay/Gold/Sage) sesuai status data

---

## Phase 6: Portal Siswa

- [ ] Tool `get_week_materials`, `submit_assignment`, `get_my_grades` (kalau belum dibuat di Phase 4)
- [ ] Halaman `/portal` — kartu progres per minggu sesuai `design_system.md`
- [ ] Halaman submit tugas
- [ ] Halaman lihat nilai & feedback

---

## Phase 7: Testing

- [ ] Black box testing tiap tool MCP — coba input valid & tidak valid, pastikan error ditangani (tidak crash)
- [ ] Cek RLS bekerja dengan benar (siswa A tidak bisa lihat data siswa B)
- [ ] Cek alur approve/publish tidak bisa dilewati (materi belum di-publish tidak muncul di portal siswa)

---

## Phase 8: Uji Coba Pengguna (UAT)

- [ ] Siapkan kuesioner Likert (kemudahan penggunaan, kesesuaian hasil AI)
- [ ] Sesi uji coba dengan guru (dan siswa kalau memungkinkan)
- [ ] Kumpulkan feedback, catat revisi yang diperlukan
- [ ] Revisi berdasarkan feedback (kembali ke Phase 4/5/6 sesuai kebutuhan — ini bagian iteratif dari Model Prototyping)

---

## Phase 9: Polish & Dokumentasi Laporan

- [ ] Rapikan responsive design (minimal cek di ukuran laptop & tablet)
- [ ] Screenshot/rekam demo untuk laporan TA
- [ ] Susun dokumentasi hasil pengujian (black box + UAT) untuk bab hasil & pembahasan skripsi

---

## Catatan Prioritas

Kalau waktu terbatas menjelang deadline, urutan yang **boleh dipangkas** (dari yang paling aman dipangkas duluan):
1. Portal siswa (Phase 6) — bisa didemokan manual/mockup kalau waktu benar-benar mepet
2. Tools tambahan di luar 6 tool inti Phase 4
3. Polish visual (Phase 9) — fungsional lebih penting daripada tampilan sempurna untuk sidang

Yang **tidak boleh dipangkas**: Phase 3 (vertical slice) dan Phase 4 (tools inti) — ini jantung pembuktian bahwa sistem MCP-nya benar-benar bekerja, itu inti dari topik TA-mu.