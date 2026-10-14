# Task Plan — SEO & i18n Polish choirulhaq.com

## Goal
Terapkan 5 rekomendasi prioritas SEO/i18n di site Astro choirulhaq.com.

## Phases

### Phase 1: Canonical URL [complete]
- Update `site` di astro.config.mjs → `https://choirulhaq.com`
- BaseLayout.astro sudah pakai `Astro.site` untuk canonical, jadi fix ini otomatis propagasi.

### Phase 2: i18n Placeholder Tutorial [complete]
- Tambah key `python.*`, `networking.*`, `java.*`, `sqlserver.*`, `hacking.*` ke dictionaries.ts (id + en)
- Key yang hilang: title, subtitle, install.title, install.windows/linux/macos/jupyter, run.title, run.file/interactive/jupyter, {topic}.title/desc/soal.{n}

### Phase 3: Meta Description [complete]
- Update default description di BaseLayout.astro
- Tambah prop description di halaman tutorial

### Phase 4: Narasi Edukatif Tutorial [complete]
- Tambah penjelasan naratif di python.astro (dan halaman tutorial lain)
- Bukan hanya latihan — tambah konteks "kenapa" dan "bagaimana"

### Phase 5: sitemap.xml + robots.txt [complete]
- Buat public/sitemap.xml
- Buat public/robots.txt

## Verification Results (2026-10-14)
- `npm run build` sukses, 6 halaman ter-generate
- Canonical URL: `https://choirulhaq.com/` dan `https://choirulhaq.com/python/` ✓
- Meta description: "Profil Choirul Haq — Tech Enthusiast, tutorial Python/Networking, dan project AI/Ekonomi Indonesia" ✓
- sitemap.xml (882B) + robots.txt (68B) ter-copy ke dist/ ✓
- Narasi edukatif ter-render di HTML ("bahasa pemrograman serbaguna", "Object-Oriented Programming") ✓

## Errors
| Error | Attempt | Resolution |
|-------|---------|------------|
