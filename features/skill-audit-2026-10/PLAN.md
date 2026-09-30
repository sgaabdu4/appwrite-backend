# Bring the Appwrite skill up to date with Appwrite 2.x and its SDKs

Status: Ready

## Outcome + scope

The skill's code examples, versions, links and rules match the current SDKs/packages and agree with each other and with Hard Eng's shared rules. Fixes the findings of the 2026-10-01 multi-model skill audit, each re-verified against its primary source before editing.

Non-goals: new features, restructuring the skill, or changing unrelated guidance.

## Repository context

Owners: `skills/appwrite-backend/SKILL.md` + `references/`; native contracts in `skills/appwrite-backend/scripts/*.test.mjs`; gates in `hard-eng.gates.json`.

## Decisions + authorization

Blockers: None
Handoff: Approval
Authority: Autonomous. The user asked to make every recommended audit change, review it, run adversarial review with GPT-6 Astra, test with GPT-6 Luna and Sonnet 5.5, and open a PR.

## Acceptance + steps

- [ ] Every changed SDK example uses methods, parameters, enums and response access that exist in the SDK version the skill pins → source check or compile per example.
- [ ] Self-hosting and version guidance covers Appwrite 2.x with release-matched pins → official install/upgrade docs.
- [ ] Error handling, chunking and pagination examples keep write intent, bound concurrency and return complete results → consistent with `error-handling.md` rules.
- [ ] Agent operations stay MCP-only; no CLI/SDK fallback remains in agent guidance → grep.
- [ ] Every appwrite.io link returns 200 → GET check.
- [ ] `python3 .hooks/hard-eng.py check` passes, including `skill-contracts`.

## Baseline + execution

Result: Passed
Evidence: `python3 .hooks/hard-eng.py check --plan-stage Draft` after the Hard Eng update commit `47ac6ae`: skill-format, skill-contracts, secrets-files, secrets-history, actionlint and zizmor passed.
Execution: One implementation subagent on branch `fix/skill-audit-2026-10`; the coordinator reviews the diff, then adversarial review and model tests.

## Risks + recovery

A rewritten example could still be wrong for an SDK version the skill pins. Each changed example is checked against that version's source or compiled; recovery is reverting the affected hunk.

## ux_reference

N/A — agent skill text; no product appearance.

## Verification

Result: Pending
Evidence: Pending
E2E: N/A — skill documentation; proof is the repository's contract/example checks plus compile checks of changed examples against the pinned SDKs.

Delivery target: PR
Delivery: Pending — PR checks.
