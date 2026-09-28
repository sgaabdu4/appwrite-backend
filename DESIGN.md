# Skill Design

## Overview

`skills/appwrite-backend/SKILL.md` routes agents to narrow references. It distinguishes SDK application development from MCP-only operational changes.

## Components

- `references/` owns domain guidance, production migration safety, and MCP configuration for Claude Code and Codex.
- `scripts/` owns the query contract helper and existing query/safety tests.
- `hard-eng.gates.json` owns the native formatter, contract suites, secret scans, and workflow checks. The existing Quality / Tests job and pre-push hook call the same owner. All checks run for this manifest-free skill repository, including Markdown changes consumed by safety tests.
- `.agents/` and `.hooks/` contain the released Hard Eng scaffold; the canonical Appwrite skill remains under `skills/`.

## Do's and Don'ts

Keep details in their existing references and preserve SDK examples. Require exact target binding, authorized scope, full inventory, read-back, and recovery evidence for operational changes. Never substitute a CLI or direct SDK operation when the required MCP capability is unavailable. Do not add an application manifest, artificial performance suite, or duplicate CI pipeline to this documentation/tooling repository.
