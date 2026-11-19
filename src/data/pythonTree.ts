/**
 * Struktur menu Tutorial Python.
 *
 * Satu sumber kebenaran untuk sidebar tree. Halaman `/python/` dan semua
 * halaman `/python/<slug>/` membaca berkas ini, jadi menambah bab atau
 * artikel cukup di satu tempat.
 *
 * `kind` menentukan badge dan apakah item bisa diklik:
 *   - artikel : materi panjang yang ditulis dari nol, kode dijalankan dulu
 *   - panduan : halaman persiapan (instalasi, pengenalan)
 *   - latihan : kumpulan soal latihan
 *   - segera  : belum ada halaman — tampil sebagai rencana, bukan tautan
 *
 * Item `segera` sengaja TIDAK dibuatkan halaman. Halaman kosong hanya
 * menambah konten tipis, dan itu justru yang ditolak AdSense.
 */

export type Kind = "artikel" | "panduan" | "latihan" | "segera";

export interface TreeItem {
  label: string;
  slug?: string;
  kind: Kind;
}

export interface TreeSection {
  id: string;
  label: string;
  items: TreeItem[];
}

export const TREE: TreeSection[] = [
  {
    id: "pengenalan",
    label: "1. Pengenalan & Instalasi",
    items: [
      { label: "Apa itu Python?", slug: "pengenalan-python", kind: "panduan" },
      { label: "Instalasi Python", slug: "instalasi-python", kind: "panduan" },
      { label: "Editor & IDE", kind: "segera" },
    ],
  },
  {
    id: "dasar",
    label: "2. Dasar-Dasar Python",
    items: [
      {
        label: "Variabel & Tipe Data",
        slug: "variabel-dan-tipe-data-python",
        kind: "artikel",
      },
      {
        label: "Operator & Prioritas",
        slug: "operator-python-dan-prioritas",
        kind: "artikel",
      },
      { label: "Control Flow (if/loop)", kind: "segera" },
      { label: "Fungsi", kind: "segera" },
      { label: "List, Tuple, Dict, Set", kind: "segera" },
      { label: "Manipulasi String", kind: "segera" },
      { label: "Penanganan Error", kind: "segera" },
      { label: "Latihan Dasar", slug: "latihan-dasar-python", kind: "latihan" },
    ],
  },
  {
    id: "intermediate",
    label: "3. Intermediate",
    items: [
      { label: "File I/O", kind: "segera" },
      { label: "Modules & Packages", kind: "segera" },
      { label: "Comprehension & Generator", kind: "segera" },
      { label: "Decorators", kind: "segera" },
      { label: "Context Manager", kind: "segera" },
      { label: "Datetime", kind: "segera" },
      { label: "Regular Expression", kind: "segera" },
    ],
  },
  {
    id: "oop",
    label: "4. OOP",
    items: [
      { label: "Latihan OOP", slug: "latihan-oop", kind: "latihan" },
      { label: "Class & Object", kind: "segera" },
      { label: "Inheritance", kind: "segera" },
      { label: "Encapsulation", kind: "segera" },
      { label: "Magic Methods", kind: "segera" },
      { label: "Dataclass", kind: "segera" },
    ],
  },
  {
    id: "web",
    label: "5. Web Development",
    items: [
      { label: "Latihan Flask & FastAPI", slug: "latihan-web-framework", kind: "latihan" },
      { label: "Flask", kind: "segera" },
      { label: "FastAPI", kind: "segera" },
      { label: "Jinja2 Template", kind: "segera" },
      { label: "Database", kind: "segera" },
      { label: "Autentikasi", kind: "segera" },
    ],
  },
  {
    id: "ds",
    label: "6. Data Science",
    items: [
      { label: "Latihan Pandas & NumPy", slug: "latihan-data-science", kind: "latihan" },
      { label: "NumPy", kind: "segera" },
      { label: "Pandas", kind: "segera" },
      { label: "Visualisasi", kind: "segera" },
      { label: "Data Cleaning", kind: "segera" },
      { label: "EDA", kind: "segera" },
    ],
  },
  {
    id: "ml",
    label: "7. Machine Learning",
    items: [
      { label: "Latihan scikit-learn", slug: "latihan-machine-learning", kind: "latihan" },
      { label: "scikit-learn", kind: "segera" },
      { label: "Regression", kind: "segera" },
      { label: "Classification", kind: "segera" },
      { label: "Evaluasi Model", kind: "segera" },
      { label: "Pipeline", kind: "segera" },
    ],
  },
  {
    id: "lanjutan",
    label: "8. Topik Lanjutan",
    items: [
      { label: "Async / Await", kind: "segera" },
      { label: "Testing (pytest)", kind: "segera" },
      { label: "Type Hints", kind: "segera" },
      { label: "Performance", kind: "segera" },
      { label: "Packaging", kind: "segera" },
      { label: "Best Practices", kind: "segera" },
    ],
  },
  {
    id: "proyek",
    label: "9. Proyek Praktik",
    items: [
      { label: "CLI Tool", kind: "segera" },
      { label: "Web App", kind: "segera" },
      { label: "Analisis Data", kind: "segera" },
      { label: "Mini ML Project", kind: "segera" },
    ],
  },
];

export const BADGE: Record<Kind, string | null> = {
  artikel: "Artikel",
  panduan: "Panduan",
  latihan: "Latihan",
  segera: null,
};

/** Semua slug yang punya halaman, untuk pembangunan rute statis. */
export const CONTENT_SLUGS = TREE.flatMap((s) =>
  s.items.filter((i) => i.slug && i.kind !== "segera").map((i) => i.slug!)
);

/** Nama bab tempat sebuah slug berada — dipakai breadcrumb dan schema. */
export function sectionOfSlug(slug: string): TreeSection | undefined {
  return TREE.find((s) => s.items.some((i) => i.slug === slug));
}