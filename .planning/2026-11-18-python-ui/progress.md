# Progress — /python/ tampilan & tree

## 2026-11-18 — Fase 1 diagnosis
- Ditemukan penyebab tree tidak aktif: `display:flex` menimpa `[hidden]`
  (0 aturan `[hidden]` di SidebarTree.astro).
- Ditemukan ketidaksesuaian palet: biru `#2563eb` vs ungu beranda.
- Plan dibuat, implementasi didelegasikan.

## 2026-11-19 — Fase 2 fix tree + palet (selesai, terverifikasi)

### Masalah 1 — tree tidak aktif
- `src/components/SidebarTree.astro`: tambah `.tree__list[hidden]{display:none}`
  (aturan pembalik minimise aksen — selector class UA tidak bisa dikalahkan).
- Tambah `.tree__item:focus-visible` + `.tree__toggle:focus-visible`
  (outline ungu offset 2px) agar fokus keyboard terlihat.
- `min-height:44px` untuk `.tree__item` dan `.tree__toggle` di layar
  <=860px; `.py-menu-btn` juga dinaikkan dari padding 0.5/0.8 ke 0.7/1rem
  plus `min-height:44px` (target sentuh).
- Tambah `aria-current="page"` pada item aktif (server-rendered).

### Masalah 2 — palet tidak menyatu
- `src/components/PythonLayout.astro`: seluruh token `--py-*` di
  `.py-page` diganti dari biru ke ungu beranda:
  - `--py-bg` → `linear-gradient(160deg,#faf5ff,#f5f3ff 45%,#f0f9ff)`
    (dari `#f5f7fa` rata; kini sepadan `from-purple-50 to-sky-50`)
  - `--py-accent` `#2563eb` → `#7e22ce` (purple-700), hover `#6b21a8`
    (purple-800); token baru `--py-accent-hover`, `--py-title` `#581c87`
    (purple-900), `--py-subtitle` `#6b21a8` (purple-800)
  - `--py-radius` 10→12px, token baru `--py-card-border: #f3f4f6` dan
    `--py-shadow-card` = shadow-md Tailwind, dipakai kartu `.py-soon` dan
    `.py-pager li`
  - header `h1` ungu, header latar putih transparan + blur
  - sidebar caption ungu/bold, bingkai ungu lembut
- Penimpaan isi artikel (`.py-content .artikel__isi ...`) diselaraskan ke
  aksen ungu; tidak ada teks artikel yang diubah.
- **Bonus (ketemu saat uji mode gelap):** `.artikel__isi` memakai warna
  terkunci untuk mode terang; atas latar gelap isinya jadi kontras rendah.
  Ditambahkan blok `@media (prefers-color-scheme:dark)` di PythonLayout
  yang menimpa body/h2/h3/a/code/blockquote/table/blok output dengan
  padanan terang bernuansa ungu (`!important` pada blok output, seperti
  kasus preflight Tailwind v4 di MarkdownArtikel).

### Bug ketiga yang ditemukan & diperbaiki saat verifikasi
- Halaman `/python/<slug>/` **tidak punya** tombol `#pyMenuBtn`,
  overlay, maupun tombol tutup, jadi di ponsel sidebar tidak bisa dibuka
  (markupnya memang tidak ada sejak awal; bukan akibat perubahan ini).
- Skrip buka/tutup panel sempat ditulis inline per halaman, tetapi
  `[slug].astro` merender artikel dalam IIFE — Astro hanya mengangkat
  `<script>` di tingkat atas halaman, jadi skrip di dalam IIFE tidak ikut
  dibundel dan tombolnya mati senyap (tanpa error di build).
  Diperbaiki dengan komponen baru **`src/components/PythonSidebarPanel.astro`**
  (tombol + overlay + sidebar + skrip, satu tempat), dipakai oleh
  `/python/` dan `/python/<slug>/`.
- Efek samping: `SidebarTree` masih dirender di dalam panel yang sama,
  jadi `import SidebarTree` di kedua halaman jadi redundan dan dibuang.

### Hasil verifikasi nyata
- `npm run build` → **18 page(s) built**, exit 0, tanpa error.
- `python3 check_headers.py dist/_headers` → **exit 0** ("structure matches
  what Pages accepts").
- Browser (Chromium lokal, dist/ disajikan di 127.0.0.1:8771):
  - (a) `.tree__list[hidden]` → `display: none` (8 dari 9 daftar)
  - (b) klik judul bab → `display: flex`, `aria-expanded="true"`,
    `.tree__section--open` aktif, chevron `rotate(90deg)`
    (matrix(0,1,-1,0,0,0)); klik lagi kembali `none` / `false`
  - (c) saat halaman dimuat → tepat **1** `.tree__section--open` (`dasar`)
  - (d) item aktif punya `aria-current="page"` (tepat 1)
  - (e) `scrollWidth <= innerWidth` di 390 (390≤390), 820 (805≤820),
    1440 (1425≤1440)
  - `#pyMenuBtn` 45px tinggi, tak ada item/toggle < 44px di 390px
  - Panel geser: tertutup `translate(-320,0)`, dibuka `translate(0)`,
    overlay `display:block`, `aria-expanded` menu sinkron; tutup balik lagi.
  - Terverifikasi identik di `/python/`, `/python/variabel-dan-tipe-data-python/`
    dan `/python/instalasi-python/`.
  - Mode gelap (emulasi prefers-color-scheme: dark) teruji: isi artikel tetap
    terbaca (body `#e5e7eb`), aksen `#c084fc` — ungu, bukan biru.
  - Screenshot desktop 1280 + mobile 390 + mode gelap dilihat langsung;
    warna piksel disampel (PNG 390x844): header putih `rgb(255,255,255)`,
    judul `rgb(101,45,144)`, latar gradien ungu→biru
    (`rgb(245,244,255)` → `rgb(241,248,255)`).
- Tidak ada `git commit` / `git push`; semua perubahan di working tree.

## To verify
- [x] `npm run build` sukses, jumlah halaman tetap 18
- [x] `python3 check_headers.py dist/_headers` exit 0
- [x] Di browser: klik judul bab mengubah `getComputedStyle(list).display`
- [x] Hanya bab aktif yang terbuka saat halaman dimuat
- [x] Item aktif punya `aria-current="page"`
- [x] 390 / 820 / 1440 px tanpa overflow horizontal
- [x] Artikel & halaman rencana tetap benar
- [x] Tampilan menyatu dengan beranda (verified via computed colors on both
      light and dark mode)

Berkas alat pemeriksaan yang dipakai sekali (bisa dihapus bila tidak
diperlukan lagi):
`.planning/2026-11-18-python-ui/inspect_css.cjs`,
`.planning/2026-11-18-python-ui/sample_png.py`