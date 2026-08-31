# Tetherly

Tetherly is an editorial creator bio-link product. This repository contains a React web application and a Laravel REST API backed by MySQL.

> **Status:** private and actively developed. Account authentication, creator profile and link editing, immutable publishing, the public `/@username` page, and recoverable account deletion are connected end to end. Analytics, Google OAuth, password reset, and production deployment automation remain unfinished.

## Architecture

```text
apps/web     Vite + React + TypeScript frontend
apps/api     Laravel 12 REST API
MySQL        Primary database
```

The browser communicates with Laravel through versioned JSON endpoints under `/api/v1`. The frontend never connects directly to MySQL. Sanctum provides cookie-based SPA authentication with CSRF protection; no bearer token is stored in local storage.

See [`docs/architecture.md`](docs/architecture.md) and [`docs/openapi.yaml`](docs/openapi.yaml) for the boundary and API contract.

## Requirements

- Node.js 24 and pnpm 11
- PHP 8.2 or newer with `pdo_mysql`, `mbstring`, `openssl`, `xml`, and `curl`
- Composer 2
- MySQL 8

## Install

```bash
pnpm install
cd apps/api
composer install
cd ../..
```

## Configure

Copy the environment examples:

```bash
cp .env.example .env.local
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

Set the MySQL database name, username, and password in `apps/api/.env`, then generate the Laravel key:

```bash
cd apps/api
php artisan key:generate
php artisan migrate
cd ../..
```

Do not commit `.env`, `.env.local`, credentials, application keys, or any other secrets.

## Run locally

Start the API in one terminal:

```bash
cd apps/api
php artisan serve --host=localhost --port=8000
```

Start the web app in another:

```bash
pnpm dev:web
```

Open [http://localhost:3000](http://localhost:3000). Vite proxies `/api` and `/sanctum` to the Laravel server.

## Account deletion operations

Deletion-request email uses Laravel's database queue. Run a queue worker anywhere account deletion requests can be accepted:

```bash
cd apps/api
php artisan queue:work --tries=3
```

The irreversible purge is registered with Laravel's scheduler at **03:00 UTC daily**. For local scheduler testing, run:

```bash
cd apps/api
php artisan schedule:work
```

Production must invoke `schedule:run` every minute from cron or the platform scheduler:

```cron
* * * * * cd /path/to/tetherly/apps/api && php artisan schedule:run >> /dev/null 2>&1
```

The scheduled command is bounded to 100 accounts per run by default. Operators may run `php artisan accounts:purge-deleted --limit=100` directly, with an allowed limit from 1 to 500. Keep `SESSION_DRIVER=database` so request-time sign-out and purge can remove account sessions deterministically.

Purge deletes required external files before database records. A storage failure keeps the account inaccessible, preserves its username reservation, records a safe operational failure, and makes it eligible for a later scheduled retry. Successful purge removes the lifecycle record with the account and releases the username.

## Verify

Frontend checks:

```bash
pnpm type-check
pnpm lint
pnpm lint:styles
pnpm test:run
pnpm build
```

API checks:

```bash
cd apps/api
php artisan test
```

The API tests require a configured MySQL test database. CI provisions MySQL 8 automatically.

## Repository structure

```text
apps/
├── web/                 React application, assets, routes, API client
└── api/                 Laravel application, migrations, API routes, tests
docs/
├── architecture.md     Runtime boundaries and ownership
└── openapi.yaml        Versioned API contract
.github/workflows/ci.yml Continuous integration for web and API
```

## Development conventions

- Keep UI and feature state in `apps/web`; centralize network calls in its API client and feature modules.
- Keep validation in Laravel FormRequests, response shaping in API Resources, and business logic in focused services/actions.
- Add schema changes as Laravel migrations and update the OpenAPI contract with endpoint changes. Publishing creates immutable snapshots so later draft edits do not change the live profile until the creator publishes again.
- Preserve Tetherly's existing design tokens, typography, assets, motion language, and responsive behavior.

## License

No license file or license declaration is currently included in this private repository.
