# Tetherly Backend Specification

## Purpose

The backend is the secure, versioned service behind Tetherly's creator accounts, usernames, profiles, links, publishing, and analytics. It turns the current frontend prototype into a production-ready service while keeping authentication, validation, authorization, and persistence out of the browser.

## Scope and baseline

- Laravel 12 REST API in `apps/api`.
- MySQL is the production source of truth; migrations under `apps/api/database/migrations` define the schema.
- Public API routes are versioned under `/api/v1`.
- Laravel Sanctum provides first-party SPA cookie sessions with CSRF protection.
- Controllers belong in `app/Http/Controllers/Api/V1`; FormRequests validate input; API Resources define response envelopes; domain actions hold substantial workflows.

The current foundation covers username availability, register/login/session/logout, authenticated profile read/update/avatar operations, and authenticated link CRUD/order operations. Publishing, public profile lookup, analytics, Suggestions, password reset, and Google OAuth remain deferred capabilities and must be implemented as explicit contracts rather than inferred from frontend scaffolding.

## Product outcomes

- A creator can claim a unique username, create an account, and receive an authenticated session.
- A creator can manage an authored profile and ordered destinations, then publish one durable public URL.
- A visitor can retrieve a published profile quickly without authentication.
- A creator can understand acquisition sources, visitor movement, high-performing links, and meaningful funnel signals through clear analytics summaries.
- Later Suggestions are explainable recommendations grounded in observed data, with uncertainty and experiment status made explicit.

## Core domain model

Minimum persisted entities:

- **User:** name, email, password hash, timestamps, verified status as required by product policy.
- **Profile:** one-to-one with user; unique username, display name, bio, avatar/theme settings, publication status, timestamps.
- **Link:** belongs to profile; label, URL, optional icon/category, display order, enabled status, timestamps.
- **Analytics event:** profile/page view, referrer/source, destination click, timestamp, anonymized technical metadata subject to privacy policy.
- **Suggestion (later):** evidence references, recommendation, expected action, informational/experiment classification, status, timestamps.

Enforce username uniqueness and normalized lookup semantics at the database layer, not only in request validation. Use foreign keys, indexes for public lookup and event aggregation, and transactional writes for registration and publishing.

## API contract

The canonical contract is `docs/openapi.yaml`. Keep it synchronized with implementation and generated/client types.

### Implemented foundation

- `GET /sanctum/csrf-cookie` — establish the CSRF cookie.
- `GET /api/v1/usernames/{username}/availability` — validate and report availability; rate-limit abuse.
- `POST /api/v1/auth/register` — validate name, email, username, password confirmation; create user and profile atomically; authenticate the session.
- `POST /api/v1/auth/login` — authenticate email/password and establish the session.
- `GET /api/v1/auth/me` — return the authenticated user and profile summary.
- `POST /api/v1/auth/logout` — invalidate the current session.
- `GET/PATCH /api/v1/profile` — read or update the authenticated draft profile.
- `POST|PUT/DELETE /api/v1/profile/avatar` — replace or remove the authenticated avatar.
- `GET/POST /api/v1/profile/links` — list or create authenticated draft links.
- `PUT /api/v1/profile/links/order` — transactionally reorder owned links.
- `PATCH|DELETE /api/v1/profile/links/{link}` — update or remove an owned draft link.

### Planned resource groups

- Draft preview and publish/unpublish actions with authorization checks.
- Public `GET /api/v1/profiles/{username}` for published profile data only.
- Authenticated analytics summary, time-series, acquisition, destination, and funnel endpoints with bounded date ranges and pagination where needed.
- Suggestions endpoint that returns evidence-backed recommendations and marks whether each item is informational or an experiment.

## Security and privacy

- Use Sanctum cookie sessions; never issue or require browser-stored bearer tokens for the first-party SPA.
- Require CSRF protection and credentialed CORS for the configured frontend origin.
- Apply FormRequest validation, authorization policies, mass-assignment protection, and rate limits to availability and authentication endpoints.
- Normalize usernames consistently and prevent reserved/system names.
- Hash passwords with Laravel's configured driver; do not log credentials, session identifiers, or raw sensitive payloads.
- Validate and safely render destination URLs; prevent open redirects and unsafe schemes.
- Minimize analytics data, document retention and consent requirements, and avoid storing unnecessary identifying data.

## Reliability and operations

- Use transactions for registration, username changes, link ordering updates, and publishing.
- Return stable JSON envelopes (`data`, `message`, and field-level `errors`) with appropriate HTTP status codes.
- Keep API error messages safe for clients while logging actionable server context without secrets.
- Add feature tests for authorization boundaries, validation, uniqueness races, session behavior, public/private visibility, analytics aggregation, and rate limiting.
- Run migrations and seeders deterministically across development, CI, and deployment environments.
- Configure queueable analytics aggregation when event volume requires it; public profile reads should remain fast through indexed queries and cacheable responses.

## Definition of done

- Every shipped endpoint is represented in `docs/openapi.yaml`, covered by feature tests, and consumed through a named frontend contract.
- Registration cannot create duplicate usernames or partially-created accounts.
- Private drafts and analytics never leak through public profile responses.
- Published profiles resolve by username over HTTPS with predictable cache and invalidation behavior.
- Analytics summaries are comprehensible, bounded, privacy-aware, and reproducible from stored events.
- Backend tests pass, migrations are clean on a fresh database, and no credentials or secrets enter source control or logs.
