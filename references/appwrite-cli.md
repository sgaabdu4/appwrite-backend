# Appwrite CLI

## Contents

- Install + Login
- Project Init
- appwrite.config.json
- Pull Existing Resources
- Push Changes
- Type-Safe SDK Generation
- Non-Interactive CI
- Debugging + Output
- Related

## Install + Login

```shell
npm install -g appwrite-cli
appwrite login
appwrite login --endpoint "https://your-instance.com/v1"
```

Verify project access:

```shell
appwrite projects get --project-id "<PROJECT_ID>"
```

---

## Project Init

```shell
appwrite init project
appwrite init functions
appwrite init tables
appwrite init buckets
appwrite init teams
appwrite init topics
```

Use `init` once per resource type. CLI writes config into repo.

---

## appwrite.config.json

All managed resources live in root `appwrite.config.json`.

```json
{
    "projectId": "<PROJECT_ID>",
    "endpoint": "https://<REGION>.cloud.appwrite.io/v1",
    "functions": [],
    "tablesDB": [],
    "tables": [],
    "buckets": [],
    "teams": [],
    "topics": []
}
```

Commit config. Treat as deploy manifest.

---

## Pull Existing Resources

```shell
appwrite pull functions
appwrite pull tables
appwrite pull buckets
appwrite pull teams
appwrite pull topics
```

Pull before large edits if Console changed out-of-band.

---

## Push Changes

```shell
appwrite push functions
appwrite push tables
appwrite push buckets
appwrite push teams
appwrite push topics
```

Push only changed resource type during local work.

---

## Type-Safe SDK Generation

```shell
appwrite generate
appwrite generate --output ./src/generated
appwrite generate --language typescript
```

Regen after schema change or pull.

---

## Non-Interactive CI

```shell
appwrite push all --all --force
appwrite push functions --all --force
appwrite push tables --all --force
appwrite push buckets --all --force
appwrite push teams --all --force
appwrite push topics --all --force
```

Use `--force` only in CI/non-interactive flows.

---

## Debugging + Output

```shell
appwrite users list --json
appwrite users list --verbose
appwrite tables-db get-row \
    --database-id "<DATABASE_ID>" \
    --table-id "<TABLE_ID>" \
    --row-id "<ROW_ID>" \
    --console --open
appwrite login --report
```

`--json` for scripts. `--verbose` for full error log. `--console --open` jumps to Console. `--report` builds GitHub error link.

---

## Related

- [schema-management.md](schema-management.md)
- [functions-advanced.md](functions-advanced.md)
- [teams.md](teams.md)
- [messaging.md](messaging.md)
