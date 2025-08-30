---
title: "Rate Limit Exceeded"
status: 429
description: "Too many requests have been made in a given time period."
type: "https://princemuel.com/problems/rate-limited"
extensions:
  limit: "The rate limit ceiling for this endpoint"
  remaining: "Number of requests remaining in current window"
  resetTime: "ISO 8601 timestamp when the rate limit resets"
  retryAfter: "Number of seconds to wait before retrying"
---

Too many requests have been made in a given time period.

## Standard Fields

- **type**: `https://princemuel.com/problems/rate-limited`
- **title**: `Rate Limit Exceeded`
- **status**: `429`
- **detail**: Description of the rate limit that was exceeded
- **instance**: URI where the rate limit was hit

## Extension Fields

### `limit`

The rate limit ceiling for this endpoint (requests per time window).

### `remaining`

Number of requests remaining in the current time window.

### `resetTime`

ISO 8601 timestamp when the rate limit window resets.

### `retryAfter`

Number of seconds to wait before making another request.

## Examples

### Basic Rate Limit

```json
{
  "type": "https://princemuel.com/problems/rate-limited",
  "title": "Rate Limit Exceeded",
  "status": 429,
  "detail": "You have exceeded the rate limit of 100 requests per hour",
  "instance": "/api/search",
  "limit": 100,
  "remaining": 0,
  "resetTime": "2024-01-01T15:00:00Z",
  "retryAfter": 3600
}
```

### Per-User Rate Limit

```json
{
  "type": "https://princemuel.com/problems/rate-limited",
  "title": "Rate Limit Exceeded",
  "status": 429,
  "detail": "User API key has exceeded 1000 requests per day",
  "instance": "/api/users/123",
  "limit": 1000,
  "remaining": 0,
  "resetTime": "2024-01-02T00:00:00Z",
  "retryAfter": 43200,
  "rateLimitType": "daily",
  "userId": "user_123"
}
```

## When This Problem Occurs

- API key or IP exceeded requests per hour/day
- Burst rate limiting triggered
- Resource-specific rate limits hit
- Cost-based rate limiting exceeded

## How to Fix

1. Wait for the time specified in `retryAfter`
2. Check the `resetTime` to know when limits reset
3. Implement exponential backoff in your client
4. Cache responses to reduce API calls
5. Consider upgrading to higher rate limit tier
6. Batch multiple operations into single requests where possible

## Headers

Rate limit responses should include these HTTP headers:

- `Retry-After`: Seconds to wait before retrying
- `X-RateLimit-Limit`: Request limit per window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when window resets

---

_This problem type conforms to [RFC 9457 - Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)_
