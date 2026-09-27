# API Documentation

## Base URL

```
/api/v1
```

## Authentication

All endpoints except `/api/v1/health` and `/api/v1/auth/login` require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Health Check

### `GET /api/v1/health`

Returns the API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

---

## Auth

### `POST /api/v1/auth/login`

> **Status:** Not yet implemented

Authenticates a user and returns a JWT token.

---

## Users

### `GET /api/v1/users`

> **Status:** Not yet implemented

List users. Admin only.

### `POST /api/v1/users`

> **Status:** Not yet implemented

Create a new user. Admin only.

### `GET /api/v1/users/:id`

> **Status:** Not yet implemented

Get user details. Admin only.

### `PUT /api/v1/users/:id`

> **Status:** Not yet implemented

Update a user. Admin only.

### `DELETE /api/v1/users/:id`

> **Status:** Not yet implemented

Delete a user. Admin only.

---

## Facilities

### `GET /api/v1/facilities`

> **Status:** Not yet implemented

List all facilities.

### `POST /api/v1/facilities`

> **Status:** Not yet implemented

Create a facility. Admin only.

### `GET /api/v1/facilities/:id`

> **Status:** Not yet implemented

Get facility details.

### `PUT /api/v1/facilities/:id`

> **Status:** Not yet implemented

Update a facility. Admin only.

### `DELETE /api/v1/facilities/:id`

> **Status:** Not yet implemented

Delete a facility. Admin only.

---

## Referrals

### `GET /api/v1/referrals`

> **Status:** Not yet implemented

List referrals. Scoped by user role and facility.

### `POST /api/v1/referrals`

> **Status:** Not yet implemented

Create a new referral. Referring workers only.

### `GET /api/v1/referrals/:id`

> **Status:** Not yet implemented

Get referral details. Scoped by user role and facility.

### `PATCH /api/v1/referrals/:id/status`

> **Status:** Not yet implemented

Update referral status. Enforces state machine transitions.

### `GET /api/v1/referrals/:id/history`

> **Status:** Not yet implemented

Get referral status history (audit trail).

---

## Dashboard

### `GET /api/v1/dashboard/stats`

> **Status:** Not yet implemented

Get dashboard statistics. Admin only.

---

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "message": "Description of the error",
    "status": 400
  }
}
```

## Common Status Codes

| Code | Meaning |
|------|--------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |
