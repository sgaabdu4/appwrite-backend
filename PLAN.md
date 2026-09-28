# MCP-only skill and repository tooling migration

Status: Complete

## Outcome + scope

Support Claude Code and Codex with MCP-only Appwrite agent operations, preserve SDK development guidance, and adopt the released Hard Eng scaffold with one native CI owner.

## Repository context

Owners: `skills/appwrite-backend` contains the public skill and native contracts; `hard-eng.gates.json` defines local checks; `.github/workflows/quality.yml` owns Quality / Tests. The delivery branch is `master`; the separate `main` branch remains outside this change.

## Decisions + authorization

Blockers: None
Handoff: Approval
Authority: The user authorized MCP-only skill cleanup, pnpm tooling, released scaffold adoption, and delivery through this existing combined PR. Merge with a merge commit to retain published prerequisite commit ancestry.

## Acceptance + steps

- [x] MCP is the sole agent operational interface; SDK development guidance and substantive migration, erasure, function, and credential safeguards remain in their existing owners.
- [x] Remove the CLI reference and bundled CLI guard after auditing references and coordinating the guarded downstream transition.
- [x] Run existing native contracts and formatting through shared gates without an invented application manifest or duplicate CI suite.
- [x] Install the verified scaffold, retain only Claude/Codex wiring, and pass required common repository checks.
- [x] Review the complete public payload and verify the same PR can preserve prerequisite ancestry.

## Baseline + execution

Result: Passed
Evidence: At prerequisite commit `5150c8c`, all 27 Node contracts and the three-file Biome check passed. Exact-head GitHub Quality runs passed for push and pull request. Fresh released setup initially rejected the legacy manifest-free gate schema; explicit shared native commands allowed installation of revision `1a1f86094fb7ceb36fd7abb7a400d056354bc1f8`.
The first integrated run passed the 27 contracts, formatting, and secret scans but found shell and security metadata issues in the existing maintenance workflow; those are repaired at that owner.
Execution: Preserve the canonical skill change, adapt the existing CI contract to the shared gate owner, run the integrated checks, and obtain independent diff review before shipping.

## Risks + recovery

Existing callers of the retired bundled CLI guard must retain that assertion in a repository-owned script before updating; the released installer refuses unresolved installed-path dependencies. Missing MCP permissions, safe transfer, or operation support remains an explicit capability gap. Revert a repository tooling change through the same native checks if needed; do not rewrite prerequisite history.

## ux_reference

N/A — this change affects a nonvisual skill package and repository tooling; it has no rendered application interface.

## Verification

Result: Passed
Evidence: Integrated Ready passed all 27 Node contracts, three-file Biome 2.5.14 formatting, current-file and 79-commit history secret scans, actionlint, and strict zizmor with zero findings. Native setup took 7.1 seconds; the longest check took 3.1 seconds. Independent review found no remaining defect, and whitespace validation passed. The scheduled maintenance workflow was reviewed statically; no email or manual dispatch was performed, and its next scheduled runtime remains unverified.
E2E: N/A — no application runtime is deployed by this repository; native skill discovery and contract execution verify its affected interface without live Appwrite operations.
Delivery target: Merge
Delivery: Pending — the existing PR must pass current Quality / Tests, merge into master with prerequisite ancestry retained, and pass the merged revision's Quality check.
