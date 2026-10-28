# Update the Appwrite skill for Appwrite 2.6.2 and MCP server 2.x

Status: Complete

## Outcome + scope

An agent using the skill on Appwrite 2.6.2 asks for the current TablesDB API key scopes, sends MCP writes to the write tool, and may set up a CI schema push. Version labels and upgrade notes reach 2.6.2. Non-goals: new services, rewording passing text, changing the SDK pins.

## Repository context

Owners: `skills/appwrite-backend/SKILL.md` (route + invariant 1), `references/mcp-servers.md` (scopes, MCP tools, launcher), `references/schema-management.md` (CI push, index types), `references/self-hosting.md`, `references/self-hosting-ops.md`, `references/functions.md`.
Same cause: an agent on a new Appwrite 2.6.2 project asked for the deprecated `collections.*` and `documents.*` key scopes. The skill banned the legacy service but never named the current scopes. The skill was not loaded in that project at all, which is fixed in Hard Eng separately. mcp-server-appwrite 2.0.0 (2026-10-27) moved every write to `appwrite_call_write_tool`, so the skill's single-tool flow broke after its last update. No earlier fix of either cause.

## Decisions + authorization

Blockers: None.
Handoff: Approval
Authority: Abid on 2026-10-28: "A GitHub Actions job may run appwrite push tables. Agents still use MCP only. Update the Appwrite skill for 2.6.2 with all the audit findings."
Decision: invariant 1 keeps agents on MCP; a repository CI job may push the schema. Every fact comes from a primary source at the cited version: appwrite/appwrite tag 2.6.2 and release notes 2.4.0 to 2.6.2, appwrite/mcp `docs/tool-surface.md` + `docs/self-hosted.md` + release notes, the appwrite/sdk-for-cli README and release 28.10.0, and the appwrite.io installation page.

## Acceptance + steps

- [x] The skill names the TablesDB scopes and bans the deprecated ones → `skills/appwrite-backend/scripts/skill-safety-contract.test.mjs::API keys use TablesDB scopes and MCP writes use the write runner`.
- [x] Reads go to `appwrite_call_tool`, writes to `appwrite_call_write_tool` with `confirm_write=true` → `skills/appwrite-backend/scripts/skill-safety-contract.test.mjs::API keys use TablesDB scopes and MCP writes use the write runner`.
- [x] The launcher keeps at least one readable scope and passes no legacy flags → `skills/appwrite-backend/scripts/skill-safety-contract.test.mjs::API keys use TablesDB scopes and MCP writes use the write runner`.
- [x] A CI job may push tables with a pinned CLI and an API key; agents never run the CLI → `skills/appwrite-backend/scripts/skill-safety-contract.test.mjs::CI schema push is serialized and blocks unapproved deletion`.
- [x] Versions, upgrade notes, Console path and index types match 2.6.2 → N/A — release facts change every release; each was read at its source, listed under Verification.
- [x] Existing safety contracts still hold → `skills/appwrite-backend/scripts/skill-safety-contract.test.mjs::MCP credentials preserve least scopes and protected consumer transfer` and the other existing contract tests.

## Baseline + execution

Result: Passed
Evidence: Branch point master 174d6c2; its `Quality` workflow passed in CI.
Execution: One builder for the edits, a fresh reader for the new text, Codex adversarial review before the PR.

## Risks + recovery

Upstream MCP and CLI releases change weekly. Recovery: the skill tells agents to search the connected server's catalog and read `--help` before trusting names.

## ux_reference

N/A — skill text only; no visible UI.

## Verification

Result: Passed
Evidence: Each fact was read at its source: appwrite/appwrite 2.6.2 (`app/config/scopes/project.php`, TablesDB `XList.php` needs `databases.read`, legacy attribute routes need `collections.*`), release notes 2.4.0 to 2.6.2, appwrite/mcp `docs/tool-surface.md` + `docs/self-hosted.md`, appwrite/sdk-for-cli 28.10.0 (`internal/schema/database.go`, `attributes.go`, `operations.go`, README CI/CD). The contract tests pass, with 2 new ones for the scope, write-runner and CI push rules. Biome 2.6.3 with Hard Eng's shipped settings reports no format change in `references/`. A fresh reader checked the new text; its findings are fixed. Codex adversarial review (gpt-6-astra), 5 rounds: rounds 1 to 4 found the omitted-resource deletion, the startup probe scope, the CI project override, the legacy scopes the CLI still needs and concurrent pushes, all fixed; round 5 no material findings. Not verified: a live CI push against Appwrite 2.6.2.
E2E: N/A — skill text; the contract tests and Hard Eng's shipped-format check cover it.
Delivery target: Merge
Delivery: Pending — the PR merges into master after its checks pass.
