# Tetherly Frontend Specification

## Purpose

The frontend is the public, responsive React experience for Tetherly: a creator bio-link product that turns scattered destinations into one authored, memorable profile. It must make the value proposition clear within five seconds and make username creation the obvious next action.

## Scope

- Vite + React 19 + TypeScript application in `apps/web`.
- Public landing page, profile/link preview, authentication screens, pricing/about route scaffolding, and future creator dashboard surfaces.
- Typed HTTP client boundary for the Laravel API; the browser never accesses MySQL directly.
- Responsive, keyboard-accessible UI for 320px through large desktop widths.

Authentication, persistence, typed profile/link/publication APIs, the protected dashboard shell, creator editing and publishing, public profile rendering, and recoverable account deletion now exist. Analytics and production deployment behavior remain incomplete. Frontend screens must not imply unfinished capabilities are live.

## Product outcomes

- A visitor understands Tetherly's purpose immediately.
- A creator can submit a valid username with clear loading, validation, error, and success feedback.
- A published profile is fast, readable, shareable, and usable on touch and keyboard devices.
- The creator experience can grow into link management, publishing, analytics, and evidence-based Suggestions without discarding the editorial visual language.

## Experience requirements

### Information architecture

Maintain this reading order: identity, headline, supporting copy, username form, profile/link preview, proof or content cards, final call to action, footer. Preserve existing routes and named navigation actions: `/`, `/login`, `/signup`, `/about`, `/pricing`, `Log In`, and `Create an Account`.

### Visual system

- Use the existing tokens and palette: near-black surfaces, warm white type, orange primary actions, restrained violet and lime accents.
- Use local Nunito for body/UI and Oswald for display/utility text. Do not add remote font dependencies.
- Use a centered `lg-wrapper` (1312px maximum, 24px minimum gutter), an 8px spacing rhythm, and the established border/shadow language.
- Keep the Editorial Bento Profile direction: asymmetry and crop variation provide hierarchy; avoid gradients, glassmorphism, generic blobs, ornamental tiles, and invented social proof.
- Use approved local image assets only; reserve aspect-ratio space and lazy-load below-the-fold imagery.
- Use `react-icons` or accessible inline SVGs, never emoji or text glyphs as interface icons.

### Responsive behavior

- 320–767px: single column, full-width form controls, 44px minimum targets, safe-area bottom padding, no horizontal overflow.
- 768–1023px: two-column hero and two-column card rhythm where space permits.
- 1024px+: 12-column composition; copy spans columns 1–7 and preview spans 8–12; hero may occupy at least 72vh without trapping content.
- Verify 375, 768, 1024, and 1440px layouts for wrapping, crop, focus visibility, and layout stability.

### Interaction and accessibility

- Every interactive element is keyboard reachable with a visible `:focus-visible` state.
- Username submission works with Enter and preserves entered text after errors.
- Form states are explicit: idle, validating, loading, success, unavailable, invalid, and server error.
- The Profile workspace ends with a focused Danger Zone. Account deletion requires the current password in an accessible confirmation dialog, keeps Cancel available during API rate-limit countdowns, and shows the API's exact UTC calendar deletion date after success.
- Pending-account login never restores silently. It routes to an explicit restoration screen that explains the unpublished-draft result and offers Restore Account or Log Out.
- Maintain 4.5:1 text contrast and 44px touch targets.
- Honor `prefers-reduced-motion`: remove rise, stagger, parallax, and scroll-scrub while keeping content and feedback immediate.
- Use semantic landmarks, labels, status messaging, and route-level document metadata.

### Motion

Use the existing GSAP approach for approved motion work. Animate transform and opacity only: staged hero reveal, one-time viewport reveals, and small hover/focus lifts. Use short micro-interactions (about 160–220ms) and restrained section reveals (about 480–650ms). Motion must never delay form usability or cause layout shift.

## Application architecture

- Keep primary source under `apps/web/src` and organize by the existing route, component, feature, and style conventions.
- Keep copy in established content/data locations rather than duplicating strings across components.
- Keep API payloads behind named domain types and a single typed client boundary.
- Use route-level lazy loading where already established; preserve direct navigation and refresh behavior for all named routes.
- Keep design tokens in Sass abstracts and prefer semantic variables over one-off literals.

## API integration contract

Use credentialed Axios requests against `/api/v1` through the Vite development proxy. For Sanctum sessions, request `/sanctum/csrf-cookie` before state-changing authentication requests. Do not store bearer tokens or secrets in browser storage.

The frontend must consume and handle:

- `GET /api/v1/usernames/{username}/availability`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/recovery`
- `POST /api/v1/auth/restore`
- `POST /api/v1/account/deletion`
- `GET/PATCH /api/v1/profile`
- `POST|PUT/DELETE /api/v1/profile/avatar`
- `GET/POST /api/v1/profile/links`
- `PATCH|DELETE /api/v1/profile/links/{link}`
- `PUT /api/v1/profile/links/order`
- `POST /api/v1/profile/publish`
- `POST /api/v1/profile/unpublish`
- `GET /api/v1/profiles/{username}`

Publishing creates an immutable snapshot. Draft edits made afterward must not appear publicly until the creator publishes again. Unpublished profiles and unknown usernames both resolve as `404` through the public lookup contract.

Map `422`, `401`, `403`, and `429` responses into local, readable UI states without leaking raw implementation details. Account-deletion rate limits use the API's machine-readable `retry_after`; do not invent a client timer. Keep the OpenAPI document and frontend domain types synchronized when contracts change.

## Definition of done

- Existing approved copy, palette, typography, assets, routes, and named actions remain intact.
- No page introduces invented claims, metrics, testimonials, or unfinished backend behavior.
- Type-check, lint, style lint, tests, and build pass for the affected scope.
- Browser checks confirm keyboard flow, form feedback, responsive layouts, route resolution, reduced-motion behavior, and no horizontal scrolling.
