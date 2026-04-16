# Attribute Reporter

A Chrome DevTools extension that inspects child elements by attribute name and gives you instant access to their values, CSS selectors, and XPath expressions.

Select any element in the **Elements** panel, switch to the **Attribute Reporter** tab, and see a live list of all matching children — sortable, searchable, and copyable.

---

## Features

- 🔍 **Target any attribute** — type a custom name or use the `class` / `id` / `data-testid` shortcut badges
- 📋 **Copy value, CSS selector, or XPath** per row with a single click
- 📦 **Copy All as JSON** — click the item count badge to export all results (element, value, CSS selector, XPath)
- 🔢 **Item count badge** — see at a glance how many matching children were found
- ✏️ **Inspect / expand** — jump directly to a child element in the Elements panel
- 🔄 **Sortable list** — sort by element name, attribute value, or index
- 💬 **Empty state** — clear message when no matching children are found

## Installation (unpacked)

1. Run `npm install && npm run build-all`
2. Open Chrome → `chrome://extensions` → enable **Developer mode**
3. Click **Load unpacked** and select the `attribute-reporter/` folder
4. Open DevTools on any page → **Elements** tab → **Attribute Reporter** panel

## Development

```bash
npm install
npm run build-all   # builds content script + Vue app
```

- `src/` — Vue 3 DevTools panel (Vite + TypeScript)
- `src-content-scripts/` — content script injected into the inspected page (compiled separately via `tsconfig.content.json`)
- `public/` — static assets, manifest, and compiled content script

## License

[MIT](./LICENSE) © Damiano Fusco

