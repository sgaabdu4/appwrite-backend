# Hard Eng 7eebdaf3 scaffold rollout

Status: Ready

## Outcome + scope

Adopt Hard Eng revision `7eebdaf3d52b4bec956b1d21f416a7d7389f79b9` and refresh repository-owned dependencies; skill content, MCP-only agent guidance and the separate `main` branch are out of scope.

## Repository context

Owners: `.hooks/` and `.agents/skills/he*` are installed by Hard Eng setup; `hard-eng.gates.json` defines shared checks with no packages; `.github/workflows/quality.yml` owns Quality / Tests and already passes `--base "$BASE_SHA"`. The only package manifests are the Hard Eng-shipped `.agents/skills/marketing-video` and `.agents/skills/product-walkthrough-video`, so the repository owns no application dependencies.

## Decisions + authorization

Blockers: None
Handoff: Approval
Authority: The user authorized scaffold adoption and a dependency refresh delivered through one squash-merged PR into `master`.

## Acceptance + steps

- [x] Hard Eng setup installs revision `7eebdaf3` → `.hooks/hard-eng-source.json` records it and setup validation reports no problems.
- [ ] Dependencies are current where the repository owns them → Hard Eng-shipped skill manifests and Hard Eng-standardized workflow action pins stay at the scaffold's versions.
- [ ] The full gate passes against `origin/master` with existing contracts, formatting, secret scans, actionlint and zizmor unchanged.

## Baseline + execution

Result: Passed
Evidence: Setup completed with exit 0 in 73 seconds, recorded revision `7eebdaf3` and committed the update; afterwards all 27 existing Node contracts passed.
Execution: Run the full gate, record timings, then ship through pre-push and hosted Quality / Tests.

## Risks + recovery

Upgrading `pnpm/setup` to v3 would diverge from the scaffold owner, which pins v2.1.0; revert through a normal commit if a scaffold file regresses, without rewriting history.

## ux_reference

N/A — this change affects repository tooling only; it has no rendered application interface.

## Verification

Result: Pending
Evidence: Pending full gate.
E2E: N/A — no application runtime is deployed by this repository; native contract execution verifies the affected interface.

Delivery target: Merge
Delivery: Pending — PR must pass Quality / Tests, squash-merge into master and pass the merged revision's Quality run.
