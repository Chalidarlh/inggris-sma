# Project Structure & Rules
## Sistem Berbasis MCP untuk Pembelajaran Bahasa Inggris
Stack: Next.js (App Router) + TypeScript + Supabase + shadcn/ui

---

## 1. Struktur Repo (Level Atas)

Karena MCP server dan Next.js app itu **runtime yang berbeda** (MCP server jalan via stdio dipanggil Claude Desktop, Next.js jalan sebagai web server), keduanya dipisah jadi dua folder independen dalam satu repo — bukan digabung jadi satu aplikasi. Ini menghindari kerumitan monorepo tooling (Turborepo dll) yang nggak dibutuhkan untuk proyek solo.

```text
/nama-proyek
  /web                  ← Next.js app (dashboard guru + portal siswa)
  /mcp-server           ← MCP server (dipanggil Claude Desktop)
  /docs                 ← dokumen non-kode (proposal, kurikulum, rencana)
    /kurikulum
    /rencana
  /shared               ← tipe TypeScript yang dipakai bareng (opsional)
  README.md
```

**Kenapa dipisah:** `web` dan `mcp-server` sama-sama connect ke Supabase yang sama, tapi mereka dijalankan, di-deploy, dan di-debug secara terpisah. Kalau digabung jadi satu aplikasi Next.js (API routes sebagai MCP server), nanti bakal ribet karena protokol MCP butuh proses long-running via stdio, bukan model request-response biasa yang dianut Next.js API routes.

---

## 2. Struktur Folder `/web` (Next.js App Router)

```text
/web
  /src
    /app
      /layout.tsx
      /page.tsx                    ← landing/login
      /(guru)
        /layout.tsx                ← layout khusus area guru (sidebar, dst)
        /dashboard
          /page.tsx
        /materi
          /[id]
            /page.tsx               ← review & edit satu materi
        /nilai
          /[id]
            /page.tsx               ← review & approve satu nilai
      /(siswa)
        /layout.tsx                 ← layout khusus area siswa
        /portal
          /page.tsx                 ← daftar materi kelas
        /tugas
          /[materiId]
            /page.tsx                ← submit jawaban
        /nilai
          /page.tsx                 ← lihat nilai & feedback sendiri
      /api
        /webhook                    ← kalau nanti butuh webhook (opsional, awal skip dulu)

    /components
      /ui                           ← komponen shadcn/ui (auto-generated, jangan edit manual)
      /features
        /materi-review
          /index.tsx
        /nilai-review
          /index.tsx
        /portal-siswa
          /index.tsx

    /lib
      /supabase
        /client.ts                  ← Supabase client (browser)
        /server.ts                  ← Supabase client (server component/action)
      /types
        /index.ts                   ← tipe TypeScript (Material, Grade, Submission, dst)
      /utils.ts                     ← helper umum (format tanggal, dst)

    /hooks
      /use-materials.ts
      /use-grades.ts

  /.env.local                       ← Supabase URL & anon key (JANGAN commit ke git)
  /package.json
  /tailwind.config.ts
```

### Catatan penting

- **Route groups `(guru)` dan `(siswa)`** — pakai fitur route groups Next.js (folder dalam kurung) supaya guru dan siswa punya layout terpisah (misalnya sidebar beda), tapi URL tetap bersih (nggak muncul `/guru/dashboard`, cukup `/dashboard`).
- **`/lib/supabase/client.ts` vs `server.ts`** — Next.js App Router butuh dua cara koneksi Supabase berbeda tergantung dijalankan di browser atau server. Ini konvensi resmi dari dokumentasi Supabase untuk Next.js, ikuti pola itu.
- **shadcn/ui tidak diinstall lewat npm biasa** — komponennya di-generate langsung ke folder `/components/ui` pakai CLI (`npx shadcn add button`). Jangan edit file di folder ini secara manual kalau memungkinkan, supaya gampang di-update ulang dari CLI-nya.

---

## 3. Struktur Folder `/mcp-server`

