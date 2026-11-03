# Findings

## Audit Existing Code

### BaseLayout.astro
- `site` di astro.config.mjs = `https://choirulhaq-profile-astro.pages.dev` (SALAH — harus `https://choirulhaq.com`)
- canonicalURL = `new URL(Astro.url.pathname, Astro.site)` — otomatis ikut site config
- Default description = "Profil pribadi Choirul Haq" (terlalu generic)

### dictionaries.ts
- Hanya ada key: hero.*, about.*, hobi.*, tutorial.*, miniproject.*, contact.*, footer.*
- TIDAK ADA key: python.*, networking.*, java.*, sqlserver.*, hacking.*
- Akibatnya: semua `data-i18n="python.*"` dll tidak pernah ketemu di kamus → teks fallback ke hardcoded ID

### LanguageSwitcher.astro
- Script client-side sudah benar: querySelectorAll `[data-i18n]` → replace textContent
- Tapi kamus tidak punya key untuk halaman tutorial

### Tutorial Pages
- python.astro: 5 topik × 5 latihan, tapi TIDAK ada narasi edukatif — hanya soal+kode
- networking.astro, java.astro, sqlserver.astro, hacking.astro: pola sama

### public/
- Isi: _headers, favicon.ico, hero-bg.jpg, favicon.svg
- TIDAK ADA: sitemap.xml, robots.txt

## Root Causes
1. `site` config salah domain → canonical URL mengarah ke pages.dev
2. dictionaries.ts tidak pernah diisi untuk halaman tutorial
3. Meta description default terlalu pendek
4. Tutorial = daftar soal tanpa konteks edukatif
5. Tidak ada sitemap/robots untuk SEO

---

## 2026-11-02 — Security header hilang, grade D (INVESTIGASI SELESAI)

### Keluhan user
Grade securityheaders.com jatuh A+ → D setelah AdSense dipasang.

### Kesimpulan: BUKAN AdSense penyebabnya.
CSP di repo (`public/_headers`, commit `abb2b44`) sudah benar: `script-src 'self'`
+ origin AdSense, TANPA `'unsafe-inline'`. Tidak ada alasan CSP AdSense
menjatuhkan ke D.

### Bukti: `_headers` repo HEAD memang ter-deploy
`pages.dev` mengirim `cache-control` yang DOBEL/TRIPEL:
- `pages.dev/floating-ad-v2.js` → `public, max-age=3600, public, max-age=3600`
- `pages.dev/_astro/*.js` → `public, max-age=3600, public, max-age=31536000, immutable, public, max-age=3600`

Doubling membuktikan Pages MEMBACA dan MENERAPKAN `_headers` HEAD. Apa yang gagal
adalah blok header keamanan pertama (`/*`), bukan file-nya.

### Akar masalah: komentar `#` DI DALAM blok header
Commit `abb2b44` (pasang AdSense) menaruh tujuh baris komentar `#` di dalam
blok header `/*`, antara `Strict-Transport-Security` dan
`Content-Security-Policy`. Parser `_headers` Cloudflare Pages hanya menerima
komentar sebagai baris terpisah ANTAR blok. Komentar di dalam blok membuat
seluruh blok `/*` gagal di-parse — semua header keamanan di dalamnya hilang.

### Kenapa beberapa file terlihat "masih A+"
Bukan bukti `_headers` lama masih hidup. Itu objek edge cache SEBELUM deploy
`abb2b44`:
- `hero-bg.jpg` → CSP commit `1177be3` (`script-src 'self'`, tanpa AdSense),
  `age: 152608` (42 jam), `cf-cache-status: HIT`
- `floating-ad.js` → CSP commit `abb2b44`, `age: 156876`, HIT

Cache-Control bertentangan dengan rule yang lebih baru (`.js` = 3600, diliat
`age` di jam) juga bukti objek itu sudah ada di edge sebelum rule baru datang.

### Verifikator menentukan
1. `curl -sI https://choirulhaq.com/floating-ad-v2.js?nocache=zz1` (MISS, tidak
   dari cache) → **tidak ada** CSP/XFO/HSTS sama sekali.
2. `curl -sI https://choirulhaq.com/robots.txt` → hanya `x-content-type-options`
   + `referrer-policy`. Blok `/*` gagal total.
3. `pages.dev` doubling `cache-control` → `_headers` HEAD ter-deploy dan
   rule cache ikut; hanya blok keamanan yang gagal.

### Fix
Pindahkan SEMUA komentar `#` ke luar blok header (di antar blok), biarkan
header apa adanya. Untuk `_headers` yang sama persis dengan A+ hari ini,
Cloudflare akan parse ulang seluruh blok `/*` saat deploy berikutnya.

### Aturan untuk sesi berikutnya
- JANGAN taruh komentar `#` di dalam blok header `_headers` Cloudflare Pages.
  Blok `/*` yang gagal parse begitu membuang HSTS + CSP + XFO + Permissions-Policy
  + COOP + CORP sekaligus, dan grade jatuh A+ → D.
- Gejala kunci: `cache-control` DOBEL di header live = rule cache jalan tapi
  blok keamanan mati.

### Verifikasi dari scanner (2026-11-02 23:22 UTC)
`securityheaders.com` → **D**. Missing: Strict-Transport-Security,
Content-Security-Policy, X-Frame-Options, Permissions-Policy.
