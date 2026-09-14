# Codex branch integration report

## Summary

Two historical, local-only Codex branches were integrated into `development`:

- `codex/launch-mvp-contract-persistence` at `346e4ceb5c1d00e116e445de69bf5e4b596153a3`
- `codex/creator-workspace-shell` at `e22ace01caa3bd8dc4c90988716419ab4394c06c`

Both branch commits were already present in the current product history as exact patch-equivalent commits. The integration therefore recorded ancestry without replaying either old snapshot over the newer implementation.

## Audit evidence

### Launch MVP persistence

The branch commit `346e4ce` is byte-for-byte patch-equivalent to current-history commit `332bd081444ba677ab0488be742b5b66fd2465b1` (`feat: add launch MVP profile persistence foundation`). Both generated the same stable patch and SHA-256:

`518f68a45d089122ee7b16e8cc8da4323990e2b34deddcb180a49cd281459f24`

That feature introduced the profile/link/publication persistence foundation: domain enums and models, ownership policies, factories, migrations, feature coverage, and the OpenAPI contract expansion. Later development commits extended and corrected that implementation.

### Creator workspace shell

The branch commit `e22ace0` is byte-for-byte patch-equivalent to current-history commit `12dc2831cf22633e02e6b6c9553b3ef3c88f4d59` (`feat(web): add creator workspace shell and typed APIs`). Both generated the same stable patch and SHA-256:

`c6facb26ad002696252f467dab45a1f202a7b03cbe343adbfc28a9cfc6fca919`

That feature introduced protected creator routes, typed profile/link/publication APIs, creator workspace context, dashboard layout and workspace pages, auth redirects, and related frontend tests. Later development commits completed and corrected those workflows.

## Integration method

Each historical branch diverged from the old base `814529d2fe09817a17403834e6dade7219a1b948`. A normal content merge would treat the branch tip as an old repository snapshot and risk replacing or deleting extensive newer work.

Because each branch's only feature patch was proven identical to a commit already contained by `development`, the branches were merged with ancestry-only merge commits using Git's `ours` merge strategy:

- `17fcef0` — `chore(git): record persistence branch integration`
- `15a3093` — `chore(git): record creator workspace branch integration`

This approach records both branch tips as merged while preserving the complete current `development` tree. The tree object remained exactly `0af8a8c97c1103adb172697e09e386a9f1cc7d25` before, between, and after both merges.

No application source, test, configuration, API contract, or documentation behavior was replaced by the historical branch snapshots. There were no content conflicts to resolve and no merge-induced product issues.

## Verification

The integrated tree passed all repository checks:

- `pnpm run type-check` — passed
- `pnpm run lint` — passed
- `pnpm run lint:styles` — passed
- `pnpm run format:check` — passed
- `pnpm run test:run` — 33 tests passed across 8 files
- `pnpm run build` — passed; Vite transformed 186 modules and produced the production bundle
- `pnpm run test:api` — 46 tests passed with 232 assertions
- `git diff --check 55aaab9..HEAD` — passed
- Tree identity against pre-integration `55aaab9` — passed
- Both historical branch tips are ancestors of the updated `development` branch — passed

## Result

The useful features remain represented by their current implementations on `development`; the old branch snapshots are now formally integrated in Git history. No code fixes were necessary because the operation intentionally retained the already-tested current tree.
