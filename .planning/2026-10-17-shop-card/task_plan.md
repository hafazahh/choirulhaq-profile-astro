# Task Plan: Tambah Card Shop di Mini Projects

## Goal
Tambah card baru di section Mini Projects (choirulhaq.com) untuk shop.choirulhaq.com dengan narasi bilingual (ID/EN) yang intuitif dan menarik.

## Phases

### Phase 1: Planning & Analysis ✅
- Baca struktur MiniProjects.astro dan dictionaries.ts
- Analisis pola card existing (4 card: CRUD, CV, Economy, LogicSim)
- Tentukan narasi yang sesuai

### Phase 2: Implementation
- Tambah entry di `miniProjects` array di `MiniProjects.astro`
- Tambah translations di `dictionaries.ts` (id + en)
- Pastikan `data-i18n` attributes benar

### Phase 3: Build & Verify
- `npm run build` harus sukses
- Cek `dist/index.html` untuk memastikan card baru ter-render
- Verifikasi translations muncul di HTML

### Phase 4: Deploy
- Git commit + push
- Verifikasi live di choirulhaq.com

## Decisions
- Badge: "SHOP" dengan warna `bg-amber-600` (berbeda dari card lain)
- Tech stack: Astro, Cloudflare Worker, D1, KV, Hono
- Narasi: fokus pada value proposition (produk digital buatan sendiri, buy once use forever)

## Errors
| Error | Attempt | Resolution |
|-------|---------|------------|
