export const dictionaries = {
  id: {
    "hero.name": "Choirul Haq",
    "hero.tagline": "Tech Enthusiast & Lifelong Learner",
    "hero.ctaHobi": "Lihat Hobi",
    "hero.ctaMiniProject": "Mini Project",
    "hero.ctaContact": "Hubungi Saya",
    "about.title": "Tentang Saya",
    "about.p1": "Halo! Saya Choirul Haq, seorang teknolog yang tertarik pada pemrograman, jaringan komputer, dan teknologi drone. Saya percaya belajar adalah perjalanan seumur hidup.",
    "about.p2": "Dengan pengalaman di Java, Python, PHP, dan simulasi jaringan menggunakan Cisco Packet Tracer serta PNETLab, saya selalu berusaha mengembangkan keterampilan teknis dan kreativitas saya.",
    "about.p3": "Di luar teknologi, saya gemar menambah bacaan buku tema apa pun — dari fiksi hingga non-fiksi. Saya juga senang melatih daya pikir dengan belajar beberapa buku matematika.",
    "hobi.title": "Hobi",
    "hobi.pemrograman.title": "Pemrograman",
    "hobi.pemrograman.desc": "Mengembangkan logika dan kreativitas melalui berbagai bahasa pemrograman.",
    "hobi.networking.title": "Networking",
    "hobi.networking.desc": "Belajar simulasi jaringan komputer dengan tools industri.",
    "hobi.drone.title": "Drone",
    "hobi.drone.desc": "Mengeksplorasi dunia drone — foto, video, dan teknologi UAV.",
    "hobi.membaca.title": "Membaca Buku",
    "hobi.membaca.desc": "Menemukan ide baru dan inspirasi dari halaman buku.",
    "tutorial.title": "Tutorial",
    "tutorial.python.title": "Python",
    "tutorial.python.desc": "Tutorial pemrograman Python dari dasar hingga lanjutan.",
    "tutorial.java.title": "Java",
    "tutorial.java.desc": "Tutorial pemrograman Java untuk aplikasi desktop dan web.",
    "tutorial.sqlserver.title": "Database SQL Server",
    "tutorial.sqlserver.desc": "Tutorial database SQL Server — desain, query, dan administrasi.",
    "tutorial.networking.title": "Networking",
    "tutorial.networking.desc": "Tutorial jaringan komputer dengan Cisco Packet Tracer dan PNETLab.",
    "tutorial.hacking.title": "Hacking",
    "tutorial.hacking.desc": "Tutorial ethical hacking dan keamanan siber.",
    "miniproject.title": "Mini Project",
    "miniproject.view": "Lihat Project",
    "miniproject.crudTestopencode.title": "CRUD Testopencode",
    "miniproject.crudTestopencode.desc": "Aplikasi web CRUD Item dengan Python (Flask) + SQLite + Auth System + Role-Based Access Control. Fitur: login/logout, user management, role management dengan permission checkboxes, CRUD items/kategori/pelanggan, auto-deploy ke Render + Cloudflare.",
    "contact.title": "Hubungi Saya",
    "footer.backToHome": "← Kembali ke Profil",
  },
  en: {
    "hero.name": "Choirul Haq",
    "hero.tagline": "Tech Enthusiast & Lifelong Learner",
    "hero.ctaHobi": "View Hobbies",
    "hero.ctaMiniProject": "Mini Project",
    "hero.ctaContact": "Contact Me",
    "about.title": "About Me",
    "about.p1": "Hello! I'm Choirul Haq, a technologist interested in programming, computer networks, and drone technology. I believe learning is a lifelong journey.",
    "about.p2": "With experience in Java, Python, PHP, and network simulation using Cisco Packet Tracer and PNETLab, I always strive to develop my technical skills and creativity.",
    "about.p3": "Outside of technology, I love adding reading material on any topic — from fiction to non-fiction. I also enjoy training my thinking by studying mathematics books.",
    "hobi.title": "Hobbies",
    "hobi.pemrograman.title": "Programming",
    "hobi.pemrograman.desc": "Developing logic and creativity through various programming languages.",
    "hobi.networking.title": "Networking",
    "hobi.networking.desc": "Learning computer network simulation with industry tools.",
    "hobi.drone.title": "Drone",
    "hobi.drone.desc": "Exploring the world of drones — photos, videos, and UAV technology.",
    "hobi.membaca.title": "Reading Books",
    "hobi.membaca.desc": "Finding new ideas and inspiration from book pages.",
    "tutorial.title": "Tutorials",
    "tutorial.python.title": "Python",
    "tutorial.python.desc": "Python programming tutorial from basics to advanced.",
    "tutorial.java.title": "Java",
    "tutorial.java.desc": "Java programming tutorial for desktop and web applications.",
    "tutorial.sqlserver.title": "Database SQL Server",
    "tutorial.sqlserver.desc": "SQL Server database tutorial — design, queries, and administration.",
    "tutorial.networking.title": "Networking",
    "tutorial.networking.desc": "Computer networking tutorial with Cisco Packet Tracer and PNETLab.",
    "tutorial.hacking.title": "Hacking",
    "tutorial.hacking.desc": "Ethical hacking and cybersecurity tutorial.",
    "miniproject.title": "Mini Project",
    "miniproject.view": "View Project",
    "miniproject.crudTestopencode.title": "CRUD Testopencode",
    "miniproject.crudTestopencode.desc": "Aplikasi web CRUD Item dengan Python (Flask) + SQLite + Auth System + Role-Based Access Control. Fitur: login/logout, user management, role management dengan permission checkboxes, CRUD items/kategori/pelanggan, auto-deploy ke Render + Cloudflare.",
    "contact.title": "Contact Me",
    "footer.backToHome": "← Back to Profile",
  },
};

export type Lang = keyof typeof dictionaries;

export function getLang(): Lang {
  if (typeof window === "undefined") return "id";
  const stored = localStorage.getItem("lang");
  return stored === "en" ? "en" : "id";
}

export function setLang(lang: Lang) {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  window.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}

export function t(path: string): string {
  const lang = getLang();
  return dictionaries[lang][path] ?? path;
}
