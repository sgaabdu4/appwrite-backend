# Appwrite Backend Skill

> Patterns + best practices for Appwrite BaaS. Dart, Python, TypeScript.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Appwrite 1.9+](https://img.shields.io/badge/Appwrite-1.9+-F02E65.svg)](https://appwrite.io)

> **Disclaimer:** Unofficial community resource. Not affiliated/endorsed/sponsored by [Appwrite](https://appwrite.io). "Appwrite" trademark of Appwrite Ltd.

## Installation

```bash
npx skills add https://github.com/sgaabdu4/appwrite-backend --skill appwrite-backend
```

## What's Included

Skill gives AI agents Appwrite dev guidance:

### Core Coverage
- **TablesDB** — CRUD, queries, relationships, transactions, bulk ops
- **Authentication** — OAuth, email/password, phone, JWT, MFA, sessions
- **Storage** — uploads, previews, transforms, file tokens
- **Functions** — cold start opt, event triggers, domain grouping
- **Realtime** — WebSocket subs, channels, server-side filters
- **Messaging** — push, email, SMS

### Key Patterns
- TablesDB API (Collections API deprecated 1.8.0)
- Atomic operators, race-free updates
- Cursor pagination, perf
- Query.select() relationship expansion
- Type-safe SDK gen `appwrite generate`
- Official SDK packages only; raw Appwrite HTTP is a violation
- Self-hosted Appwrite 1.9.x SDK pins: `dart_appwrite: 25.1.0`, Flutter `appwrite: 25.2.0`, `node-appwrite: 26.2.0`, web `appwrite: 26.1.0`, Python `appwrite: 21.0.0`, CLI `22.4.0`

## Reference Files

| Topic | File |
|-------|------|
| Schema & Columns | [schema-management.md](skills/appwrite-backend/references/schema-management.md) |
| Query Optimization | [query-optimization.md](skills/appwrite-backend/references/query-optimization.md) |
| Atomic Operators | [atomic-operators.md](skills/appwrite-backend/references/atomic-operators.md) |
| Relationships | [relationships.md](skills/appwrite-backend/references/relationships.md) |
| Transactions | [transactions.md](skills/appwrite-backend/references/transactions.md) |
| Bulk Operations | [bulk-operations.md](skills/appwrite-backend/references/bulk-operations.md) |
| Authentication | [authentication.md](skills/appwrite-backend/references/authentication.md) |
| Functions | [functions.md](skills/appwrite-backend/references/functions.md) |
| Realtime | [realtime.md](skills/appwrite-backend/references/realtime.md) |
| Performance | [performance.md](skills/appwrite-backend/references/performance.md) |
| Error Handling | [error-handling.md](skills/appwrite-backend/references/error-handling.md) |

Full list → [SKILL.md](skills/appwrite-backend/SKILL.md).

## Compatible Agents

- [Claude Code](https://code.claude.com/)
- [Cursor](https://cursor.sh/)
- [Windsurf](https://windsurf.ai/)
- Any agent on [Agent Skills](https://agentskills.io/) standard

## Usage

Auto-activates when:
- Mention Appwrite, TablesDB, Appwrite SDK
- Work Appwrite auth/storage/functions
- Ask BaaS patterns

Codex explicit invocation:

```text
$appwrite-backend
```

## Contributing

PRs welcome:

1. Fork repo
2. Feature branch (`git checkout -b feature/add-new-pattern`)
3. Match existing doc style
4. Submit PR

### Guidelines
- `skills/appwrite-backend/SKILL.md` <500 lines
- Detail patterns → `skills/appwrite-backend/references/`
- Code examples: Dart, Python, TypeScript
- Test Appwrite 1.9+

## License

MIT — see [LICENSE](LICENSE)

## Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite API Reference](https://appwrite.io/docs/references)
- [Appwrite SDKs](https://github.com/appwrite)
