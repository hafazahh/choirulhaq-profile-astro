import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Koleksi artikel tutorial.
 *
 * Aturan file: satu artikel = satu file .md di src/content/artikel/, namanya
 * menjadi slug URL. Jadi /python/<nama-file>/.
 *
 * Frontmatter yang wajib: judul, tema, ringkasan, tanggal, penulis.
 * - `tema` dipakai mengelompokkan artikel di halaman landing (index tree).
 * - `diverifikasi` mencatat versi Python tempat kode contoh dijalankan; ini
 *   yang membuat output pada artikel bisa dipercaya dan dicatat ulang.
 */
const artikel = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/artikel" }),
  schema: z.object({
    judul: z.string(),
    tema: z.string(),
    ringkasan: z.string(),
    tanggal: z.coerce.date(),
    penulis: z.string().default("Choirul Haq"),
    bahasa: z.enum(["id", "en"]).default("id"),
    diverifikasi: z.string().optional(),
    durasiBaca: z.number().optional(),
  }),
});

export const collections = { artikel };