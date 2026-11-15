# Modern Web Guidance — Concrete Implementation & Verification Guide

Installed skill location: [SKILL.md](file:///f:/RMC/.agents/skills/modern-web-guidance/SKILL.md) (plus 209 `.md` files in [guides/](file:///f:/RMC/.agents/skills/modern-web-guidance/guides/)).

All website builders must follow the rules below when authoring HTML, CSS, and JavaScript in this workspace.

---

## 1. Using the Installed Skill & Baseline Policy

### Querying Guidance (Windows CLI)
On Windows, use `npx.cmd` from `f:\RMC` (include `--skill-version` on `search`):

```powershell
# Search guides with 2-5 generic action words
npx.cmd --yes modern-web-guidance@latest search "cascade layers oklch" --skill-version 2026_11_09-5bcc021b

# Retrieve a full guide by ID
npx.cmd --yes modern-web-guidance@latest retrieve "dialog"

# List indexed guide IDs and descriptions
npx.cmd --yes modern-web-guidance@latest list
```

### Browser Support Policy (Baseline)
- **Baseline Widely available** (`color-scheme`, `subgrid`, `@container` size queries, `dvh`/`dvw`, `:has()`, `:user-invalid`/`:user-valid`, `<dialog>`): use directly as default platform features.
- **Baseline Newly available** (`light-dark()`, `text-wrap: balance`, `@starting-style`, `transition-behavior`, `popover`, `<details name>`, `::details-content`, `commandfor` invokers, `scrollbar-color`, `scrollbar-gutter`, `scroll-driven animations`): progressive-enhance or pair with `@supports` / lightweight JS fallbacks when core functionality depends on them.
- **Limited availability** (`<dialog closedby>`, `overlay` / discrete `display` exit transition, `interpolate-size`, `text-wrap: pretty`, CSS Anchor Positioning `position-area`/`anchor()`, cross-document `@view-transition`, `accent-color`): **always** guard with `@supports` / feature detection or treat strictly as visual progressive enhancement so Safari/Firefox users never lose functionality.

---

## 2. CSS Architecture & Cascade Layers (`@layer`)

Source guides: `css`

1. **Declare layer order first** at line 1 of your main stylesheet, before importing or writing rules:
   ```css
   @layer reset, base, theme, components, utilities;
   ```
2. **Never use global `*` resets** like `* { margin: 0; padding: 0; }` or `* { all: unset; }`. Keep minimal resets inside `@layer reset` using `:where()` for zero specificity:
   ```css
   @layer reset {
     :where(*, *::before, *::after) { box-sizing: border-box; }
     :where(h1, h2, h3, h4, p, ul, ol, figure, blockquote) { margin: 0; }
     :where(img, svg, video, picture) { display: block; max-inline-size: 100%; }
   }
   ```
3. **Avoid specificity wars and BEM bloat**: rely on `@layer`, shallow native CSS nesting (max 2–3 levels), `:where()` for low-specificity defaults, and `:not()` to prevent overmatching (`li:not(:last-child)`, `button:hover:not(:disabled)`).
4. **Pseudo-element rule**: never place pseudo-elements (`::before`, `::after`) inside `:is()`, `:where()`, or `:has()` — browsers ignore invalid arguments inside those functional pseudo-classes.
5. **Four-tier `:root` tokens**: structure tokens in `@layer theme` from primitives -> semantic aliases -> component defaults -> instance overrides.
6. **Component proximity scoping** (`@scope (.card) to (.content)`): useful for donut scoping (preventing card rules from leaking into nested rich content), paired cleanly with `@layer components`.

---

## 3. Modern Color & Light/Dark Theming

Source guides: `color`, `dark-mode`, `component-specific-light-dark-theme`, `dark-mode-toggle`

### Mandatory `color-scheme` + `light-dark()` Setup
1. Put `<meta name="color-scheme" content="light dark">` inside `<head>` on every page.
2. Declare `:root { color-scheme: light dark; }` in `@layer base` or `@layer theme`.
3. Provide a `@media (prefers-color-scheme: dark)` + `@supports (color: light-dark(white, black))` fallback layer if targeting Baseline Widely available, and ensure **both arguments to `light-dark()` share the same CSS type** (two colors, or two images/gradients):
   ```css
   @layer theme {
     :root {
       color-scheme: light dark;

       --surface-light: oklch(0.985 0.004 250);
       --surface-dark: oklch(0.18 0.03 255);
       --ink-light: oklch(0.22 0.04 255);
       --ink-dark: oklch(0.95 0.005 250);

       /* Baseline Widely available fallback */
       --surface-page: var(--surface-light);
       --text-primary: var(--ink-light);
     }

     @media (prefers-color-scheme: dark) {
       :root {
         --surface-page: var(--surface-dark);
         --text-primary: var(--ink-dark);
       }
     }

     @supports (color: light-dark(white, black)) {
       :root {
         --surface-page: light-dark(var(--surface-light), var(--surface-dark));
         --text-primary: light-dark(var(--ink-light), var(--ink-dark));
       }
     }
   }
   ```

### Component `color-scheme` Override Gotcha (Critical)
- **Never register theme tokens with `@property { syntax: "<color>"; inherits: true; }` when they resolve `light-dark()`** — registered inherited `<color>` tokens compute on `:root` and stop reacting to nested `color-scheme: dark` overrides! Keep color tokens as ordinary custom properties.
- Whenever a band/card overrides `color-scheme` (e.g., dark hero/footer on a light page), **explicitly set `background-color` AND re-declare inherited `<color>` properties** (`color`, `accent-color`) on that element, even to the same token:
  ```css
  .band-dark {
    color-scheme: dark;
    background-color: var(--surface-page);
    color: var(--text-primary);
  }
  ```

### `oklch()` & `color-mix()` Tints/Shades
- **Do not generate tints/shades by altering `oklch()` lightness (`L`) alone** (it shifts perceived hue/chroma awkwardly).
- Always mix perceptually with `color-mix(in oklab, ...)` — if shifting `L` via relative color syntax (`oklch(from ...)`), keep the direct mix/shift balanced (`<= 30%` white/black mix or combining `color-mix(in oklab, oklch(from var(--brand) 0.9 c h), white 30%)`):
  ```css
  --brand-tint: color-mix(in oklab, var(--brand-primary) 16%, var(--surface-page));
  --brand-hover: color-mix(in oklab, var(--brand-primary) 86%, black);
  ```

### Theme Toggle Rules (If Implementing a Toggle)
- Keep `:root { color-scheme: light dark; }` by default.
- Update `<meta name="color-scheme">` (`"light"` or `"dark"`, or `"light dark"`) and style overrides with `:root:has(> head > meta[name="color-scheme"][content="dark"])`.
- Prevent FOUC with a tiny **inline, non-module, non-deferred** `<script>` immediately after `<meta name="color-scheme">` in `<head>`. Never delete a user's saved theme preference just because it currently matches OS preference.

### Contrast, Accessibility & Forced Colors
- **WCAG 1.4.1**: Never communicate success, error, warning, or required state by color alone — pair with an icon and/or clear text label.
- **WCAG 1.4.3 / 1.4.11**: Enforce **>= 4.5:1** contrast for normal text and **>= 3:1** for large text (`>= 24px` or `>= 18.66px` bold), icons, form boundaries, and focus states.
- **`@media (forced-colors: active)`**: `box-shadow`, `background-image`, and `border-image` are stripped in Windows High Contrast Mode. Always give cards, buttons, badges, and dialogs real CSS `border`s (`1px solid`), use CSS system colors (`Canvas`, `CanvasText`, `Highlight`, `ButtonFace`, `ButtonText`) in `@media (forced-colors: active)`, and never set `forced-color-adjust: none` purely for aesthetics.
- **`scrollbar-color`**: Never animate or transition `scrollbar-color`. Pair with `scrollbar-width` / `scrollbar-gutter: stable` and use `@supports not (scrollbar-color: auto)` if providing WebKit scrollbar fallbacks.

---

## 4. Fluid Typography & Readability

Source guides: `typography`, `improve-text-layout-and-legibility`, `visually-stable-font-fallbacks`, `precise-text-alignment`

1. **Units & Scaling**:
   - Never set `font-size` in raw `px`; use `rem`/`em` (minimum `1rem` body size).
   - Always use **unitless** `line-height` (e.g. `1.55` for body, `1.1`–`1.2` for headings).
   - Never set fixed `height` or `block-size` on text containers — use `min-block-size` so zoomed text never overlaps or clips.
2. **Line Measure & Alignment**:
   - Constrain body prose measure to **`<= 60ch`** (`max-inline-size: 60ch`, staying well within `45ch–75ch` / `80` chars max) and align with `text-align: start`.
3. **Fluid `clamp()` Accessibility Rule (WCAG 1.4.4)**:
   - Never use raw `vw` (`font-size: 4vw` breaks 200% zoom). Always combine a font-relative base with viewport/container growth (`cqi` or `vw`), using font-relative `min`/`max` bounds where **`max <= 2.5 * min`**:
     ```css
     h1 {
       font-size: clamp(2rem, 1.4rem + 2.2vw, 3.5rem); /* 3.5 / 2.0 = 1.75 <= 2.5 */
       line-height: 1.12;
       text-wrap: balance;
     }
     ```
4. **`text-wrap: balance` vs `text-wrap: pretty`**:
   - Use `text-wrap: balance` (Newly available) ONLY on headings and short UI captions (`<= 6–10` lines). Avoid on buttons/pills with tight boxes/borders if widening creates awkward padding; **never apply to `*` or body paragraphs**.
   - Use `text-wrap: pretty` (Limited progressive enhancement) on `p, blockquote, li` for orphan prevention; **never apply to `*`**.
5. **Fallback Stability**: Set `font-size-adjust: from-font` on web-font stacks (`Plus Jakarta Sans`, `Instrument Serif`, etc.) to minimize CLS during font swap.
6. **Tabular Numerals (`tabular-nums`)**: *(Standard CSS practice; not explicitly documented in the `modern-web-guidance` corpus)* — apply `font-variant-numeric: tabular-nums;` on metric/KPI counters, ISO/specification tables, pricing/estimator readouts, and stat columns so digits stay vertically aligned.

---

## 5. Modern Layout (`subgrid`, `@container`, Logical Properties)

Source guides: `css-layout`, `fluid-scaling`, `size-aware-styling`, `card`, `responsive-table`

1. **Logical Properties Everywhere**:
   - Use `inline-size`, `min-inline-size`, `max-inline-size`, `block-size`, `min-block-size`, `margin-inline`, `margin-block`, `padding-inline`, `padding-block`, `inset-inline-start`, `inset-block-start`, `border-inline-start`, `text-align: start`.
   - Use `100dvh` / `100svh` instead of `100vh`; avoid `100vw` (use `100%` or `100dvw` carefully to prevent horizontal scrollbar overflow).
2. **Flexbox & Grid Safety Rules**:
   - Give flex/grid children containing wrapping text or overflow containers **`min-inline-size: 0`** so they don't blow out tracks.
   - Use `align-items: safe center` when centering potentially tall content.
   - Never visually reorder interactive elements with CSS `order` or `grid-auto-flow: dense` (breaks keyboard Tab order).
   - Add explicit `aspect-ratio` + `object-fit: cover` to media frames to eliminate CLS.
   - Use `overflow: clip` for visual clipping (does not break `position: sticky` or create accidental scroll containers).
   - Add `scrollbar-gutter: stable` and `overscroll-behavior: contain` on scrollable drawers/tables. Wrap wide tables in a `<div class="table-wrap" tabindex="0" role="region" aria-labelledby="table-title">` with `overflow-x: auto`.
3. **CSS `subgrid` for Aligned Card Rows** (Baseline Widely available):
   - Subgrid **one axis** (`grid-template-rows: subgrid`) when sibling cards have variable text length so headings, summaries, and footer CTAs align horizontally.
   - Always place a non-subgrid track fallback right before `subgrid`:
     ```css
     .card-grid {
       display: grid;
       grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr));
       gap: var(--space-l);
     }

     .card {
       display: grid;
       grid-row: span 4;
       grid-template-rows: auto auto 1fr auto; /* fallback */
       grid-template-rows: subgrid;
       gap: var(--space-s);
     }
     ```
4. **Container Queries (`@container`)** (Baseline Widely available):
   - Use `container: <name> / inline-size;` (equivalent to `container-name` + `container-type: inline-size`). Never use `container-type: block-size`, and avoid `container-type: size` unless `block-size` is explicitly fixed.
   - Scale internal card/component layout and spacing with `@container` + `cqi`:
     ```css
     .card-wrapper { container: card / inline-size; }

     @container card (inline-size >= 28rem) {
       .card-inner {
         display: grid;
         grid-template-columns: 12rem 1fr;
         padding: clamp(1rem, 3cqi, 1.75rem);
       }
     }
     ```

---

## 6. Native Interactive Elements & Fallbacks

### A. Modals (`<dialog>` + `showModal()` + `@starting-style`)
Source guides: `dialog`, `declarative-dialog-popover-control`, `light-dismiss-a-dialog`, `prevent-page-scroll-under-modal-dialog`, `animate-to-from-top-layer`, `animate-element-entry-exit`

- **HTML & A11y**:
  - Open modal dialogs via `.showModal()` (or `command="show-modal" commandfor="my-dialog"` + conditional polyfill `if (!('commandForElement' in HTMLButtonElement.prototype))` or small click listener). **Never combine `popovertarget` and `commandfor` on the same button.**
  - Do **not** add `role="dialog"`, `aria-modal="true"`, custom focus traps, or manual Escape key handlers — `showModal()` handles all of these natively.
  - Always label with `aria-labelledby="dialog-title"` (or `aria-label`), place `autofocus` on the first form field or safe close control, close via `<form method="dialog">` or `command="close"`, and reset `dialog.returnValue = ''` on the `close` event.
- **Scroll-Lock Rule (Mandatory)**:
  - **NEVER** set `overflow: hidden` or `position: fixed` on `html` or `body` when opening a modal! Use top-layer overscroll containment instead:
    ```css
    dialog:modal { overscroll-behavior: contain; }
    dialog::backdrop { overflow: hidden; overscroll-behavior: contain; }
    ```
- **`display` & `@starting-style` Animation Rule**:
  - **Never** set an unconditional `display: flex | grid` on `dialog` (breaks closed state!). Always scope to `dialog[open]`.
  - Put `transition-behavior: allow-discrete;` as a **separate property AFTER** the `transition` shorthand (never inside the shorthand), wrap transforms inside `@media (prefers-reduced-motion: no-preference)`, and note `overlay` / discrete `display` transitions are Limited availability (so `open` stays 100% functional if exit animations snap immediately):
    ```css
    dialog[open] {
      display: grid;
      opacity: 1;
    }

    @media (prefers-reduced-motion: no-preference) {
      dialog {
        opacity: 0;
        transform: translateY(0.75rem);
        transition: opacity 200ms ease, transform 200ms ease, overlay 200ms ease, display 200ms ease;
        transition-behavior: allow-discrete;
      }

      dialog[open] {
        opacity: 1;
        transform: translateY(0);
      }

      @starting-style {
        dialog[open] {
          opacity: 0;
          transform: translateY(0.75rem);
        }
      }
    }
    ```
- **Light Dismiss Fallback (`closedby="any"`)**:
  - `closedby="any"` is Limited availability (not in Safari). Pair it with a `!('closedBy' in HTMLDialogElement.prototype)` fallback checking BOTH `pointerdown` and `pointerup` outside `dialog.getBoundingClientRect()` (never a single `click` on `e.target === dialog`, which accidentally closes when dragging text selection outside!).

### B. Popover API (`popover`) & Anchoring
Source guides: `viewport-aware-dropdowns`, `position-aware-tooltips`, `navbar`, `declarative-dialog-popover-control`

- Use `popover="auto"` (light-dismiss, auto-closes other auto popovers) or `popover="manual"` triggered via `popovertarget="menu-id"` (or `command="toggle-popover" commandfor="menu-id"`).
- **ARIA contract**: do not attach `role="menu"` or `aria-haspopup="menu"` to plain popover lists/drawers unless you implement the full ARIA menu keyboard contract (arrow navigation, Home/End, Escape). Plain `<nav>` / `<ul>` / `<a>` / `<button>` inside a popover works natively.
- Style open state safely if using optional `@oddbird/popover-polyfill`: `[popover]:is(:popover-open, .\:popover-open)`. Gate polyfill on `!Object.hasOwn(HTMLElement.prototype, "popover")`, and use `getAttribute`/`setAttribute('popover', ...)` rather than touching `.popover` IDL before polyfill loads.
- **Anchor Positioning Guard**: CSS `position-area` / `anchor()` is Limited availability — gate `inset: auto; margin: 0;` anchored positioning behind `@supports (position-area: block-end)` (or provide centered/relative positioning fallback outside `@supports`).

### C. Exclusive Accordions (`<details name="...">` + `::details-content`)
Source guides: `accordion`, `animate-to-intrinsic-sizes`, `search-hidden-content`

- Wrap related accordion items in `<section aria-labelledby="faq-heading">` using native `<details name="group-name">` and `<summary>`.
- **Never put heading tags (`<h2>`, `<h3>`, etc.) inside `<summary>`** — screen readers like JAWS/TalkBack suppress heading semantics inside interactive summary buttons. Put headings outside `<details>` if needed, and keep `<summary>` text clean.
- Rotate an inline chevron icon (`-90deg` closed -> `0deg` open, `90deg` in `:dir(rtl)`) placed beside the label rather than fighting default `::marker` quirks.
- **Progressive Slide Animation**:
  ```css
  @layer components {
    .accordion-group { interpolate-size: allow-keywords; }

    details::details-content {
      overflow: clip;
      contain: layout;
    }

    details:not([open])::details-content {
      block-size: 0;
    }

    @media (prefers-reduced-motion: no-preference) {
      details::details-content {
        transition: block-size 280ms ease, content-visibility 280ms ease, display 280ms ease;
        transition-behavior: allow-discrete;
      }
    }
  }
  ```
- **Fallback for `name`**: `<details name>` is Newly available — if exclusive closing is required on older engines, add a small `!Object.hasOwn(HTMLDetailsElement.prototype, "name")` capture-phase `toggle` listener to close siblings with matching `name`. (Avoid exclusive accordions altogether if users need to compare two panels side by side.)

### D. Stateful Parent/Filter Styling (`:has()`)
Source guides: `child-state-based-styling`, `content-based-styling`, `style-parent-with-has`

- `:has()` is Baseline Widely available.
- **Scope locally**: target component containers (`.filter-section:has(...)`, `.field-group:has(:user-invalid)`, `.card:has(a:focus-visible)`), **never `body:has(...)` across the entire page**.
- **Prohibitions**: never nest `:has()` inside `:has()`, and never pass pseudo-elements (`::before`, `::after`) inside `:has()`.
- Add `@supports not selector(:has(*))` fallbacks when layout or interactive state critically depends on `:has()`. For multi-criteria filter UIs (e.g., sector + service filters), pair `:has()` styling with JS/DOM state updates for accurate screen-reader result counts and keyboard-accessible filter resets.

### E. Cross-Document View Transitions (`@view-transition`)
Source guides: `cross-document-transitions`, `consistent-cross-document-transitions`, `same-document-transitions`

- Cross-document MPA `@view-transition` is **Limited availability** (progressive enhancement only).
- Enable on **both** source and destination HTML documents strictly gated by reduced motion:
  ```css
  @media (prefers-reduced-motion: no-preference) {
    @view-transition {
      navigation: auto;
    }
  }
  ```
- Add `<link rel="expect" href="#main-content" blocking="render">` in `<head>` pointing **only** to an above-the-fold landmark (never below-the-fold elements or third-party scripts), plus `blocking="render"` on critical layout/theme scripts.
- **Unique names only**: never duplicate `view-transition-name` across multiple visible elements on the same page (`project-card-1`, `project-card-2`, not `.card { view-transition-name: card; }`). Preload/size morphing images with `width`/`height`, and clear dynamically set `view-transition-name` values after transition `finished` to keep bfcache clean.
- For same-document transitions (`document.startViewTransition()`), feature-detect first and move focus programmatically (`target.focus()`) on `finished`.

### F. Scroll-Driven Animations & Sticky Headers
Source guides: `motion`, `scroll-entry-exit-effects`, `scroll-progress-indicator`, `shrinking-header-on-scroll`, `state-aware-sticky-headers`

- **Compositor-only rule**: animate only `opacity`, `transform`, `translate`, `scale`, `rotate`. Never put `* { animation-duration: 0.01ms !important; }` in reduced-motion CSS.
- **Dual guard + ordering rule** (Scroll-driven animations are Newly available in recent browsers — **always** guard BOTH reduced motion AND `@supports`, and **always declare `animation-timeline` & `animation-range` AFTER the `animation` shorthand** because `animation` resets `animation-timeline`!):
  ```css
  @media (prefers-reduced-motion: no-preference) {
    @supports ((animation-timeline: view()) and (animation-range: entry)) {
      .scroll-reveal {
        animation: reveal-up linear both;
        animation-timeline: view();
        animation-range: entry 0% cover 25%;
      }
    }

    @supports ((animation-timeline: scroll()) and (animation-range: 0% 100%)) {
      .scroll-progress {
        animation: grow-inline linear both;
        animation-timeline: scroll();
        animation-range: 0% 100%;
      }
    }
  }
  ```
- **No `scroll-timeline-polyfill`**: if non-decorative reveal animations need fallback support, use `IntersectionObserver` gated on `matchMedia('(prefers-reduced-motion: no-preference)').matches && !CSS.supports('animation-timeline: view()')` so elements remain visible by default without JS or scroll support.
- **Sticky Headers**: always set `scroll-padding-top` on `html` equal to sticky header height (WCAG 2.4.11 Focus Not Obscured). Add `overflow-anchor: none` only on the direct parent of a dynamically shrinking sticky header if height changes cause scroll jitter.

### G. Forms (`:user-invalid` / `:user-valid`, Hints & ARIA Sync)
Source guides: `forms`, `validate-input-after-interaction`, `required-field-feedback`, `select-menu-interaction`, `accessible-error-announcement`, `brand-consistent-forms`

- **Use `:user-valid` / `:user-invalid` only** (Baseline Widely available) — **never** style raw `:invalid`/`:valid` before user interaction. Exclude range inputs:
  ```css
  :is(input:not([type="range"]), select, textarea):user-invalid {
    border-color: var(--status-error);
  }
  :is(input:not([type="range"]), select, textarea):user-valid {
    border-color: var(--status-success);
  }
  ```
- **Never disable submit buttons** (`<button type="submit">`) before submission. Validate on submit, highlight errors, and focus the first invalid field (or top error summary).
- **Layout & Touch Ergonomics**:
  - Place format hints **above** inputs (linked via `aria-describedby`) and visible error message + icon **below**.
  - Required `<select>`: start with `<option value="" disabled selected>Select service…</option>`.
  - Set `font-size: max(1rem, 1em)` on controls (prevents mobile Safari auto-zoom) and `min-block-size: 48px` (`52px` under `@media (pointer: coarse)`).
  - Add appropriate `autocomplete`, `inputmode`, `enterkeyhint`, and `autocorrect="off"` / `spellcheck="false"` on emails/IDs.
- **Mandatory JS ARIA Sync Pattern**:
  - `:user-invalid` updates visuals only — screen readers still need synchronized `aria-invalid` and live announcements:
    1. Initialize `aria-invalid="false"` on every `input, select, textarea` (do **not** wire hidden error spans in initial `aria-describedby`).
    2. On `blur` (capture), `input`, `change` (capture), `invalid` (capture), and `reset` (capture + `setTimeout`), check `el.matches(':user-invalid')`: toggle `aria-invalid="true" | "false"`, append/remove the error element ID in `aria-describedby`, and reveal/hide the inline error node.
    3. Debounce (`~500ms`) validation summary updates into a single `.visually-hidden` `[aria-live="polite"]` region.

---

## 7. Verification with `legacy-scan`

Before declaring any page or stylesheet finished, run `legacy-scan` from `f:\RMC`:

```powershell
# Scan the project and inspect structured JSON findings
npx.cmd --yes modern-web-guidance@latest legacy-scan . --json

# Target a specific directory, file, or guide ID
npx.cmd --yes modern-web-guidance@latest legacy-scan .\styles --json
npx.cmd --yes modern-web-guidance@latest legacy-scan . --guide dialog --json

# Include docs/examples/tests if desired
npx.cmd --yes modern-web-guidance@latest legacy-scan . --include-docs-and-tests --json
```

### Triage Rules (`keepWhen` / `dropWhen`)
1. Review each JSON finding's `keepWhen` / `dropWhen` rubric:
   - **Keep & fix** real legacy patterns (e.g., raw `:invalid`, `overflow: hidden` body scroll lock on modals, `100vh` layout traps, `font-size: ...vw` without `clamp()`, missing `prefers-reduced-motion` guard, `:root` missing `color-scheme`).
   - **Drop false positives** such as intentional `@supports` / `@media` progressive-enhancement fallbacks, conditional polyfills, third-party/vendor assets, or unrelated lookalike code.
2. When fixing a kept finding, retrieve its full guide first (`npx.cmd --yes modern-web-guidance@latest retrieve "<guide-id>"`).
3. Re-run `legacy-scan` on the modified files after edits to confirm kept findings are resolved — **never delete safe progressive-enhancement fallbacks just to force raw count to zero**.
