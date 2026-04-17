# v2.1.1 — Config Cleanup, Popup Vue Migration & Tailwind CSS v4

## Problem & Approach

Three incremental improvements to modernise the extension's DX and style system:

1. **Config audit** – tighten vite.config.ts and all tsconfigs for correctness and build performance before adding complexity.
2. **Popup Vue migration** – move `public/popup.html` (static HTML with inline styles) into the Vite build as a proper second entry point, enabling full Vue + TS DX.
3. **Tailwind CSS v4** – replace the hand-rolled global styles in `App.vue` and component `<style>` blocks with Tailwind utility classes.

---

## Phase 1 — Config Cleanup & Build Performance

### vite.config.ts
- Remove redundant dual `path` import (`import path from 'path'` AND `import { resolve } from 'path'`) → consolidate to one
- Remove dead comment `//{ src: 'public/icons', dest: '.' }`
- Add explicit `build.target: 'es2022'` (Manifest V3 / Chrome supports it; aligns with tsconfig targets)
- Prepare `rollupOptions.input` as named map (required for Phase 2 multi-entry)
- Review `external: ['icon-32.png', './icon-32.png']` — icons should be served as static assets, not externalized

### tsconfig.json (main app)
- Remove `"jsx": "preserve"` — not needed for `.vue` SFC files; Vue templates are handled by the Vite plugin, not tsc
- Consider adding `"verbatimModuleSyntax": true` (TS 5+ best practice; avoids import elision bugs)

### tsconfig.content.json
- Upgrade `"target": "ES2019"` → `"ES2022"` (Manifest V3 targets modern Chrome; consistent with main tsconfig)
- No other changes needed (outputs to `public/`, separate from the Vue build)

### tsconfig.node.json
- Add `"resolveJsonModule": true` (vite.config.ts already reads package.json via `readFileSync`/JSON.parse; not strictly needed but consistent)
- No structural changes needed

---

## Phase 2 — Popup Vue Migration

### Strategy
Keep Vite's "multi-page app" pattern: both HTML entry files at the **project root**, Vue source under `src/`.

```
popup.html          ← new Vite entry (alongside existing index.html)
src/
  popup/
    main.ts         ← popup Vue app bootstrap
    PopupApp.vue    ← popup UI component (replaces the static HTML)
```

### Steps
1. Create `popup.html` at project root referencing `src/popup/main.ts`
2. Create `src/popup/main.ts` + `src/popup/PopupApp.vue` with the same content as the current static popup
3. Update `vite.config.ts` `rollupOptions.input` to include both `index.html` and `popup.html`
4. Delete `public/popup.html`
5. Manifest `"default_popup": "popup.html"` stays unchanged ✓
6. Verify the built `attribute-reporter/popup.html` is emitted correctly

### Notes
- `public/content-script.js` and `public/content-script.css` are **not affected** — they are still compiled by `tsc -p tsconfig.content.json` and served as extension assets
- The `viteStaticCopy` for `manifest.json` is unaffected

---

## Phase 3 — Tailwind CSS v4

### Install
```
npm install -D tailwindcss @tailwindcss/vite
```

### Tailwind v4 setup (CSS-first, no config file)
- Add `@tailwindcss/vite` plugin to `vite.config.ts`
- Create `src/style.css` containing `@import "tailwindcss";`
- Import `src/style.css` in both `src/main.ts` and `src/popup/main.ts`

### Style replacements
| Location | What to do |
|---|---|
| `App.vue` `<style>` block | Replace global CSS rules with Tailwind utility classes in component templates; remove `<style>` block |
| `SortButton2.vue` `<style>` block | Replace 6 rules with utility classes; remove `<style>` block |
| `src/popup/PopupApp.vue` | Author with utility classes from the start |
| `public/content-script.css` | **Keep as-is** — runs in page context, not part of the Vue build |
| `index.html` | Remove Google Fonts `<link>` (Tailwind will handle font stack or we configure it) |

### Notes
- Tailwind v4 uses `@import "tailwindcss"` — no `tailwind.config.js` needed
- Dark mode, custom colours, etc. are configured via CSS `@theme` blocks
- The extension UI is a DevTools panel (light bg by default); dark mode strategy TBD

---

## Todos (tracked in SQL)

- [ ] phase1-vite-config — Clean up vite.config.ts
- [ ] phase1-tsconfig-main — Fix tsconfig.json
- [ ] phase1-tsconfig-content — Fix tsconfig.content.json
- [ ] phase1-tsconfig-node — Fix tsconfig.node.json
- [ ] phase1-build-verify — Run `npm run build` and verify output is correct
- [ ] phase2-popup-html — Create root popup.html entry
- [ ] phase2-popup-src — Create src/popup/main.ts + PopupApp.vue
- [ ] phase2-vite-multientry — Update vite.config.ts for multi-entry
- [ ] phase2-cleanup — Delete public/popup.html
- [ ] phase2-build-verify — Run `npm run build` and verify popup in output
- [ ] phase3-install-tailwind — npm install tailwindcss @tailwindcss/vite
- [ ] phase3-vite-plugin — Add @tailwindcss/vite to vite.config.ts
- [ ] phase3-css-entry — Create src/style.css and import in both entry mains
- [ ] phase3-replace-app-styles — Replace App.vue global styles with Tailwind
- [ ] phase3-replace-sortbutton2 — Replace SortButton2.vue styles with Tailwind
- [ ] phase3-build-verify — Run `npm run build`, verify styles look correct
