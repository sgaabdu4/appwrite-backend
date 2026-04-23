# Appwrite Backend Skill

> Patterns + best practices for Appwrite BaaS. Dart, Python, TypeScript.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Appwrite 1.8+](https://img.shields.io/badge/Appwrite-1.8+-F02E65.svg)](https://appwrite.io)

> **Disclaimer:** Unofficial community resource. Not affiliated/endorsed/sponsored by [Appwrite](https://appwrite.io). "Appwrite" trademark of Appwrite Ltd.

## Installation

```bash
npx skills add sgaabdu4/appwrite-backend
```

Or clone into `~/.claude/skills/`:

```bash
git clone https://github.com/sgaabdu4/appwrite-backend ~/.claude/skills/appwrite-backend
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

## Reference Files

| Topic | File |
|-------|------|
| Schema & Columns | [schema-management.md](references/schema-management.md) |
| Query Optimization | [query-optimization.md](references/query-optimization.md) |
| Atomic Operators | [atomic-operators.md](references/atomic-operators.md) |
| Relationships | [relationships.md](references/relationships.md) |
| Transactions | [transactions.md](references/transactions.md) |
| Bulk Operations | [bulk-operations.md](references/bulk-operations.md) |
| Authentication | [authentication.md](references/authentication.md) |
| Functions | [functions.md](references/functions.md) |
| Realtime | [realtime.md](references/realtime.md) |
| Performance | [performance.md](references/performance.md) |
| Error Handling | [error-handling.md](references/error-handling.md) |

Full list → [SKILL.md](SKILL.md).

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

Direct invoke:
```
/appwrite-backend
```

## Contributing

PRs welcome:

1. Fork repo
2. Feature branch (`git checkout -b feature/add-new-pattern`)
3. Match existing doc style
4. Submit PR

### Guidelines
- SKILL.md <500 lines
- Detail patterns → `references/`
- Code examples: Dart, Python, TypeScript
- Test Appwrite 1.8+

## License

MIT — see [LICENSE](LICENSE)

## Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite API Reference](https://appwrite.io/docs/references)
- [Appwrite SDKs](https://github.com/appwrite)