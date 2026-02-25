# Pagination Performance

## Contents

- The Rule
- Why
- The Pattern
- Combine with Skip Totals
- When Offset is Acceptable
- Complete Pagination Pattern
- Impact
- Related

## The Rule

**Always use cursor pagination for paginated lists.**

## Why

Offset pagination degrades linearly. The database reads N rows before returning results. At offset 10,000, it reads 10,000 rows just to skip them.

Cursor pagination jumps directly to the target row using an index. Performance stays constant regardless of position.

| Records | Offset 10,000 | Cursor |
|---------|---------------|--------|
| 10,000 | ~100ms | ~5ms |
| 100,000 | ~1,000ms | ~5ms |
| 1,000,000 | ~10,000ms | ~5ms |

## The Pattern

### Wrong (O(n))

```dart
// Slow - reads 10,000 rows to skip them
Query.offset(10000)
Query.limit(25)
```

```python
# Slow - scans rows sequentially
Query.offset(10000)
Query.limit(25)
```

```typescript
// Slow - performance degrades with position
Query.offset(10000)
Query.limit(25)
```

### Correct (O(1))

```dart
// Dart - Constant time regardless of position
final response = await tablesDB.listRows(
    databaseId: 'db',
    tableId: 'items',
    queries: [
        Query.cursorAfter(lastRowId),
        Query.limit(25),
    ],
    total: false,  // Skip counting for extra speed
);

// Store last ID for next page
final nextCursor = response.rows.last.$id;
```

```python
# Python - O(1) lookup
response = tables_db.list_rows(
    database_id='db',
    table_id='items',
    queries=[
        Query.cursor_after(last_row_id),
        Query.limit(25),
    ],
    total=False
)

next_cursor = response['rows'][-1]['$id']
```

```typescript
// TypeScript - Constant performance
const response = await tablesDB.listRows({
    databaseId: 'db',
    tableId: 'items',
    queries: [
        Query.cursorAfter(lastRowId),
        Query.limit(25),
    ],
    total: false,
});

const nextCursor = response.rows[response.rows.length - 1].$id;
```

## Combine with Skip Totals

The `total=false` parameter skips the COUNT query — another full table scan. Combine with cursor pagination for maximum performance.

```dart
// Maximum performance - cursor + skip total
final response = await tablesDB.listRows(
    databaseId: 'db',
    tableId: 'logs',
    queries: [
        Query.cursorAfter(lastId),
        Query.limit(100),
        Query.orderDesc('$createdAt'),
    ],
    total: false,  // response.total = 0, but rows returned normally
);
```

## When Offset is Acceptable

Small lookup tables with <1,000 rows:
- Countries, currencies, categories
- Static configuration data
- Dropdown options

## Complete Pagination Pattern

```typescript
// TypeScript - Async generator for all rows
async function* fetchAllRows<T>(
    dbId: string,
    tableId: string,
    baseQueries: string[] = []
): AsyncGenerator<T[]> {
    let cursor: string | undefined;

    while (true) {
        const queries = [
            ...baseQueries,
            Query.limit(100),
        ];

        if (cursor) {
            queries.push(Query.cursorAfter(cursor));
        }

        const response = await tablesDB.listRows<T>({
            databaseId: dbId,
            tableId: tableId,
            queries,
            total: false,
        });

        if (response.rows.length === 0) break;

        yield response.rows;

        cursor = response.rows[response.rows.length - 1].$id;

        if (response.rows.length < 100) break;
    }
}

// Usage
for await (const batch of fetchAllRows('db', 'users')) {
    await processBatch(batch);
}
```

```dart
// Dart - Stream-based pagination
Stream<List<Map<String, dynamic>>> fetchAllRows(
    String dbId,
    String tableId,
    List<String> baseQueries,
) async* {
    String? cursor;

    while (true) {
        final queries = [
            ...baseQueries,
            Query.limit(100),
            if (cursor != null) Query.cursorAfter(cursor),
        ];

        final response = await tablesDB.listRows(
            databaseId: dbId,
            tableId: tableId,
            queries: queries,
            total: false,
        );

        if (response.rows.isEmpty) break;

        yield response.rows;

        cursor = response.rows.last.$id;

        if (response.rows.length < 100) break;
    }
}
```

```python
# Python - Generator for memory efficiency
def fetch_all_rows(db_id: str, table_id: str, base_queries: list = []):
    cursor = None

    while True:
        queries = base_queries.copy()
        queries.append(Query.limit(100))

        if cursor:
            queries.append(Query.cursor_after(cursor))

        response = tables_db.list_rows(
            database_id=db_id,
            table_id=table_id,
            queries=queries,
            total=False
        )

        rows = response['rows']
        if not rows:
            break

        yield rows

        cursor = rows[-1]['$id']

        if len(rows) < 100:
            break
```

## Impact

- **Latency:** 10-100x improvement on large datasets
- **Cost:** Reduced database CPU usage
- **Scale:** Enables infinite scroll and feeds at any scale

## Related

- Skip totals for count elimination
- Indexes for query performance
- Query.select() for payload reduction
