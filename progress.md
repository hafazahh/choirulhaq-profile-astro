# Progress Log

## 2026-11-03 — Security headers restored, grade A+ (commit `46f3b99`)

**Laporan user:** grade choirulhaq.com jatuh A+ → D setelah AdSense dipasang.
Digunakan pembaca scanner sungguhan (securityheaders.com) sebagai acuan.

**Kesimpulan: BUKAN AdSense penyebabnya.** CSP di repo
(`public/_headers`, commit `abb2b44`) sudah benar — `script-src 'self'` +
origin AdSense, TANPA `'unsafe-inline'`. Tidak ada alasan CSP AdSense
menjatuhkan ke D.

**Akar masalah: bentuk `_headers`, bukan isinya.** Blok header `/*` membawa
sembilan baris komentar `#` ter-indentasi (antara HSTS dan CSP), dan `/*`
didefinisikan DUA KALI — blok kedua di akhir file hanya untuk `Cache-Control`.
Cloudflare Pages membuang blok keamanan itu, jadi HTML disajikan hanya dengan
`x-content-type-options` + `referrer-policy`. Tidak ada CSP, HSTS,
X-Frame-Options, Permissions-Policy, COOP, CORP. Grade jatuh A+ → D.

**Bukti menentukan:**
- `pages.dev` mengirim `cache-control: public, max-age=3600, public, max-age=3600`
  dan `...immutable, public, max-age=3600` (DOBEL/TRIPEL) → Pages MEMBACA dan
  MENERAPKAN `_headers` HEAD; yang gagal hanya blok keamanan.
- File seperti `hero-bg.jpg` (`age: 152608`, HIT) masih memakai CSP versi
  `1177be3` — itu objek edge cache SEBELUM deploy `abb2b44`, bukan bukti
  `_headers` lama masih hidup.
- `/robots.txt?probe=1` berstatus MISS (bukan cache) tanpa CSP/XFO/HSTS.

**Perbaikan (commit `46f3b99`, push `origin/main`):**
- Semua komentar dipindah ke antar blok (kolom 0) — tidak ada lagi di dalam blok header.
- Cache-Control dimasukkan ke blok `/*` tunggal.
- `check_headers.py` ditambahkan: parse seperti Pages, menolak komentar dalam blok,
  pola URL duplikat, dan blok `/*` tanpa set header wajib.
- Live: `/*` sekarang 1 blok, 9 header.

**Verifikasi (bukan self-report):**
- `npm run build` sukses; `diff public/_headers dist/_headers` = identik.
- `python3 check_headers.py dist/_headers` → exit 0; file git HEAD → exit 1
  (dua masalah terdeteksi) — skrip terbukti bisa membedakan.
- `curl -sI https://choirulhaq.com/?probe=B2` → CSP + HSTS + XFO +
  Permissions-Policy + COOP + CORP lengkap (CSP `script-src 'self'` + origin
  AdSense, TANPA `'unsafe-inline'`).
- securityheaders.com → **A+** (Report Time 03 Nov 2026 00:51:09 UTC).
- CSP **terpaksa berlaku**: inline script tanpa nonce TIDAK berjalan
  (`window.__noNonceRan === false`); script situs sendiri tetap hidup.
- Bar iklan AdSense tidak terpengaruh: `ins.adsbygoogle` status `done`,
  90×1217 px, 1 iframe, request ke `pagead2.googlesyndication.com` +
  `googleads.g.doubleclick.net` 200. Nol CSP violations.

## 2026-10-14
- Audit selesai. 5 masalah teridentifikasi, root cause jelas.
- Phase 1 (canonical URL): `site` di astro.config.mjs diupdate ke `https://choirulhaq.com`.
- Phase 2 (i18n): dictionaries.ts ditambah 200+ key untuk python, networking, java, sqlserver, hacking (id + en).
- Phase 3 (meta description): default description di BaseLayout.astro diperkaya.
- Phase 4 (narasi): python.astro dapat narasi intro + konteks edukatif per topik.
- Phase 5 (sitemap+robots): public/sitemap.xml dan public/robots.txt dibuat.
- Build sukses. Verifikasi HTML: canonical, meta, sitemap, robots, narasi — semua ter-render.
