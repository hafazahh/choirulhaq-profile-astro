# Task Plan — Perbaikan tampilan & tree halaman /python/

Tujuan: halaman `/python/` menyatu dengan beranda (palet ungu), dan sidebar tree
benar-benar berfungsi (buka-tutup + penanda materi aktif).

Repo: `/home/choirulhaq/tailwind` · Astro 7.3.5 · halaman statis.

## Fase

### Fase 1 — Diagnosis [SELESAI]
- **Toggle tree tidak berefek.** `.tree__list { display: flex }` di
  `src/components/SidebarTree.astro` menimpa `[hidden]` bawaan browser. Tidak ada
  satu pun aturan `[hidden]` di berkas itu (dihitung: 0). Akibatnya semua bab
  selalu terbuka dan klik judul bab hanya mengubah atribut — layar tak berubah.
  Ini yang terasa sebagai "menu tidak aktif".
- **Palet tidak menyatu.** `src/components/PythonLayout.astro` memakai biru
  netral (`#2563eb`, latar `#f5f7fa`), sedangkan beranda memakai ungu
  (`purple-700/900`) dengan gradien `purple-50 → sky-50`.
- **Penanda aktif lemah.** Item aktif hanya dibedakan warna latar; tidak ada
  `aria-current` dan bab aktif tidak otomatis terbuka saat berpindah halaman.

### Fase 2 — Implementasi [SELESAI]
Semua sasaran dipenuhi, ditambah dua temuan baru saat verifikasi:
- Halaman `/python/<slug>/` tidak punya tombol/overlay/tombol-tutup panel
  ponsel sama sekali (markup hilang sejak awal) — diperbaiki.
- Skrip panel ditulis inline di dalam IIFE tidak dibundel Astro (hoisting
  hanya untuk `<script>` tingkat atas) — dipindah ke komponen
  `PythonSidebarPanel.astro`.

### Fase 3 — Review & verifikasi mandiri [SELESAI]
- `npm run build` → 18 halaman, tanpa error.
- `python3 check_headers.py dist/_headers` → exit 0.
- Browser sungguhan 127.0.0.1:8771: (a) display none, (b) klik → flex,
  (c) 1 bab terbuka saat load, (d) `aria-current="page"`, (e) 390/820/1440
  tanpa overflow. Detail angka di `progress.md`.
- Mode gelap ikut diperiksa; isi artikel sebelumnya kontras rendah di latar
  gelap, sudah diberi aturan terang bernuansa ungu.
- Tanpa `git commit` / `git push`.

## Batasan
- Jangan mengubah isi artikel markdown (`src/content/artikel/`).
- Jangan `git push`.
- Jangan hapus 7 halaman materi rencana (`pengenalan-python`, `instalasi-python`,
  `latihan-*`).
- Jangan sentuh `public/_headers` (grade security A+ bergantung padanya).

## Errors Encountered
| Error | Attempt | Resolution |
|---|---|---|
| Toggle tree tak berefek | 1 | `display:flex` menimpa `[hidden]`; diperbaiki di fase 2 |
