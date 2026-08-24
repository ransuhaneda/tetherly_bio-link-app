# Tetherly design system

This project follows the same layered structure as the portfolio website while preserving Tetherly's existing palette.

## Layers

- **Source** — content and assets remain in `src/` and `public/`.
- **Sass foundation** — `src/assets/styles/abstracts/` owns color maps, typography, spacing, breakpoints, functions, and mixins.
- **Runtime tokens** — `src/assets/styles/base/_tokens.scss` exposes semantic CSS custom properties for components.
- **Global primitives** — reset, base, grid, typography, and helpers are composed by `src/assets/styles/App.scss`.
- **Components and pages** — CSS modules consume semantic tokens and existing Sass helpers; page-specific layout stays local.

## Token order

Use an existing semantic custom property first, then a Sass helper from `abstracts`, and only use a local literal for a genuinely one-off layout rule. Do not add new raw colors: extend `src/assets/styles/base/_colors.scss` only when the brand itself changes.

### Semantic groups

- Colors: `--color-text-*`, `--color-background-*`, `--color-action-*`, `--color-border-*`
- Spacing: `--space-2xs` through `--space-2xl`, `--space-section`
- Shape: `--radius-none`, `--radius-sm`, `--radius-md`, `--radius-pill`
- Motion: `--motion-fast`, `--motion-standard`, `--motion-ease-standard`
- Components: button, card, and form field sizing tokens

## Layout contract

Use `.container` for the shared max-width shell and `.sm-wrapper`, `.md-wrapper`, or `.lg-wrapper` for grid-column layouts. Keep responsive behavior at the established `768px` and `1024px` breakpoints unless a component needs a documented exception.

## Accessibility contract

Interactive controls use the `--target-min-size` (44px) minimum where practical, retain visible `:focus-visible` states, and respect reduced motion. Keep labels in markup rather than relying on placeholders.

## Validation

```bash
pnpm run lint
pnpm run lint:styles
pnpm run type-check
pnpm run build
```
