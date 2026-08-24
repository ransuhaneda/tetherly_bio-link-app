# Project Agent Instructions

These are project-specific additions to the global `/home/ransu/.codex/AGENTS.md`. Do not duplicate global rules here; update this file only when this project has a stronger or more specific convention.

## React, content, and styling

- Use `react-icons` as the default icon source. Do not create custom SVG icons if it already exists or use text glyphs/symbol characters as icon substitutes.
- Use GSAP for animation work in this project. Do not introduce a second animation library or replace GSAP with ad hoc animation systems.
- Keep content in the project's established source/data locations rather than duplicating copy across React components.
- Prefer small, composable React components and the existing routing/state patterns. Keep unknown external/API data behind named domain contracts at the I/O boundary.
- Preserve the existing visual language when making UI changes: palette, typography, spacing rhythm, motion, assets, responsive behavior, and named affordances remain unchanged unless the request says otherwise.
- Prefer token-driven SCSS and existing semantic variables over repeated one-off literals. Keep wrapper widths and shared layout responsibilities owned by their established primitives.
- Treat screenshots, readability, responsive layout, centering, and interaction behavior as acceptance checks for visual work; source edits alone are not visual proof.

## Validation and generated files

- Validate at the layer affected by the change: use the relevant project scripts for type-checking, linting, stylelint, tests, builds, and rendered/browser checks.
- Keep agent plans, notes, reference material, and generated working documents out of the repository root; use `agent-generated-docs/` when the project has it, otherwise a clearly named ignored folder.
- Keep Playwright/browser screenshots, snapshots, traces, and MCP output in the repository's ignored `.playwright/`, `.playwright-cli/`, or `.playwright-mcp/` folders.

## Project-specific notes

- The app is a Vite + React + TypeScript project. Use the existing `package.json` scripts for development, linting, styling checks, tests, type-checking, and builds.
- Keep primary application source under `src/` and static assets under `public/`; do not place generated verification artifacts in either location.
- Update the README when setup, environment variables, scripts, or contributor workflow materially changes.

## Design-system documentation

- Read `docs/DESIGN-SYSTEM.md` before making visual or interaction changes. Treat it as the canonical reference for tokens, typography, color, spacing, components, icon usage, and motion direction.
- Use `docs/DESIGN-BRIEF.md` for the approved product direction, content constraints, assets, and named interactions.
- Use `docs/PROJECT_STRUCTURE.md` to preserve the project's source and feature organization when adding or moving files.
- Keep implementation aligned with these documents; update the relevant document when an intentional design-system decision changes.
