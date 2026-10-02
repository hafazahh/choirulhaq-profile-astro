# Task Plan: Link Kartu Python Tutorial ke /python#dasar

## Goal
Menambahkan link dari kartu "Python" di section Tutorial (Projects.astro) ke halaman `/python#dasar` (Dasar Python).

## Current State
- `Projects.astro` memiliki array `tutorials` dengan 5 kartu (Python, Java, SQL Server, Networking, Hacking)
- Kartu Python saat ini TIDAK memiliki link
- `python.astro` sudah memiliki section dengan `id="dasar"` (Dasar Python)
- `index.astro` mengimpor dan menampilkan komponen `Projects`

## Implementation Plan

### Phase 1: Tambah properti link di data tutorial
**File:** `src/components/Projects.astro`
- Tambahkan properti `link: "/python#dasar"` pada objek tutorial Python di array `tutorials`

### Phase 2: Bungkus konten kartu dengan anchor
**File:** `src/components/Projects.astro`
- Bungkus konten kartu Python dengan `<a href={tutorial.link}>` agar seluruh kartu bisa diklik
- Atau tambahkan link eksplisit di dalam kartu (misal: "Mulai Belajar →")

### Phase 3: Verifikasi
- Pastikan anchor `#dasar` sudah ada di `python.astro` (sudah ada: `id="dasar"`)
- Test bahwa link berfungsi dengan benar

## Files to Modify
- `src/components/Projects.astro` — tambah link di kartu Python

## Files to Verify (read-only)
- `src/pages/python.astro` — pastikan `id="dasar"` sudah ada
- `src/pages/index.astro` — pastikan Projects diimpor dengan benar
