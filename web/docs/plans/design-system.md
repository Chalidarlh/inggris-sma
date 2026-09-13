# Design System — Sistem Pembelajaran Bahasa Inggris SMA

## 0. Konsep Dasar

Aplikasi ini punya **dua audiens dengan kebutuhan beda**: guru (kerja administratif, butuh efisiensi & kepercayaan) dan siswa (belajar, butuh motivasi & rasa progres). Daripada satu tampilan generik buat keduanya, konsepnya diambil dari metafora **"buku catatan guru"** — tinta biru gelap untuk struktur dan otoritas (sisi guru), emas/gold untuk pencapaian (sisi siswa, seperti bintang/nilai bagus), dan warna tanah liat lembut untuk status "perlu revisi" (seperti coretan pena guru — mengoreksi, bukan menghukum).

Ini juga langsung dipakai secara fungsional: aplikasi ini punya banyak **status** (draft/published, pending/approved) yang harus jelas dibedakan tanpa terasa seperti lampu lalu lintas generik (merah=error, hijau=sukses doang).

---

## 1. Warna (Color Tokens)

| Nama | Hex | Fungsi |
|---|---|---|
| **Ink** (primer) | `#24344D` | Teks utama, header, tombol primer, elemen struktural (biru tinta gelap) |
| **Paper** (background) | `#F1EEE6` | Latar belakang halaman (kertas hangat, bukan putih polos) |
| **Surface** (kartu/panel) | `#FFFFFF` | Latar kartu/panel di atas Paper |
| **Gold** (accent/pencapaian) | `#C68A2D` | Status "approved/published", pencapaian siswa, CTA sekunder |
| **Sage** (sukses/benar) | `#4C7A5E` | Jawaban benar, progres tercapai, konfirmasi positif |
| **Clay** (perlu perhatian) | `#B85C38` | Status "draft/menunggu review", perlu revisi — **bukan merah error**, kesannya "catatan guru", bukan "salah fatal" |

---

## 2. Tipografi

| Peran | Font | Alasan |
|---|---|---|
| **Heading/Judul** | `Source Serif 4` | Serif akademis, terasa seperti buku pelajaran/materi cetak — beda dari serif display AI-generated yang biasanya lebih dekoratif |
| **Body/UI** | `Public Sans` | Sans-serif humanis, netral dan sangat terbaca di ukuran kecil (tabel, form) — bukan `Inter` (default yang terlalu sering dipakai) |

- Heading pakai Source Serif 4 dengan weight medium/semibold, ukuran besar untuk judul halaman & nama materi (memberi kesan "materi pelajaran", bukan "produk SaaS")
- Body/UI (label tombol, tabel, form) pakai Public Sans, weight regular/medium
- Line-length body teks dibatasi ±75 karakter untuk keterbacaan materi bacaan (reading passage)

---

## 3. Layout

### Sisi Guru — gaya "buku nilai" (gradebook), bukan grid kartu

```
┌─────────────────────────────────────────┐
│  Ink header bar                          │
│  Dashboard Guru          [Kelas XI-1 ▾]  │
├─────────────────────────────────────────┤
│  Materi Menunggu Review           (3)    │
│  ─────────────────────────────────────  │
│  Minggu 7 · Narrative Text    [Clay]     │
│  Minggu 9 · Procedure Text    [Clay]     │
│  ─────────────────────────────────────  │
│  Nilai Menunggu Approve           (12)   │
│  ─────────────────────────────────────  │
│  Andi P. · Writing · skor AI: 82  [Gold] │
└─────────────────────────────────────────┘
```

Daftar berbentuk **baris (rows), bukan kartu grid** — meniru gaya buku nilai/gradebook fisik yang guru sudah familiar, lebih scan-able untuk data padat (nama siswa, skor, status) dibanding kartu besar-besar.

### Sisi Siswa — gaya "kartu progres", lebih ramah dan visual

```
┌───────────────────────────┐  ┌───────────────────────────┐
│  Minggu 7                 │  │  Minggu 8                 │
│  Narrative Text            │  │  Direct/Indirect Speech    │
│  ● Selesai         [Sage] │  │  ○ Belum dikerjakan        │
└───────────────────────────┘  └───────────────────────────┘
```

Kartu dipakai di sisi siswa (bukan tabel) karena audiensnya lebih muda dan tugasnya sedikit per minggu — kartu lebih ramah secara visual dan gampang di-scan sebagai "progres", bukan sekadar daftar data.

**Alignment:** left-aligned untuk semua konten (bukan center) — konsisten dengan konteks kerja/produktivitas, bukan halaman landing marketing.

### Penomoran minggu (1-24) — SAH dipakai di sini

Beda dengan penomoran dekoratif generik (01/02/03) yang sering jadi red flag desain AI, di aplikasi ini **kontennya memang sekuensial** — minggu 1 sampai 24, fase 1 sampai 4 — jadi penomoran eksplisit justru fungsional dan perlu, bukan hiasan.

---

## 4. Komponen

| Komponen | Style | Catatan |
|---|---|---|
| **Status badge** | Pill kecil, warna sesuai token (Clay/Gold/Sage), teks warna gelap dari ramp yang sama | Dipakai konsisten: Clay = draft/menunggu, Gold = published/approved, Sage = selesai/benar |
| **Tombol primer** | Ink background, teks Paper/putih, radius sedang (8px) | Untuk aksi utama: "Publish", "Approve" |
| **Tombol sekunder** | Outline Ink, transparan | Untuk aksi netral: "Lihat detail", "Batal" |
| **Kartu progres siswa** | Surface putih, border tipis, radius 12px, indikator bulat (● selesai / ○ belum) | Bukan shadow abu-abu generik — pakai border tipis warna Paper gelap |
| **Baris tabel guru** | Garis pembatas tipis (bukan card terpisah), hover state warna Paper sedikit lebih gelap | Meniru gradebook fisik |
| **Progress bar minggu** | Isi Gold di atas track warna Paper gelap | Dipakai untuk progres siswa dalam satu fase (misal 3 dari 6 minggu selesai) |

---

## 5. Prinsip

1. **Status harus jelas tanpa kata** — badge warna (Clay/Gold/Sage) harus cukup dikenali sendiri, teks status tetap ada sebagai penjelas, bukan pengganti warna
2. **Guru dapat densitas, siswa dapat kelapangan** — dashboard guru boleh padat informasi (banyak baris terlihat sekaligus), portal siswa lebih longgar dan bertahap
3. **Satu momen animasi, bukan banyak** — animasi cuma dipakai di transisi status berubah (misal saat guru klik "Approve", badge berubah warna dengan transisi halus), bukan hover effect di semua elemen
4. **Nomor minggu itu penanda progres, bukan dekorasi** — dipakai secara fungsional (roadmap 24 minggu), bukan angka `01/02/03` tempel di setiap section

---

## Catatan

Token warna & tipografi di atas siap langsung diterjemahkan ke `tailwind.config.ts` dan `theme.css` untuk implementasi Next.js. Kalau mau, saya bisa bantu buatkan konfigurasi Tailwind-nya langsung berdasarkan token ini di langkah selanjutnya.`