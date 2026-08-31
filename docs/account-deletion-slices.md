# Recoverable account deletion — implementation slices

This plan breaks the seventh publishing milestone into independently implementable slices. It reflects the decisions recorded in `docs/adr/0001-recoverable-account-deletion.md`, `docs/publishing-vertical-slice.md`, and the design review completed on 2026-08-30.

## Product invariants

- Deletion applies to the entire **Account**, not only its Draft Profile.
- A deletion request immediately unpublishes the account, signs the creator out, and makes public lookup return `404`.
- The account enters **Pending Deletion** for 30 days. All account-owned data remains recoverable but inaccessible.
- The username remains reserved during Pending Deletion.
- Restoration requires explicit authentication through the normal login flow. Login never restores silently.
- Restoration returns an unpublished Draft Profile and preserves publication history.
- The stored recovery deadline is authoritative. Restoration is unavailable after it, even if physical purge has not run.
- **Purge** is irreversible and releases the username only after required cleanup succeeds.
- All account-associated data, including future analytics data, is deleted during purge.
- The product shows the exact calendar deletion date, not a live days-remaining counter.
- No unauthenticated restore token or direct account-action link is included in the email.

## Slices

### 7.1 — Account-deletion domain and persistence

Implement the account-deletion lifecycle as a dedicated `account_deletions` table rather than adding lifecycle state to `users` or `profiles`.

Include:

- Account relationship
- Pending, restored, purge-eligible, purging, completed, and failed lifecycle states as needed by the implementation
- Request timestamp
- Authoritative recovery/deletion deadline
- Captured email address at request time
- Purge attempt count, last error, and next retry timestamp
- Indexed lookup for eligible deletion records
- Constraints preventing multiple active deletion records for one account
- Model casts, relationships, and tests

### 7.2 — Request-deletion API

Add an authenticated endpoint for requesting account deletion.

Behavior:

- Require the current password.
- Rate-limit failed confirmation to five attempts per minute per account and IP.
- Return `Retry-After` and a machine-readable retry value on `429`.
- Make repeated requests idempotent: return the existing deletion state/date without resetting the deadline.
- Capture the current account email at request time.
- Immediately unpublish, mark Pending Deletion, reserve the username, invalidate the session, and regenerate the session token.
- Use a transaction for the account state transition.
- Keep errors safe and do not log passwords, sessions, or sensitive payloads.

### 7.3 — Deletion-request email

Send one immediate deletion-request confirmation to the email captured when deletion was requested.

The message includes:

- Request date
- Calendar deletion date
- Username
- Public-visibility state
- Instructions for the authenticated normal-login restoration path
- Security guidance

Use Laravel's normal queued mail path. Email delivery failure does not roll back deletion; failed delivery is logged/queued for retry. Do not send a final post-purge confirmation.

### 7.4 — Recovery-aware authentication and restoration

Update login behavior for Pending Deletion accounts.

Behavior:

- Valid credentials for an account still inside the recovery window open an explicit Restore Account screen.
- No workspace access is granted before restoration.
- The creator may restore or log out.
- Restoration checks the stored deadline.
- Restoration marks the account active, clears pending-deletion state, and returns an unpublished draft.
- Publication snapshots remain preserved.
- Expired accounts cannot be restored, even before physical purge; login shows an unavailable-account outcome without exposing lifecycle details unnecessarily.

### 7.5 — Profile workspace Danger Zone

Add the Danger Zone at the bottom of the Profile workspace's Account section.

Include:

- Repository-deletion-style consequence list
- Current-password field
- Accessible confirmation modal and focus management
- Cancel action
- Loading, validation, API error, and rate-limit states
- API `Retry-After` countdown with Cancel still available
- Exact calendar deletion date after successful request
- Return to the logged-out public/auth shell after success

### 7.6 — Purge command and cleanup

Implement irreversible cleanup for accounts whose authoritative deadline has passed.

Delete all account-owned data:

- Account/user record
- Draft Profile
- Links
- Publication snapshots
- Account-associated analytics events
- Uploaded avatar and other external files
- Sessions
- Deletion lifecycle record after successful completion, or retain only the minimum operational record required by the final retention policy

Use bounded processing and idempotent behavior. Database deletion and external-file cleanup are separate phases because storage deletion is not transactional. If required external-file cleanup fails, keep the account inaccessible and username reserved, record the failure, and retry later.

### 7.7 — Daily purge scheduling

Register the purge process with Laravel's scheduler for **03:00 UTC daily**.

Include:

- Indexed bounded query for eligible records
- Safe retry behavior
- Operational logging without credentials or sensitive payloads
- Deterministic command/scheduler tests
- Documentation for queue and scheduler operation

### 7.8 — Contract synchronization and final verification

Synchronize and verify the complete feature.

Update:

- `docs/openapi.yaml`
- Backend request/resource/domain types
- Frontend API client/types
- Authentication route behavior
- Relevant feature and component tests

Verify:

- Active, pending-deletion, restored, expired, purging, failed, and purged states
- Public lookup returns `404` during Pending Deletion
- Repeated deletion requests do not extend recovery
- Rate limiting and `Retry-After`
- Email recipient and captured request-time address
- Restore never happens silently
- Restored accounts remain unpublished
- Publication history survives restoration
- Failed file cleanup retains access restrictions and username reservation
- Successful purge releases the username
- Fresh-database migrations
- Minimal frontend type-check, tests, and build

## Dependency order

```text
7.1 Domain and persistence
  ↓
7.2 Request-deletion API
  ├── 7.3 Deletion email
  └── 7.5 Danger Zone UI
  ↓
7.4 Recovery and restoration
  ↓
7.6 Purge and cleanup
  ↓
7.7 Daily scheduler
  ↓
7.8 Contracts and final verification
```

## Delivery rule

Implement one slice per branch/commit where practical. Each slice must have focused tests and pass the smallest relevant verification before moving to the next slice. Avoid implementing purge behavior before the deletion lifecycle and recovery semantics are stable.

## Explicitly deferred

These remain outside this milestone:

- Dynamic days-remaining countdown
- Cross-device editing locks
- Server-side optimistic concurrency unrelated to deletion
- Public themes
- Old-username redirects
- Google OAuth-specific deletion policy
- Unauthenticated restoration links or tokens
