# Self-Hosting

Production setup, scaling, and security.

---

## Contents

- System Requirements
- Installation
- Production Security
- Email Delivery (SMTP)
- Error Monitoring
- Scaling
- Related

## System Requirements

| Resource | Minimum |
|----------|---------|
| CPU | 2 cores |
| RAM | 4 GB |
| Swap | 2 GB |
| Docker Compose | v2+ |

---

## Installation

### Quick Install

```bash
docker run -it --rm \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
    --entrypoint="install" \
    appwrite/appwrite:1.8.1
```

### Manual Install

1. Download [docker-compose.yml](https://appwrite.io/install/compose) and [.env](https://appwrite.io/install/env)
2. Place both in an `appwrite/` directory
3. Run: `docker compose up -d --remove-orphans`

After `.env` changes: `docker compose up -d` then `docker compose exec appwrite vars` to verify.

---

## Production Security

### Encryption Key

Set `_APP_OPENSSL_KEY_V1` immediately after installation — encrypts all sensitive data. Changing it later destroys existing encrypted data. Store in a secrets manager.

### Force HTTPS

```bash
_APP_OPTIONS_ROUTER_FORCE_HTTPS=enabled
```

### Console Access

| Variable | Effect |
|----------|--------|
| `_APP_CONSOLE_WHITELIST_ROOT` | Only first user signs up; others join by invitation |
| `_APP_CONSOLE_WHITELIST_EMAILS` | Comma-separated allowed emails |
| `_APP_CONSOLE_WHITELIST_IPS` | Comma-separated allowed IPs |

### Rate Limiting

```bash
_APP_OPTIONS_ABUSE=enabled   # production (default)
_APP_OPTIONS_ABUSE=disabled  # development only
```

Client SDK requests are rate-limited. Server SDK requests with API keys bypass limits.

---

## Email Delivery (SMTP)

Auth emails require SMTP. Use a third-party service (Mailgun, SendGrid, AWS SES) — self-hosted SMTP risks spam folders.

```bash
_APP_SMTP_HOST=smtp.mailgun.org
_APP_SMTP_PORT=587
_APP_SMTP_SECURE=tls
_APP_SMTP_USERNAME=postmaster@yourdomain.com
_APP_SMTP_PASSWORD=your-smtp-password
_APP_SYSTEM_EMAIL_ADDRESS=noreply@yourdomain.com
_APP_SYSTEM_EMAIL_NAME=YourApp
```

---

## Error Monitoring

```bash
_APP_ENV=production
_APP_LOGGING_CONFIG=sentry://PUBLIC_KEY@HOST:PORT/PROJECT_ID
```

Other providers: Raygun, AppSignal, LogOwl.

---

## Scaling

### Container Types

| Container | Stateless? | How to Scale |
|-----------|-----------|--------------|
| API (appwrite) | Yes | Replicate + load balancer |
| Realtime/Function/Other workers | Yes | Replicate freely |
| MariaDB | No | Primary-replica |
| Redis | No | Sentinel or Cluster |
| Storage volumes | No | NFS or S3-compatible |

### Scale Stateless Containers

```bash
docker compose up --scale appwrite-worker-functions=4 -d
```

### Performance Tuning

```bash
_APP_WORKER_PER_CORE=6  # default; increase for I/O, decrease for CPU
```

### Log Rotation

```yaml
x-logging: &x-logging
  logging:
    driver: 'json-file'
    options:
      max-file: '5'
      max-size: '10m'
```

### Redis Memory

```bash
maxmemory 256mb
maxmemory-policy allkeys-lru
```

---

## Related

- [self-hosting-ops.md](self-hosting-ops.md) — Backups, updates, maintenance, storage adapters, runtimes
- [health.md](health.md) — Health checks and monitoring
- [performance.md](performance.md) — Optimization checklist
