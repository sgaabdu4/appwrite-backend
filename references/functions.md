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

Initialize SDK and services **outside the handler** (warm-start). Refresh the dynamic API key on each call — it changes per execution.

### Dart

```dart
Client? _client;
TablesDB? _tablesDB;

void _ensureInit(dynamic context) {
  final apiKey = (context.req.headers['x-appwrite-key'] ?? '') as String;

  if (_client != null) {
    _client!.setKey(apiKey);
    return;
  }

  _client = Client()
      .setEndpoint(Platform.environment['APPWRITE_FUNCTION_API_ENDPOINT']!)
      .setProject(Platform.environment['APPWRITE_FUNCTION_PROJECT_ID']!)
      .setKey(apiKey);
  _tablesDB = TablesDB(_client!);
}

Future<dynamic> main(final context) async {
    _ensureInit(context);
    final rows = await _tablesDB!.listRows(
        databaseId: 'db', tableId: 'items',
        queries: [Query.limit(10)], total: false);
    return context.res.json({'items': rows.rows});
}
```

### Python

```python
client = None
tables_db = None

def _ensure_init(context):
    global client, tables_db
    api_key = context.req.headers.get('x-appwrite-key', '')

    if client is not None:
        client.set_key(api_key)
        return

    client = Client()
    client.set_endpoint(os.environ['APPWRITE_FUNCTION_API_ENDPOINT'])
    client.set_project(os.environ['APPWRITE_FUNCTION_PROJECT_ID'])
    client.set_key(api_key)
    tables_db = TablesDB(client)

def main(context):
    _ensure_init(context)
    rows = tables_db.list_rows(
        database_id='db', table_id='items',
        queries=[Query.limit(10)], total=False)
    return context.res.json({'items': rows['rows']})
```

### TypeScript

```typescript
let client: Client | null = null;
let tablesDB: TablesDB | null = null;

function ensureInit(context: any) {
    const apiKey = context.req.headers['x-appwrite-key'] ?? '';

    if (client) {
        client.setKey(apiKey);
        return;
    }

    client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT!)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
        .setKey(apiKey);
    tablesDB = new TablesDB(client);
}

export default async ({ req, res }: any) => {
    ensureInit({ req });
    const rows = await tablesDB!.listRows({
        databaseId: 'db', tableId: 'items',
        queries: [Query.limit(10)], total: false});
    return res.json({ items: rows.rows });
};
```

---

## Input Validation & Responses

> **Security:** All user input from `context.req.bodyJson` is untrusted. Always validate types, sanitize strings, and enforce length limits before processing.

```dart
Future<dynamic> main(final context) async {
    if (context.req.method != 'POST') {
        return context.res.json({'error': 'Method not allowed'}, statusCode: 405);
    }

    // ⚠️ UNTRUSTED INPUT — validate before use
    final body = context.req.bodyJson;
    final email = _sanitizeString(body['email']);
    if (email == null || !_isValidEmail(email)) {
        return context.res.json({'error': 'Invalid email'}, statusCode: 400);
    }

    final password = _sanitizeString(body['password']);
    if (password == null || password.length < 8 || password.length > 128) {
        return context.res.json({'error': 'Invalid password'}, statusCode: 400);
    }

    try {
        final user = await account.create(
            userId: ID.unique(), email: email, password: password);
        return context.res.json({'userId': user.$id});
    } on AppwriteException catch (e) {
        return context.res.json({'error': e.message}, statusCode: e.code ?? 500);
    }
}

// Sanitization helpers
String? _sanitizeString(dynamic value) {
    if (value is! String) return null;
    return value.trim().substring(0, value.length.clamp(0, 1000));
}

bool _isValidEmail(String email) {
    return email.length <= 254 && RegExp(r'^[^@]+@[^@]+\.[^@]+$').hasMatch(email);
}
```

---

## Security

### API Keys

Appwrite auto-generates a short-lived API key per execution from the function's **scopes** (Console → Settings → Scopes). Use `context.req.headers['x-appwrite-key']` — no manual key management needed.

```
✅ rows.read only for a read function
✅ teams.read + teams.write + rows.read + rows.write for squad ops
❌ All scopes for every function
```

### Execute Permissions

```
['users']              — any authenticated user
['user:abc123']        — specific user only
['team:teamABC']       — team members
[]                     — server/event/schedule only
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

---

## Environment Variables

Console → Functions → Settings → Environment Variables. Use for non-secret config (database IDs, feature flags).

```dart
final stripeKey = Platform.environment['STRIPE_SECRET_KEY']!;
```

### Built-In Variables & Headers

| Name | Source | Description |
|------|--------|-------------|
| `APPWRITE_FUNCTION_API_ENDPOINT` | Env var | API endpoint (auto-injected) |
| `APPWRITE_FUNCTION_PROJECT_ID` | Env var | Project ID (auto-injected) |
| `x-appwrite-key` | `req.headers` | Dynamic API key (scoped, short-lived) |
| `x-appwrite-user-id` | `req.headers` | Caller's user ID (empty for server calls) |
| `x-appwrite-user-jwt` | `req.headers` | Caller's JWT (client-SDK executions) |

---

## Related

- [functions-advanced.md](functions-advanced.md) — Caching, events, scheduling, CI/CD, anti-patterns
- [realtime.md](realtime.md) — Event-driven subscriptions
- [cost-optimization.md](cost-optimization.md) — Reducing execution costs
