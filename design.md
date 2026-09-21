# VeloxPark v2.0 User UI Design System

> **Rule:** Every new page must reuse these tokens/components. Do not introduce new colors, fonts, or one-off styles without adding them here first.

This document is the single source of truth for the user-side VeloxPark interface. The visual language is dark, high-contrast, compact, and operational: near-black surfaces, golden actions, strong uppercase headings, and clear status color coding.

## 1. Color tokens

| Token | Hex | Tailwind class | Usage |
| --- | --- | --- | --- |
| `ink` | `#0A0A0A` | `bg-ink`, `text-ink` | App background and dark button text |
| `surface` | `#141414` | `bg-surface` | Cards, panels, and elevated controls |
| `surface-raised` | `#1C1C1C` | `bg-surface-raised` | Hovered cards, input backgrounds, selected secondary surfaces |
| `line` | `#333333` | `border-line` | Default borders and dividers |
| `muted` | `#8A8A8A` | `text-muted` | Supporting text, placeholders, inactive labels |
| `paper` | `#F5F5F0` | `text-paper` | Primary body text |
| `gold` | `#F2C230` | `bg-gold`, `text-gold`, `border-gold` | Headings highlights, active states, primary actions, focus borders |
| `gold-soft` | `#6B5514` | `border-gold-soft` | Low-emphasis gold borders and grid accents |
| `available` | `#35C878` | `bg-available`, `text-available`, `border-available` | Available slot state and active status |
| `danger` | `#F05A67` | `bg-danger`, `text-danger`, `border-danger` | Expired/cancelled states and destructive feedback |
| `info` | `#6EA8FE` | `bg-info`, `text-info`, `border-info` | Completed state and informational feedback |

The background texture uses `--color-gold` at low opacity and is applied through the `.vp-grid` utility in `src/index.css`; it is not a new color token.

## 2. Typography scale

The display stack is a condensed sans-serif fallback stack. Body/UI text uses a neutral sans-serif stack. No external font is required for the token system.

| Token | Size / line height | Weight | Letter spacing | Tailwind class | Usage |
| --- | --- | --- | --- | --- | --- |
| `display-xl` | `3rem / 1` | 800 | `-0.04em` | `text-display-xl` | Hero or dashboard headline |
| `display-lg` | `2.25rem / 1.05` | 800 | `-0.03em` | `text-display-lg` | Page headline |
| `display-md` | `1.5rem / 1.1` | 800 | `-0.02em` | `text-display-md` | Section headline |
| `label` | `0.75rem / 1.2` | 700 | `0.12em` | `text-label` | Uppercase labels and metadata |
| `body-lg` | `1.125rem / 1.6` | 400 | `0` | `text-body-lg` | Lead/supporting copy |
| `body` | `0.9375rem / 1.5` | 400 | `0` | `text-body` | Default UI/body text |
| `body-sm` | `0.8125rem / 1.4` | 400 | `0` | `text-body-sm` | Helper text and dense metadata |

Headlines and labels are uppercase. Body copy and form values remain sentence case.

## 3. Spacing and radius scale

| Token | Value | Tailwind class | Usage |
| --- | --- | --- | --- |
| `space-1` | `0.25rem` | `p-1`, `gap-1` | Icon/label micro-spacing |
| `space-2` | `0.5rem` | `p-2`, `gap-2` | Compact control spacing |
| `space-3` | `0.75rem` | `p-3`, `gap-3` | Small component padding |
| `space-4` | `1rem` | `p-4`, `gap-4` | Default field/control spacing |
| `space-6` | `1.5rem` | `p-6`, `gap-6` | Card internal padding |
| `space-8` | `2rem` | `p-8`, `gap-8` | Section spacing |
| `space-12` | `3rem` | `p-12`, `gap-12` | Page-level spacing |
| `radius-sm` | `0.5rem` | `rounded-sm` | Inputs and small controls |
| `radius-md` | `0.75rem` | `rounded-md` | Cards and buttons |
| `radius-lg` | `1rem` | `rounded-lg` | Large feature surfaces |
| `radius-pill` | `9999px` | `rounded-pill` | Status pills and compact badges |

## 4. Component patterns

### Button

Primary is filled gold with dark text. Secondary is transparent with a gold outline. Disabled controls use the neutral line color and cannot imply availability.

```jsx
<Button variant="primary">Book a slot</Button>
<Button variant="secondary">View history</Button>
<Button disabled>Unavailable</Button>
```

The `ghost` variant is reserved for low-emphasis navigation actions such as “Back” and “Sign out”; it uses the neutral line border and shifts to gold on hover.

### Card

Cards use `bg-surface`, a 1px `border-line` border, `rounded-md`, and generous `p-6` padding. Use the optional `badge` prop for a low-opacity numbered badge in the top-right corner.

```jsx
<Card badge="01" className="max-w-md">
  <h2 className="text-display-md">Your next stay</h2>
</Card>
```

### Input field

Inputs use a dark raised surface, line border, paper text, muted placeholder, and a gold focus border/ring.

```jsx
<Input label="Email address" type="email" placeholder="you@example.com" />
```

### Status pill

Pills are small, rounded, bordered, uppercase badges. The lifecycle colors are: `reserved` = gold, `active` = available green, `expired` = danger red, `completed` = info blue, `cancelled` = muted gray.

```jsx
<StatusPill status="reserved" />
<StatusPill status="active" />
```

### Numbered badge

Feature cards may display a low-opacity `01`, `02`, etc. badge positioned in the top-right corner. Use the `Card` `badge` prop rather than creating a standalone one-off style.

### Top bar

The top bar is a full-width `bg-ink`/`bg-surface` navigation row with a gold wordmark, sentence-case navigation links, a compact user control, and a bottom `border-line` divider.

```jsx
<TopBar userName="Alex Morgan" onSignOut={signOut} />
```

## 5. Tailwind token source

The canonical JavaScript token map is in `tailwind.config.js`. Because this project uses Tailwind v4, the same values are also exposed through the `@theme` block in `src/index.css` so utility classes work with the current Vite plugin.
