# Agent Guidelines

These guidelines apply to automated coding agents working in this repository.
Keep `AGENTS.md` and `CLAUDE.md` aligned when changing agent instructions.

## Styling And Design Tokens

- Prefer Emotion `theme` tokens before writing raw CSS values.
- Use `theme.spacing` for spacing values that exist in the design system.
- Use `theme.radius` for border radius values that exist in the design system.
- Use `theme.pxToRem()` when a new rem value is needed from a px design spec.
- Do not append `px` to `theme.spacing` or `theme.radius` values. They are already rem strings.
- Use `theme.typography` or the shared `Text` component for typography whenever possible.
- Keep existing raw values only when there is no matching token or changing the value would alter the visual design.
- Do not invent new theme tokens inline inside components. Add them under `src/styles/tokens` and expose them through `src/styles/theme.ts`.
- When extending theme fields, update `src/styles/emotion.d.ts` so styled components receive correct types.

## Current Token Policy

- Spacing and radius tokens are rem-based.
- The rem conversion baseline is `16px = 1rem`.
- `fontWeight`, `spacing`, `radius`, `typography`, and `pxToRem` are available from Emotion `theme`.
- Color tokens are not defined yet, so raw color values are allowed until color tokens are added.

## Shared Components

- When adding or modifying shared components, update the related documentation, examples, exports, and usage references in the same change.
- Shared components intended for app-wide use must be exported from the appropriate barrel file, such as `src/components/index.ts`.
- Shared component styles should prefer existing Emotion `theme` tokens over hardcoded CSS values.
- If a shared component introduces or changes props, update all affected call sites and examples to reflect the intended API.
- Do not leave temporary demo-only component usage in pages unless it is intentionally part of the current UI.

## Validation

Before finishing style, theme, or shared component changes, run:

- `pnpm lint`
- `pnpm build`
