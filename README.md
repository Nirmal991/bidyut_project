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
