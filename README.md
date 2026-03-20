# User Registration API

## 📌 Endpoint

`POST /user/register`

---

## 📝 Description

This endpoint is used to register a new user in the system.
It accepts user details, validates them, and creates a new user record.

---

## 📥 Request Body

Content-Type: `application/json`

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "profileImage": "optional_image_url"
}
```

### 🔹 Fields

| Field        | Type   | Required | Description          |
| ------------ | ------ | -------- | -------------------- |
| username     | string | ✅ Yes    | Unique username      |
| email        | string | ✅ Yes    | Unique email address |
| password     | string | ✅ Yes    | User password        |
| profileImage | string | ❌ No     | Profile image URL    |

---

## 📤 Response

### ✅ Success (201 Created)

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

### ❌ Error Responses

#### 400 Bad Request

```json
{
  "message": "All fields are required"
}
```

#### 409 Conflict

```json
{
  "message": "User already exists"
}
```

#### 500 Internal Server Error

```json
{
  "message": "Something went wrong"
}
```

---

## 🔐 Notes

* Password is hashed before saving.
* Username and email must be unique.
* JWT tokens may be generated after registration.

# User Login API

## 📌 Endpoint

`POST /api/users/login`

---

## 📝 Description

This endpoint authenticates a user using either **username or email** along with a password.
If the credentials are valid, it returns user details along with **access and refresh tokens**, and also sets them in HTTP-only cookies.

---

## 📥 Request Body

Content-Type: `application/json`

```json
{
  "username": "john_doe", 
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### 🔹 Fields

| Field    | Type   | Required | Description                               |
| -------- | ------ | -------- | ----------------------------------------- |
| username | string | ❌ No     | Username (required if email not provided) |
| email    | string | ❌ No     | Email (required if username not provided) |
| password | string | ✅ Yes    | User password                             |

> ⚠️ Either **username or email must be provided**

---

## 🍪 Cookies Set

| Cookie Name  | Description           | Options          |
| ------------ | --------------------- | ---------------- |
| accessToken  | Short-lived JWT token | httpOnly, secure |
| refreshToken | Long-lived JWT token  | httpOnly, secure |

---

## 📤 Response

### ✅ Success (200 OK)

```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "profileImage": "optional_url"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "user loggedin successfully"
}
```

---

## ❌ Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "username or email is required",
  "errors": []
}
```

---

### 404 Not Found

```json
{
  "success": false,
  "message": "user not found",
  "errors": []
}
```

---

### 401 Unauthorized

```json
{
  "success": false,
  "message": "invalid credentails",
  "errors": []
}
```

---

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal Server Error",
  "errors": []
}
```

---

## 🔐 Authentication Flow

1. User sends login request with credentials
2. Server validates username/email
3. Password is verified using bcrypt
4. JWT tokens are generated:

   * Access Token (short expiry)
   * Refresh Token (long expiry)
5. Refresh token is stored in database
6. Tokens are sent:

   * In response body
   * As HTTP-only cookies

---

## 🛠 Notes

* Password is never returned in response
* Refresh token is stored securely in DB
* Cookies are **httpOnly** (not accessible via JS)
* `secure: true` means cookies work only over HTTPS

---

## 📁 Route Setup

```ts
router.route('/login').post(loginUser);
app.use('/api/users', userRouter);
```

---


# User Logout API

## 📌 Endpoint

`GET /api/users/logout`

---

## 📝 Description

This endpoint logs out the currently authenticated user by:

* Removing the stored **refresh token** from the database
* Clearing authentication cookies (**accessToken** and **refreshToken**)
* Invalidating the user's session

> 🔐 This is a **protected route** and requires a valid access token.

---

## 🔑 Authentication

This endpoint requires authentication via:

### Option 1: Cookies

* `accessToken` (HTTP-only cookie)

### Option 2: Authorization Header

```http
Authorization: Bearer <accessToken>
```

---

## 📥 Request

### Headers (if not using cookies)

```http
Authorization: Bearer <accessToken>
```

### Body

❌ No request body required

---

## 🍪 Cookies Cleared

| Cookie Name  | Description       |
| ------------ | ----------------- |
| accessToken  | JWT access token  |
| refreshToken | JWT refresh token |

Cookies are cleared with:

* `httpOnly: true`
* `secure: true`

---

## 📤 Response

### ✅ Success (200 OK)

```json id="s9f2kd"
{
  "statusCode": 200,
  "data": null,
  "message": "user logged out successfully"
}
```

---

## ❌ Error Responses

### 401 Unauthorized

```json id="j3k2lm"
{
  "success": false,
  "message": "unauthorized request",
  "errors": []
}
```

---

### 500 Internal Server Error

```json id="x92lpa"
{
  "success": false,
  "message": "Something went wrong while logout",
  "errors": []
}
```

OR

```json id="k29sdf"
{
  "success": false,
  "message": "Internal Server Error",
  "errors": []
}
```

---

## 🔄 Logout Flow

1. Client sends request to `/api/users/logout`
2. Middleware (`verifyJWT`) verifies access token
3. Server extracts user from token
4. Refresh token is removed from database
5. Cookies are cleared from client
6. Success response is returned

---

## 📁 Route Setup

```ts id="92lsjd"
router.route('/logout').get(verifyJWT, logoutUser);
```

---

## ⚠️ Notes

* User must be authenticated before calling this endpoint
* Refresh token is removed using `$unset` from database
* Cookies are **httpOnly**, so they cannot be accessed via JavaScript
* `secure: true` means cookies only work over HTTPS

---

## 🚀 Best Practice Suggestion

Instead of `GET`, consider using:

```http
POST /api/users/logout
```

👉 Because logout changes server state (REST principle)

---


# Get Current User API

## 📌 Endpoint

`GET /api/users/current-profile`

---

## 📝 Description

This endpoint returns the **currently authenticated user's profile details**.

It extracts the user information from the JWT token via middleware and sends it back in the response.

> 🔐 This is a **protected route** and requires a valid access token.

---

## 🔑 Authentication

This endpoint requires authentication via:

### Option 1: Cookies

* `accessToken` (HTTP-only cookie)

### Option 2: Authorization Header

```http id="k91sd8"
Authorization: Bearer <accessToken>
```

---

## 📥 Request

### Headers (if not using cookies)

```http id="plm4x2"
Authorization: Bearer <accessToken>
```

### Body

❌ No request body required

---

## 📤 Response

### ✅ Success (200 OK)

```json id="d8s2la"
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "profileImage": "optional_url",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  },
  "message": "current user fetched successfully"
}
```

---

## ❌ Error Responses

### 401 Unauthorized

```json id="2k9sdf"
{
  "success": false,
  "message": "unauthorized request",
  "errors": []
}
```

---

### 500 Internal Server Error

```json id="8dk3ms"
{
  "success": false,
  "message": "Internal Server Error",
  "errors": []
}
```

---

## 🔄 Flow

1. Client sends request to `/api/users/current-profile`
2. Middleware (`verifyJWT`) validates the access token
3. User is extracted and attached to `req.user`
4. Controller returns the user data
5. Response is sent back to client

---

## 📁 Route Setup

```ts id="m8dk29"
router.route('/current-profile').get(verifyJWT, getCurrentUser);
```

---

## ⚠️ Notes

* User must be authenticated to access this endpoint
* Password and sensitive fields are excluded in middleware
* Uses JWT-based authentication
* Relies on `req.user` set by `verifyJWT` middleware

---



