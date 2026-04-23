---
name: appwrite-backend
description: Appwrite BaaS. TablesDB/Auth/Storage/Functions/Realtime. Dart/Python/TS. Use for Appwrite SDK, DB, auth, storage, fn, BaaS. Patterns+rules only.
license: MIT
metadata:
  author: sgaabdu4
  version: "1.8.0"
  tags: appwrite, backend, baas, dart, python, typescript
---

# Appwrite Development

## Critical Rules

1. **Use TablesDB API** — Collections API deprecated 1.8.0
2. **Use `ID.unique()` for all IDs** — Row IDs (`rowId:`) + entity IDs in columns. Custom gen w/ names/timestamps overflow column limits, leak data. ~20-char hex client-side.
3. **Use Query.select()** — Relationships return IDs only without
4. **Use cursor pagination** — Offset degrades on large tables
5. **Use Operator for counters** — Avoids race conditions
6. **Create indexes** — Queries without scan entire tables
7. **Init outside handler** — SDK/connections persist between warm invocations
8. **Group functions by domain** — One per domain, not per op
9. **Event triggers over polling** — One trigger replaces thousands of requests
10. **Use explicit string types** — `string` deprecated; use `varchar` or `text`/`mediumtext`/`longtext`
11. **Use `appwrite generate`** — Type-safe SDK from schema
12. **Use Channel helpers** — Type-safe realtime subs, not raw strings
13. **Use Realtime queries** — Server-side event filtering, not client-side

## Terminology (1.8.0+)

| Old | New |
|-----|-----|
| Collections | Tables |
| Documents | Rows |
| Attributes | Columns |
| Databases | TablesDB |

---

## Setup

```dart
import 'package:dart_appwrite/dart_appwrite.dart';

final client = Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('<PROJECT_ID>')
    .setKey('<API_KEY>');

final tablesDB = TablesDB(client);
```

```python
from appwrite.client import Client
from appwrite.services.tables_db import TablesDB
client = Client()
client.set_endpoint('https://cloud.appwrite.io/v1')
client.set_project('<PROJECT_ID>')
client.set_key('<API_KEY>')
tables_db = TablesDB(client)
```

```typescript
import { Client, TablesDB } from 'node-appwrite';
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('<PROJECT_ID>')
    .setKey('<API_KEY>');
const tablesDB = new TablesDB(client);
```

---

## TablesDB CRUD

```dart
// Create
await tablesDB.createRow(databaseId: 'db', tableId: 'users', rowId: ID.unique(),
    data: {'name': 'Alice'});

// Read
final rows = await tablesDB.listRows(databaseId: 'db', tableId: 'users',
    queries: [Query.equal('status', 'active'), Query.select(['name', 'email'])]);

// Update
await tablesDB.updateRow(databaseId: 'db', tableId: 'users', rowId: 'user_123',
    data: {'status': 'inactive'});

// Upsert
await tablesDB.upsertRow(databaseId: 'db', tableId: 'settings', rowId: 'prefs',
    data: {'theme': 'dark'});

// Delete
await tablesDB.deleteRow(databaseId: 'db', tableId: 'users', rowId: 'user_123');
```

**Bulk:** [bulk-operations.md](references/bulk-operations.md) | **Chunked ID queries:** [chunked-queries.md](references/chunked-queries.md)

---

## Query Reference

**Comparison:** `equal` | `notEqual` | `lessThan` | `lessThanEqual` | `greaterThan` | `greaterThanEqual` | `between` | `notBetween`
**String:** `startsWith` | `endsWith` | `contains` | `search` (+ `not` variants)
**Null:** `isNull` | `isNotNull` · **Logical:** `and([...])` | `or([...])`
**Pagination:** `select` | `limit` | `cursorAfter` | `cursorBefore` | `orderAsc` | `orderDesc` | `orderRandom`
**Timestamp:** `createdAfter` | `createdBefore` | `updatedAfter` | `updatedBefore`
**Spatial:** `distanceEqual` | `distanceLessThan` | `distanceGreaterThan` | `intersects` | `overlaps` | `touches` | `crosses` (+ `not` variants)

All prefixed `Query.`. Details: [query-optimization.md](references/query-optimization.md)

---

## Operators (Atomic Updates)

```dart
data: {
    'likes': Operator.increment(1),
    'tags': Operator.arrayAppend(['trending']),
    'updatedAt': Operator.dateSetNow(),
}
```

