# GraphQL API

## Contents

- Endpoint
- Introspection
- Query Tables (TablesDB)
- Mutations (TablesDB)
- Batching
- File Uploads via GraphQL
- Rate Limits
- SDK Usage
- When to Use GraphQL

## Endpoint

```
POST /v1/graphql
```

Required headers:
- `X-Appwrite-Project: <project-id>`
- `X-Appwrite-Key: <api-key>` (server) or `X-Appwrite-JWT: <jwt>` (client)

---

## Introspection

Explore available types and operations.

```graphql
query {
  __schema {
    types {
      name
      fields {
        name
        type { name }
      }
    }
  }
}
```

---

## Query Tables (TablesDB)

```graphql
# List rows with filters
query {
  tablesdbListRows(
    tableId: "products"
    queries: ["category.equal('electronics')", "price.lessThan(500)"]
  ) {
    total
    rows {
      id
      name
      price
    }
  }
}

# Get single row
query {
  tablesdbGetRow(
    tableId: "products"
    rowId: "product_123"
  ) {
    id
    name
    price
    inventory
  }
}
```

---

## Mutations (TablesDB)

```graphql
# Create row
mutation {
  tablesdbCreateRow(
    tableId: "products"
    data: {
      name: "Widget"
      price: 29.99
      category: "gadgets"
    }
  ) {
    id
  }
}

# Update row
mutation {
  tablesdbUpdateRow(
    tableId: "products"
    rowId: "product_123"
    data: { price: 24.99 }
  ) {
    id
    price
  }
}

# Delete row
mutation {
  tablesdbDeleteRow(
    tableId: "products"
    rowId: "product_123"
  ) {
    id
  }
}
```

---

## Batching

Combine multiple operations in single request.

```graphql
query BatchedQueries {
  products: tablesdbListRows(tableId: "products", queries: ["limit(10)"]) {
    rows { id name }
  }
  
  categories: tablesdbListRows(tableId: "categories") {
    rows { id title }
  }
  
  stats: tablesdbListRows(tableId: "stats", queries: ["limit(1)"]) {
    rows { totalSales }
  }
}
```

---

## File Uploads via GraphQL

Use REST API for file uploads.

---

## Rate Limits

REST API rate limits apply.

---

## SDK Usage

Use HTTP client or dedicated GraphQL library.

```typescript
// TypeScript - Basic fetch
const response = await fetch('https://cloud.appwrite.io/v1/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': projectId,
        'X-Appwrite-Key': apiKey,
    },
    body: JSON.stringify({
        query: `
            query { tablesdbListRows(tableId: "products") { rows { id name } } }
        `,
    }),
});

const { data, errors } = await response.json();
```

---

## When to Use GraphQL

✅ **Recommended:**
- Fetch multiple resources in one request
- Client needs specific field selection
- Avoiding over-fetching

❌ **Use REST instead:**
- File uploads/downloads
- Bulk operations
- Transactions
- Realtime subscriptions
