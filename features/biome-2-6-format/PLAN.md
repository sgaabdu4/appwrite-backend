# Format skill references with Biome 2.6

Status: Complete

## Outcome + scope

Every reference file in the skill matches Biome 2.6 Markdown formatting, so Hard Eng's `shipped-format` check passes on the files it ships. Non-goals: wording changes, `SKILL.md` (Biome 2.6.2 flattens nested YAML front matter and drops the skill metadata), and new rules.

## Repository context

Owners: `skills/appwrite-backend/references/*.md`; table-text assertions in `skills/appwrite-backend/scripts/skill-safety-contract.test.mjs`. Biome 2.6.0 (2026-10-21) pads Markdown table columns, and three assertions matched cells with single spaces.

## Decisions + authorization

Blockers: None
Handoff: Approval
Authority: The user asked on 2026-10-21 to fix every Biome finding and switch nothing off.

## Acceptance + steps

- [x] Biome 2.6.2 reports no format change in `skills/appwrite-backend` except `SKILL.md`, and a second run changes nothing → `biome format` with the shipped settings.
- [x] The three table assertions accept any cell spacing and still match the same text → `bun test` on the contract suites.

## Baseline + execution

Result: Passed
Evidence: Contract suites passed on `master` 647883b (27 tests).
Execution: One builder.

## Risks + recovery

Padded tables make reference files larger. Revert the commit to restore the old layout.

## ux_reference

N/A — agent skill text; no product appearance.

## Verification

Result: Passed
Evidence: Contract suites 27 passed; Biome 2.6.2 format run is clean and stable.
E2E: N/A — skill documentation; proof is the contract checks.

Delivery target: Merge
Delivery: Pending — PR into `master` with its checks green.
