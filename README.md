# Appwrite Backend Skill

> Patterns and best practices for building with Appwrite BaaS using Dart, Python, and TypeScript.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Appwrite 1.8+](https://img.shields.io/badge/Appwrite-1.8+-F02E65.svg)](https://appwrite.io)

> **Disclaimer:** This is an unofficial community resource. It is not affiliated with, endorsed by, or sponsored by [Appwrite](https://appwrite.io). "Appwrite" is a trademark of Appwrite Ltd.

## Installation

```bash
npx skills add sgaabdu4/appwrite-backend
```

Or manually clone into `~/.claude/skills/`:

```bash
git clone https://github.com/sgaabdu4/appwrite-backend ~/.claude/skills/appwrite-backend
```

## What's Included

This skill provides AI agents with comprehensive guidance for Appwrite development:

### Core Coverage
- **TablesDB** — CRUD operations, queries, relationships, transactions, bulk operations
- **Authentication** — OAuth, email/password, phone, JWT, MFA, session management
- **Storage** — File uploads, previews, transformations, file tokens
- **Functions** — Cold start optimization, event triggers, domain grouping
- **Realtime** — WebSocket subscriptions, channel patterns, server-side filtering
- **Messaging** — Push notifications, email, SMS

### Key Patterns
- TablesDB API (Collections API deprecated in 1.8.0)
- Atomic operators for race-free updates
- Cursor pagination for performance
- Query.select() for relationship expansion
- Type-safe SDK generation with `appwrite generate`

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

See [SKILL.md](SKILL.md) for the complete reference list.

## Compatible Agents

- [Claude Code](https://code.claude.com/)
- [Cursor](https://cursor.sh/)
- [Windsurf](https://windsurf.ai/)
- Any agent supporting the [Agent Skills](https://agentskills.io/) standard

## Usage

Once installed, the skill automatically activates when you:
- Mention Appwrite, TablesDB, or Appwrite SDK
- Work with Appwrite authentication, storage, or functions
- Ask about backend-as-a-service patterns

Or invoke directly:
```
/appwrite-backend
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/add-new-pattern`)
3. Follow existing documentation style
4. Submit a pull request

### Guidelines
- Keep SKILL.md under 500 lines
- Add detailed patterns to `references/` files
- Include code examples in Dart, Python, and TypeScript
- Test with Appwrite 1.8+

## License

MIT — see [LICENSE](LICENSE)

## Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite API Reference](https://appwrite.io/docs/references)
- [Appwrite SDKs](https://github.com/appwrite)
