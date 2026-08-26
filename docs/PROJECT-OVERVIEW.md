# Tetherly project overview

## What Tetherly is

Tetherly is a creator bio-link product and frontend prototype. It gives a creator or small personal brand one memorable URL that gathers their work, community, social channels, and other destinations into a single authored profile. The current repository is the public-facing React experience for that product: a landing page, profile/link preview, username creation flow, and supporting route scaffolding.

The product thesis is simple: a bio-link page should feel like a small editorial profile, not a crowded directory. A visitor should understand the value proposition quickly and reach the next action without hunting.

## Current project scope

This repository is a private, actively developed Vite + React 19 + TypeScript frontend plus a Laravel API foundation. It includes:

- A responsive landing page with the approved headline, supporting copy, and `Create Your Tether` username form.
- A profile/link preview that demonstrates the intended creator destination.
- Lazy-loaded routes for `/`, `/login`, `/signup`, `/about`, and `/pricing`.
- Shared layout and UI components, local responsive image handling, Sass design tokens, SEO metadata, and Vitest setup.
- A development `/api` proxy boundary for the Laravel service.
- Sanctum authentication, profile persistence, profile/avatar API operations, link CRUD/order APIs, and a protected dashboard shell.

The product roadmap also includes a comprehensive, creator-facing analytics offer. Analytics should show where visitors came from, which links or destinations they used next, and the key audience and funnel patterns between those steps. It must be designed for quick comprehension: clear summary metrics first, skimmable charts and tables second, and deeper detail available without making the creator decode a dense reporting dashboard.

Publishing, public profile lookup, creator editing UI, analytics, and production deployment behavior are not implemented yet. Login, signup, dashboard, and API screens must be read according to their actual contract and state rather than treated as proof that deferred features are complete.

## Intended users and problem

The primary users are creators, freelancers, independent professionals, and small personal brands who currently spread their audience across many URLs. Their problem is not a lack of places to publish; it is the friction and visual inconsistency of sending people to several destinations. Tetherly should make the handoff from a social profile to a creator's wider web presence clear, fast, and memorable.

The primary visitor success criterion is that a first-time visitor understands what Tetherly does within five seconds and can submit a username without searching for the control.

## Competitive landscape

Tetherly operates in the creator link-in-bio and lightweight personal-site category. The relevant comparison set is:

- **Linktree** — the category benchmark and the most recognizable link-directory model. Tetherly should be calmer, more editorial, and less template-like rather than trying to out-feature it immediately.
- **Beacons** — a creator business platform with monetization, media, and audience tools. It represents the broader “creator operating system” direction that Tetherly may eventually integrate with, while Tetherly currently stays focused on the profile and link experience.
- **Carrd** — a flexible low-cost one-page site builder. Carrd is a useful benchmark for simplicity and control, but Tetherly is purpose-built around the bio-link use case and a faster setup path.
- **Later Linkin.bio** — a social-commerce-oriented link hub. It highlights the value of routing social traffic into multiple destinations, while Tetherly is intentionally more platform-neutral and personal-brand-led.
- **Stan Store and similar creator storefronts** — commerce-first alternatives that turn the bio link into a product or offer funnel. They are adjacent competitors; Tetherly's near-term distinction is an authored identity and clean destination hierarchy before storefront complexity.

These are strategic reference points, not instructions to copy their interfaces, copy, or visual identity. The product should win on clarity, taste, speed, and a more personal presentation.

## Design direction

The approved direction is **Editorial Bento Profile**: a dark, warm, high-contrast profile system with disciplined asymmetry and restrained motion.

- **Composition:** identity, headline, supporting copy, username form, profile/link preview, proof or content cards, final CTA, then footer. Desktop uses a 12-column composition; mobile preserves the same reading order in one column.
- **Surfaces:** near-black matte backgrounds, warm-white type, thin neutral borders, one restrained shadow, and subtle grain only. No gradients, glassmorphism, generic blobs, or decorative bento tiles.
- **Typography:** Oswald for display and utility labels; Nunito for body copy, controls, and links. The headline should have an intentional wide-screen break and natural mobile wrapping.
- **Color:** retain the existing brand tokens—near-black, warm white, orange action accents, violet and lime secondary accents. Orange signals primary actions; violet and lime are used sparingly for categories, status, and highlights.
- **Layout:** a centered `lg-wrapper`, 24px minimum outer gutter, an 8px spacing rhythm, readable text measures, and asymmetric card spans that create editorial pacing without clutter.
- **Motion:** staged first-load hierarchy, small one-time scroll reveals, subtle card lift on hover/focus, and explicit form feedback. Motion should clarify sequence and state, respect reduced-motion preferences, and never compromise first paint or usability.
- **Assets and icons:** use the approved local image assets and `react-icons`; inspiration-capture images are research only and must not ship as product assets.

The visual reference material is directional research. It can inform whitespace, framing, crop, and reveal timing, but it must not be reproduced as a template or copied composition.

## Final goal

The final product goal is a production-ready Tetherly service that lets a creator claim a username, build and publish an attractive link profile, and share one durable URL everywhere. The public page should be immediately legible, fast on mobile, accessible by keyboard and touch, and distinctive enough to feel authored rather than generic.

A successful first release should preserve the current design thesis while adding the product foundations behind it: reliable account and profile data, link management, publishing, dependable routing, and a clear path from landing-page signup to a live creator page. Analytics is a core expansion of that product: creators should be able to quickly understand acquisition sources, visitor movement, high-performing links, and meaningful conversion or sales-funnel signals. Feature growth should not turn the product into a noisy dashboard; the analytics experience should prioritize plain-language summaries, hierarchy, comparison, and skimmability.

As a later feature, Tetherly should use those analytics signals to provide **Suggestions**: practical, explainable recommendations for improving engagement or a sales funnel. Suggestions should connect each recommendation to observed evidence (for example, a strong traffic source with a weak downstream click-through), state the likely action, and make clear whether the advice is informational or an experiment to test. They should assist the creator's judgment rather than pretend to automate strategy or invent conclusions from insufficient data.

## Source of truth

Use these documents together when making project decisions:

- [`docs/DESIGN-BRIEF.md`](./DESIGN-BRIEF.md) — approved product direction, copy constraints, assets, layout, responsive behavior, motion, and acceptance checkpoints.
- [`docs/DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) — tokens, typography, layout contracts, accessibility, and validation commands.
- [`docs/PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) — source organization and file-placement guidance.
- [`AGENTS.md`](../AGENTS.md) — project-specific implementation rules.
