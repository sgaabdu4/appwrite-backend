# Performance Optimization

## Contents

- Quick Reference
- Checklist
- Red Flags
- Performance Targets
- Self-Hosted: Redis Caching
- Related

## Quick Reference

| Technique | Impact | Details |
|-----------|--------|---------|
| Cursor pagination | 100x faster at scale | [pagination-performance.md](pagination-performance.md) |
| Query.select() | 12-18x for relationships | [relationships.md](relationships.md) |
| Skip totals | Eliminates COUNT scan | [pagination-performance.md](pagination-performance.md) |
| Indexes | 100x faster queries | [schema-management.md](schema-management.md) |
| Atomic operators | Eliminates race conditions | [atomic-operators.md](atomic-operators.md) |
| Bulk operations | N requests → 1 | [bulk-operations.md](bulk-operations.md) |
| Realtime | WebSocket vs polling | [realtime.md](realtime.md) |
| Image caching | WebP/AVIF 30-55% smaller | [storage-files.md](storage-files.md) |
| Redis cache (self-hosted) | Cut DB reads for hot data | See below |

---

## Checklist

Before deploying:

- [ ] All filter/sort columns indexed
- [ ] Lists use `Query.select()` for needed fields only
- [ ] Pagination uses cursor (not offset) for >100 rows
- [ ] `total: false` for infinite scroll
- [ ] Counters use `Operator.increment()`
- [ ] Bulk creates use `createRows()` not loops
- [ ] ID queries chunked when >100 IDs
- [ ] Realtime replaces polling
- [ ] Images use WebP/AVIF at quality 80

---

## Red Flags

| Symptom | Cause | Fix |
|---------|-------|-----|
| Query >500ms | Missing index | Add index for queried columns |
| Latency increases over time | Offset pagination | Switch to cursor |
| High client memory | Fetching all data | Use generators |
| Duplicate data in responses | Missing Query.select() | Select only needed fields |
| Lost counter updates | Read-modify-write | Use Operator.increment() |

---

## Performance Targets

| Operation | Target |
|-----------|--------|
| Single row get | <50ms |
| List (25 rows) | <100ms |
| Full-text search | <200ms |
| Bulk (100 rows) | <500ms |

---

## Self-Hosted: Redis Caching

Self-hosted Appwrite includes Redis. Use it to cache frequent reads and cut database load.

### Cache-Aside Pattern (Function-Level)

```dart
import 'dart:convert';
import 'package:redis/redis.dart';

final redis = RedisConnection();
Command? _cmd;

Future<Command> getRedis() async {
    _cmd ??= await redis.connect('localhost', 6379);
    return _cmd!;
}

Future<Map<String, dynamic>> getCachedRow(String key, Future<Map<String, dynamic>> Function() fetch) async {
    final cmd = await getRedis();
    final cached = await cmd.get(key);

    if (cached != null) return jsonDecode(cached as String);

    final data = await fetch();
    await cmd.send_object(['SET', key, jsonEncode(data), 'EX', '300']); // 5 min TTL
    return data;
}
```

### When to Cache

| Cache | Skip Cache |
|-------|-----------|
| User profiles read 100x/min | Data that changes every request |
| Config/settings (changes rarely) | Writes (always go to TablesDB) |
| Computed aggregations | Security-sensitive data |
| API responses shared across users | Per-user real-time data |

### Invalidation

Invalidate on write. Use Appwrite event triggers to clear stale cache entries:

```dart
// In your data-update function: clear the cache key after writing
await cmd.send_object(['DEL', 'user:$userId']);
```

---

## Related

- [pagination-performance.md](pagination-performance.md) — Cursor patterns, generators
- [query-optimization.md](query-optimization.md) — Index strategy, spatial
- [atomic-operators.md](atomic-operators.md) — Thread-safe updates
- [bulk-operations.md](bulk-operations.md) — Mass operations
- [limits.md](limits.md) — Platform limits
