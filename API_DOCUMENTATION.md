# Habit Tracker API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

**Errors:**
- `400` - Email already exists or validation failed
- `500` - Server error

---

### Login User
**POST** `/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

**Errors:**
- `400` - Invalid credentials
- `500` - Server error

---

## Habits

### Get All Habits
**GET** `/habits`
🔒 **Protected**

Retrieve all habits for the authenticated user.

**Response:** `200 OK`
```json
{
  "success": true,
  "habits": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f191e810c19729de860ea",
      "name": "Morning meditation",
      "icon": "🧘",
      "tracking": [
        {
          "date": "2024-01-15",
          "completed": true
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Create Habit
**POST** `/habits`
🔒 **Protected**

Create a new habit.

**Request Body:**
```json
{
  "name": "Morning meditation",
  "icon": "🧘"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Habit created successfully",
  "habit": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f191e810c19729de860ea",
    "name": "Morning meditation",
    "icon": "🧘",
    "tracking": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Validation failed
- `500` - Server error

---

### Update Habit
**PUT** `/habits/:id`
🔒 **Protected**

Update habit details (name and/or icon).

**Request Body:**
```json
{
  "name": "Evening meditation",
  "icon": "🌙"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Habit updated successfully",
  "habit": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Evening meditation",
    "icon": "🌙",
    ...
  }
}
```

**Errors:**
- `404` - Habit not found
- `400` - Validation failed
- `500` - Server error

---

### Delete Habit
**DELETE** `/habits/:id`
🔒 **Protected**

Delete a habit permanently.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Habit deleted successfully"
}
```

**Errors:**
- `404` - Habit not found
- `500` - Server error

---

### Track Habit (Toggle Checkbox)
**POST** `/habits/:id/track`
🔒 **Protected**

Mark a habit as complete/incomplete for a specific date. Toggles the state if already tracked.

**Request Body:**
```json
{
  "date": "2024-01-15"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Tracking updated successfully",
  "habit": {
    "_id": "507f1f77bcf86cd799439011",
    "tracking": [
      {
        "date": "2024-01-15",
        "completed": true
      }
    ],
    ...
  }
}
```

**Errors:**
- `404` - Habit not found
- `400` - Invalid date format (must be YYYY-MM-DD)
- `500` - Server error

---

### Get Weekly Analysis
**GET** `/habits/:id/weekly`
🔒 **Protected**

Get 4-week progress analysis for a specific habit.

**Response:** `200 OK`
```json
{
  "success": true,
  "habitName": "Morning meditation",
  "weeks": [
    {
      "weekLabel": "Week 1",
      "completedDays": 5,
      "totalDays": 7,
      "percentage": 71
    },
    {
      "weekLabel": "Week 2",
      "completedDays": 6,
      "totalDays": 7,
      "percentage": 86
    },
    ...
  ]
}
```

**Errors:**
- `404` - Habit not found
- `500` - Server error

---

### Get Monthly Analysis
**GET** `/habits/:id/monthly`
🔒 **Protected**

Get current month analysis for a specific habit.

**Response:** `200 OK`
```json
{
  "success": true,
  "habitName": "Morning meditation",
  "month": "January 2024",
  "completedDays": 22,
  "totalDays": 31,
  "percentage": 71
}
```

**Errors:**
- `404` - Habit not found
- `500` - Server error

---

## Analysis

### Get Overview Statistics
**GET** `/analysis/overview`
🔒 **Protected**

Get overall statistics for all habits.

**Response:** `200 OK`
```json
{
  "success": true,
  "totalHabits": 5,
  "totalCompletedToday": 3,
  "completionRate": 60,
  "monthlyStats": {
    "507f1f77bcf86cd799439011": {
      "name": "Morning meditation",
      "completed": 22,
      "total": 31,
      "percentage": 71
    },
    ...
  }
}
```

---

### Get Auto-Analysis
**GET** `/analysis/auto`
🔒 **Protected**

Get intelligent analysis with most/least followed habits and personalized suggestions.

**Response:** `200 OK`
```json
{
  "success": true,
  "mostFollowed": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Morning meditation",
    "icon": "🧘",
    "completed": 28,
    "total": 31,
    "percentage": 90
  },
  "leastFollowed": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Exercise",
    "icon": "💪",
    "completed": 10,
    "total": 31,
    "percentage": 32
  },
  "overallPercentage": 65,
  "allHabits": [...],
  "suggestions": [
    "Focus on \"Exercise\" - try setting a specific time of day for this habit.",
    "Excellent work on \"Morning meditation\"! You're at 90% completion. Keep it up!",
    "Tip: Track your habits at the same time each day to build consistency."
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No authentication token, access denied"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message",
  "errors": [
    {
      "msg": "Password must be at least 6 characters",
      "param": "password"
    }
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Habit not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error description"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production deployment, consider implementing rate limiting middleware.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.
