# Skill: dither-fade

Use the `<DitherFade>` component to add a textured depth shadow to any panel
that sits on a lower visual plane than an adjacent panel. The effect uses
ordered dithering (dot density zones) to create a risograph-style shadow —
intentionally coarser than a gradient.

## Component location
`src/components/ui/DitherFade.tsx`

## Props
| Prop         | Type              | Default     | Description                                      |
|--------------|-------------------|-------------|--------------------------------------------------|
| `height`     | number            | `40`        | Fade height in px                                |
| `color`      | string            | `#298E4E`   | Dot color (green-600 token)                      |
| `background` | string            | `#C3EFD3`   | Fill behind dots (app background token)          |
| `direction`  | `"up" \| "down"`  | `"up"`      | Density orientation (see below)                  |
| `className`  | string            | —           | NativeWind classes applied to the wrapper View   |

## When to use
- A list or panel that sits visually below another (e.g. Read below To Read)
- A completed/archived/secondary section beneath a primary one
- Any surface that should read as recessed or behind

## When NOT to use
- The two panels are on the same visual plane
- The list/panel is empty — never render the fade with no content beneath it
- You already have a hard border or divider doing separation — the fade
  replaces the divider, don't stack both

## Direction
- `direction="up"` — dense at top, dissolving downward. Use at the **top** of
  a recessed panel to simulate shadow falling from the panel above.
- `direction="down"` — dense at bottom, dissolving upward. Use at the
  **bottom** of an elevated panel to simulate it casting shadow downward.

## Usage examples

```tsx
// Top of a recessed Read list — shadow from the To Read panel above
{readBooks.length > 0 && <DitherFade direction="up" />}
{readBooks.map(...)}

// Subtle hint (24px)
<DitherFade direction="up" height={24} />

// Strong depth (56px)
<DitherFade direction="up" height={56} />

// Custom colors
<DitherFade color="#1D492D" background="#E2F8EA" />
```

## Rules
- Always condition on content: `{items.length > 0 && <DitherFade />}`
- Place flush against the panel edge — no padding between fade and border
- Dot color should be your palette's shadow tone (green-600), not neutral
  black — it should feel like a shadow cast within your color world
- Default 40px suits most list separations; use 24px for subtle, 56px for strong
