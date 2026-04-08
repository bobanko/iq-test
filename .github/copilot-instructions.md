# Dobble — Project Code Guidelines

## Tech Stack

- Vanilla JS (ES6+ modules), no frameworks
- Firebase (Firestore + Auth)
- Plain CSS with custom properties
- No build step — files are served directly

## JavaScript

### Naming

- Variables and functions: `camelCase`
- Constants: `ALL_CAPS`
- Single DOM element references: prefix with `$` (e.g., `$btnStart`, `$cardLeft`) — applies to every variable holding a DOM element, not just cached ones
- Collections of DOM elements (arrays, NodeLists): prefix with `$$` (e.g., `$$modeCards`, `$$gameCardRings`) — mirrors the DevTools `$$()` convention
- CSS classes in JS: `kebab-case` strings

### Web Components

- Tag naming: if the component wraps a standard HTML element, prefix with that element name (e.g., `<button-ability>`, `<input-color>`). Otherwise use a descriptive `kebab-case` name (e.g., `<dobble-card>`, `<dobble-player>`)
- Class naming: `PascalCase` matching the tag — `ButtonAbility`, `DobbleCard`
- Files live in `components/`

### Module structure

- Pure utility functions → free-standing `export function` in a `utils`-style module
- use ES6 classes when they better fit (e.g., multiple instances, seeded helpers)
- Each module has a single responsibility and is imported where needed

### DOM

- Elements with IDs are available directly as global variables (e.g., `$screenStart` for `id="$screenStart"`), no need to query them via `querySelector` or `getElementById`
- Manipulate classes with `classList.add/remove/toggle/contains`
- Use `dataset` for reading `data-*` attributes

### Async / Firebase

- Use `async/await` everywhere, no raw `.then()` chains
- Wrap Firebase calls in `try/catch`; fail gracefully (log, show fallback UI)

### Comments

- Section headers: `// ===== Section Name =====`
- Console logs use emoji prefixes that match the domain (e.g., `🔥` for Firebase)
- Don't add comments for self-evident code
- do not delete existing console logs
- Do not delete code comments, only if whole related code block is deleted

## CSS

### Variables

- Define all design tokens in `:root` in `style.css`
- Naming: `--color-*`, `--size-*`, `--duration-*`

### File organisation

- `style.css` is the entry point and imports component files via `@import`
- Each logical UI area has its own file (`fonts.css`, `buttons.css`, `inputs.css`, etc.)

### Naming

- Component blocks: `kebab-case` descriptive names (`.card-container`, `.emoji-item`)
- State modifiers as standalone classes: `.correct`, `.wrong`, `.hint`, `.hidden`
- Utility / layout helpers: `.flex-row`, `.items-center`, `.gap-1`

### Nesting

- Use native CSS nesting — nest child selectors, pseudo-classes, and media queries inside their parent rule
- Example: `.card { color: red; &:hover { opacity: 0.8; } .emoji-item { font-size: 2rem; } }`

### Layout

- Flexbox for all flow layout; absolute positioning only for overlays and decorative elements
- Do not use `left: 50%; transform: translateX(-50%)` for centering; use flex container alignments/justify instead
- Prefer `min()` / `max()` / `clamp()` for fluid sizing

### z-index

- Use only small values: `1`, `2`, `3` — no magic numbers like `10`, `99`, `999`
- Rely on stacking context and DOM order first; add `z-index` only when necessary

### Time values

- For CSS time values (e.g., `transition-duration`, `animation-duration`), use milliseconds (`ms`) if the value is below 1000ms, and seconds (`s`) if 1000ms or above

## HTML

### IDs

- Always prefix with `$`: `id="$btnStart"`, `id="$screenGame"`, `id="$cardLeft"`
- camelCase following role pattern: `$btn{Purpose}`, `$screen{Name}`, `$card{Position}`

### i18n

- All user-visible text uses `data-i18n="key"` — never hardcode text directly
- Translation keys live in `i18n/en.json` and `i18n/ru.json`

### Visibility

- Hide elements with the `[hidden]` attribute (`el.hidden = true/false`) — prefer over class toggling
- Use `.hidden` class only when the `hidden` attribute is not applicable

### Labels

- Always wrap the associated control inside the `<label>` element so the browser's default focus-on-click works without an explicit `for` attribute
- Example: `<label>Name <input type="text"></label>` — not `<label for="name">Name</label><input id="name">`

### Accessibility

- Decorative SVGs get `aria-hidden="true"`
- Interactive elements use semantic tags (`<button>`, not `<div onclick>`)

## Development

- Do not start a dev server to check pages in the browser — suppose that it is already running at `http://localhost:8080/`
