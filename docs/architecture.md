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

## Environments

- Root `.env.example` documents shared development values.
- `apps/web/.env.example` contains only `VITE_*` values safe for the browser.
- `apps/api/.env.example` contains Laravel, MySQL, CORS, Sanctum, and session settings. Real `.env` files and credentials are never committed.
- Development runs the frontend on port 3000 and the API on port 8000. Deployments may host them independently behind HTTPS.
