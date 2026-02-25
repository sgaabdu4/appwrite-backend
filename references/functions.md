# Functions Best Practices

## Contents

- Architecture
- Cold Start Optimization
- Handler Pattern
- Input Validation & Responses
- Security
- Environment Variables
- Related

## Architecture

**Group functions by domain.** Each function owns one domain — not one operation, not everything.

```
✅ api-users          — all user endpoints (CRUD, profile, settings)
✅ api-orders         — order creation, status, cancellation
✅ api-notifications  — email, push, SMS triggers
✅ process-images     — resize, convert, thumbnail
✅ scheduled-cleanup  — daily/weekly maintenance tasks
❌ handle-everything  — one monolith doing all domains
❌ create-user        — one function per operation
```

**Warm-start advantage:** More requests per function means instances stay warm. A function handling 50 user operations gets 50x traffic vs one handling just "create user" — so it rarely cold-starts.

### Route Handling Inside Domain Functions

```dart
Future<dynamic> main(final context) async {
    final path = context.req.path;
    final method = context.req.method;

    if (method == 'GET' && path == '/users') return listUsers(context);
    if (method == 'POST' && path == '/users') return createUser(context);
    if (method == 'GET' && path.startsWith('/users/')) return getUser(context);
    if (method == 'PUT' && path.startsWith('/users/')) return updateUser(context);
    if (method == 'DELETE' && path.startsWith('/users/')) return deleteUser(context);

    return context.res.json({'error': 'Not found'}, statusCode: 404);
}
```

### When to Split

Split when a domain function has operations with vastly different resource needs, exceeds timeout limits, or needs different API key scopes.

---

## Cold Start Optimization

### Language Choice

| Language | Cold Start | Use When |
|----------|-----------|----------|
| Dart | Fastest | User-facing (compiled, native SDK) |
| Node.js + ESBuild | Fast | npm ecosystem needed |
| Python | Slowest | Data processing, ML |

**Bundle interpreted languages** into a single file:

```bash
npx esbuild src/index.ts --bundle --platform=node --outfile=dist/index.js
```

**Keep dependencies minimal.** Every dep adds cold start time.

### Specifications

| Workload | CPU | Memory |
|----------|-----|--------|
| Text processing, CRUD | Low | 128MB |
| Image processing | High | 512MB+ |
| ML inference | High | 1GB+ |

---

## Handler Pattern

Initialize SDK, connections, and caches **outside the handler**. They persist between warm invocations.

### Dart

```dart
// ✅ Initialize ONCE — reused across warm invocations
final client = Client()
    .setEndpoint(Platform.environment['APPWRITE_FUNCTION_API_ENDPOINT']!)
    .setProject(Platform.environment['APPWRITE_FUNCTION_PROJECT_ID']!)
    .setKey(Platform.environment['APPWRITE_FUNCTION_API_KEY']!);

final tablesDB = TablesDB(client);

Future<dynamic> main(final context) async {
    final rows = await tablesDB.listRows(
        databaseId: 'db', tableId: 'items',
        queries: [Query.limit(10)], total: false);
    return context.res.json({'items': rows.rows});
}
```

### Python

```python
client = Client()
client.set_endpoint(os.environ['APPWRITE_FUNCTION_API_ENDPOINT'])
client.set_project(os.environ['APPWRITE_FUNCTION_PROJECT_ID'])
client.set_key(os.environ['APPWRITE_FUNCTION_API_KEY'])

tables_db = TablesDB(client)

def main(context):
    rows = tables_db.list_rows(
        database_id='db', table_id='items',
        queries=[Query.limit(10)], total=False)
    return context.res.json({'items': rows['rows']})
```

### TypeScript

```typescript
const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT!)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY!);

const tablesDB = new TablesDB(client);

export default async ({ req, res }: any) => {
    const rows = await tablesDB.listRows({
        databaseId: 'db', tableId: 'items',
        queries: [Query.limit(10)], total: false});
    return res.json({ items: rows.rows });
};
```

---

## Input Validation & Responses

```dart
Future<dynamic> main(final context) async {
    if (context.req.method != 'POST') {
        return context.res.json({'error': 'Method not allowed'}, statusCode: 405);
    }

    final body = context.req.bodyJson;
    final email = body['email'] as String?;
    if (email == null || !email.contains('@')) {
        return context.res.json({'error': 'Invalid email'}, statusCode: 400);
    }

    try {
        final user = await account.create(
            userId: ID.unique(), email: email, password: body['password']);
        return context.res.json({'userId': user.$id});
    } on AppwriteException catch (e) {
        return context.res.json({'error': e.message}, statusCode: e.code ?? 500);
    }
}
```

---

## Security

### Minimal API Key Scopes

```
✅ Key for "send-email": messaging.write only
✅ Key for "list-products": tables.read only
❌ Full admin key for every function
```

### Enforce Authorization Server-Side

```dart
Future<dynamic> main(final context) async {
    final userId = context.req.headers['x-appwrite-user-id'];
    if (userId == null || userId.isEmpty) {
        return context.res.json({'error': 'Unauthorized'}, statusCode: 401);
    }

    final row = await tablesDB.getRow(
        databaseId: 'db', tableId: 'orders', rowId: orderId);
    if (row.data['userId'] != userId) {
        return context.res.json({'error': 'Forbidden'}, statusCode: 403);
    }
}
```

Rotate function API keys every 1-3 months. Set expiration dates.

---

## Environment Variables

Console → Functions → Settings → Environment Variables

```dart
// ✅ From environment
final stripeKey = Platform.environment['STRIPE_SECRET_KEY']!;
// ❌ NEVER hardcode
```

### Built-In Variables

| Variable | Description |
|----------|-------------|
| `APPWRITE_FUNCTION_API_ENDPOINT` | API endpoint URL |
| `APPWRITE_FUNCTION_PROJECT_ID` | Current project ID |
| `APPWRITE_FUNCTION_API_KEY` | Scoped API key |

---

## Related

- [functions-advanced.md](functions-advanced.md) — Caching, events, scheduling, CI/CD, anti-patterns
- [realtime.md](realtime.md) — Event-driven subscriptions
- [cost-optimization.md](cost-optimization.md) — Reducing execution costs
