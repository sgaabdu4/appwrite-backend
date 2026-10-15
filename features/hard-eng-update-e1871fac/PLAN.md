# Hard Eng e1871fac update

Status: Complete

## Outcome + scope

The repo runs Hard Eng `e1871fac` installed by the supported updater, with every repository check passing. Hard Eng now runs every Node tool on Bun, so the skill contract tests run with `bun test` and CI sets up Bun before the check. Out of scope: skill content, MCP guidance, dependency updates.

## Repository context

Owners: `.hooks/hard-eng-source.json` and the updater commit (installed revision); `.hooks/`, `.agents/skills/he*` and the Hard Eng block of `AGENTS.md` (scaffold); `hard-eng.gates.json` (the `skill-contracts` command); `.github/workflows/quality.yml` and its contract test.
Evidence: On `e1871fac` the `skill-contracts` gate failed with "Cannot use test outside of the test runner. Run "bun test" to run tests." The updater printed "quality.yml runs Hard Eng without setting up Bun; add an oven-sh/setup-bun step before the check."

## Decisions + authorization

Blockers: None
Handoff: Approval
Authority: Agent-loop under the owner's Hard Eng update request: update to the newest verified release, fix what the update reports at its owner, merge when CI is green.
Decisions: Keep the `node:test` imports; `bun test` runs them unchanged, so only the runner changes. Pin `oven-sh/setup-bun` to the v2.2.0 commit Hard Eng's own workflow uses.

## Acceptance + steps

- [x] Installed revision is `e1871fac` → `.hooks/hard-eng-source.json` shows `e1871fac9032e10b7a9f30de353c3bbfe08ea39c`.
- [x] The skill contract tests run under Bun → `skill-contracts` runs `bun test` on the three contract files; the workflow contract test pins that command and the Bun setup step.
- [x] Repository checks pass on the updated scaffold → `python3 .hooks/hard-eng.py check` exits 0.

## Baseline + execution

Result: Passed
Evidence: Starting revision `f421934` (Hard Eng `02f02959`); the update PR check failed only on `skill-contracts`.
Execution: Single builder.

## Risks + recovery

CI could miss Bun if the setup step moved after the check; the workflow contract test pins it. Recovery = revert the PR.

## ux_reference

N/A — tooling only; no rendered interface changes.

## Verification

Result: Passed
Evidence: `bun test` on the three contract files: 27 passed, 0 failed.
E2E: N/A — no application runtime is deployed by this repository; the native contract checks cover the affected interface.

Delivery target: Merge
Delivery: Pending — PR merged into master with the required Quality checks passing on the merged revision.
