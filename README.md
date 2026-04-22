# Email Studio

A brand-themed, drag-and-drop email template builder with design tokens, per-block overrides, and a developer-friendly custom snippet authoring system.

Built with **Vite + React 18 + Tailwind CSS**. Exports Outlook-safe, mobile-responsive, ESP-ready HTML.

![Email Studio screenshot](./public/favicon.svg)

---

## ✨ Features

- **Drag-and-drop canvas** with 17+ built-in snippets (Hero, Columns, Media, Special, Layout, Header/Footer)
- **Line of Business (LOB) theming** — switch between brand presets (Mercedes-Benz Stadium, Atlanta United, Atlanta Falcons, Corporate) or create your own. Every token (colors, fonts, CTA styles) retheme the canvas instantly.
- **Basic / Advanced edit mode** — Basic edits content; Advanced unlocks per-block overrides for typography, CTAs, padding, image sizing, border radius, and more. One-click reset to LOB defaults.
- **Custom Snippet Studio** — a separate developer page where you paste raw HTML + define a JSON field schema. Snippets save locally and can be exported as JSON files to commit alongside the repo.
- **Persistent** — LOBs, custom snippets, saved templates, and your last session all survive page reloads via `localStorage`.
- **Exports clean HTML** — table-based, Outlook MSO-safe, `@media (max-width:590px)` responsive, ready to paste into Iterable, Mailchimp, SFMC, or any ESP.
- **Keyboard shortcuts**, **undo/redo**, **mobile/desktop preview**, **guided tour**.

---

## 🚀 Getting started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### Install and run

```bash
git clone <your-repo-url>
cd email-studio
npm install
npm run dev
```

The dev server opens at `http://localhost:5173/`.

### Build for production

```bash
npm run build
npm run preview   # optional: serve the built dist/ locally
```

The production bundle lands in `./dist/`.

### Lint and format

```bash
npm run lint
npm run format
```

---

