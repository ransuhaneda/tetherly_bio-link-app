# Tetherly Bio Link

Tetherly is a React landing page for a creator bio-link product: one considered URL for a creator’s work, community, and other online destinations.

> **Status:** private, actively developed frontend prototype.

## What is included

- Responsive Tetherly landing page with username form and profile preview
- Lazy-loaded routes for `/`, `/login`, `/signup`, `/about`, and `/pricing`
- Responsive local image processing through the Vite responsive-image plugin
- Shared layout, UI components, SEO metadata, Sass styles, and Vitest setup
- Development `/api` proxy targeting `http://localhost:8000`

The login, signup, content, and API-related screens are frontend scaffolding. This repository does not include a backend service or production authentication implementation.

## Requirements

- Node.js compatible with the versions supported by the current Vite and TypeScript dependencies
- pnpm

## Install

```bash
pnpm install
```

## Configure environment variables

Copy the example file when you need to override the defaults:

```bash
cp .env.example .env.local
```

The Vite client reads variables prefixed with `VITE_`. The example file documents the available application, mode, public-path, and API URL settings. Do not put secrets in client-exposed `VITE_` variables or commit `.env.local`.

## Run locally

Start the Vite development server on port `3000`:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Requests to `/api` are proxied to `http://localhost:8000` by the Vite configuration; the frontend can still run without that backend while using the prototype screens.

## Build and preview

Create the production bundle:

```bash
pnpm build
```

The generated site is written to `dist/`. Preview that bundle locally with:

```bash
pnpm preview
```

## Verify changes

Run the checks relevant to your change:

```bash
pnpm type-check
pnpm lint
pnpm lint:styles
pnpm test:run
pnpm format:check
```

Useful development commands include `pnpm test` for watch mode, `pnpm test:ui` for the Vitest UI, and `pnpm coverage` for a coverage report.

## Project structure

```text
src/
├── app/                 Router and application shell
├── assets/              Local images and Sass design tokens
├── components/          Shared layout and UI components
├── pages/               Route-level pages, including auth screens
├── services/            API client boundary
├── types/               Environment and API types
└── test/                Vitest setup
```

See [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md) for the repository’s fuller source tree and [`docs/DESIGN-BRIEF.md`](docs/DESIGN-BRIEF.md) for the product and visual direction.

## Contributing

Keep changes focused, preserve the existing content and design tokens, and run the relevant verification commands before opening a change. Husky hooks and lint-staged are configured for local commits.

## License

No license file or license declaration is currently included in this private repository.
