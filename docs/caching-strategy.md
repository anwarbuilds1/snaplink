# Caching Strategy

## Redirect Cache Flow

```mermaid
flowchart TD

A[Incoming Request]
--> B{Cache Hit?}

B -->|Yes| C[Return Cached URL]

B -->|No| D[Query MongoDB]
D --> E[Store in Redis]
E --> F[Return URL]
```

---

## Cache Keys

```text
url:{shortCode}
```

Example:

```text
url:abc123
```

---

## Cache Invalidation

The cache is invalidated when:

- URL is updated
- URL is deleted
- URL expires

---

## Benefits

- Reduced MongoDB load
- Faster redirects
- Improved scalability
- Better user experience

```

```
