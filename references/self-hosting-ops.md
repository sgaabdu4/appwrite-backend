# Self-Hosting Operations

## Contents

- Storage Adapters
- Function Runtimes
- Backups
- Updates
- Maintenance
- Related

## Storage Adapters

Default is local disk. Use external storage for multi-node deployments.

| Adapter | Variable | Use When |
|---------|----------|----------|
| Local | `_APP_STORAGE_DEVICE=local` | Single server (default) |
| AWS S3 | `_APP_STORAGE_DEVICE=s3` | Multi-node, large files |
| DigitalOcean Spaces | `_APP_STORAGE_DEVICE=dospaces` | DO infrastructure |
| Backblaze B2 | `_APP_STORAGE_DEVICE=backblaze` | Cost-effective backup |
| Akamai (Linode) | `_APP_STORAGE_DEVICE=linode` | Akamai infrastructure |
| Wasabi | `_APP_STORAGE_DEVICE=wasabi` | S3-compatible, cheap storage |

Each adapter requires access key, secret, region, and bucket env vars. Local storage limits you to a single node.

---

## Function Runtimes

Enable only the runtimes you need:

```bash
_APP_FUNCTIONS_RUNTIMES=dart-3.5,node-22.0,python-3.12
```

### Resource Limits

| Variable | Effect |
|----------|--------|
| `_APP_COMPUTE_CPUS` | Max CPU cores per function |
| `_APP_COMPUTE_MEMORY` | Max memory in MB per function |
| `_APP_FUNCTIONS_TIMEOUT` | Max timeout in seconds (default: 900) |
| `_APP_COMPUTE_INACTIVE_THRESHOLD` | Idle container cleanup (default: 60s) |

### Function Domain SSL

Provide wildcard SSL certificates for function domains:

**Manual:** `docker compose exec appwrite ssl --domain="<id>.functions.yourdomain.com"`

**Automated:** Configure DNS provider (Cloudflare, DigitalOcean) in docker-compose.yml for wildcard cert generation.

---

## Backups

### What to Back Up

| Component | Tool |
|-----------|------|
| Database (MariaDB) | mysqldump |
| Storage volumes | tar / Docker volume |
| `.env` file | `cp .env .env.backup.$(date +"%Y%m%d")` |

### Database Backup

```bash
# Backup
docker compose exec mariadb sh -c \
  'exec mysqldump --all-databases --add-drop-database \
   --single-transaction --routines --triggers \
   -uroot -p"$MYSQL_ROOT_PASSWORD"' > ./dump.sql

# Restore (fresh installation only)
docker compose exec -T mariadb sh -c \
  'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"' < dump.sql
```

For databases over 5 GB, use `mariabackup` for faster physical backups.

### Volume Backup

```bash
docker compose stop

docker run --rm \
  -v appwrite-uploads:/data \
  -v $(pwd)/backup:/backup \
  ubuntu tar czf "/backup/uploads.tar.gz" -C /data .

docker compose start
```

Key volumes: `appwrite-uploads`, `appwrite-functions`, `appwrite-builds`, `appwrite-certificates`, `appwrite-mariadb`, `appwrite-redis`.

### Critical

`_APP_OPENSSL_KEY_V1` encrypts all sensitive data. Copy this exact value when restoring, or you lose encrypted data permanently.

Follow the 3-2-1 rule: 3 copies, 2 media, 1 offsite. Test restores quarterly.

---

## Updates

### Upgrade Path

Upgrade through each minor version's latest patch: `1.5.1` → `1.5.11` → `1.6.2` → `1.7.4` → `1.8.1`. Pin a specific version — never use `latest`.

```bash
docker run -it --rm \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
    --entrypoint="upgrade" \
    appwrite/appwrite:1.8.1
```

### Run Migration

```bash
cd appwrite/
docker compose exec appwrite migrate
```

**Before every upgrade:** Back up, review changelog, test on non-production first.

---

## Maintenance

| Variable | Default | Effect |
|----------|---------|--------|
| `_APP_MAINTENANCE_INTERVAL` | 86400s | Cleanup cycle |
| `_APP_MAINTENANCE_RETENTION_CACHE` | 2592000s (30d) | Max cache age |
| `_APP_MAINTENANCE_RETENTION_EXECUTION` | 1209600s (14d) | Max execution log age |
| `_APP_MAINTENANCE_RETENTION_AUDIT` | 1209600s (14d) | Max audit log age |
| `_APP_MAINTENANCE_RETENTION_ABUSE` | 86400s (1d) | Max abuse log age |

Use the Health API (admin key) to monitor services. See [health.md](health.md).

---

## Related

- [self-hosting.md](self-hosting.md) — Installation, security, scaling
- [health.md](health.md) — Health checks and monitoring
- [functions.md](functions.md) — Cold starts, function architecture
