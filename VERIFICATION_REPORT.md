# Risk Management Consultants (RMC) — Cross-File Verification Report

**Target Workspace:** `f:\RMC`  
**Verified By:** `@verifier`  
**Overall Result:** **PASS** (all checks passed after final fixes in swarm board `#19`, `#20`, and `#25`)

---

## 1. Executive Summary

| Audit Check | Outcome | Observed Result |
|---|---|---|
| `modern-web-guidance legacy-scan . --json` | **PASS** | `totalFindings: 0` across `35` active rules / `33` active guides (exit code `0`) |
| JS Module Syntax (`node --check`) | **PASS** | `0` syntax errors across `main.js`, `home.js`, `services.js`, `case-studies.js` |
| `<link>`, `<script>`, Asset & Anchor Integrity | **PASS** | `0` broken local refs, `0` broken `#anchor` refs, `0` duplicate IDs, `0` broken ARIA/popover/command IDs |
| JS-to-HTML Selector, ID, `name` & `data-*` Binding | **PASS** | `0` missing IDs (`53` checked), `0` missing selectors, `0` missing static `name` / `data-*` attributes |
| CSS-to-HTML & JS Class Coverage | **PASS** | `0` unstyled HTML classes (`446` page class usages audited), `0` unstyled JS-toggled classes |
| `<summary>` Heading Audit | **PASS** | `0` heading tags (`<h1>`–`<h6>`) inside `<summary>` across `10` accordions (`6` home, `4` contact) |
| HTML5 & SVG Structural Checks | **PASS** | `1` `<h1>` per page, `0` skipped heading levels, `0` flow children in `<output>`, inline SVG text within box bounds |
| RMC Company Facts & Domain Alignment | **PASS** | Verified Karachi HQ, `2016` founding, `2–10` specialists, `3` phones, and `0` financial/ERM drift terms |

---

## 2. `modern-web-guidance` `legacy-scan` & Baseline Compliance

Command executed after all builder edits completed:

```powershell
npx.cmd --yes modern-web-guidance@latest legacy-scan . --json
```

Observed output:
- `targetDir`: `.`
- `totalFindings`: `0`
- `guides`: `[]`
- `activeRuleCount`: `35`
- `activeGuideCount`: `33`

### Manual CSS & Modern Platform Verification

- **Cascade Layers (`styles/main.css`):** Explicit `@layer reset, base, theme, components, utilities;` imports `tokens.css`, `base.css`, `layout.css`, and `components.css`.
- **Adaptive Color Scheme (`styles/tokens.css`, all 5 HTML heads):** `<meta name="color-scheme" content="light dark">` on every page; `color-scheme: light dark` in `tokens.css` paired with `light-dark()` inside `@supports (color: light-dark(...))` and `@media (prefers-color-scheme: dark)` fallback tokens.
- **Fluid `clamp()` Bounds:** All `20` `clamp()` declarations across `styles/tokens.css` (`7`), `styles/layout.css` (`1`), and `styles/components.css` (`12`) remain within the `max <= 2.5 * min` ceiling (observed ratios range from `1.14x` to `2.50x`).
- **Layout Anti-Pattern Check:** Zero `100vh` usages, zero `overflow: hidden` on `html` or `body`, and zero universal `* { margin: 0; padding: 0; }` resets (`base.css` uses `:where()` selectors).
- **Progressive Enhancement Verification:** `flex-wrap: balance` in `styles/components.css` follows `flex-wrap: wrap` as an intentional progressive enhancement documented in `.agents/skills/modern-web-guidance/guides/css/css-layout.md`.

---

## 3. File, `<link>`, `<script>`, & Asset Integrity

All 5 HTML entry pages link existing project files cleanly:
- **Favicon:** `<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">` on all 5 pages (`assets/favicon.svg` and `assets/logo.svg` verified on disk; navbar renders an inline adaptive `<svg class="rmc-mark">` emblem).
- **Render Synchronization:** `<link rel="expect" href="#main-content" blocking="render">` present on all 5 pages, matched by `id="main-content"` (`hasMainId: true`).
- **Stylesheet Entry:** `<link rel="stylesheet" href="styles/main.css">` on all 5 pages (`styles/main.css` imports `./tokens.css`, `./base.css`, `./layout.css`, `./components.css`).
- **Module Scripts (`node --check` passed exit `0` on all 4):**
  - `scripts/main.js` loaded on all 5 pages
  - `scripts/home.js` loaded on `index.html`
  - `scripts/services.js` loaded on `services.html`
  - `scripts/case-studies.js` loaded on `case-studies.html`
