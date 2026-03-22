---
name: theme-tokens
description: Ensures all color values in this React Native app reference tokens from src/theme/colors.ts rather than hardcoded hex values. Use when adding or editing any UI component that includes color values, when reviewing code for hardcoded hex strings, or when the user asks about colors, theming, or the design system.
---

# Theme Tokens

All colors must come from `src/theme/colors.ts`. Never hardcode hex values in component files.

## The Two Exports

**`green`** — the full 11-step palette. Use when you need a specific shade that isn't in `theme`.

```ts
import { green } from '../theme/colors';

color: green[700]   // #237040
color: green[900]   // #1D492D
```

**`theme`** — named semantic tokens. Prefer these over raw `green[n]` whenever the intent maps cleanly to a token.

| Token | Value | Typical use |
|---|---|---|
| `theme.primary` | green[500] | Tailwind `bg-primary` equivalent |
| `theme.primaryDark` | green[600] | FAB, active tab indicator underline |
| `theme.background` | green[200] | Screen/list backgrounds |
| `theme.surface` | green[100] | Card/input backgrounds |
| `theme.border` | green[300] | Dividers, separator lines |
| `theme.foreground` | neutral[900] | Primary body text |
| `theme.subtle` | neutral[700] | Secondary/muted text |
| `theme.danger` | red[600] | Delete actions, error states |
| `theme.dangerDark` | red[800] | Dither shadow on delete actions |

## Import Paths by Directory

| File location | Import |
|---|---|
| `src/components/*.tsx` | `import { theme, green } from '../theme/colors';` |
| `src/components/ui/*.tsx` | `import { green } from '../../theme/colors';` |
| `src/screens/*.tsx` | `import { theme, green } from '../theme/colors';` |

## Rules

- **`theme.*` over `green[n]`** when a semantic name exists.
- **`green[n]`** when you need a specific shade with no matching token (e.g. letter headers use `green[700]`, deep active text uses `green[900]`).
- **Alpha/opacity variants** — append a two-digit hex alpha suffix to the palette value: `green[700] + '59'` gives 35% opacity. Add a comment explaining the percentage.
- **White** (`#FFFFFF`) and **transparent** are not brand colors and may be used as literals.
- **Red Tailwind classes** (`bg-red-600`, etc.) are fine in JSX className strings; only inline `style` prop values need tokens.
- **`tailwind.config.js`** already sources its palette from `src/theme/colors.ts` — do not duplicate the palette elsewhere.

## Adding New Tokens

Add to `src/theme/colors.ts` under the `theme` object if a new semantic use case emerges. Do not create a second theme file.

## Audit Command

To find any remaining hardcoded brand greens in the codebase:

```bash
rg "'#(298E4E|237040|C3EFD3|94E1B0|5EC986|37AE63|1D492D|205A36|E2F8EA|F3FCF6|0B2816|166534)'" src/
rg '"#(298E4E|237040|C3EFD3|94E1B0|5EC986|37AE63|1D492D|205A36|E2F8EA|F3FCF6|0B2816|166534)"' src/
```

Results should only appear inside `src/theme/colors.ts` itself.
