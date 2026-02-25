# Health

System health checks for self-hosted Appwrite deployments.

---

## Contents

- Overall Health
- Service Checks
- Queue Monitoring
- Certificate Check
- Time Sync
- Public Cloud Note
- Monitoring Integration
- Horizontal Scaling (Self-Hosted)
- Related

## Overall Health

```dart
// Dart (Server SDK with admin privileges)
final health = await health.get();

print(health.status);  // 'pass' or 'fail'
```

---

## Service Checks

### Database

```dart
final dbHealth = await health.getDB();
print(dbHealth.status);  // 'pass'
print(dbHealth.ping);    // Response time in ms
```

### Cache (Redis)

```dart
final cacheHealth = await health.getCache();
print(cacheHealth.status);
print(cacheHealth.ping);
```

### Storage

```dart
final storageHealth = await health.getStorage();
print(storageHealth.status);
```

### Antivirus

```dart
final avHealth = await health.getAntivirus();
print(avHealth.status);  // 'pass' if ClamAV running
```

---

## Queue Monitoring

Check background job queues.

```dart
// All queues
final queuesHealth = await health.getQueues();

for (final queue in queuesHealth.queues) {
    print('${queue.name}: ${queue.size} jobs');
}
```

### Specific Queues

```dart
final webhooks = await health.getQueueWebhooks();
final functions = await health.getQueueFunctions();
final builds = await health.getQueueBuilds();
final messaging = await health.getQueueMessaging();
final migrations = await health.getQueueMigrations();
```

---

## Certificate Check

Verify SSL certificate validity.

```dart
final certHealth = await health.getCertificate(domain: 'cloud.appwrite.io');

print(certHealth.valid);        // true
print(certHealth.domain);       // cloud.appwrite.io
print(certHealth.signatureType); // RSA
print(certHealth.validFrom);    // ISO date
print(certHealth.validTo);      // ISO date
```

---

## Time Sync

Check server time accuracy.

```dart
final timeHealth = await health.getTime();

print(timeHealth.remoteTime);      // NTP server time
print(timeHealth.localTime);       // Server time
print(timeHealth.diff);            // Difference in ms
```

Time differences >30 seconds cause authentication issues.

---

## Public Cloud Note

Health endpoints require admin API key. Appwrite manages Cloud health internally — these endpoints apply to self-hosted only.

---

## Monitoring Integration

Use health checks for:

- **Uptime monitors:** Pingdom, UptimeRobot
- **Kubernetes probes:** Liveness/readiness
- **Alerting:** PagerDuty, Slack notifications
- **Dashboards:** Grafana, Datadog

### Example Endpoint

```typescript
// TypeScript - Express health endpoint
app.get('/health', async (req, res) => {
    try {
        const db = await health.getDB();
        const cache = await health.getCache();
        
        if (db.status === 'pass' && cache.status === 'pass') {
            res.status(200).json({ status: 'healthy' });
        } else {
            res.status(503).json({ status: 'degraded', db, cache });
        }
    } catch (e) {
        res.status(503).json({ status: 'unhealthy', error: e.message });
    }
});
```

---

## Horizontal Scaling (Self-Hosted)

Appwrite runs as multiple Docker containers. Stateless containers scale by replication; stateful containers need cluster configuration.

### What to Scale

| Container | Stateless? | How to Scale |
|-----------|-----------|--------------|
| API (appwrite) | Yes | Replicate + load balancer (Nginx/Traefik/HAProxy) |
| Function workers | Yes | Replicate freely |
| Realtime workers | Yes | Replicate freely |
| Other workers (webhooks, messaging, builds) | Yes | Replicate freely |
| MariaDB | No | Primary-replica replication |
| Redis | No | Redis Sentinel or Cluster |
| Storage volumes | No | Shared filesystem (NFS) or S3-compatible |

### Scale Stateless Containers

```bash
docker compose up --scale appwrite-worker-functions=4 -d
```

Route all traffic through a load balancer. Configure inter-container communication through Docker environment variables.

### Performance Tuning

```bash
# Workers per CPU core (applies to API, Realtime, Executor containers)
_APP_WORKER_PER_CORE=6  # default, tune based on workload
```

### Stateful Containers

**MariaDB:** Configure primary-replica replication. Appwrite writes to primary; replicas handle read queries.

**Redis:** Use Redis Sentinel for failover or Redis Cluster for sharding. Appwrite uses Redis for caching and pub/sub (Realtime). Set memory limits to prevent OOM:

```bash
maxmemory 256mb
maxmemory-policy allkeys-lru
```

**Storage:** Switch from local to S3-compatible storage (`_APP_STORAGE_DEVICE=s3`) so all nodes access the same files. Local disk limits you to a single node.

### Monitoring Scaled Deployments

Use the health endpoints above per container instance. Route health checks through your load balancer to catch unhealthy nodes.

For full self-hosting guide (installation, backups, updates, maintenance), see [self-hosting.md](self-hosting.md).

---

## Related

- Functions for health check automation
- Webhooks for alerting
- [performance.md](performance.md) — Redis caching patterns
