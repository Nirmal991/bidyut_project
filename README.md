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

