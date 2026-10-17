# Findings

## Struktur MiniProjects.astro
- Array `miniProjects` dengan 4 entry existing
- Setiap card: titleKey, descKey, techStack, link, badge, badgeColor, fallbackTitle, fallbackDesc
- Render pakai `data-i18n` attributes untuk title dan desc
- Grid: 1 col mobile, 2 col md, 3 col lg

## Struktur dictionaries.ts
- 2 bahasa: `id` dan `en`
- Key pattern: `miniproject.{name}.title` dan `miniproject.{name}.desc`
- Client-side switcher pakai `data-i18n` attributes

## Pola Card Existing
| Card | Badge | Color | Tech Stack |
|------|-------|-------|------------|
| CRUD | CRUD | bg-indigo-600 | Python, Flask, SQLite, Jinja2 |
| CV | CV | bg-purple-600 | Python, OpenCV, EasyOCR, PyTorch |
| Economy | ECON | bg-emerald-600 | Python, Flask, Plotly, APScheduler, SQLite, World Bank API |
| LogicSim | LOGIC | bg-cyan-600 | Python, Flask, HTML5 Canvas, JavaScript, IEEE ANSI |

## Shop Card (New)
- Badge: SHOP
- Color: bg-amber-600 (unik, tidak konflik)
- Tech: Astro, Cloudflare Worker, D1, KV, Hono
- Link: https://shop.choirulhaq.com