- **Shared Chrome Consistency:** Across all 5 HTML files, the comment-normalized `<header>`, `<footer>`, and `<dialog id="consultation-modal">` each have a unique count of `1`, with `aria-current="page"` matched to the active page.
- **Prefill Option Alignment:** All `data-service-prefill` values on consultation triggers match valid `<option>` values in `#modal-service` (`ehs-audits`, `ehs-systems`, `wastewater`, `fire-suppression`, `fire-detection`, `fire-investigation`) with `0` invalid prefills.

---

## 4. JS-to-HTML ID, Selector, `name`, & `data-*` Audit

Every DOM ID, selector, input `name`, and `data-*` attribute queried across the four ES modules matches the HTML markup:

| Script | Target HTML | IDs Verified | `name`s Verified | `data-*` & Selectors Verified |
|---|---|---|---|---|
| `scripts/main.js` | Shared across 5 pages | `6` (`site-header`, `site-menu`, `consultation-modal`, `modal-service`, `modal-scope`, `consultation-modal-form`) | `company`, `service` (plus dynamic `<details name>`) | `data-year`, `data-open-consultation`, `data-service-prefill`, `data-scope-prefill`, `.site-header`, `.header-inner`, `.menu-button`, `.form-status`, `dialog[open]`, `.field-error`, `.scroll-reveal` |
| `scripts/home.js` | `index.html` | `21` (`risk-pulse-matrix` through `home-filter-count`) | `sector`, `fire`, `wastewater`, `ehs`, `forensics`, `home-benchmark-filter` | `data-sector`, `data-service-prefill`, `data-scope-prefill`, `data-points`, `data-tier`, `data-category`, `.filter-section`, `.card-shell`, `.case-card`, `svg`, `path` |
| `scripts/services.js` | `services.html` | `8` (`scope-estimator`, `scope-estimator-form`, `est-discipline`, `est-timeline`, `est-mobilization`, `est-docs`, `est-clearances`, `est-lock-cta`) | `discipline`, `engagement`, `scale`, `region` | `data-service-prefill`, `data-scope-prefill` |
| `scripts/case-studies.js` | `case-studies.html` | `18` (`case-filter-form` through `dossier-modal-cta`) | `category` | `data-category`, `data-sector`, `data-case-id`, `data-service-prefill`, `data-scope-prefill`, `.card-shell` |

**Result:** `0` missing IDs, `0` missing static `name`s, `0` missing `data-*` attributes, and `0` missing CSS selectors.

---

## 5. CSS-to-HTML & JS Class Coverage

- **HTML Classes:** `index.html` (`121` unique classes), `services.html` (`81`), `case-studies.html` (`90`), `about.html` (`85`), and `contact.html` (`69`) all had `unstyledClasses: []`.
- **JS-Toggled & Generated Classes:** All runtime classes manipulated by `scripts/*.js` (`.is-measuring`, `.is-wide`, `.is-error`, `.user-invalid-fallback`, `.user-valid-fallback`, `.visually-hidden`, `.is-hidden`, `.case-metric-item`, `.case-metric-label`, `.case-metric-val`) and popover fallback selector `.\:popover-open` have matching rules across `styles/layout.css` and `styles/components.css`.

---

## 6. Accessibility, Semantics, & `<summary>` Heading Check

- **`<summary>` Elements:** `6` `<summary>` elements in `index.html` and `4` in `contact.html` (`0` in `services.html`, `case-studies.html`, `about.html`). **Zero** heading elements (`<h1>`–`<h6>`) appear inside any `<summary>`.
- **Heading Hierarchy:** Each page contains exactly `1` `<h1>` (`27`, `12`, `9`, `20`, and `6` total headings across `index.html`, `services.html`, `case-studies.html`, `about.html`, and `contact.html` respectively) with `0` skipped heading levels.
- **`<output>` Content Model:** `#diagnostic-score` (`index.html`) and `#est-timeline` (`services.html`) contain strictly phrasing content with `0` flow-level child tags.
- **SVG & Link Hygiene:** `0` inaccessible `<svg>` elements (`aria-hidden="true"` on decorative icons; `role="img"` + `aria-labelledby="<title-id>"` on schematics and diagrams), `0` unsafe external links missing `noopener`, and `0` placeholder strings (`Lorem`/`TODO`/`TBD`).

