# Tetherly architecture

```text
Browser
  │
  ▼
apps/web (Vite + React + TypeScript)
  │ HTTPS / JSON, Sanctum session cookies
  ▼
apps/api (Laravel 12 REST API)
  │ Eloquent / migrations
  ▼
MySQL
```

## Boundaries

- `apps/web` owns the public UI, route-level pages, feature state, and the typed API client. It never connects to MySQL.
- `apps/api` owns authentication, validation, authorization, response resources, business actions, and database access.
- MySQL is the source of persisted user and profile data. Migrations in `apps/api/database/migrations` are the schema source of truth.

## Authentication

The first-party SPA uses Laravel Sanctum's cookie-based session flow. The frontend requests `/sanctum/csrf-cookie`, then calls `/api/v1/*` with credentialed Axios requests. No bearer token or secret is stored in browser storage. Google OAuth and password reset remain deferred.

## API organization

Public endpoints are versioned under `/api/v1`. Controllers live in `apps/api/app/Http/Controllers/Api/V1`, validation uses FormRequests, response shape uses API Resources, and substantial registration work is handled by `RegisterUser`. Add new endpoints to `routes/api.php`, then update `docs/openapi.yaml` and the relevant feature tests.

## Publishing

The authenticated profile and links are always the editable draft. Publishing runs transactionally and stores the next immutable `publication_snapshots` version, then points the profile at that selected snapshot. Public `GET /api/v1/profiles/{username}` reads only the selected snapshot and never reads live draft fields. Later edits remain private until another publish; unpublishing clears the selected snapshot pointer without deleting draft data or snapshot history.

## Recoverable account deletion

Account deletion uses a dedicated `account_deletions` lifecycle record. A password-confirmed request transactionally unpublishes the profile, captures the request-time email, fixes one 30-day UTC recovery deadline, invalidates sessions, and queues a confirmation email. Public and authenticated profile access reject every access-restricted deletion state.

Valid credentials during the recovery window establish only a limited server-side restoration session. They do not authenticate the creator into the workspace. Explicit restoration marks the lifecycle restored, authenticates the account, and keeps the profile as an unpublished draft while preserving publication snapshots.

`accounts:purge-deleted` claims eligible records in bounded batches. External files are removed before the account's database transaction; a failed file cleanup retains the inaccessible account and username for retry. Laravel's scheduler runs the bounded command daily at 03:00 UTC without overlap.

## Environments

- Root `.env.example` documents shared development values.
- `apps/web/.env.example` contains only `VITE_*` values safe for the browser.
- `apps/api/.env.example` contains Laravel, MySQL, CORS, Sanctum, and session settings. Real `.env` files and credentials are never committed.
- Development runs the frontend on port 3000 and the API on port 8000. Deployments may host them independently behind HTTPS.
