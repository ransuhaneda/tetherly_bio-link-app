# Tetherly

Tetherly gives each creator an account, an editable profile, and a separately controlled public publication.

## Language

**Account**:
A creator’s login identity and ownership boundary for all of their Tetherly data.
_Avoid_: User profile, profile account

**Draft Profile**:
The creator’s current editable identity and links, whether or not a public publication exists.
_Avoid_: Private profile, unpublished profile

**Publication**:
The public visibility of one selected immutable profile snapshot at `/@username`.
_Avoid_: Live draft, public draft

**Workspace Editor**:
The single active browser tab allowed to mutate a creator’s draft; other same-browser tabs remain read-only until they acquire editing ownership.
_Avoid_: Login session, publication lock

**Draft Revision**:
The profile-wide content version that advances whenever its identity, avatar, links, link order, or link visibility changes.
_Avoid_: Updated timestamp, publication version

**Publication Revision**:
The draft revision captured by the selected publication snapshot; equality with the current draft revision means no unpublished changes exist.
_Avoid_: Snapshot timestamp, latest edit

**Reserved Username**:
A username unavailable to other accounts because an account currently uses it in its draft, selected publication, or pending-deletion identity.
_Avoid_: Available alias, redirect

**Public Profile**:
The canonical lowercase `/@username` page rendered only from the selected publication snapshot; unavailable profiles reveal no account lifecycle state.
_Avoid_: Draft preview, account page

**Destination Preview**:
A non-navigating disclosure of a public link’s normalized hostname and full URL, available by pointer, keyboard, and touch before the visitor chooses to open it.
_Avoid_: Page preview, metadata preview, tracked redirect

**Public Page Theme**:
A later customization capability that applies one curated, accessibility-tested presentation to the creator’s entire public profile without changing its content, destination order, safety rules, or accessibility requirements.
_Avoid_: Themed link, arbitrary CSS, per-link theme

**Unpublish**:
To remove a publication from public access while preserving the account, draft profile, and publication history.
_Avoid_: Soft delete, delete profile

**Pending Deletion**:
The recoverable 30-day state after a creator requests account deletion; public access and normal account use are disabled, and the username remains reserved until restoration or purge.
_Avoid_: Hard delete, deleted profile

**Restoration**:
The creator’s explicit cancellation of pending deletion after successfully authenticating during the recovery window; the account returns as an unpublished draft.
_Avoid_: Login, automatic recovery, republish

**Purge**:
The irreversible removal of an account and all data it owns after the recovery period ends.
_Avoid_: Unpublish, deactivate
