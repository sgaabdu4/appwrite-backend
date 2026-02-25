# Atomic Operators

## Contents

- The Rule
- Why
- The Problem
- The Solution
- Operator Reference
- Examples
- Operators in Transactions
- Impact
- Related

## The Rule

**Use Operator for field updates. Never read-modify-write.**

## Why

Read-modify-write creates race conditions. Two concurrent requests read the same value, increment locally, and write back—losing one increment.

Operators execute atomically on the server. No conflicts. No lost updates.

## The Problem

```dart
// WRONG - Race condition
final row = await tablesDB.getRow(databaseId: 'db', tableId: 'posts', rowId: 'post_1');
final newLikes = row.data['likes'] + 1;  // Both requests read 100
await tablesDB.updateRow(
    databaseId: 'db',
    tableId: 'posts',
    rowId: 'post_1',
    data: {'likes': newLikes},  // Both write 101, should be 102
);
```

## The Solution

```dart
// CORRECT - Atomic, thread-safe
await tablesDB.updateRow(
    databaseId: 'db',
    tableId: 'posts',
    rowId: 'post_1',
    data: {'likes': Operator.increment(1)},
);
```

## Operator Reference

### Numeric

| Operator | Dart | Python | TypeScript |
|----------|------|--------|------------|
| Add | `Operator.increment(n)` | `Operator.increment(n)` | `Operator.increment(n)` |
| Add with max | `Operator.increment(n, max)` | `Operator.increment(n, max_value=x)` | `Operator.increment(n, max)` |
| Subtract | `Operator.decrement(n)` | `Operator.decrement(n)` | `Operator.decrement(n)` |
| Subtract with min | `Operator.decrement(n, min)` | `Operator.decrement(n, min_value=x)` | `Operator.decrement(n, min)` |
| Multiply | `Operator.multiply(f)` | `Operator.multiply(f)` | `Operator.multiply(f)` |
| Divide | `Operator.divide(d)` | `Operator.divide(d)` | `Operator.divide(d)` |
| Modulo | `Operator.modulo(d)` | `Operator.modulo(d)` | `Operator.modulo(d)` |
| Power | `Operator.power(e)` | `Operator.power(e)` | `Operator.power(e)` |

### Array

| Operator | Description |
|----------|-------------|
| `Operator.arrayAppend([...])` | Add items to end |
| `Operator.arrayPrepend([...])` | Add items to start |
| `Operator.arrayInsert(index, value)` | Insert at position |
| `Operator.arrayRemove(value)` | Remove first occurrence |
| `Operator.arrayUnique()` | Remove duplicates |
| `Operator.arrayIntersect([...])` | Keep only matching items |
| `Operator.arrayDiff([...])` | Remove matching items |
| `Operator.arrayFilter(condition)` | Filter by condition |

### String

| Operator | Description |
|----------|-------------|
| `Operator.stringConcat(value)` | Append to string |
| `Operator.stringReplace(search, replace)` | Find and replace |

### Boolean & Date

| Operator | Description |
|----------|-------------|
| `Operator.toggle()` | Flip boolean value |
| `Operator.dateAddDays(n)` | Add days to date |
| `Operator.dateSubDays(n)` | Subtract days from date |
| `Operator.dateSetNow()` | Set to current timestamp |

## Examples

### Like Counter with Floor

```dart
// Dart - Can't go below 0
await tablesDB.updateRow(
    databaseId: 'db',
    tableId: 'posts',
    rowId: 'post_123',
    data: {'likes': Operator.decrement(1, 0)},
);
```

```python
# Python - Bounded decrement
tables_db.update_row(
    database_id='db',
    table_id='posts',
    row_id='post_123',
    data={'likes': Operator.decrement(1, min_value=0)}
)
```

### Inventory with Transaction

```typescript
// TypeScript - Atomic stock decrement
await tablesDB.updateRow({
    databaseId: 'db',
    tableId: 'products',
    rowId: 'product_123',
    data: {
        stock: Operator.decrement(quantity, 0),
        lastSold: Operator.dateSetNow(),
    },
});
```

### Tag Management

```dart
// Dart - Add tags atomically
await tablesDB.updateRow(
    databaseId: 'db',
    tableId: 'posts',
    rowId: 'post_123',
    data: {
        'tags': Operator.arrayAppend(['featured', 'trending']),
    },
);

// Remove specific tag
await tablesDB.updateRow(
    databaseId: 'db',
    tableId: 'posts',
    rowId: 'post_123',
    data: {
        'tags': Operator.arrayRemove('archived'),
    },
);
```

### Feature Flags

```python
# Python - Toggle flag
tables_db.update_row(
    database_id='db',
    table_id='features',
    row_id='dark_mode',
    data={'enabled': Operator.toggle()}
)
```

### Login Tracking

```python
# Python - Multiple atomic updates
tables_db.update_row(
    database_id='db',
    table_id='users',
    row_id='user_123',
    data={
        'loginCount': Operator.increment(1),
        'lastLogin': Operator.date_set_now(),
    }
)
```

## Operators in Transactions

Operators work inside transactions for complex atomic workflows.

```dart
// Dart - Transfer between accounts
final tx = await tablesDB.createTransaction(ttl: 300);

await tablesDB.updateRow(
    databaseId: 'db',
    tableId: 'accounts',
    rowId: fromAccount,
    data: {'balance': Operator.decrement(amount, 0)},
    transactionId: tx.$id,
);

await tablesDB.updateRow(
    databaseId: 'db',
    tableId: 'accounts',
    rowId: toAccount,
    data: {'balance': Operator.increment(amount)},
    transactionId: tx.$id,
);

await tablesDB.updateTransaction(transactionId: tx.$id, commit: true);
```

## Impact

- **Consistency:** Eliminates race conditions
- **Latency:** One roundtrip instead of two
- **Bandwidth:** No need to fetch current value
- **Reliability:** Server guarantees atomicity

## Related

- Transactions for multi-row atomicity
- Bulk operations for batch updates
- Upsert for create-or-update patterns
