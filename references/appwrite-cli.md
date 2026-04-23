# Appwrite CLI

## Contents

- Install + Login
- Init
- Config File
- Scope + Precedence
- Pull
- Push
- Generate
- CI
- Debug
- Related

## Install + Login

```shell
npm install -g appwrite-cli
appwrite login
appwrite login --endpoint "https://your-instance.com/v1"
```

Check project access:

```shell
appwrite projects get --project-id "<PROJECT_ID>"
```

---

## Init

```shell
appwrite init project
appwrite init functions
appwrite init tables
appwrite init buckets
appwrite init teams
appwrite init topics
```

Run `init` once per resource type. CLI writes repo config.

---

## Config File

Root file: `appwrite.config.json`.

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

Commit file. Treat as deploy manifest.

---

## Scope + Precedence

Two scopes:

1. Local project config: `appwrite.config.json`
2. Global CLI config: `appwrite client`

Global config can override local config (non-interactive mode).

```shell
appwrite client --endpoint "https://your-instance.com/v1" --project-id "<PROJECT_ID>" --key "<API_KEY>"
```

Rules:

- `appwrite client` does not rewrite local `appwrite.config.json`.
- Non-interactive mode targets one project at time.
- Inspect active global config: `appwrite client --debug`.
- Clear global override: `appwrite client --reset`.

Use local file for repo dev. Set global client config at CI job start.

---

## Pull

```shell
appwrite pull functions
appwrite pull tables
appwrite pull buckets
appwrite pull teams
appwrite pull topics
```

Pull before big edits if Console changed out-of-band.

---

## Push

```shell
appwrite push functions
appwrite push tables
appwrite push buckets
appwrite push teams
appwrite push topics
```

Push changed resource type only.

---

## Generate

```shell
appwrite generate
appwrite generate --output ./src/generated
appwrite generate --language typescript
```

Regen after schema change or pull.

---

## CI

```shell
appwrite push all --all --force
appwrite push functions --all --force
appwrite push tables --all --force
appwrite push buckets --all --force
appwrite push teams --all --force
appwrite push topics --all --force
```

Use `--force` only for CI/non-interactive.

---

## Debug

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

- `--json`: scripts
- `--verbose`: full errors
- `--console --open`: open Console
- `--report`: build GitHub issue link

---

## Related

- [schema-management.md](schema-management.md)
- [functions-advanced.md](functions-advanced.md)
- [teams.md](teams.md)
- [messaging.md](messaging.md)
