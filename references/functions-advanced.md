# Functions Advanced

## Contents

- Error Handling & Idempotency
- Caching
- Logging
- Event Triggers
- Timeout Strategy
- Scheduled Executions
- Binary Payloads
- CI/CD Deployment
- Function Domains
- Local Development
- Anti-Patterns
- Related

## Error Handling & Idempotency

> **Security:** Data from `context.req.bodyJson` and event payloads is untrusted. Validate and sanitize all fields before database operations. See [functions.md](functions.md) for sanitization patterns.

### Always Return Valid Responses

```dart
Future<dynamic> main(final context) async {
    try {
        // ⚠️ Validate bodyJson before passing to processOrder
        final body = context.req.bodyJson;
        if (body is! Map<String, dynamic>) {
            return context.res.json({'error': 'Invalid payload'}, statusCode: 400);
        }
        final result = await processOrder(body);
        return context.res.json({'success': true, 'data': result});
    } catch (e) {
        context.error('Function failed: $e');
        return context.res.json({'error': 'Internal error'}, statusCode: 500);
    }
}
```

### Design for Idempotency

Event triggers can deliver the same event more than once. Use idempotency keys.

```dart
Future<dynamic> main(final context) async {
    final eventId = context.req.headers['x-appwrite-event-id'];
    if (eventId == null || eventId.isEmpty) {
        return context.res.json({'error': 'Missing event ID'}, statusCode: 400);
    }

    try {
        await tablesDB.getRow(
            databaseId: 'db', tableId: 'processed_events', rowId: eventId);
        return context.res.json({'status': 'already_processed'});
    } on AppwriteException catch (e) {
        if (e.code != 404) rethrow;
    }

    // ⚠️ Validate event payload before processing
    final payload = context.req.bodyJson;
    if (payload is! Map<String, dynamic>) {
        return context.res.json({'error': 'Invalid payload'}, statusCode: 400);
    }
    
    await processEvent(payload);
    await tablesDB.createRow(
        databaseId: 'db', tableId: 'processed_events', rowId: eventId,
        data: {'processedAt': DateTime.now().toIso8601String()});

    return context.res.json({'status': 'processed'});
}
```

---

## Caching

Global variables persist across warm invocations.

```dart
Map<String, dynamic> _cache = {};
DateTime? _cacheTime;
const _cacheTTL = Duration(minutes: 5);

Future<dynamic> main(final context) async {
    if (_cacheTime != null &&
        DateTime.now().difference(_cacheTime!) < _cacheTTL) {
        return context.res.json(_cache);
    }

    final rows = await tablesDB.listRows(
        databaseId: 'db', tableId: 'config',
        queries: [Query.limit(100)], total: false);

    _cache = {'config': rows.rows};
    _cacheTime = DateTime.now();
    return context.res.json(_cache);
}
```

**Cache:** Configuration, lookup tables, rate-limit counters.
**Skip:** User-specific data, frequently changing data.

---

## Logging

Use `context.log()` for info, `context.error()` for errors. Disable in production for performance; re-enable for debugging.

Console → Functions → Settings → Logging

---

## Event Triggers

**Prefer over polling.** One trigger replaces thousands of requests.

| Event | Use Case |
|-------|----------|
| `databases.*.tables.orders.rows.*.create` | Process new orders |
| `users.*.create` | Send welcome email |
| `storage.*.files.*.create` | Process uploads |
| `users.*.sessions.*.create` | Log new sign-ins |

```dart
Future<dynamic> main(final context) async {
    final event = context.req.headers['x-appwrite-event'];
    final payload = context.req.bodyJson;

    if (event?.contains('rows') == true && event?.endsWith('.create') == true) {
        await sendOrderConfirmation(payload);
    }
    return context.res.json({'processed': true});
}
```

---

## Timeout Strategy

| Workload | Timeout |
|----------|---------|
| API response (CRUD) | 15s |
| Image processing | 30s |
| Report generation | 60s |
| Data migration | 300s |

Break long tasks into async executions:

```dart
final execution = await functions.createExecution(
    functionId: 'heavy-report', async: true,
    body: jsonEncode({'reportId': 'abc'}));

// Check result later
final result = await functions.getExecution(
    functionId: 'heavy-report', executionId: execution.$id);
```

---

## Scheduled Executions

### One-Time / Delayed

```dart
await functions.createExecution(
    functionId: 'send-report',
    scheduledAt: DateTime.parse('2025-01-15T09:00:00Z').toIso8601String(),
);
```

### Cron (Recurring)

```dart
await functions.update(functionId: 'daily-cleanup', schedule: '0 0 * * *');
```

| Pattern | Description |
|---------|-------------|
| `0 * * * *` | Every hour |
| `0 0 * * *` | Daily at midnight |
| `0 0 * * 0` | Weekly on Sunday |
| `0 0 1 * *` | Monthly on 1st |

---

## Binary Payloads

```dart
final bytes = await File('image.png').readAsBytes();
await functions.createExecution(
    functionId: 'process-image', body: base64Encode(bytes),
    headers: {'content-type': 'application/octet-stream'});
```

---

## CI/CD Deployment

**Git (recommended):** Console → Functions → Settings → Connect Git Repository. Push to branch → auto deploy.

**CLI:** `appwrite deploy function --function-id my-function`

---

## Function Domains

Map custom domains: `https://api.example.com/path` → Function execution.

Console → Functions → Settings → Domains.

---

## Local Development

```bash
appwrite init function
appwrite run function --function-id my-function
```

---

## Anti-Patterns

| Wrong | Right | Why |
|-------|-------|-----|
| Init SDK inside handler | Init outside | Repeated setup |
| One function does everything | Domain grouping | Hard to scale/debug |
| Full admin API key | Minimal scope key | Blast radius |
| Trust client auth only | Validate in function | Easily bypassed |
| No error handling | Try-catch + structured errors | Silent failures |
| Log everything in prod | Disable, enable for debug | Performance |
| Process same event twice | Idempotency check | Duplicates |
| Long single function | Break into async tasks | Timeout risk |
| Poll for changes | Event triggers / Realtime | Wasted executions |
| Import unused deps | Minimal imports | Slower cold starts |

---

## Related

- [functions.md](functions.md) — Architecture, cold starts, handler pattern
- [realtime.md](realtime.md) — Event-driven subscriptions
- [error-handling.md](error-handling.md) — Retry patterns
- [cost-optimization.md](cost-optimization.md) — Reducing execution costs
