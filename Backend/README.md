# Uber Clone Backend API Documentation

## User Registration Endpoint

### Endpoint Description
The `/users/register` endpoint is used to register a new user in the application. It validates the incoming data, hashes the password, creates a user in the database, and returns an authentication token.

---

## POST /register

### Request Method
```
POST /users/register
```

### Required Data (Request Body)
The endpoint expects a JSON object with the following fields:

| Field | Type | Required | Validation Rules | Description |
|-------|------|----------|------------------|-------------|
| `email` | String | Yes | Must be a valid email format | User's email address (must be unique) |
| `fullname.firstname` | String | Yes | Minimum 3 characters | User's first name |
| `fullname.lastname` | String | No | Minimum 3 characters (if provided) | User's last name |
| `password` | String | Yes | Minimum 6 characters | User's password (will be hashed before storage) |

### Request Example
```json
{
  "email": "user@example.com",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "password": "securePassword123"
}
```

---

## Response

### Success Response (Status Code: 201 Created)
When the user is successfully registered, the endpoint returns:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "user@example.com",
    "socketId": null
  }
}
```

**Details:**
- `token`: JWT authentication token that expires in 1 hour
- `user`: The newly created user object (password is not included in response)

### Error Response (Status Code: 400 Bad Request)
When validation fails, the endpoint returns:

```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "param": "email",
      "msg": "Invalid email",
      "value": "invalid-email"
    },
    {
      "param": "fullname.firstname",
      "msg": "Firstname must be at least 3 characters long",
      "value": "ab"
    }
  ]
}
```

---

## Status Codes

| Status Code | Description |
|-------------|-------------|
| `201 Created` | User successfully registered and token generated |
| `400 Bad Request` | Validation failed (invalid email, password too short, missing fields, firstname too short) |
| `500 Internal Server Error` | Server error during user creation or database operations |

---

## Validation Rules Summary

1. **Email**
   - Must be a valid email format
   - Must be unique (no duplicate emails in database)
   - Minimum 5 characters

2. **Firstname**
   - Required field
   - Minimum 3 characters

3. **Lastname**
   - Optional field
   - If provided, must be at least 3 characters

4. **Password**
   - Required field
   - Minimum 6 characters
   - Stored as hashed value in database using bcrypt

---

## Authentication Token

Upon successful registration, the user receives a JWT token that:
- Contains the user's MongoDB ID (`_id`)
- Expires in 1 hour
- Can be used for subsequent authenticated requests
- Should be stored and sent in request headers for future API calls

---

## Usage Example

### Using cURL
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "password": "mySecurePass123"
  }'
```

### Using JavaScript/Fetch
```javascript
const response = await fetch('/users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'newuser@example.com',
    fullname: {
      firstname: 'Jane',
      lastname: 'Smith'
    },
    password: 'mySecurePass123'
  })
});

const data = await response.json();
console.log(data);
```

---

## Security Notes

- Passwords are hashed using bcrypt with 10 salt rounds before storage
- Passwords are never returned in API responses
- JWT tokens expire after 1 hour
- Email addresses must be unique in the system
- Input validation is enforced on all required fields