---

## 7. RMC Verified Company Reality Check

All 5 pages preserve verified Risk Management Consultants (RMC) facts with zero drift into off-domain financial/banking ERM terminology:
- **HQ Address:** `Office M-1, Fareed Chambers, Abdullah Haroon Road, Saddar, Karachi, Sindh 74400` present across all 5 pages.
- **Phones (`tel:+92...`):** `0316-9043273`, `0316-9043272`, and `0323-3963928` linked with valid `tel:+923169043273`, `tel:+923169043272`, and `tel:+923233963928` hrefs across all 5 pages.
- **Identity & Scale:** Founded `2016`, `2–10` specialist engineer team (`index.html`, `about.html`), and core industrial EHS, ISO 45001/14001 systems, Wastewater Treatment (ETP/STP), Fire Suppression/Hydrant, Fire Detection (FACP), and NFPA 921 Fire Investigation practices.
- **Banned Off-Domain Terms (`SBP`, `SECP`, `COSO`, `ISO 31000`, `NDMA`, `IFC`, `banking`, `financial ERM`):** `0` occurrences (`bannedHits: {}`) across all 5 HTML pages.

---

## 8. Defects Identified & Resolved During Audit

During initial verification (`#18`) and live browser QA (`#24`), `7` defects were flagged to their respective file owners and re-verified clean after `#19`, `#20`, and `#25`:

1. **`styles/components.css` — `[hidden]` vs. `.stack-sm` Cascade Specificity (`@design-system`, `#19`):** `#case-empty-state` (`class="filter-empty stack-sm mt-lg" hidden`) had `[hidden]` in `@layer base` overridden by `.stack-sm { display: grid; }` in `@layer utilities`. Fixed by adding `.filter-empty[hidden] { display: none; }` in `@layer components` and placing `[hidden] { display: none; }` at the end of `@layer utilities`.
2. **`styles/layout.css` — Missing `.footer-brand` and `.footer-col` Rules (`@design-system`, `#19`):** Added explicit grid/alignment styling `.footer-brand, .footer-col { display: grid; align-content: start; gap: var(--space-xs); min-inline-size: 0; }`.
3. **`styles/components.css` — Missing JS Validation Fallback Classes (`@design-system`, `#19`):** Added `.user-invalid-fallback` and `.user-valid-fallback` alongside `:user-invalid` / `:user-valid` and updated `.field-group:has(...) > label`.
4. **`styles/components.css` — Full-Row Hit Targets for Choice & Checkbox Labels (`@design-system`, `#19`):** Added `flex: 1; cursor: pointer;` on `.choice-option label` and `.checkbox-item label`.
5. **`services.html` — Invalid Flow Content Inside `<output id="est-result">` (`@pages-builder`, `#20`):** Replaced the outer `<output id="est-result">` wrapper with `<div id="est-result" aria-live="polite" class="stack-md">`, retaining valid phrasing-only `<output id="est-timeline" for="est-discipline" form="scope-estimator-form">`.
6. **`services.html` — Inline SVG Text Bounds (`@pages-builder`, `#20`):** Adjusted `<rect>` geometry and monospace `font-size` (`9.5`–`10`) across the inline schematics (`#svg-audit-title`, `#svg-systems-title`, `#svg-etp-title`, `#svg-hydrant-title`, `#svg-facp-title`, `#svg-forensics-title`) so labels fit cleanly inside their bounding frames.
7. **`styles/layout.css` — Contained `.card-shell` + Nested `subgrid` Track Collapse (`@design-system`, `#24` -> `#25`):** Replaced `grid-row: 1 / -1; grid-template-rows: subgrid;` on `.card-shell > :is(.practice-card, .case-card)` (which collapsed `.card-top`, `h3`, `.card-body`, and `.card-footer` inside layout-contained `.card-shell` wrappers) with explicit 4-row tracks (`display: grid; grid-template-rows: auto auto 1fr auto; row-gap: var(--space-s); block-size: 100%; min-inline-size: 0;`) matching the 4 direct children in all `.practice-card` and `.case-card` markup, while keeping `subgrid` scoped to direct `.card-grid > :is(.practice-card, .case-card)` children and `display: grid` on `.card-shell`.
