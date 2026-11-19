# Findings — /python/ tampilan & tree

## Berkas yang terlibat
| Berkas | Peran |
|---|---|
| `src/components/PythonLayout.astro` | seluruh CSS kerangka: warna, layout dua kolom, responsif, mode gelap |
| `src/components/SidebarTree.astro` | markup + CSS + script tree indeks |
| `src/pages/python/index.astro` | halaman utama: materi pertama + sidebar |
| `src/pages/python/[slug].astro` | artikel & halaman rencana, sidebar sama |
| `src/data/pythonTree.ts` | sumber data 9 bab / 52 item |
| `src/components/MarkdownArtikel.astro` | gaya isi artikel (`.artikel__isi`) |

## Palet beranda (acuan agar menyatu)
Diambil dari `src/pages/index.astro` dan komponen lain:
- judul: `text-purple-900` (#581c87), sub-judul `purple-800` (#6b21a8)
- tombol: `bg-purple-700` (#7e22ce), hover `purple-800`
- latar seksi: `bg-gradient-to-br from-purple-50 to-sky-50`
- kartu: `bg-white rounded-xl shadow-md/lg border border-gray-100`
- teks: `text-gray-600` / `text-gray-700`

## Palet halaman sekarang (masalah)
- aksen `#2563eb` (biru) — tidak dipakai di beranda
- latar rata `#f5f7fa`, tanpa gradien
- kartu `rounded-2xl` + border ungu muda, campur dua bahasa desain

## Penyebab tree "tidak aktif" (terbukti)
```css
.tree__list { display: flex; flex-direction: column; }
```
Tidak ada `.tree__list[hidden]`. Selektor penulis menang atas `[hidden]` UA
stylesheet, jadi `hidden` tidak pernah menyembunyikan apa pun. Perbaikan minimal:
```css
.tree__list[hidden] { display: none; }
```

## Catatan teknis Astro yang sudah dipelajari di pekerjaan ini
- Komponen yang hanya merender `<style>` WAJIB `is:global`; jika tidak, Astro
  menambahkan `[data-astro-cid-...]` ke setiap selektor dan selektor tak
  pernah cocok.
- Di dalam blok `is:global`, jangan menulis `:global()` lagi.
- `getStaticPaths` di-hoist; jangan bergantung pada `const` frontmatter di
  bawahnya.
- Tailwind v4 preflight masuk `@layer base` setelah style komponen; properti
  yang bersaing perlu `!important` (kasus blok OUTPUT).
- **`<script>` di dalam ekspresi JSX bersarang (mis. IIFE) TIDAK dibundel.**
  Astro hanya mengangkat (hoist) skrip yang berada di tingkat atas template
  halaman/komponen. Skrip panel geser ditaruh di dalam IIFE di
  `[slug].astro`, hasilnya tidak masuk bundle dan tombol ponsel mati
  **tanpa error saat build**. Solusinya: skrip di komponen tersendiri
  (`PythonSidebarPanel.astro`), selalu di tingkat atas.
- **Mode gelap bukan sekadar variabel.** `MarkdownArtikel` mengunci warna
  isi untuk mode terang; menukar hanya token halaman membuat body `#374151`
  nyaris tak terbaca di atas latar `#1f2937`. Perlu override eksplisit di
  dalam `@media (prefers-color-scheme: dark)`.

## Temuan tambahan saat verifikasi (2026-11-19)
- Halaman `/python/<slug>/` tidak punya tombol `#pyMenuBtn`, overlay
  `#pyOverlay`, `#pyCloseBtn`, maupun `#pySidebar` — di ponsel sidebar tak
  bisa dibuka sama sekali. Bukan akibat perubahan palet; markup-nya memang
  belum ada.
- Media query hasil build ditulis minified sebagai `@media (width<=860px)`,
  jadi `grep "max-width:860px"` tidak menemukan apa pun (jebakan saat
  memeriksa hasil build).