## 📐 Architecture at a glance

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Root component with hash routing (#builder / #studio)
├── index.css                   # Tailwind + global styles
│
├── lobs/
│   └── defaults.js             # Built-in LOB presets with brand tokens
│
├── snippets/
│   ├── builtin.js              # Registry of built-in snippets (JSX Preview + toHTML)
│   ├── customLoader.jsx        # Compiles user-authored {htmlTemplate, fields[]} JSON
│   └── templates.js            # Starter templates (Match Day, Newsletter, Promo)
│
├── lib/
│   ├── tokens.js               # Token resolution helpers (R, headlineStyle, ctaHTML)
│   ├── shell.js                # Final email HTML document builder
│   └── storage.js              # localStorage-backed persistence layer
│
├── components/
│   ├── UI.jsx                  # Glass primitives (ModalShell, Collapsible, sliders, …)
│   ├── SnippetHelpers.jsx      # Shared CTAPreview + EmptyMedia
│   ├── LobModals.jsx           # LOB picker + full editor modal
│   ├── Modals.jsx              # Export / Tour / Shortcuts modals
│   └── PropsPanel.jsx          # Right-rail property editor (handles all snippet types)
│
└── pages/
    ├── Builder.jsx             # Main drag-drop canvas page
    └── SnippetStudio.jsx       # Custom snippet authoring page
```

---

## 🎨 Line of Business (LOB) presets

Open the colored pill in the top bar to switch LOBs. Each LOB controls every design token used across the canvas:

| Token group | Keys |
|---|---|
| Backgrounds | `outerBg`, `canvasBg`, `footerBg` |
| Headings | `h1Color`, `h2Color`, `h3Color`, `h1Size`, `h1Line`, `h1Weight`, `h1Transform`, … |
| Body | `bodyColor`, `bodySize`, `bodyLine`, `bodyWeight` |
| Small / Link / Divider | `smallColor`, `linkColor`, `divider` |
| CTA | `ctaBg`, `ctaColor`, `ctaRadius`, `ctaTransform`, `ctaWeight` |
| Fonts | `fontStack` |
| Misc | `accent`, `textDark`, `textLight` |

To add a permanent LOB to the repo, edit `src/lobs/defaults.js`. User-created LOBs also save to `localStorage` (key `emailstudio:lobs`).

---

## 🧱 Authoring custom snippets

Click **Snippet Studio →** in the top bar (or visit `/#studio`). The studio gives you three views: **Split**, **HTML**, and **Preview**.

### Snippet anatomy

A custom snippet is a JSON document like this:

```json
{
  "id": "promo_banner",
  "label": "Promo Banner",
  "category": "Custom",
  "fields": [
    { "key": "headline", "label": "Headline", "type": "text", "default": "Big News!" },
    { "key": "bg", "label": "Background", "type": "color", "default": "#c3112c" }
  ],
  "htmlTemplate": "<tr><td style=\"background:{{bg}};color:{{|textLight}};padding:24px;font-family:{{|fontStack}};\"><h1 style=\"margin:0;\">{{headline}}</h1></td></tr>"
}
```

### Field types

| `type` | UI control | Stored as |
|---|---|---|
| `text` | single-line input | string |
| `textarea` | multi-line input (set `rows`) | string |
| `url` | single-line input | string |
| `color` | color picker + hex input | hex string |
| `number` | slider (set `min`, `max`, optional `suf`) | number |
| `image` | upload or URL input | data URL or URL string |
| `select` | dropdown (set `options: []`) | string |

### HTML template syntax

Placeholders inside `htmlTemplate`:

- `{{fieldKey}}` — inserts the block's field value, HTML-escaped.
- `{{fieldKey|tokenKey}}` — inserts the field value if set, otherwise falls back to a LOB token (e.g. `{{headlineColor|h1Color}}`).
- `{{|tokenKey}}` — always inserts a LOB token (e.g. `{{|fontStack}}` for the active brand's font).

Because the template renders inside an email `<table>`, your snippet should emit a `<tr>` (or multiple `<tr>`s). The wrapping table is provided by the shell.

### Saving, exporting, and committing to the repo

- **Save** stores the snippet in `localStorage` (key `emailstudio:customSnippets`). It immediately appears in the Builder's palette.
- **Export JSON** downloads `<id>.json` to commit alongside the repo. To ship a custom snippet in the repo (so every teammate gets it without manually importing), create a folder like `src/snippets/custom/`, drop the JSON there, and import+register it in `src/snippets/builtin.js` via `compileCustomSnippet` from `src/snippets/customLoader.jsx`.
- **Import** loads a `.json` file from disk into the editor.

---

## 💾 Persistence

All data is stored client-side via `localStorage`:

| Key | What |
|---|---|
| `emailstudio:lobs` | LOB presets (defaults + user-created) |
| `emailstudio:customSnippets` | Custom snippet definitions |
| `emailstudio:templates` | User-saved templates |
| `emailstudio:lastSession` | Last canvas state (blocks, active LOB, settings) |

To wipe everything, run in the browser console:

```js
Object.keys(localStorage).filter(k => k.startsWith("emailstudio:")).forEach(k => localStorage.removeItem(k));
```

---

## 🚢 Deploying

### GitHub Pages (automatic)

A workflow is included at `.github/workflows/deploy.yml`. On push to `main`:

1. It builds with `BASE_URL=/email-studio/` (change this to match your repo name in the workflow).
2. It publishes `dist/` to GitHub Pages.

To enable: go to **Settings → Pages → Source → GitHub Actions**.

### Any static host (Vercel, Netlify, Cloudflare Pages)

```bash
npm run build
# Upload the contents of `dist/`.
```

If your host serves from a subpath, set `BASE_URL` at build time:

```bash
BASE_URL=/my-subpath/ npm run build
```

---

## ⌨️ Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `⌘Z` / `Ctrl+Z` | Undo |
| `⌘⇧Z` / `Ctrl+Shift+Z` | Redo |
| `⌘S` / `Ctrl+S` | Save current template |
| `⌘E` / `Ctrl+E` | Export HTML |
| `⌘D` / `Ctrl+D` | Duplicate selected block |
| `⌫` / `Delete` | Delete selected block |
| `Esc` | Deselect / close modal |
| `⌘/` / `Ctrl+/` | Show shortcuts panel |

---

## 🛠 Roadmap ideas

- Merge tag / personalization dropdown (`${firstName}`, `${Profile.Email}`, `[@Hosted Type='HTML'/]`)
- Image library with reusable uploads
- Template versioning / history browser
- Real Iterable send-test integration
- Multi-file snippet packages (e.g. commit a folder, auto-register on boot)
- Collaborative editing via backend

---

## 🤝 Contributing

1. Fork → branch → PR.
2. Run `npm run lint && npm run format` before committing.
3. For new snippets:
   - If it's a built-in core snippet, add it to `src/snippets/builtin.js`.
   - If it's brand-specific or one-off, author it in the Snippet Studio and commit the resulting `.json`.

---

## 📄 License

MIT
