# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] — 2026-04-17

### Added

- **∅ Missing toggle** — Switch between "elements that have the attribute" and "elements that are missing it entirely" (e.g. find all `<button>` without `aria-label`)
- **Element-type filter** — Dynamic badge row showing distinct element types in the current result set; multi-select to narrow down (e.g. show only `button` and `input`). Appears automatically when 2+ types are present. Composes with the missing toggle.
- **`aria-label` shortcut badge** — Added alongside `class`, `id`, `data-testid`
- **Status indicators** — Every row in the list now shows a colour-coded emoji in the value column: 🟢 OK · 🟡 Duplicate value · 🟠 Empty value · 🔴 Missing attribute. Hover for a description.
- **Duplicate value detection** — Rows sharing the same attribute value are highlighted in yellow
- **Empty value detection** — Rows where the attribute exists but is blank (`attr=""`) are highlighted in orange, distinct from missing
- **`[missing]` / `[empty]` placeholders** — Value column shows an italic placeholder instead of blank space for missing/empty rows
- **Copy as CSV** — Green "CSV" badge next to the JSON count badge; copies `element,attributeName,attributeValue,cssSelector` (RFC-4180 quoted) for the current filtered view
- **Persist last attribute name** — Target attribute is saved to `localStorage` and restored on next DevTools open; defaults to `data-testid`
- **Full version string** — Panel header now shows the full semver (e.g. `v2.1.0`) instead of truncating to major.minor

### Fixed

- List height now fills the available DevTools panel height instead of being capped at 300px
- Scrollbar gutter reserved with CSS (`scrollbar-gutter: stable`) — list header stays aligned whether or not the scrollbar is visible
- `content-script.js` was not compiled as part of `npm run build`; build script reorganised so `npm run build` always runs the full pipeline (prettier → content script → vite)
- `attributeNotSet` now correctly distinguishes absent attributes (`attr === null`) from empty ones (`attr=""`)

## [2.0.0] — 2026-04-16

### ⚡ Major upgrade

Complete toolchain rewrite: Vue 3, TypeScript 6, Vite 8, Manifest V3.

### Added

- **Attribute shortcuts** — Badge buttons (`class`, `id`, `data-testid`) for one-click switching of the target attribute
- **Copy CSS Selector** — Per-row action copies e.g. `button[data-testid="submit"]`
- **Copy All as JSON** — Click the item count badge to copy all results (element, value, CSS selector, XPath) as a JSON array
- **Item count badge** — Shows the number of matching child elements next to the attribute input
- **Empty state message** — Clear feedback when the selected element has no matching children

### Fixed

- SVG elements no longer crash the panel (`className` is an `SVGAnimatedString`, not a string)
- Element highlight outline renamed to `.ar-highlight-item` to avoid colliding with inspected-page styles
- Hanging promise / unhandled rejections in the DevTools panel on page load
- `inspect()` calls via `evalOnInspectedPage` no longer trigger *"Object reference chain is too long"* errors
- Content script no longer throws `SyntaxError` on pages where it was already injected

### Security / Privacy

- Removed `scripting` permission and `<all_urls>` host permission — the extension now requires **no special permissions**

---

## [1.8.0] and earlier

Legacy Vue 2 / Webpack builds. See git history for details.
