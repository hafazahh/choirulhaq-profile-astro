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
