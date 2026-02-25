# Cost Optimization

## Contents

- Appwrite Cloud Pricing
- Cost Reduction Strategies
- Image Transformation Cache
- Budget Protection
- Monitor Usage
- Related

## Appwrite Cloud Pricing

| Resource | Free | Pro ($25/mo) |
|----------|------|--------------|
| Bandwidth | 5 GB | 2 TB |
| Storage | 2 GB | 150 GB |
| Executions | 750K | 3.5M |
| Monthly Active Users | 75K | 200K |
| Databases (count) | 1 | Unlimited |
| Buckets (count) | 1 | Unlimited |
| Functions (count) | 2 | Unlimited |

> **"Unlimited" means the NUMBER of databases/buckets/functions you can create — NOT unlimited reads/writes.** All database reads, writes, and API responses consume bandwidth. Pro includes 2 TB; overages are billed as add-ons until your budget cap.

### What Costs Money

- **Bandwidth:** All API request/response data (including database reads/writes)
- **Storage:** Files in buckets + database storage
- **Executions:** Each function invocation
- **MAU:** Unique logged-in users per month

---

## Cost Reduction Strategies

| Strategy | Impact | Details |
|----------|--------|---------|
| Query.select() | Less bandwidth | [query-optimization.md](query-optimization.md) |
| Cursor pagination | Faster queries | [pagination-performance.md](pagination-performance.md) |
| Skip totals | No COUNT scan | [pagination-performance.md](pagination-performance.md) |
| Indexes | Faster lookups | [schema-management.md](schema-management.md) |
| Realtime | No polling | [realtime.md](realtime.md) |
| WebP/AVIF | 30-55% smaller | [storage-files.md](storage-files.md) |
| Batch functions | 1 exec vs N | See below |

### Batch Function Operations

One execution doing 10 operations beats 10 executions.

```python
# ❌ 10 function calls (10 executions)
for item in items:
    functions.create_execution(function_id='process', body=item)

# ✅ 1 function call (1 execution)
functions.create_execution(
    function_id='process-batch',
    body=json.dumps(items)
)
```

---

## Image Transformation Cache

Appwrite caches transformed images. Identical URLs serve from cache.

```dart
// First request: computed
// Second request: cached (minimal cost)
storage.getFilePreview(bucketId: 'img', fileId: 'id', width: 400, output: 'webp');
```

Use consistent URLs to maximize cache hits.

---

## Budget Protection

Console → Organization → Billing → Budget cap

| Resource | Pro at Limit | Free at Limit |
|----------|--------------|---------------|
| Bandwidth | Auto-buy until cap | API access denied |
| Storage | Auto-buy until cap | Uploads disabled |
| Executions | Auto-buy until cap | Functions disabled |

Set budget caps to prevent unexpected charges.

### Budget Alerts

Console → Organization → Billing → Budget Alerts

Alerts warn you before the budget cap stops services. Set alerts at 50%, 75%, and 90% of your cap to react before hitting hard limits.

---

## Monitor Usage

Console → Organization → Usage

Track bandwidth, storage, executions, and MAU against your limits.

---

## Related

- [performance.md](performance.md) — Optimization checklist
- [storage-files.md](storage-files.md) — Image formats
- [limits.md](limits.md) — Platform limits
