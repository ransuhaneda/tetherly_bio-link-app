# Publishing vertical slice

This document records the agreed implementation sequence and product behavior for Tetherly publishing. Domain language lives in [`CONTEXT.md`](../CONTEXT.md); durable trade-offs live in [`docs/adr`](./adr/).

## Implementation sequence

Implement and verify each slice independently:

1. Publication revisions and username reservations
2. Publish and unpublish UI
3. Public `/@username` page
4. Accessible drag reordering
5. Single editing-tab coordination
6. Reusable toast system
7. Recoverable account deletion and purge

Account deletion, drag ordering, tab coordination, and reusable toasts do not block the core publishing flow.

## Publication state

- A profile has a monotonic `draft_revision`.
- A publication snapshot stores its `source_revision`.
- No selected snapshot means **Draft**.
- Equal draft and source revisions mean **Published**.
- A newer draft revision means **Changes not published**.
- Profile identity, avatar, links, link order, and enabled state advance the draft revision.
- Publishing unchanged content is disabled.
- Failed publishing preserves the existing public snapshot and draft.
- Publication buttons use only **Publish** and **Unpublish**.

## Username behavior

- Public pages use canonical lowercase `/@username` URLs.
- API lookup remains `/api/v1/profiles/{username}` without `@`.
- Mixed-case public routes redirect to lowercase.
- A published creator may change their draft username without moving the current public page.
- Draft and selected-publication usernames remain reserved simultaneously.
- Republishing moves public availability to the draft username and releases the old public username.
- Unpublishing releases the old publication username.
- The MVP does not redirect old creator URLs.

## Publish and unpublish experience

- The full publication panel lives in Preview.
- The dashboard header shows compact status and actions.
- First publication opens a confirmation modal displaying the canonical public URL, enabled-link behavior, and the fact that later edits remain private until republished.
- Later Publish actions execute directly.
- Publish requires a display name and at least one enabled valid HTTP(S) destination.
- Bio and uploaded avatar are optional.
- Missing avatars use up to two display-name initials, falling back to the username’s first character.
- Unpublish opens a lightweight confirmation modal; it does not require a password or typed username.
- Unpublishing preserves the draft and publication history.
- Unmet requirements appear in the Preview panel and modal with direct navigation to Profile or Links.

## Public profile

- Unknown, unpublished, pending-deletion, and purged profiles all return `404` without revealing lifecycle state.
- The unavailable page says: **This Tether isn’t available.** The link may be incorrect, unpublished, or no longer active.
- The page uses a minimal Tetherly shell, creator content, Share control, and restrained product attribution.
- Snapshot position is the only destination ordering rule.
- Empty bios are omitted without replacement copy.
- Uploaded and initials avatars use the same frame.
- Destinations are consistent button-style links with restrained category accents.
- Missing or unsupported icons use an allowlisted external-link fallback.
- Destinations open directly in a new tab with `rel="noopener noreferrer"`; the MVP adds no redirect tracking.
- A destination-preview control reveals normalized hostname and full URL without fetching remote metadata. It works by pointer, keyboard, and touch and provides a Copy URL action.
- Public metadata uses `{display_name} (@{username}) | Tetherly`, the bio or a standard fallback description, and the creator avatar or default Tetherly social image.
- Share uses native Web Share when available, clipboard fallback when possible, and a readonly selectable URL fallback otherwise.
- Analytics and public-page themes are later work; no speculative schema is added.

## Link editor

- Snapshot order comes from the persisted creator order.
- Dedicated drag handles become the primary reordering interaction.
- Move up and Move down remain available for keyboard and assistive-technology use.
- Reordering updates visually during the gesture and persists once on drop.
- A failed reorder restores the previous order and offers inline retry.
- Position changes are announced through `aria-live`.
- An expanded link editor is not draggable.
- Disabled destinations stay visible and reorderable in draft with a **Hidden** badge but never enter publication snapshots.
- Deleting a destination requires a lightweight confirmation without using the explicit word “link” in its body or actions.
- Removing an uploaded avatar requires lightweight confirmation without using the explicit word “photo” in its body or actions.

## Single editing tab

- The MVP permits one mutating creator-workspace tab per browser profile, not one per device or account globally.
- A user-scoped `localStorage` lease tracks ownership; `BroadcastChannel` sends immediate messages.
- Secondary and displaced tabs are read-only and show a dismissible ownership modal plus persistent banner.
- Actions are **Take Over Here** and **Continue Read Only**.
- Visible unsaved input remains local but cannot submit until ownership returns.
- Ownership transfers immediately; the old tab receives the same modal.
- Heartbeats renew the lease, which expires about 15 seconds after they stop.
- Leaving the workspace or signing out releases ownership; hiding the tab does not.
- The MVP adds no cross-device lock, server stale-revision guard, or legacy-browser fallback.

## Toasts

- Build the reusable toast provider before public Share, not before the publication panel.
- Desktop and tablet place toasts bottom-right; mobile uses bottom-center above safe-area padding.
- Show at most three; duplicate messages replace and reset the existing toast.
- Success messages dismiss after roughly four seconds; errors remain until dismissed or retried.
- Toasts do not capture focus and use polite live announcements.
- Validation and actionable errors remain inline.

## Recoverable account deletion

- Account deletion is separate from unpublishing and follows the public-profile milestone.
- The Danger Zone lives at the bottom of the Profile workspace’s Account section.
- A repository-deletion-style modal lists every consequence and requires the current password.
- Failed confirmation is limited to five attempts per minute per account and IP. The modal disables password submission and shows the API `Retry-After` countdown while keeping Cancel available.
- A successful request immediately unpublishes, signs out, reserves the username, and starts a 30-day recovery period.
- The UI shows the exact calendar deletion date, not a changing days-remaining counter.
- Login during the recovery window opens an explicit Restore Account screen; login never restores silently.
- Restoration returns an unpublished draft and preserves historical snapshots.
- Recovery is unavailable after the stored deadline even if physical cleanup has not yet run.
- An indexed, bounded, idempotent purge runs once daily off-peak.
- Failed external-file cleanup keeps the account inaccessible and username reserved for retry.
- Successful purge removes user, profile, links, snapshots, uploaded files, and sessions, then releases the username.
- Send one immediate deletion-request email containing request date, deletion date, username, public-visibility state, authenticated restoration path, and security guidance. Do not send a final post-purge confirmation.

## Deferred work

- Analytics and tracked redirects
- Cross-device editing locks
- Server-side optimistic concurrency
- Dynamic days-remaining deletion countdown
- Public page themes, which will apply as curated accessibility-tested variants to the whole page
- Old-username redirects
- Remote destination metadata previews
