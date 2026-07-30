# Tailwind CSS v4 — Setup & Design System

Documentation for the styling foundation of the Salon Management System frontend
(React 19 + TypeScript + Vite + Tailwind CSS v4). Every decision below includes
the reasoning behind it, not just the "how."

---

## 1. Installation

Tailwind v4 has two moving parts: the `tailwindcss` engine and a build-tool
integration. For Vite, that integration is the official `@tailwindcss/vite`
plugin — **no PostCSS, no `postcss.config.js`, no `autoprefixer` needed**,
because v4's engine handles vendor prefixing and CSS transforms internally.

```bash
npm install tailwindcss @tailwindcss/vite
```

Supporting libraries used by the component patterns in this doc:

```bash
npm install clsx tailwind-merge class-variance-authority tw-animate-css zustand
```

| Package | Why |
|---|---|
| `clsx` | Conditionally compose class name strings without manual template-literal juggling. |
| `tailwind-merge` | Resolves conflicting Tailwind classes (e.g. a consumer passing `p-2` to override a component's `p-4`) so the *last* one wins instead of both being emitted. |
| `class-variance-authority` (cva) | Type-safe variant APIs for components (`<Button variant="outline" size="sm">`) instead of ad-hoc boolean props and nested ternaries. |
| `tw-animate-css` | v4-native animation utilities (`animate-in`, `fade-*`, `zoom-*`, `slide-*`) as a plain CSS import — no JS config, unlike its v3-era predecessor. |
| `zustand` | Minimal state store; used here to hold and persist the dark/light theme. |

Reasoning: all five are small, dependency-light, and represent the same
pairing used by mature Tailwind v4 component systems (e.g. shadcn/ui). None
of them lock you into a component library — they're primitives you compose.

---

## 2. Configuration files

Tailwind v4 is **CSS-first**. Configuration that used to live in
`tailwind.config.js` (theme colors, fonts, breakpoints) now lives directly in
CSS via the `@theme` at-rule. As a result, this project has:

- **No `tailwind.config.ts`** — intentionally omitted. A JS config file is
  only necessary for legacy plugins that haven't adopted v4's CSS-first
  `@plugin` directive; none are used here. Adding an empty/unnecessary config
  file is a common mistake (see [§14](#14-common-mistakes-to-avoid)).
- **No `postcss.config.js`** — the Vite plugin replaces the PostCSS pipeline.
- **`vite.config.ts`** — registers the plugin and a `@` import alias:

  ```ts
  import { fileURLToPath, URL } from 'node:url'
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import tailwindcss from '@tailwindcss/vite'

  export default defineConfig({
    plugins: [tailwindcss(), react()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
  })
  ```

- **`tsconfig.app.json`** — mirrors the alias so TypeScript and the editor
  resolve `@/lib/utils` the same way Vite does:

  ```json
  "paths": { "@/*": ["./src/*"] }
  ```

- **Content detection is automatic.** v4 scans your project's file system
  (respecting `.gitignore`) for class names — the v3 `content: [...]` glob
  array is gone. Nothing to configure or forget to update when adding a new
  folder.

---

## 3. Folder structure for styles

```
src/
├── styles/
│   ├── index.css       # single entrypoint, imported once from main.tsx
│   ├── theme.css        # @theme design tokens (colors, fonts, radius, breakpoints)
│   ├── base.css          # @custom-variant dark + @layer base element defaults
│   └── utilities.css    # hand-picked @utility definitions
├── lib/
│   └── utils.ts          # cn() class-merging helper
├── store/
│   └── themeStore.ts     # Zustand store for dark/light mode
├── components/
│   ├── ui/                # unopinionated, reusable primitives (Button, Card)
│   └── layout/            # app shell pieces (Sidebar, Header, DashboardLayout)
└── pages/                 # route-level composition (DashboardPage, ...)
```

Rationale: `styles/` is split by *concern* (tokens vs. base resets vs.
utilities) rather than dumped into one file, so each piece stays reviewable
and diffable on its own. `components/ui` vs `components/layout` separates
generic, app-agnostic primitives from salon-app-specific shell pieces —
`ui/Button.tsx` could be lifted into a design-system package later with no
changes required.

---

## 4. Global CSS setup

`src/styles/index.css` is the only stylesheet imported anywhere in the app
(from `main.tsx`). It composes the rest via `@import`, in an order that
matters: Tailwind's base layer first, then the animation utilities, then our
own tokens and overrides.

```css
@import "tailwindcss";
@import "tw-animate-css";

@import "./theme.css";
@import "./base.css";
@import "./utilities.css";
```

Only ever import this one file elsewhere in the app. Scattering additional
global `@import`s across components defeats the point of a single source of
truth and reintroduces the "which CSS file affects this page" problem
Tailwind is meant to solve.

---

## 5. Theme configuration

All design tokens are declared with the `@theme` at-rule in
`src/styles/theme.css`. Every variable defined there **automatically
generates matching utility classes** — declaring `--color-primary-500`
gives you `bg-primary-500`, `text-primary-500`, `border-primary-500`,
`ring-primary-500`, etc. for free. There is no separate "extend theme in JS,
then use in CSS" step like v3's `tailwind.config.js theme.extend.colors`.

```css
@theme {
  --color-primary-500: #e0527a;
  --font-display: "Playfair Display", ui-serif, Georgia, serif;
  --radius-lg: 1rem;
  --breakpoint-xs: 30rem;
  /* ... */
}
```

Why CSS-first matters here: tokens are visible right next to the utilities
that consume them, there's no JS build step to resolve values, and the
tokens are real CSS custom properties at runtime — inspectable in DevTools
and usable directly in hand-written CSS (`color: var(--color-primary-500)`)
without any Tailwind-specific tooling.

---

## 6. Color palette

An upscale salon reads as *warm* and *refined*, not "generic SaaS blue."
Three token scales cover the whole UI:

| Scale | Role | Base hue |
|---|---|---|
| `primary` (rose/blush) | Brand color, primary CTAs, active nav state, links | `#e0527a` |
| `gold` (amber) | Secondary accents, badges, premium/loyalty highlights | `#d9922a` |
| `charcoal` (warm neutral) | Text, surfaces, borders, backgrounds | `#5f5451` |

Each scale runs `50 → 950` (11 steps), matching Tailwind's own convention so
they drop into existing patterns (`hover:bg-primary-600`,
`dark:text-charcoal-50`) without surprises.

Decisions:
- **Charcoal instead of `gray`/`slate`**: standard grays have a cool/blue
  cast that reads clinical. This scale is tinted warm (brown-leaning) to
  match the rose/gold brand colors instead of fighting them.
- **11-step scales**: gives enough range for both light-mode surfaces
  (`50`–`100`) and dark-mode surfaces (`900`–`950`) from the *same* palette,
  which is what makes the dark mode implementation in §10 a small effort
  rather than a second palette to maintain.
- **Contrast**: `primary-600` on white and `charcoal-50` on `charcoal-950`
  both clear WCAG AA for normal text; when introducing new color+background
  pairings, check with a contrast tool before shipping — don't assume every
  combination in an 11-step scale is automatically accessible.

---

## 7. Typography

- **Display font — Playfair Display**: an elegant, high-contrast serif for
  headings (`h1`–`h3`), evoking the "boutique" feel appropriate to a salon
  brand.
- **Body font — Inter**: a clean, highly legible sans-serif for everything
  else (body copy, UI labels, form fields) — serif body text hurts
  readability at UI sizes.
- Loaded via Google Fonts `<link>` tags in `index.html` (with
  `rel="preconnect"` for the two font-serving origins) rather than
  self-hosted `@fontsource/*` packages — fewer npm dependencies, and the
  fonts are cached across sites that use the same Google Fonts URLs.
  Trade-off: an external network request at page load; if that becomes a
  concern later (privacy, offline support), swap to `@fontsource/*` without
  touching any component code, since consumers only ever reference
  `font-display` / `font-sans`.
- Tokens: `--font-display` and `--font-sans` in `theme.css`; applied via
  `font-display` / `font-sans` utility classes, with `h1`/`h2`/`h3` set to
  `font-display` by default in `base.css` so headings don't need the class
  repeated everywhere.

---

## 8. Spacing system

No custom spacing scale is defined. Tailwind v4 derives its *entire* spacing
scale (`p-1`, `gap-4`, `-mt-2`, arbitrary multiples, etc.) from a single
`--spacing` variable, default `0.25rem` (4px) — every numbered utility is a
multiple of that one value. This project keeps the default: a 4px base grid
is fine-grained enough for dense dashboard UI (tables, form rows, card
padding) without needing project-specific overrides. If a different base
grid were ever needed, it's a one-line change (`--spacing: 0.2rem;` in
`theme.css`) that rescales *every* spacing utility in the app consistently —
which is the main advantage of not hand-rolling a custom spacing scale.

---

## 9. Responsive breakpoints strategy

Tailwind's default breakpoints are kept, mobile-first:

| Prefix | Min width | Used for |
|---|---|---|
| *(none)* | 0 | Base/mobile styles |
| `sm` | 40rem (640px) | Large phones / small tablets |
| `md` | 48rem (768px) | Tablets |
| `lg` | 64rem (1024px) | Small laptops — sidebar becomes visible |
| `xl` | 80rem (1280px) | Desktops |
| `2xl` | 96rem (1536px) | Large monitors |

One addition: `--breakpoint-xs: 30rem` (480px), for the rare case of
needing a breakpoint between "phone" and "large phone" — e.g. a 2-column
stat grid on wider phones.

**Mobile-first, always**: write the base (unprefixed) classes for the
smallest screen, then layer `sm:`/`md:`/`lg:` on top. `DashboardLayout`
demonstrates this — the sidebar is `hidden` by default and only becomes
`lg:flex`, rather than being visible-by-default and hidden at small sizes.

**`@container` queries**: v4 ships native container query support
(`@container`, `@sm`, `@md` on a container-scoped element). For components
like `ServiceCard` that might render in different container widths (a full
page grid vs. a narrow sidebar widget), prefer a container query over a
viewport breakpoint once that need actually arises — don't add it
speculatively.

---

## 10. Dark mode implementation

Mechanism (`src/styles/base.css`):

```css
@custom-variant dark (&:where(.dark, .dark *));
```

This tells Tailwind that `dark:` variants should apply whenever an ancestor
(or the element itself) has the `.dark` class — a manual class toggle, not
`prefers-color-scheme`. `prefers-color-scheme` alone doesn't let users
override their OS setting for just this app, which is worth the small extra
wiring.

Toggle state (`src/store/themeStore.ts`): a Zustand store with the
`persist` middleware, so the choice survives reloads via `localStorage`.
`toggleTheme()`/`setTheme()` both update the store *and* flip
`document.documentElement.classList` directly — Tailwind only cares about
the DOM class, not the store, so the two are kept in sync in one place
rather than relying on a React effect that could lag a render behind.

```ts
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => { /* flips class + state together */ },
    }),
    { name: "salon-theme" },
  ),
);
```

Every component styled with this system pairs a light-mode class with a
`dark:` variant (`bg-white dark:bg-charcoal-900`) rather than branching in
JS — keep dark mode a CSS concern, not a conditional-rendering concern.

---

## 11. Reusable utility classes

Most styling should be inline Tailwind utilities in JSX (see §12). The
exceptions — small, high-reuse primitives — live in `src/styles/utilities.css`
using v4's `@utility` directive (not `@layer components`, which is the
older, less composable v3 pattern for this purpose):

```css
@utility focus-ring {
  @apply outline-none focus-visible:ring-2 focus-visible:ring-primary-400
    focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-50
    dark:focus-visible:ring-offset-charcoal-950;
}

@utility section-container {
  @apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8;
}
```

`@utility`-defined classes behave like Tailwind's own utilities — they can
be overridden by `tailwind-merge` correctly and participate in the same
specificity model, which `@layer components` classes historically fought
with. Keep this file short: if you find yourself adding a new `@utility`
for something used in only one or two places, it likely belongs inline in
the component instead (see next section).

---

## 12. Best practices for component styling

- **Compose utilities in JSX; don't reach for `@apply` by default.**
  `@apply` re-creates the exact "named CSS class that hides its own
  definition" problem Tailwind exists to avoid. It's used sparingly in this
  project only for true global element defaults (`base.css`'s `body`
  styles), never for one-off components.
- **`cva` for variant APIs.** Whenever a component has more than one "look"
  (`Button`'s `variant`/`size`), define the variants centrally with `cva`
  instead of scattering ternaries through the JSX. See `Button.tsx`.
- **`cn()` for every `className` prop.** Any component that accepts a
  `className` prop should merge it with `cn(internalClasses, className)`
  (via `tailwind-merge`), so a consumer's override *actually* overrides
  instead of producing two conflicting classes in the DOM.
- **Co-locate, don't centralize.** A component's classes live with its JSX,
  not in a separate stylesheet or a giant shared "styles" object — this is
  what keeps a component deletable/movable as a single unit.
- **`forwardRef` on interactive primitives.** `Button` forwards its ref so
  consumers can focus/measure it, integrate with form libraries, etc. —
  skipping this is a common source of "why doesn't autofocus work" bugs
  later.
- **Design tokens over raw values.** Use `bg-primary-500`, not
  `bg-[#e0527a]`. Arbitrary values are for genuine one-offs (a specific
  pixel offset to align with a third-party widget), not a substitute for
  extending the theme.

---

## 13. Common mistakes to avoid

- **Adding a `tailwind.config.ts` "just in case."** In v4 this is dead
  weight unless you have a legacy JS-only plugin. If you find yourself
  wanting one, first check whether the same config can be expressed as
  `@theme`/`@utility`/`@custom-variant` in CSS.
- **Installing `autoprefixer`/`postcss-import`.** The `@tailwindcss/vite`
  plugin already handles this; adding the old PostCSS pipeline back is
  redundant and can cause double-processing.
- **Forgetting the plugin ordering.** `tailwindcss()` should generally come
  before `react()` in the Vite `plugins` array so Tailwind's transform sees
  the raw source first.
- **Manually maintaining a `content: [...]` glob.** It doesn't exist in v4
  — if classes aren't showing up, the actual cause is almost always a typo
  in the class name or a class built via string concatenation that the
  scanner can't statically see (e.g. `` `bg-${color}-500` `` — use a
  lookup object instead, as `Card.tsx`'s `statusStyles` map does).
- **Using `@layer components` for one-off component styles.** Prefer plain
  JSX utilities or `@utility` (see §11/§12) — `@layer components` classes
  sit at a lower specificity than utilities and are easy to accidentally
  override in surprising ways.
- **Mixing `dark:` variants with JS conditionals for the same concern.**
  Pick one mechanism (CSS `dark:` classes here) — mixing both means two
  places can disagree about the current theme.
- **Reaching for arbitrary values (`w-[137px]`) before checking the theme
  scale.** If you're arbitrary-valuing the same number more than once,
  it's a token, not a one-off — add it to `@theme`.

---

## 14. Example: dashboard layout

`src/components/layout/DashboardLayout.tsx` composes `Sidebar` + `Header` +
a `<main>` slot:

```tsx
export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-charcoal-50 dark:bg-charcoal-950">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="section-container flex-1 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  )
}
```

`Sidebar` is `hidden` below the `lg` breakpoint and `lg:flex` above it —
mobile-first, matching §9. `min-w-0` on the flex child is what allows the
main content column to actually shrink/scroll instead of being pushed wide
by its children, a common flexbox gotcha in dashboard shells. See
`src/pages/DashboardPage.tsx` for a full example page (a services grid +
today's appointments list) built entirely from `ServiceCard`/`AppointmentCard`.

---

## 15. Example: Button component

`src/components/ui/Button.tsx` — full source is the canonical reference;
summary of the pattern:

```tsx
const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 text-white hover:bg-primary-600",
        secondary: "bg-gold-400 text-charcoal-900 hover:bg-gold-500",
        outline: "border border-charcoal-300 hover:bg-charcoal-100 dark:border-charcoal-700 dark:hover:bg-charcoal-800",
        ghost: "hover:bg-charcoal-100 dark:hover:bg-charcoal-800",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
)
```

Usage: `<Button variant="outline" size="sm">Cancel</Button>`. The
`focus-ring` custom utility (§11) is baked into the base classes so every
button variant gets consistent, accessible focus styling for free.

---

## 16. Example: Card component

`src/components/ui/Card.tsx` exports two salon-specific cards built on a
shared internal `CardShell`:

- **`ServiceCard`** — name, duration badge, price, description, and a
  "Book now" `Button` — used for the services catalog.
- **`AppointmentCard`** — client name, service, time, and a color-coded
  status pill (`confirmed` / `pending` / `cancelled`) driven by a
  `Record<AppointmentStatus, string>` lookup map (not string
  concatenation — see §13 on why that matters for the class scanner).

```tsx
function CardShell({ className, children }: CardShellProps) {
  return (
    <div className={cn(
      "rounded-2xl border border-charcoal-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-charcoal-700 dark:bg-charcoal-900",
      className,
    )}>
      {children}
    </div>
  )
}
```

Sharing `CardShell` internally (not exported) means both card types get the
same surface/border/shadow treatment automatically, and a future third card
type (e.g. `StaffCard`) is a small addition, not a copy-paste of the shell
styles.

---

## 17. Animation library recommendation

| Option | Verdict |
|---|---|
| `tailwindcss-animate` | **Not used.** A v3-era plugin requiring a JS `tailwind.config.js` entry — friction against this project's CSS-first, no-config approach. |
| `tw-animate-css` | **Adopted.** Pure CSS, a single `@import "tw-animate-css";` in `styles/index.css`, purpose-built for v4. Provides `animate-in`/`animate-out`, `fade-*`, `zoom-*`, `slide-*` utilities — enough for menus, toasts, and modal transitions without writing custom keyframes. |
| Motion (formerly Framer Motion) | **Documented, not installed.** Reserved for interactions that need real JS-driven orchestration — drag-to-reschedule on a calendar, staggered list animations, gesture-based swipe actions. None of the current example components need it; add it when a specific interaction actually requires it, not preemptively. |

---

## What's next

This setup covers styling primitives and one example page. As real features
are built (appointment booking, staff scheduling, client profiles), extend
the `components/ui/` folder with new primitives (`Input`, `Select`, `Modal`,
`Badge`) following the same `cva` + `cn()` + `forwardRef` pattern established
by `Button`, rather than introducing a second styling approach.
