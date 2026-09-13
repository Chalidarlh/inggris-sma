# ERD & Spesifikasi Tools MCP — Berdasarkan Kurikulum Bahasa Inggris SMA

## 1. Insight dari Kurikulum

Kurikulum ini terstruktur dalam **24 minggu, 4 fase**, tiap minggu punya kombinasi: 1 grammar point + (kadang) 1 jenis teks + fokus skill (reading/writing/speaking/listening). Ini beda jauh dari kasus EPLC — di sini **9 dari 10 jenis teks + 3 dari 4 skill sepenuhnya berbasis tulisan**, cuma Speaking yang murni butuh audio (dan itu sudah kita sepakati di luar scope).

## 2. Penjelasan Tabel (ERD)

| Tabel | Fungsi | Sumber dari kurikulum |
|---|---|---|
| `weeks` | Representasi 24 minggu kurikulum — grammar point & jenis teks per minggu | Bagian 4 (Rincian Mingguan) |
| `classes` | Kelas siswa (misal "XI IPA 1") | — |
| `students` | Data siswa, terhubung ke satu kelas | — |
| `materials` | Materi/soal yang di-generate AI untuk minggu & skill tertentu | Kombinasi week + skill_type |
| `submissions` | Jawaban siswa atas satu materi | — |
| `grades` | Hasil penilaian AI atas satu submission | — |
| `rubrics` | Kriteria penilaian per jenis teks (10 genre) | Bagian 6 (Daftar Jenis Teks) |

### Detail kolom penting

- **`weeks.text_type`** — nullable, karena tidak semua minggu punya jenis teks (misal Minggu 1 cuma grammar, tanpa teks)
- **`materials.skill_type`** — enum: `reading`, `writing`, `listening` (skip `speaking` untuk versi prototype, sesuai kesepakatan scope)
- **`materials.status`** — enum: `draft`, `published` (sesuai alur approve guru yang sudah kita sepakati)
- **`grades.status`** — enum: `draft`, `approved` (nilai AI baru resmi setelah guru approve)
- **`rubrics.text_type`** — merujuk ke 10 genre di kurikulum (descriptive, recount, narrative, dst), tiap genre punya kriteria beda karena strukturnya beda (misal narrative dinilai dari orientation-complication-resolution, sedangkan report dari general classification-description)

---

## 3. Daftar Tools MCP (disesuaikan struktur kurikulum)

### Kelompok 1: Pembuatan Materi (dipanggil guru)

**`generate_reading_material(week_id)`**
Ambil `text_type` dan `grammar_point` dari tabel `weeks`, generate teks bacaan + soal pemahaman sesuai jenis teks minggu itu (misal Minggu 7 → narrative text tentang dongeng).

**`generate_writing_prompt(week_id)`**
Generate instruksi tugas menulis sesuai `text_type` minggu itu (misal Minggu 4 → prompt recount text tentang pengalaman liburan).

**`generate_grammar_exercise(week_id, jumlah_soal)`**
Generate latihan sesuai `grammar_point` minggu itu (misal Minggu 11 → soal first conditional).

**`generate_listening_task(week_id, sumber_referensi)`**
Karena listening di kurikulum ini pakai sumber eksternal (podcast/video, lihat Bagian 7), tool ini generate **pertanyaan/instruksi ringkasan** yang menyertai sumber tersebut, bukan generate audio-nya sendiri.

**`publish_material(id, class_id)`**
Materi yang sudah di-approve guru dipublikasikan ke kelas tertentu.

### Kelompok 2: Penilaian & Feedback (dipanggil guru)

**`get_pending_submissions(class_id)`**
Daftar jawaban siswa yang belum dinilai.

**`grade_writing_submission(submission_id)`**
Ambil `text_type` dari materi terkait, ambil rubrik yang sesuai dari tabel `rubrics`, nilai jawaban siswa berdasarkan struktur teks yang berlaku untuk genre itu (misal cek struktur orientation-complication-resolution untuk narrative).

**`grade_reading_comprehension(submission_id)`**
Untuk soal pemahaman bacaan (biasanya pilihan ganda/isian singkat) — bisa lebih sederhana dari `grade_writing_submission` karena jawabannya lebih terstruktur/pasti.

**`grade_listening_summary(submission_id)`**
Menilai ringkasan tertulis siswa atas materi listening — dinilai dari kelengkapan poin penting, bukan tata bahasa semata.

**`approve_grade(id)`**
Guru menyetujui nilai AI, baru resmi masuk sistem.

### Kelompok 3: Akses Siswa

**`get_week_materials(student_id)`**
Materi minggu berjalan yang sudah dipublikasikan untuk kelas siswa tersebut.

**`submit_assignment(student_id, material_id, jawaban)`**
Siswa mengumpulkan jawaban.

**`get_my_grades(student_id)`**
Siswa melihat nilai & feedback miliknya.

### Kelompok 4 (opsional): Pendukung Progres

**`track_grammar_mastery(student_id)`**
Berdasarkan struktur kurikulum yang grammar-nya berurutan (15 grammar point berurutan), tool ini bisa melacak grammar point mana yang sering salah, berguna untuk rekomendasi review sebelum lanjut minggu berikutnya — ini **sejalan dengan poin 9 di kurikulum** ("tambah 2-3 hari review kalau belum paham").

**`generate_weekly_review(week_range)`**
Otomatis bikin soal review gabungan untuk minggu-minggu sebelumnya (relevan dengan pola "Sabtu = hari review" dan minggu ke-6/12/18/24 yang berisi mini ulangan/ujian komprehensif).

---

## Catatan Penting

**`generate_weekly_review` dan `track_grammar_mastery` cocok jadi pembeda TA-mu** — karena ini bukan sekadar "generate satu soal", tapi memanfaatkan **struktur kurikulum yang berurutan** (grammar bertahap, ada siklus review tiap 6 minggu) untuk sesuatu yang lebih pintar. Ini nilai tambah dibanding sistem generate-soal generik.

**Untuk versi prototype/MVP**, saran saya tetap fokus dulu ke Kelompok 1 dan 2 (10 tools), dan pilih **2-3 minggu contoh saja** dari 24 minggu yang ada untuk diuji (misal Minggu 2, 7, dan 13 — mewakili 3 fase berbeda dengan jenis teks berbeda), supaya nggak perlu generate semua 24 minggu sekaligus di awal pengembangan.