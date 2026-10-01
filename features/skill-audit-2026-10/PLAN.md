# Bring the Appwrite skill up to date with Appwrite 2.x and its SDKs

Status: Complete

## Outcome + scope

The skill's code examples, versions, links and rules match the current SDKs/packages and agree with each other and with Hard Eng's shared rules. Fixes the findings of the 2026-10-01 multi-model skill audit, each re-verified against its primary source before editing. The package also meets the `writing-great-skills` checklist: one owner per rule, every reference routed with a load condition.

Non-goals: new features, restyling passing text, or changing unrelated guidance.

## Repository context

Owners: `skills/appwrite-backend/SKILL.md` + `references/`; native contracts in `skills/appwrite-backend/scripts/*.test.mjs`; gates in `hard-eng.gates.json`.

## Decisions + authorization

Blockers: None
Handoff: Approval
Authority: Autonomous. The user asked to make every recommended audit change, review it, run adversarial review with GPT-6 Astra, test with GPT-6 Luna and Sonnet 5.5, and open a PR; after the PR opened, the user approved merging it.

## Acceptance + steps

- [x] Every changed SDK example uses methods, parameters, enums and response access that exist in the SDK version the skill pins → source check or compile per example.
- [x] Self-hosting and version guidance covers Appwrite 2.x with release-matched pins → official install/upgrade docs.
- [x] Error handling, chunking and pagination examples keep write intent, bound concurrency and return complete results → consistent with `error-handling.md` rules.
- [x] Agent operations stay MCP-only; no CLI/SDK fallback remains in agent guidance → grep.
- [x] Every appwrite.io link returns 200 → GET check.
- [x] ID chunk sizing respects both the `Query.equal()` value cap and the 4096-char query limit → 2.3.0 source.
- [x] Contradictory or duplicated rules have one owner (raw HTTP, session deletion, prefs replacement, 500 handling, upsert scope, transaction client, MCP-only) and every relative/`#anchor` link resolves → link check.
- [x] Webhook ingestion deduplicates per resource revision, keeps deletes at an equal revision and confirms an unsigned delete with Appwrite before acting → `webhooks.md` against the webhook docs.
- [x] Console paths and feature availability match the Appwrite version they name → release notes and docs.
- [x] `python3 .hooks/hard-eng.py check` passes, including `skill-contracts`.

## Baseline + execution

Result: Passed
Evidence: `python3 .hooks/hard-eng.py check --plan-stage Draft` after the Hard Eng update commit `47ac6ae`: skill-format, skill-contracts, secrets-files, secrets-history, actionlint and zizmor passed.
Execution: One implementation subagent on branch `fix/skill-audit-2026-10`; the coordinator reviews the diff, then adversarial review and model tests.

## Risks + recovery

A rewritten example could still be wrong for an SDK version the skill pins. Each changed example is checked against that version's source or compiled; recovery is reverting the affected hunk.

## ux_reference

N/A — agent skill text; no product appearance.

## Verification

Result: Passed
Evidence: `python3 .hooks/hard-eng.py check` passed, including `skill-contracts`. Changed examples were checked against the pinned SDK sources with a scratch harness, and every changed appwrite.io link returned 200. GPT-6 Astra adversarial review approved after four rounds, then flagged the 1.9.x email-policy path in a confirmation pass (fixed in `216affa`) and approved the re-run. Sonnet 5.5 (high) passed; its notes were fixed in `7e6489c` and `12c243d`. GPT-6 Luna (max) found unqualified Console paths, fixed in `5c9cfd2`.
E2E: N/A — skill documentation; proof is the repository's contract/example checks plus compile checks of changed examples against the pinned SDKs.

Delivery target: Merge
Delivery: Pending — squash merge and post-merge CI on the base branch.