**Numeric:** `increment` | `decrement` | `multiply` | `divide`
**Array:** `arrayAppend` | `arrayPrepend` | `arrayRemove` | `arrayUnique` | `arrayIntersect` | `arrayDiff`
**Other:** `toggle` | `stringConcat` | `stringReplace` | `dateAddDays` | `dateSetNow`

Details: [atomic-operators.md](references/atomic-operators.md)

---

## Column Types

| Type | Max Chars | Indexing | Use |
|------|-----------|----------|-----|
| `varchar` | 16,383 | Full (if size < 768) | Queryable short strings |
| `text` | 16,383 | Prefix only | Descriptions, notes |
| `mediumtext` | 4,194,303 | Prefix only | Articles |
| `longtext` | 1,073,741,823 | Prefix only | Large documents |

> **`string` deprecated.** Use `varchar` for queryable, `text` for non-indexed.

**Other:** `integer` | `float` | `boolean` | `datetime` | `email` | `url` | `ip` | `enum` | `relationship` | `point` | `line` | `polygon`

Details: [schema-management.md](references/schema-management.md)

---

## Performance

| Rule | Impact |
|------|--------|
| Cursor pagination | 10-100x faster than offset |
| Pagination mixin (Dart) | ~50 lines saved per datasource |
| `Query.select()` | 12-18x faster for relationships |
| `total: false` | Eliminates COUNT scan |
| Indexes | 100x faster on large tables |
| Operators | No race conditions |
| Bulk operations | N → 1 request |
| Delta sync | Fetches only changed rows |

Details: [performance.md](references/performance.md), [pagination-performance.md](references/pagination-performance.md)

---

## Type-Safe SDK Generation

```shell
appwrite generate
```

Gen typed helpers into `generated/appwrite/` from DB schema. Autocomplete, compile-time validation, no hand-written types. Regen after schema change.
CLI flow: `login -> init project -> pull -> generate -> push`. Details: [appwrite-cli](./references/appwrite-cli.md)

---

## Authentication

Email/password, OAuth (50+ providers), phone, magic link, anon, email OTP, custom token. MFA w/ TOTP, email, phone, recovery codes. SSR session handling. JWT for functions.
SSR: cookie `a_session_<PROJECT_ID>`. Use admin client to create session, session client per request to read user context.

Details: [authentication.md](references/authentication.md) | [auth-methods.md](references/auth-methods.md)

---

## Storage

Upload, download, preview w/ transforms (resize, format conversion), file tokens for shareable URLs. HEIC, AVIF, WebP supported.

Details: [storage-files.md](references/storage-files.md)

---

## Realtime

```dart
final sub = realtime.subscribe(['databases.db.tables.posts.rows']);
sub.stream.listen((e) => print(e.events));
```

**Channels:** `account` | `databases.<DB>.tables.<TABLE>.rows` | `buckets.<BUCKET>.files`

**Channel helpers (preferred):** `Channel` class for type-safe subs w/ IDE autocomplete:

```typescript
import { Client, Realtime, Channel, Query } from "appwrite";
const sub = await realtime.subscribe(
    Channel.tablesdb('<DB>').table('<TABLE>').row(),
    response => console.log(response.payload),
    [Query.equal('status', ['active'])]  // server-side filtering
);
```

Details: [realtime.md](references/realtime.md)

---

## Functions

Init SDK outside handler. Group by domain. Event triggers, not polling.

Details: [functions.md](references/functions.md) | [functions-advanced.md](references/functions-advanced.md)

---

## Transactions

```dart
final tx = await tablesDB.createTransaction(ttl: 300);
await tablesDB.createRow(..., transactionId: tx.$id);
await tablesDB.updateTransaction(transactionId: tx.$id, commit: true);
```

Details: [transactions.md](references/transactions.md)

---

## Relationships

```dart
await tablesDB.listRows(databaseId: 'db', tableId: 'posts',
    queries: [Query.equal('author.country', 'US'), Query.select(['title', 'author.name'])]);
```

**Types:** `oneToOne` | `oneToMany` | `manyToOne` | `manyToMany`

Details: [relationships.md](references/relationships.md)

---

## Permissions

```dart
permissions: [
    Permission.read(Role.any()),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.team('admin')),
    Permission.create(Role.label('premium')),
]
```

