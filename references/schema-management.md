# Schema Management

## Contents

- Full Schema Creation
- Column Types
- Index Types
- Auto-Increment
- Timestamp Overrides
- Upsert
- CSV Import/Export
- Related

## Full Schema Creation

Create complete tables with columns and indexes in one atomic call. You can read and write immediately. Failure rolls back all changes.

### Why

- **Atomic:** All-or-nothing creation prevents partial schemas
- **Synchronous:** Table ready immediately on return
- **Reliable:** Eliminates setup script failures and race conditions

### Usage

```dart
// Dart - Create table with columns and indexes atomically
await tablesDB.createTable(
    databaseId: 'db',
    tableId: 'posts',
    name: 'Posts',
    columns: [
        ColumnVarchar(key: 'title', size: 255, required: true),
        ColumnText(key: 'content'),
        ColumnVarchar(key: 'status', size: 20, default: 'draft'),
        ColumnInteger(key: 'views', default: 0),
        ColumnDatetime(key: 'publishedAt'),
    ],
    indexes: [
        Index(key: 'status_idx', type: IndexType.key, columns: ['status']),
        Index(key: 'published_idx', type: IndexType.key, columns: ['publishedAt']),
    ],
);
```

```python
# Python — same structure with snake_case
tables_db.create_table(
    database_id='db', table_id='posts', name='Posts',
    columns=[ColumnVarchar(key='title', size=255, required=True),
             ColumnText(key='content'),
             ColumnVarchar(key='status', size=20, default='draft'),
             ColumnInteger(key='views', default=0),
             ColumnDatetime(key='published_at')],
    indexes=[Index(key='status_idx', type=IndexType.KEY, columns=['status'])]
)
```

TypeScript follows the same pattern with camelCase.

---

## Column Types

### Text

| Type | Max Chars | Storage | Indexing | Use Case |
|------|-----------|---------|----------|----------|
| `varchar` | 16,383 | Inline (counts toward 64KB row size) | Fully indexable if size < 768 | Names, slugs, identifiers — anything you query/sort/filter |
| `text` | 16,383 | Off-page (20-byte pointer in row) | Prefix indexing only | Descriptions, notes — no full indexing needed |
| `mediumtext` | 4,194,303 | Off-page | Prefix indexing only | Articles, blog posts |
| `longtext` | 1,073,741,823 | Off-page | Prefix indexing only | Large documents |

> **`string` is deprecated.** It abstracted away four storage types based on size. Use the explicit types above instead.

#### Varchar vs Text

Both share the same max size but differ in storage:
- **`varchar`** — stored inline, counts toward 64KB row budget. Fully indexable when size < 768 chars. Use for short, queryable strings.
- **`text`** — stored off-page with a 20-byte pointer. Doesn't consume row size budget but only supports prefix indexing. Use when you don't need full indexing.

### Numeric

| Type | Range | Parameters |
|------|-------|------------|
| `integer` | ±2^63 | `min`, `max`, `default` |
| `float` | 64-bit | `min`, `max`, `default` |

### Other

| Type | Description |
|------|-------------|
| `boolean` | true/false |
| `datetime` | ISO 8601 timestamp |
| `email` | Validated email format |
| `url` | Validated URL format |
| `ip` | IPv4 or IPv6 address |
| `enum` | Predefined values (max 100 elements) |

### Spatial (Geo)

| Type | Format |
|------|--------|
| `point` | `[longitude, latitude]` |
| `line` | `[[lon1,lat1], [lon2,lat2], ...]` |
| `polygon` | `[[[lon,lat], ...]]` (closed ring) |

### Encrypted String

Encrypt sensitive data at rest with AES-128-GCM. Non-queryable.

```dart
// Dart - Encrypted column (Pro/Scale/Self-hosted)
await tablesDB.createColumnString(
    databaseId: 'db',
    tableId: 'users',
    key: 'ssn',
    size: 20,
    encrypted: true,  // AES-128-GCM encryption
);
```

**Use for:** SSN, admin notes, IP addresses, sensitive identifiers.

**Encrypted columns support storage and retrieval only** — querying, filtering, and indexing excluded.

---

## Index Types

| Type | Use Case |
|------|----------|
| `key` | WHERE, ORDER BY queries |
| `fulltext` | `Query.search()` text search |
| `unique` | Enforce uniqueness constraint |
| `spatial` | Geo queries on Point/Line/Polygon |

### Create Index

```dart
// Dart - Composite index (order by selectivity)
await tablesDB.createIndex(
    databaseId: 'db',
    tableId: 'posts',
    key: 'status_created_idx',
    type: IndexType.key,
    columns: ['status', '$createdAt'],  // Most selective first
    orders: [OrderBy.asc, OrderBy.desc],
);
```

### Index Rules

- Order columns by selectivity (most selective first)
- Indexing supports scalar columns only (arrays and relationships excluded)
- `Query.search()` requires a fulltext index
- Geo queries require a spatial index

---

## Auto-Increment

Automatic `$sequence` column that increments with each insert. Useful for:

- Invoice numbers
- Activity logs
- Ordered timelines
- Paginated datasets

```dart
// Dart - Enable auto-increment on table
await tablesDB.createTable(
    databaseId: 'db',
    tableId: 'invoices',
    name: 'Invoices',
    autoIncrement: true,  // Adds $sequence column
    columns: [...],
);

// Query by sequence
final invoices = await tablesDB.listRows(
    databaseId: 'db',
    tableId: 'invoices',
    queries: [
        Query.orderAsc('$sequence'),
    ],
);
```

---

## Timestamp Overrides

Manually set `$createdAt` and `$updatedAt` for data migrations. Preserves original timestamps.

```dart
// Dart - Import with original timestamps
await tablesDB.createRow(
    databaseId: 'db',
    tableId: 'orders',
    rowId: ID.unique(),
    data: {
        'product': 'Widget',
        '$createdAt': '2024-01-15T10:30:00.000Z',  // Original date
        '$updatedAt': '2024-01-15T10:30:00.000Z',
    },
);
```

```python
# Python
tables_db.create_row(
    database_id='db', table_id='orders', row_id=ID.unique(),
    data={'product': 'Widget',
          '$createdAt': '2024-01-15T10:30:00.000Z',
          '$updatedAt': '2024-01-15T10:30:00.000Z'})
```

**Use for:**
- Data migrations from other systems
- Backfilling historical data
- Audit trail preservation

---

## Upsert

Create or update in a single call. If the row exists, update it. If not, create it.

```dart
// Dart - Upsert row
await tablesDB.upsertRow(
    databaseId: 'db',
    tableId: 'sessions',
    rowId: 'session_abc',
    data: {
        'userId': 'user_123',
        'lastActive': DateTime.now().toIso8601String(),
    },
);
```

Python uses `upsert_row()`, TypeScript uses `upsertRow()` — same parameters.

**Benefits:**
- Single network call
- No race conditions
- Cleaner code (no if-exists check)

---

## CSV Import/Export

### Import

Import rows from CSV files without custom scripts.

```dart
// Via Appwrite Console or CLI
// Supports: column mapping, type validation
```

**Use for:**
- Data migration
- Seeding test environments
- Bulk data import

### Export

Export filtered data to CSV directly from Console.

**Features:**
- Apply queries before export
- Select specific columns
- Custom delimiter
- Background execution
- Email notification on completion

---

## Related

- Transactions for atomic multi-table operations
- Bulk operations for batch inserts
- Relationships for table connections
