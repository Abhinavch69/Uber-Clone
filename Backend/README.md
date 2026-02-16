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

## User Login Endpoint

### Endpoint Description
The `/users/login` endpoint is used to authenticate an existing user in the application. It validates the incoming credentials, verifies the password against the stored hashed password, and returns an authentication token upon successful login.

---

## POST /login

### Request Method
```
POST /users/login
```

### Required Data (Request Body)
The endpoint expects a JSON object with the following fields:

| Field | Type | Required | Validation Rules | Description |
|-------|------|----------|------------------|-------------|
| `email` | String | Yes | Must be a valid email format | User's registered email address |
| `password` | String | Yes | Minimum 6 characters | User's password |

### Request Example
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

---

## Response

### Success Response (Status Code: 200 OK)
When the user is successfully authenticated, the endpoint returns:

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
- `user`: The authenticated user object (password is not included in response)

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
    }
  ]
}
```

### Error Response (Status Code: 401 Unauthorized)
When credentials are invalid, the endpoint returns:

```json
{
  "message": "Invalid email or password"
}
```

---

## Status Codes

| Status Code | Description |
|-------------|-------------|
| `200 OK` | User successfully authenticated and token generated |
| `400 Bad Request` | Validation failed (invalid email format, password too short, missing fields) |
| `401 Unauthorized` | Invalid email or password |
| `500 Internal Server Error` | Server error during authentication or database operations |

---

## Validation Rules Summary

1. **Email**
   - Must be a valid email format
   - Must exist in the database (registered user)

2. **Password**
   - Required field
   - Minimum 6 characters
   - Must match the hashed password stored in database

---

## Authentication Token

Upon successful login, the user receives a JWT token that:
- Contains the user's MongoDB ID (`_id`)
- Expires in 1 hour
- Can be used for subsequent authenticated requests
- Should be stored and sent in request headers for future API calls

---

## Usage Example

### Using cURL
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

### Using JavaScript/Fetch
```javascript
const response = await fetch('/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123'
  })
});

const data = await response.json();
console.log(data);
```

---

## User Profile Endpoint

### Endpoint Description
The `/users/profile` endpoint is used to retrieve the authenticated user's profile information. It requires a valid authentication token and returns the current user's details.

---

## GET /profile

### Request Method
```
GET /users/profile
```

### Required Headers
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Authorization` | String | Yes | Bearer token received from login/register endpoint (format: "Bearer <token>") |
| OR `Cookie` | String | Yes | Token can alternatively be sent as a cookie named "token" |

### Request Example
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Response

### Success Response (Status Code: 200 OK)
When the token is valid and user is authenticated, the endpoint returns:

```json
{
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
- `user`: The authenticated user object containing their profile information

### Error Response (Status Code: 401 Unauthorized)
When the token is invalid or missing, the endpoint returns:

```json
{
  "message": "Unauthorized"
}
```

---

## Status Codes

| Status Code | Description |
|-------------|-------------|
| `200 OK` | User authenticated successfully and profile retrieved |
| `401 Unauthorized` | Invalid, expired, or missing authentication token |
| `500 Internal Server Error` | Server error during profile retrieval |

---

## Usage Example

### Using JavaScript/Fetch with Bearer Token
```javascript
const token = localStorage.getItem('token');

