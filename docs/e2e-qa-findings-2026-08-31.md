# Tetherly end-to-end QA findings — 2026-08-31

## Executive summary

A local end-to-end QA pass was run against the Tetherly services. The frontend is available at `http://localhost:3000` and the Laravel API is available at `http://localhost:8000`.

The reported systemic CSRF failure was reproduced at the API boundary with a disposable account and fixed in the shared frontend API service. Mutations now coordinate CSRF refreshes and retry once on HTTP 419. Regression tests cover success and retry exhaustion.

The complete browser matrix remains blocked because repository-local Playwright is not installed/configured and the browser harness could not attach to Chrome in this WSL session. The workflow statuses below distinguish API/unit evidence from unverified browser behavior.

## Environment and evidence

- Repository: `/home/ransu/personal-projects/tetherly-bio-link`
- Branch: `fix/e2e-user-workflows`
- Frontend: `http://localhost:3000` — HTTP 200 confirmed with `curl`
- API: `http://localhost:8000`
- `/sanctum/csrf-cookie` — HTTP 204 with CSRF/session cookies
- Disposable account registration succeeded through the real Laravel API.
- Profile PATCH with the current token returned HTTP 200.
- Link POST with the stale token returned HTTP 419 `CSRF token mismatch`.
- Browser limitation: `browser_exec` reported `chrome-not-running`; desktop capture reported no DISPLAY/X11 reachable. Repository-local Playwright is not installed.
- No user credentials were requested or used.

## Findings and resolutions

### F-001 — Authenticated mutation requests had no CSRF recovery path

- **Severity:** Critical
- **Status:** Fixed and unit-regression-verified; direct cookie-aware API reproduction confirmed the original 419; full browser verification blocked by Playwright setup absence
- **Category:** Functional / Security boundary
- **Affected capabilities:** profile update, avatar upload/delete, link create/update/delete/reorder, publish/unpublish, account deletion request
- **Relevant source:** `apps/web/src/services/api.ts`, `apps/web/src/features/creator-workspace/*Api.ts`, `apps/web/src/features/account-deletion/accountDeletionApi.ts`
- **Root cause:** `apiService.csrf()` was called only during registration and login. Later mutations had no HTTP 419 refresh/retry path, and concurrent refreshes were not coordinated.
- **Fix:** Shared mutation wrapper refreshes `/sanctum/csrf-cookie` on one 419 and retries the original request once. CSRF refreshes share one in-flight promise. JSON and `FormData` request bodies are preserved. HTTP 419 receives a specific user-facing error mapping when recovery fails.
- **Fix commits:** `ff356d2`, `75a1757`, `c0e1342`, `89cb92b`
- **Verification commits:** `bc2b706`, `928e1ed`, `a6dde89`

### F-002 — Existing automated coverage missed browser-level Sanctum behavior

- **Severity:** High
- **Status:** Open / blocked
- **Category:** Test coverage / Functional
- **Expected:** A real browser or equivalent cookie-aware integration test should cover CSRF bootstrap, authentication, mutation, cookie rotation, and retry behavior.
- **Actual:** Existing jsdom and Laravel tests passed but did not cover the real browser/proxy cookie path. A repository Playwright harness was not present and could not be installed/executed during this session.
- **Next action:** Add the minimal repository-local Playwright setup and run the thirteen-workflow matrix when the runner is available.

## Thirteen-workflow acceptance matrix

| Workflow                     | Status                 | Evidence / blocker                                                                 |
| ---------------------------- | ---------------------- | ---------------------------------------------------------------------------------- |
| Registration                 | API verified           | Disposable registration returned HTTP 201                                          |
| Login/logout/session restore | Blocked                | Browser matrix unavailable                                                         |
| Draft profile editing        | API verified           | Profile PATCH returned HTTP 200; CSRF fix covered in unit tests                    |
| Avatar upload/delete         | Blocked                | Browser/upload replay not exercised                                                |
| Link creation                | Reproduced before fix  | Stale-token POST returned HTTP 419; post-fix browser/API client path not exercised |
| Link editing                 | Blocked                | Browser matrix unavailable                                                         |
| Link deletion                | Blocked                | Browser matrix unavailable                                                         |
| Link reordering              | Unit verified only     | Existing ordering tests pass; real persistence not browser-verified                |
| Publish                      | Blocked                | Browser matrix unavailable                                                         |
| Unpublish                    | Blocked                | Browser matrix unavailable                                                         |
| Public published profile     | Unit/API coverage only | Browser publication flow not verified                                              |
| Account deletion request     | Blocked                | Destructive real-stack flow not completed                                          |
| Pending-account restoration  | Unit/API coverage only | Browser restoration flow not verified                                              |

## Verification results

Passed after the fixes:

```text
pnpm type-check
passed

pnpm lint
passed

pnpm lint:styles
passed

pnpm build
passed

pnpm --filter @tetherly/web test:run
Test Files  8 passed (8)
Tests       33 passed (33)

cd apps/api && php artisan test
Tests: 42 passed (216 assertions)
```

## Commits

- `ff356d2` — `fix(web): recover from stale csrf tokens`
- `75a1757` — `test(web): cover csrf mutation recovery`
- `c0e1342` — `fix(web): coordinate concurrent csrf refreshes`
- `89cb92b` — `fix(web): explain unrecoverable csrf failures`
- `928e1ed` — `docs(qa): record reproduced csrf failure`
- `bc2b706` — `docs(qa): track csrf fix verification status`
- `a6dde89` — `docs(qa): record api boundary verification`

## Scope notes

The separate comprehensive responsive/accessibility/reduced-motion pass was intentionally deferred. Basic workflow operability remains part of the still-blocked browser matrix. No application code outside the CSRF boundary was changed because additional user-flow defects could not be honestly reproduced without browser execution.

The working tree is clean on `fix/e2e-user-workflows`.

## Next required step

Install or expose the repository-approved Playwright runner, then execute the disposable-account browser matrix. Do not treat this report as full E2E completion until all thirteen workflows are `Verified`, `Blocked`, or `Deferred` with browser evidence.