**Default:** deny all unless row/file perms set or inherited from table/bucket.
**Use row/file perms** for per-resource ACL. If all resources share rules, set table/bucket perms and leave row/file perms empty.
**`write`** = `create + update + delete`
**Avoid:** missing perms = lockout; `Role.any()` + `write`/`update`/`delete` = public mutation; `Permission.read(Role.any())` on sensitive data = public leak.
**Roles:** `any()` | `guests()` | `users()` | `user(id)` | `team(id)` | `team(id, role)` | `label(name)`
Details: [permissions](./references/permissions.md) | [teams](references/teams.md) | [storage-files](references/storage-files.md)

---

## Limits

Default page: 25 · Bulk: 1000 rows · `Query.equal()`: 100 values · Nesting: 3 levels · Queries/req: 100 · Timeout: 15s

## Error Codes

`400` Bad request · `401` Unauthorized · `403` Forbidden · `404` Not found · `409` Conflict · `429` Rate limited (client SDKs only)
Catch `AppwriteException`. `429` -> exponential backoff.

Details: [error-handling.md](references/error-handling.md)

---

## Anti-Patterns

| Wrong | Right | Why |
|-------|-------|-----|
| N+1 queries | `Query.select(['col', 'relation.col'])` | Kills extra round-trips |
| Read-modify-write | `Operator.increment()` | Race condition |
| Large offsets | `Query.cursorAfter(id)` | O(n) vs O(1) |
| Skip totals | `total: false` | Kills COUNT scan |
| Missing indexes | Create for queried columns | Queries scan entire table |
| SDK init inside handler | Init outside for warm reuse | Repeated setup each call |
| Hardcoded secrets | Env vars | Security risk |
| Polling | Realtime or event triggers | Wasted executions |
| Client-side filtering | Realtime queries | Server does work |
| Raw channel strings | `Channel` helpers | Typos, no autocomplete |
| `ColumnString` | `ColumnVarchar` or `ColumnText` | `string` deprecated |
| Hand-writing types | `appwrite generate` | Schema drift, no autocomplete |
| `databases.listDocuments()` | `tablesDB.listRows()` | Deprecated API |
| Custom ID generators | `ID.unique()` | Overflow risk, info leakage |
| Full re-fetch every sync | `Query.updatedAfter()` + per-table timestamps | Wastes bandwidth, slow |
| Loop w/ `createRow()` | `createRows()` bulk | N requests vs 1 |

---

## Cost Optimization

1. `Query.select()` — cuts bandwidth
2. Cursor pagination + `total: false` — fastest queries
3. Realtime over polling — one connection vs repeated calls
4. Batch ops — 1 execution vs N
5. WebP quality 80 — smallest files, universal support
6. Init outside handler — fewer cold starts
7. Budget cap — Organization → Billing → Budget cap

Details: [cost-optimization.md](references/cost-optimization.md)

---

## Reference Files

**Data:** [schema-management](references/schema-management.md) · [query-optimization](references/query-optimization.md) · [atomic-operators](references/atomic-operators.md) · [relationships](references/relationships.md) · [transactions](references/transactions.md) · [bulk-operations](references/bulk-operations.md) · [chunked-queries](references/chunked-queries.md)
**Performance:** [performance](references/performance.md) · [pagination-performance](references/pagination-performance.md) · [cost-optimization](references/cost-optimization.md)
**Auth:** [authentication](references/authentication.md) · [auth-methods](references/auth-methods.md) · [permissions](./references/permissions.md) · [teams](references/teams.md)
**Services:** [storage-files](references/storage-files.md) · [functions](references/functions.md) · [functions-advanced](references/functions-advanced.md) · [realtime](references/realtime.md) · [messaging](references/messaging.md) · [webhooks](references/webhooks.md) · [avatars](references/avatars.md) · [graphql](references/graphql.md) · [locale](references/locale.md)
**Tooling:** [appwrite-cli](./references/appwrite-cli.md)
**Platform:** [error-handling](references/error-handling.md) · [limits](references/limits.md) · [health](references/health.md) · [self-hosting](references/self-hosting.md) · [self-hosting-ops](references/self-hosting-ops.md)

---

## Resources

**Docs:** https://appwrite.io/docs · **API:** https://appwrite.io/docs/references · **SDKs:** https://github.com/appwrite