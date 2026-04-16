# Changelog

All notable changes to this project will be documented in this file.

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