const response = await fetch('/users/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data);
```

### Using JavaScript/Fetch with Cookie
```javascript
const response = await fetch('/users/profile', {
  method: 'GET',
  credentials: 'include' // Automatically includes cookies
});

const data = await response.json();
console.log(data);
```

---

## User Logout Endpoint

### Endpoint Description
The `/users/logout` endpoint is used to log out an authenticated user. It clears the authentication cookie and adds the user's token to a blacklist to prevent further use.

---

## GET /logout

### Request Method
```
GET /users/logout
```

### Required Headers
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Authorization` | String | Yes | Bearer token received from login/register endpoint (format: "Bearer <token>") |
| OR `Cookie` | String | Yes | Token can alternatively be sent as a cookie named "token" |

### Request Example
```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Response

### Success Response (Status Code: 200 OK)
When the user is successfully logged out, the endpoint returns:

```json
{
  "message": "Logged out successfully"
}
```

**Details:**
- The authentication token is cleared from cookies
- The token is added to the blacklist and cannot be reused
- Subsequent requests with this token will be rejected

### Error Response (Status Code: 401 Unauthorized)
When the token is invalid or missing, the endpoint returns:

```json
{
  "message": "Unauthorized"
}
```

---

## Status Codes

| Status Code | Description |
|-------------|-------------|
| `200 OK` | User successfully logged out |
| `401 Unauthorized` | Invalid, expired, or missing authentication token |
| `500 Internal Server Error` | Server error during logout process |

---

## Usage Example

### Using JavaScript/Fetch with Bearer Token
```javascript
const token = localStorage.getItem('token');

const response = await fetch('/users/logout', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data);

// Clear token from storage after successful logout
localStorage.removeItem('token');
```

### Using JavaScript/Fetch with Cookie
```javascript
const response = await fetch('/users/logout', {
  method: 'GET',
  credentials: 'include' // Automatically includes cookies
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
- Password comparison uses the bcrypt comparePassword method to securely verify stored hashes
- Blacklisted tokens are added to the database to prevent reuse after logout
- Authentication is required for accessing profile and logout endpoints

---

# Captain Registration API Documentation

## Captain Registration Endpoint

### Endpoint Description
The `/captains/register` endpoint is used to register a new captain (driver) in the application. It validates the incoming data, hashes the password, creates a captain record along with their vehicle information in the database, and returns an authentication token.

---

## POST /register

### Request Method
```
POST /captains/register
```

### Required Data (Request Body)
The endpoint expects a JSON object with the following fields:

| Field | Type | Required | Validation Rules | Description |
|-------|------|----------|------------------|-------------|
| `email` | String | Yes | Must be a valid email format | Captain's email address (must be unique) |
| `fullname.firstname` | String | Yes | Minimum 3 characters | Captain's first name |
| `fullname.lastname` | String | No | Minimum 3 characters (if provided) | Captain's last name |
| `password` | String | Yes | Minimum 6 characters | Captain's password (will be hashed before storage) |
| `vehicle.color` | String | Yes | Minimum 3 characters | Vehicle color |
| `vehicle.plate` | String | Yes | Minimum 3 characters | Vehicle license plate |
| `vehicle.capacity` | Integer | Yes | Minimum 1 | Vehicle passenger capacity |
| `vehicle.vehicleType` | String | Yes | Must be 'car', 'motorcycle', or 'auto' | Type of vehicle being registered |

### Request Example
```json
{
  "email": "captain@example.com",
  "fullname": {
    "firstname": "James",
    "lastname": "Wilson"
  },
  "password": "capSecurePass123",
  "vehicle": {
    "color": "Black",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

---

## Response

### Success Response (Status Code: 201 Created)
When the captain is successfully registered, the endpoint returns:

```json
{
  "captain": {
    "_id": "507f1f77bcf86cd799439012",
    "fullname": {
      "firstname": "James",
      "lastname": "Wilson"
    },
    "email": "captain@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "socketId": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Details:**
- `token`: JWT authentication token that expires in 1 hour
- `captain`: The newly created captain object with vehicle information (password is not included in response)

### Error Response (Status Code: 400 Bad Request) - Validation Errors
When validation fails, the endpoint returns:

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "ab",
      "msg": "Firstname must be at least 3 characters long",
      "path": "fullname.firstname",
      "location": "body"
    },
    {
      "type": "field",
      "value": "car",
      "msg": "Vehicle type must be either car, motorcycle, or auto",
      "path": "vehicle.vehicleType",
      "location": "body"
    }
  ]
}
```

### Error Response (Status Code: 400 Bad Request) - Captain Already Exists
When a captain with the same email already exists:

```json
{
  "message": "Captain already exists"
}
```

---

## Status Codes

| Status Code | Description |
|-------------|-------------|
| `201 Created` | Captain successfully registered and token generated |
| `400 Bad Request` | Validation failed (invalid email, password too short, missing fields, invalid vehicle type) OR captain already exists |
| `500 Internal Server Error` | Server error during captain creation or database operations |

---

## Validation Rules Summary

1. **Email**
   - Must be a valid email format
   - Must be unique (no duplicate emails in database)

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

5. **Vehicle Information**
   - All vehicle fields are required for captain registration
   - **Color**: Minimum 3 characters
   - **Plate**: Minimum 3 characters (vehicle license plate)
   - **Capacity**: Integer value with minimum capacity of 1 passenger
   - **Vehicle Type**: Must be one of the following:
     - `car` - Standard car/sedan
     - `motorcycle` - Motorcycle or scooter
     - `auto` - Auto-rickshaw

---

## Authentication Token

Upon successful registration, the captain receives a JWT token that:
- Contains the captain's MongoDB ID (`_id`)
- Expires in 1 hour
- Can be used for subsequent authenticated requests
- Should be stored and sent in request headers for future API calls

---

## Usage Example

### Using cURL
```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newcaptain@example.com",
    "fullname": {
      "firstname": "Michael",
      "lastname": "Brown"
    },
    "password": "mySecurePass123",
    "vehicle": {
      "color": "White",
      "plate": "XYZ789",
      "capacity": 4,
      "vehicleType": "car"
    }
  }'
```

### Using JavaScript/Fetch
```javascript
const response = await fetch('/captains/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'newcaptain@example.com',
    fullname: {
      firstname: 'Michael',
      lastname: 'Brown'
    },
    password: 'mySecurePass123',
    vehicle: {
      color: 'White',
      plate: 'XYZ789',
      capacity: 4,
      vehicleType: 'car'
    }
  })
});

const data = await response.json();
console.log(data);
```

---

## Additional Captain Endpoints (Coming Soon)

The following captain endpoints are planned for future development:
- `GET /captains/profile` - Retrieve captain profile information
- `POST /captains/login` - Captain login endpoint
- `GET /captains/logout` - Captain logout endpoint
