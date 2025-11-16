---
title: "Validation Error"
status: 400
description: "The request contains invalid or missing data that prevents processing."
type: "https://princemuel.netlify.app/problems/validation-error"
extensions:
  errors: "Array of validation error objects with field and message properties"
  invalid_params: "Array of parameter names that failed validation"
---

The request contains invalid or missing data that prevents processing.

## Standard Fields

- **type**: `https://princemuel.netlify.app/problems/validation-error`
- **title**: `Validation Error`
- **status**: `400`
- **detail**: Human-readable explanation of the specific validation failure
- **instance**: URI identifying where this validation error occurred

## Extension Fields

### `errors`

Array of validation error objects. Each error contains:

- `field` (string): The field name that failed validation
- `message` (string): Human-readable description of the validation failure

### `invalid_params`

Array of parameter names that failed validation. Useful for query parameter validation.

## Examples

### Missing Required Field

```json
{
  "type": "https://princemuel.netlify.app/problems/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "Required field 'email' is missing",
  "instance": "/api/users",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Multiple Validation Failures

```json
{
  "type": "https://princemuel.netlify.app/problems/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "Multiple validation errors occurred",
  "instance": "/api/users/123",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "age",
      "message": "Must be between 18 and 120"
    }
  ]
}
```

### Query Parameter Validation

```json
{
  "type": "https://princemuel.netlify.app/problems/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "Invalid query parameters provided",
  "instance": "/api/search?limit=abc&offset=-1",
  "invalid_params": ["limit", "offset"],
  "errors": [
    {
      "field": "limit",
      "message": "Must be a positive integer"
    },
    {
      "field": "offset",
      "message": "Cannot be negative"
    }
  ]
}
```

## When This Problem Occurs

- Missing required fields in request body
- Invalid data types (string instead of number)
- Values outside acceptable ranges
- Malformed email addresses, URLs, etc.
- Invalid enum values
- Failed custom validation rules

## How to Fix

1. Check the `errors` array for specific field issues
2. Validate data types match API expectations
3. Ensure required fields are present
4. Verify values are within acceptable ranges
5. Check format requirements (email, phone, etc.)

---

_This problem type conforms to [RFC 9457 - Problem Details for HTTP APIs][rfc-9457]_

[rfc-9457]: https://www.rfc-editor.org/rfc/rfc9457.html
