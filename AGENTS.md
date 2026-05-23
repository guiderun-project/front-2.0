# Agent Guidelines

These guidelines apply to automated coding agents working in this repository.
Keep `AGENTS.md` and `CLAUDE.md` aligned when changing agent instructions.

## Project Overview

- This is a React + TypeScript + Vite frontend application.
- Styling is based on Emotion and the shared theme in `src/styles`.
- Routing is handled with React Router.
- Server communication is organized through the Axios API layer in `src/api`.
- Mock APIs are handled with MSW under `src/mocks`.
- Use the `@/` import alias for paths under `src`.

## Repository Structure

- `src/api/core`: Axios clients, token storage, and request helpers.
- `src/api/services`: Domain-specific API service modules.
- `src/api/types`: API request and response types.
- `src/api/constants`: Shared API constants.
- `src/components`: Shared app-wide components.
- `src/pages`: Route-level pages.
- `src/router`: Route definitions and path constants.
- `src/styles`: Theme, global styles, and design tokens.
- `src/mocks`: MSW handlers, fixtures, and mock setup.

## Development Commands

- `pnpm dev`: Start the Vite development server.
- `pnpm lint`: Run ESLint.
- `pnpm build`: Run TypeScript build and Vite production build.
- `pnpm preview`: Preview the production build locally.
- `pnpm msw:init`: Regenerate the MSW worker when needed.

## Implementation Workflow

- Inspect the relevant files before making changes, especially nearby components, API services, types, mocks, and style tokens.
- Make the smallest cohesive change that satisfies the request.
- Prefer existing conventions in `src/api`, `src/styles`, `src/components`, and `src/router` before adding new patterns.
- Keep code page-local by default while page development is still early. Promote code to shared locations only when reuse is clear.
- Avoid speculative folders, generic hooks, global state, or design-system components without a concrete current use case.
- Update related files in the same change when applicable: exports, types, mocks, fixtures, documentation, and examples.
- Keep `AGENTS.md` and `CLAUDE.md` aligned whenever agent instructions change.
- Before finishing, run the validation commands relevant to the changed area.

## Styling Guide

- Use Emotion `styled` APIs for component styles unless an existing local pattern uses another approach.
- Prefer Emotion `theme` tokens before writing raw CSS values.
- Use `theme.spacing` for spacing values that exist in the design system.
- Use `theme.radius` for border radius values that exist in the design system.
- Do not append `px` to `theme.spacing` or `theme.radius` values. They are already rem strings.
- Use `theme.pxToRem()` when a new rem value is needed from a px design spec.
- Use `theme.typography` or the shared `Text` component for typography whenever possible.
- Use semantic `theme.color` tokens for component colors.
- Keep existing raw values only when there is no matching token or changing the value would alter the intended design.
- Do not use raw hex, rgba, or CSS color names in shared components.
- Use primitive colors only for semantic token definitions, token documentation, swatch UI, or justified exceptions.
- If primitive colors are used directly, leave a short reason because primitive values may change.
- Use CSS variables and `data-color-mode` for light/dark behavior instead of hardcoding mode branches in components.
- Keep styles close to the component they belong to. Extract styling helpers only when they remove real duplication.
- Avoid creating broad layout primitives or design-system components before real repeated page use cases exist.

## Current Token Policy

- Spacing and radius tokens are rem-based.
- The rem conversion baseline is `16px = 1rem`.
- `fontWeight`, `spacing`, `radius`, `typography`, `pxToRem`, and `color` are available from Emotion `theme`.
- Color tokens are semantic CSS variable references.
- Prefer `theme.color` in app UI and reserve `theme.colorPrimitive` for token infrastructure or documented exceptions.

## Extending Theme Tokens

- Do not invent new theme tokens inline inside components.
- Add new tokens under `src/styles/tokens`.
- Expose new token groups through `src/styles/theme.ts`.
- Update `src/styles/emotion.d.ts` when extending theme fields.
- Prefer semantic token names over component-specific names unless the token is intentionally component-scoped.

## Shared Components

- When adding or modifying shared components, update the related documentation, examples, exports, and usage references in the same change.
- Shared components intended for app-wide use must be exported from the appropriate barrel file, such as `src/components/index.ts`.
- Shared component styles should prefer existing Emotion `theme` tokens over hardcoded CSS values.
- If a shared component introduces or changes props, update all affected call sites and examples to reflect the intended API.
- Do not leave temporary demo-only component usage in pages unless it is intentionally part of the current UI.
- Do not promote page-specific UI to `src/components` until reuse across pages is clear.

## API Layer

- Do not call Axios directly from UI components. Add or update a service module under `src/api/services`.
- Use API request and response types from `src/api/types`.
- Use `publicApi` for public endpoints, `privateApi` for authenticated endpoints, and `optionalAuthApi` for endpoints that support both guest and authenticated users.
- Wrap API service calls with `handleApiRequest`.
- Keep API method names consistent with the existing service style.
- When an API contract changes, update related service methods, types, mocks, and fixtures together.
- Keep authentication and token refresh behavior inside `src/api/core`.

## Mocking

- Keep MSW handlers aligned with API service behavior.
- Update fixtures when request or response shapes change.
- Prefer realistic mock data that reflects actual API contracts.
- Do not remove or bypass mocks unless the task explicitly requires it.

## Page Development Policy

Page-level conventions are still intentionally light because full page development has not started yet.

- Prefer page-local components, hooks, and helpers first.
- Promote code to shared locations only when reuse across pages is clear.
- When introducing the first pattern for forms, data fetching, layouts, loading states, empty states, or error states, keep the implementation small.
- Update these guidelines only after a pattern proves reusable.
- Avoid broad abstractions before at least one real page use case exists.

## Accessibility

- Prefer semantic HTML elements such as `button`, `a`, `label`, `input`, and `section`.
- Avoid clickable `div` or `span` elements when a semantic element is available.
- Provide accessible names for icon-only buttons and form controls.
- Preserve keyboard interaction and visible focus states.
- Do not communicate important state through color alone.
- Consider loading, disabled, error, and empty states for interactive UI.

## Environment Variables

- Client-exposed environment variables must use the `VITE_` prefix.
- `VITE_API_BASE_URL` is required for the app to start.
- Update `.env.example` whenever adding or changing environment variables.
- Do not put secrets in frontend environment variables.

## Validation

Before finishing style, theme, or shared component changes, run:

- `pnpm lint`
- `pnpm build`

For API contract changes, also verify related service types, MSW handlers, and fixtures.

If validation cannot be run, mention the reason clearly in the final response.
