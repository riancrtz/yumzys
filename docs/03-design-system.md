# Design system

The rules this interface follows, so that screen four looks like screen one.

[Visual document](./assets/design-system.pdf)

## Colour

| Name in code | Hex | Used for |
|---|---|---|
| `--color-primary` | `#D08549` | Filled buttons, the active nav item, selected chips and pills, borders on focus and hover tints |
| `--color-accent` | `#E8A33D` | The "Want to try" badge, star ratings, the demo notice |
| `--color-bg` | `#FFFFFF` | Page background, input fields, dialog background |
| `--color-surface` | `#FAFAFA` | Cards, the sidebar, the visited block in the form, empty states |
| `--color-text` | `#2B2420` | All text, and the focus outline |
| `--muted` | 70% of `--color-text` on white | Secondary text: area, notes placeholder, hints |
| `--line` | 15% of `--color-text` on white | Card and sidebar borders |
| `--field-border` | 55% of `--color-text` on white | Input, pill and dashed placeholder borders |

**Contrast.** Text is `#2B2420` on every background it appears on, which clears the 4.5 to 1 minimum: about 15 to 1 on white, and about 5.2 to 1 on terracotta. Filled buttons originally used white text, which measures about 2.9 to 1 on terracotta and fails, so they were changed to dark text. Star ratings use amber, which is too light to carry meaning on its own, so the rating is also written as a number beside the stars.

## Type

| Name in code | Size | Used for |
|---|---|---|
| `--font-size-lg` | 24px bold | Page titles, the app name, dialog titles |
| `--font-size-md` | 16px | Body text, place names in cards, form fields |
| `--font-size-sm` | 13px | Labels, metadata, hints, chips and pills |

The family is the system font stack (`system-ui`, `-apple-system`, `"Segoe UI"`, `sans-serif`), so the app uses whatever the device reads most comfortably and loads no font files. The line height is 1.5 for body text and 1.25 for headings.

## Spacing

One scale, used everywhere:

| Name in code | Value |
|---|---|
| `--space-1` | 8px |
| `--space-2` | 16px |
| `--space-4` | 24px |

Gaps inside a component use `--space-1`, gaps between components use `--space-2`, and page padding uses `--space-4`, dropping to `--space-2` on phones.

## Components

| Component | Normal | Hover | Focus | Disabled | Loading |
|---|---|---|---|---|---|
| Button | Terracotta fill, dark text, 8px radius | Lighter terracotta | 3px dark outline, offset 2px | 60% opacity, default cursor | Label changes, for example "Saving..." |
| Ghost button | Transparent, grey border | Light terracotta tint | Same outline | Same | Same |
| Nav item | Transparent, no border | Light terracotta tint | Same outline | Not used | Not used |
| Type chip | Light terracotta tint, rounded | Stronger tint | Same outline | Not used | Not used |
| Type chip, selected | Solid terracotta | Stays solid | Same outline | Not used | Not used |
| Status pill | Transparent, grey border | Light terracotta tint | Same outline | 60% opacity while saving | Spinner shown beside the group |
| Status pill, selected | Solid terracotta, bold | Stays solid | Same outline | Same | Same |
| Choice pill (form) | Grey border, hidden radio | Light terracotta tint | Outline on the whole pill | Not used | Not used |
| Card | Surface fill, 1px line, 12px radius | Terracotta border, name underlined | Outline around the whole card | Not used | Not used |
| Photo thumbnail | 4:3, transparent 2px border | Border appears | Same outline | Not used | Not used |
| Thumbnail, selected | Terracotta border | Stays | Same outline | Not used | Not used |
| Dialog | White panel, dark translucent backdrop | Not applicable | Cancel focused on open | Not applicable | Not applicable |
| Input | White, grey border, 8px radius | Not applicable | Same outline | Not used | Not used |

On phones every control is at least 44px tall, so it can be tapped accurately.

**Focus is never removed.** `:focus-visible` draws a 3px outline in the text colour, offset by 2px. The one exception is the card, where the outline is moved onto the overlay that covers the whole card, so focus shows around the card rather than around the name alone.

## States

| State | What it looks like |
|---|---|
| Loading | Grey "Loading..." text. After three seconds it adds that the server may be waking up, because the free API sleeps. Saves and uploads show a small spinner and a line of text instead. |
| Empty | A surface panel with a dashed border, a bold line, a grey hint, and usually a button: "No places here yet" offers Add a place, and "No places match your search" offers Clear search. Places with no photo show a camera icon and "No photo yet" in a dashed box. |
| Error | A light terracotta banner with a terracotta border, holding the message and, where it helps, a Try again button. |
| Data | Cards in one column on phones and three across on wider screens. |

## In code

These live as CSS custom properties in the `:root` block of `client/src/styles.css`, which is where the class template started. I kept that approach rather than moving to CSS modules or Tailwind, because the whole interface is one component file and one stylesheet, so a single set of properties is easy to read, needs no extra build step, and lets me change a colour or a spacing step in one place. The tradeoff is that class names are global, so a general rule can override a specific one. That happened once, when a general `button` rule filled both status pills with colour until the `.pill` rule was given its own background.
