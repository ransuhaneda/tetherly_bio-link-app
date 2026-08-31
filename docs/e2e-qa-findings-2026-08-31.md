# Tetherly end-to-end QA findings — 2026-08-31

## Executive summary

A local end-to-end QA pass was started against the running Tetherly services. The frontend is available at `http://localhost:3000` and the Laravel API is available at `http://localhost:8000`.

The highest-risk finding is a likely systemic CSRF failure affecting authenticated mutations. The frontend explicitly obtains the Sanctum CSRF cookie during registration and login, but every later mutation (profile update, avatar changes, link CRUD/reorder, publish/unpublish, and account deletion) relies on the original cookie/session state and has no shared CSRF refresh/retry path. This matches the reported CSRF token mismatch behavior on editing capabilities. The implementation should be reproduced in a real authenticated browser session before applying a fix; this run could not create/use a browser session because the available browser harness reported that Chrome was not running and the WSL desktop has no reachable X11 display.

Automated tests currently pass, but they do not exercise the browser's cookie/header behavior against a running Laravel server.

## Environment and evidence

- Repository: `/home/ransu/personal-projects/tetherly-bio-link`
- Branch: `development`
- Frontend: Vite, port 3000, HTTP 200 confirmed with `curl`
- API: Laravel, port 8000, `/sanctum/csrf-cookie` returned HTTP 204
- CSRF endpoint response included `XSRF-TOKEN` and `tetherly-api-session` cookies, with `Access-Control-Allow-Origin: http://localhost:3000` and credentials enabled.
- Browser limitation: `browser_exec` reported `chrome-not-running`; desktop capture reported no DISPLAY/X11 reachable. No account credentials were requested or used.

## Findings

### F-001 — Authenticated mutation requests have no CSRF recovery path

- **Severity:** Critical (reported production workflow blocker; final severity should be confirmed after authenticated reproduction)
- **Category:** Functional / Security boundary
- **Affected capabilities:**
  - Draft profile update (`PATCH /api/v1/profile`)
  - Avatar upload/delete
  - Link create/update/delete/reorder
  - Publish/unpublish
  - Account deletion request
- **Relevant source:** `apps/web/src/services/api.ts`, `apps/web/src/features/creator-workspace/*Api.ts`, `apps/web/src/features/account-deletion/accountDeletionApi.ts`
- **Expected:** After authentication, each credentialed state-changing request should carry a valid Sanctum CSRF token. If the token expires or becomes stale, the client should refresh `/sanctum/csrf-cookie` and retry once, without losing the user's edit.
- **Actual implementation:** `apiService.csrf()` is called by `authApi.register()` and `authApi.login()` only. The shared Axios instance has `withCredentials: true`, but there is no request interceptor, mutation wrapper, or 419 retry handler that refreshes the CSRF cookie. All workspace mutation APIs call `apiService.post/patch/put/delete` directly.
- **Reproduction status:** Reproduced against the running Laravel stack with a disposable account: profile PATCH succeeded with the captured token, then a link POST using the stale pre-mutation token returned HTTP 419 `CSRF token mismatch`. The browser harness remained unavailable, so automatic cookie/header refresh was not directly observed in Chrome.
- **Evidence:**
  - `apps/web/src/services/api.ts:23-25`: CSRF bootstrap is a standalone call.
  - `apps/web/src/features/auth/authApi.ts:26` and `:34`: bootstrap occurs only before register/login.
  - `apps/web/src/features/creator-workspace/profileApi.ts`, `linksApi.ts`, and `publicationApi.ts`: mutations do not bootstrap or recover CSRF.
  - `apps/api/routes/api.php:28-48`: mutation routes use Laravel `web` middleware and therefore require CSRF validation.

### F-002 — Existing automated coverage misses browser-level Sanctum behavior

- **Severity:** High
- **Category:** Test coverage / Functional
- **Expected:** CI should include at least one browser or HTTP integration test that obtains `/sanctum/csrf-cookie`, authenticates, and performs a representative authenticated mutation with cookies and the XSRF header.
- **Actual:** Web tests are jsdom/unit-style tests; API feature tests use Laravel's test client and pass without exercising the real cross-origin/proxy cookie flow. No authenticated browser mutation test was executed in this pass.
- **Evidence:** `pnpm test:run` passed 8 files / 31 tests; `php artisan test` passed 42 tests / 216 assertions, but neither suite proves the localhost browser flow.

## Tested / not tested

### Completed

- Repository guidance, Git status, recent commits, scripts, routes, API client, and Sanctum configuration inspected.
- Frontend HTTP availability checked.
- Laravel CSRF bootstrap endpoint checked.
- Frontend automated test suite executed.
- Laravel feature test suite executed.

### Blocked or not completed

- Real account registration/login in a browser.
- Profile editing and persistence through the UI.
- Avatar upload/delete.
- Link creation, editing, deletion, and drag reorder.
- Publish/unpublish and public profile verification.
- Account deletion and restoration UI flow.
- Browser console/network capture and screenshots.

## Recommended next verification

1. Run Chrome with remote debugging accessible to the browser harness, or run the repository's Playwright setup directly under WSL.
2. Use a disposable local test account and capture cookies plus request/response details for login followed by `PATCH /api/v1/profile`.
3. Confirm whether the failure is HTTP 419 and whether the request contains an `X-XSRF-TOKEN` header matching the current `XSRF-TOKEN` cookie.
4. Add a regression test at the browser/API boundary before changing implementation.
5. Prefer one centralized Axios response interceptor: on a single 419 response, refresh `/sanctum/csrf-cookie`, then retry the original request once; prevent retry loops and preserve the original request body/FormData.
6. Re-run the full mutation matrix and document exact pass/fail evidence here.

## Automated verification output

```text
pnpm test:run
Test Files  8 passed (8)
Tests       31 passed (31)

cd apps/api && php artisan test
Tests:      42 passed (216 assertions)
```

These results establish that the existing unit/API suites pass; they do not close F-001 because the failing browser cookie/header path is outside their coverage.

## Change log

No application code was changed during this QA pass. This document is the only new artifact.

## Summary table

| ID    | Severity   | Area                                   | Status                                            |
| ----- | ---------- | -------------------------------------- | ------------------------------------------------- |
| F-001 | Critical\* | CSRF for authenticated mutations       | Code-confirmed risk; browser reproduction blocked |
| F-002 | High       | Missing browser-level Sanctum coverage | Confirmed                                         |

`*` Critical reflects the user's report that all editing capabilities are blocked. Reclassify after a real authenticated request capture if the failure is narrower.

## Notes

This report intentionally records findings rather than applying a speculative fix. The CSRF implementation should be changed only after the exact failing request and cookie/header state are captured, then protected by a regression test.
