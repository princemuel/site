---
title: "Resource Not Found"
status: 404
description: "The requested resource could not be found on this server."
type: "https://princemuel.netlify.app/problems/not-found"
extensions:
  instance: URI identifying where this error occurred
  resource_type: "The type of resource that was not found"
  resource_id: "The identifier of the resource that was not found"
---

The requested resource could not be found on this server.

## Standard Fields

- **type**: `https://princemuel.netlify.app/problems/not-found`
- **title**: `Resource Not Found`
- **status**: `404`
- **detail**: Specific description of what resource was not found
- **instance**: URI where the not-found error occurred

## Extension Fields

### `resource_type`

The type of resource that was not found (e.g., "user", "post", "image").

### `resource_id`

The identifier of the resource that was not found.

## Examples

### User Not Found

```json
{
  "type": "https://princemuel.netlify.app/problems/not-found",
  "title": "Resource Not Found",
  "status": 404,
  "detail": "No user exists with ID 999",
  "instance": "/api/users/999",
  "resource_type": "user",
  "resource_id": "999"
}
```

### Nested Resource Not Found

```json
{
  "type": "https://princemuel.netlify.app/problems/not-found",
  "title": "Resource Not Found",
  "status": 404,
  "detail": "Post 123 does not have a comment with ID 456",
  "instance": "/api/posts/123/comments/456",
  "resource_type": "comment",
  "resource_id": "456",
  "parent": { "type": "post", "id": "123" }
}
```

## When This Problem Occurs

- Resource ID doesn't exist in database
- Resource was deleted
- User lacks permission to see resource (may return 404 instead of 403 for security)
- Malformed resource identifier
- Resource exists but in different location

## How to Fix

1. Verify the resource identifier is correct
2. Check if resource was recently deleted
3. Confirm you have proper access permissions
4. Try searching for the resource by other means
5. Check if resource moved to different endpoint

---

_This problem type conforms to [RFC 9457 - Problem Details for HTTP APIs][rfc-9457]_

[rfc-9457]: https://www.rfc-editor.org/rfc/rfc9457.html