```text
/mcp-server
  /src
    /tools
      /create-material.ts
      /get-pending-materials.ts
      /publish-material.ts
      /grade-submission.ts
      /approve-grade.ts
      /index.ts                     ← daftar semua tools, di-register ke server
    /lib
      /supabase.ts                  ← Supabase client (server-side, pakai service role key)
      /rubrics.ts                   ← rubrik penilaian (hardcode dulu untuk versi awal)
    /server.ts                      ← entry point MCP server
  /.env                             ← Supabase service role key (JANGAN commit ke git)
  /package.json
```

### Catatan penting

- **Satu file per tool** — supaya gampang ditelusuri dan nggak ada satu file raksasa berisi semua logic.
- **Rubrik di-hardcode dulu di `/lib/rubrics.ts`** — untuk versi prototype, ini paling sederhana. Nanti kalau perlu, bisa dipindah ke database Supabase dan diambil dinamis.
- **Service role key vs anon key** — MCP server pakai **service role key** Supabase (akses penuh, bypass Row Level Security), karena ini server tepercaya yang dikontrol lewat validasi di kode sendiri. Beda dengan `/web` yang pakai anon key + RLS karena diakses langsung dari browser pengguna.

---

## 4. Project Rules

### 4.1 Penamaan File & Folder

- **Folder & file**: kebab-case (`materi-review`, `create-material.ts`)
- **Komponen React**: PascalCase untuk nama komponennya di dalam kode (`export function MateriReview()`), tapi nama filenya tetap kebab-case
- **Setiap folder fitur** di `/components/features` wajib punya `index.tsx` sebagai entry point

### 4.2 Ukuran File

- Maksimal ±300 baris per file komponen. Kalau lebih, pecah jadi sub-komponen di folder yang sama (misal `materi-review/materi-editor.tsx`, `materi-review/materi-preview.tsx`)
- (Catatan: contoh yang kamu tunjukkan tadi pakai batas 800 baris — itu wajar untuk tim/proyek lebih besar. Untuk proyek solo skala TA, 300 baris lebih realistis supaya kamu sendiri nggak kesulitan navigasi file sendiri nanti.)

### 4.3 Tipe Data (TypeScript)

- Semua tipe data inti (Material, Grade, Submission, Rubric, dst) didefinisikan **satu tempat**: `/lib/types/index.ts` di `/web`, dan disalin/disesuaikan manual ke `/mcp-server/src/lib` (karena dua project terpisah, tidak otomatis sinkron — pastikan konsisten manual tiap ada perubahan skema database)
- Jangan pakai `any` — kalau tipe data belum jelas, pakai `unknown` dan definisikan tipe sebenarnya secepatnya

### 4.4 Environment Variables

- Supabase anon key & URL → `/web/.env.local`
- Supabase service role key → `/mcp-server/.env`
- **Service role key TIDAK BOLEH** pernah muncul di kode `/web` (karena itu bisa diakses browser/publik). Anon key aman dipakai di `/web` karena dibatasi Row Level Security.
- Kedua `.env` masuk `.gitignore`, jangan sampai ke-commit

### 4.5 Database & Row Level Security (RLS)

- Setiap tabel baru di Supabase **wajib** diaktifkan RLS sebelum dipakai, meskipun masih tahap development
- Kebijakan dasar: siswa hanya boleh SELECT data miliknya sendiri (`student_id = auth.uid()`), guru hanya boleh akses data kelas yang diampu

### 4.6 AI & MCP Tools

- Setiap tool MCP wajib punya deskripsi parameter yang jelas (dipakai Claude untuk memahami kapan tool itu dipanggil) — ikuti dokumentasi resmi `@modelcontextprotocol/sdk` soal cara mendefinisikan schema tool
- Prompt/instruksi yang ditanam di dalam tool (misalnya rubrik penilaian) disimpan sebagai konstanta terpisah di `/lib/rubrics.ts`, jangan di-hardcode langsung di tengah kode tool — supaya gampang diubah tanpa mengutak-atik logic

### 4.7 Git & Commit

- Commit kecil dan sering, bukan satu commit raksasa di akhir minggu — ini penting untuk histori kalau perlu dicek ulang saat sidang/laporan progress ke dosbing
- Pesan commit pakai bahasa yang jelas menyatakan apa yang berubah (contoh: `feat: tambah tool create_material`, bukan `update`)

---