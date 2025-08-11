# Prioritizze API Documentation

## Base URL
```
http://127.0.0.1:8000/
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in_progress', 'completed') DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  due_date TIMESTAMP,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_type ENUM('daily', 'weekly', 'monthly'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Testimonials Table
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  avatar TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Feedback Table
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type ENUM('bug', 'feature', 'feedback') NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('open', 'in_progress', 'resolved') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Reminders Table
```sql
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  reminder_date_time TIMESTAMP NOT NULL,
  message TEXT,
  is_email_notification BOOLEAN DEFAULT TRUE,
  is_triggered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "+1234567890",
      "role": "user",
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  },
  "message": "Registration successful"
}
```

#### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "+1234567890",
      "role": "user",
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  },
  "message": "Login successful"
}
```

#### POST /auth/logout
Logout user and invalidate token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### User Management

#### GET /user/profile
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+1234567890",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /user/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "mobile": "+1234567891"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "mobile": "+1234567891",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "Profile updated successfully"
}
```

#### POST /user/avatar
Upload user avatar.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:**
```
avatar: <file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "avatar": "https://example.com/new-avatar.jpg"
  },
  "message": "Avatar uploaded successfully"
}
```

#### GET /user/stats
Get user task statistics.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTasks": 25,
    "pendingTasks": 8,
    "completedTasks": 17,
    "recentTasks": [
      {
        "id": "uuid",
        "title": "Complete project",
        "status": "completed",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

### Tasks

#### GET /tasks
Get user tasks with optional filters.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status (todo, in_progress, completed)
- `category` (optional): Filter by category ID
- `priority` (optional): Filter by priority (low, medium, high)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "in_progress",
      "priority": "high",
      "categoryId": "uuid",
      "dueDate": "2024-01-15T00:00:00Z",
      "isRecurring": false,
      "recurringType": null,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET /tasks/:id
Get specific task by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "in_progress",
    "priority": "high",
    "categoryId": "uuid",
    "dueDate": "2024-01-15T00:00:00Z",
    "isRecurring": false,
    "recurringType": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /tasks
Create a new task.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high",
  "categoryId": "uuid",
  "dueDate": "2024-01-15T00:00:00Z",
  "isRecurring": false,
  "recurringType": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "todo",
    "priority": "high",
    "categoryId": "uuid",
    "dueDate": "2024-01-15T00:00:00Z",
    "isRecurring": false,
    "recurringType": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Task created successfully"
}
```

#### PUT /tasks/:id
Update an existing task.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated task title",
  "status": "completed",
  "priority": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Updated task title",
    "description": "Write comprehensive API documentation",
    "status": "completed",
    "priority": "medium",
    "categoryId": "uuid",
    "dueDate": "2024-01-15T00:00:00Z",
    "isRecurring": false,
    "recurringType": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  },
  "message": "Task updated successfully"
}
```

#### DELETE /tasks/:id
Delete a task.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

#### GET /tasks/due
Get tasks that are due soon.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Submit report",
      "dueDate": "2024-01-02T00:00:00Z",
      "priority": "high",
      "status": "todo"
    }
  ]
}
```

#### GET /tasks/recurring
Get recurring tasks.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Weekly team meeting",
      "isRecurring": true,
      "recurringType": "weekly",
      "status": "todo"
    }
  ]
}
```

---

### Categories

#### GET /categories
Get user categories.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Work",
      "color": "#3B82F6",
      "taskCount": 5
    }
  ]
}
```

#### POST /categories
Create a new category.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Personal",
  "color": "#10B981"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Personal",
    "color": "#10B981",
    "taskCount": 0
  },
  "message": "Category created successfully"
}
```

#### PUT /categories/:id
Update a category.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Category",
  "color": "#EF4444"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Category",
    "color": "#EF4444",
    "taskCount": 3
  },
  "message": "Category updated successfully"
}
```

#### DELETE /categories/:id
Delete a category.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

### Reminders

#### GET /reminders
Get user reminders with optional task filter.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `taskId` (optional): Filter by task ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "taskId": "uuid",
      "reminderDateTime": "2024-01-15T09:00:00Z",
      "message": "Don't forget to submit the report",
      "isEmailNotification": true,
      "isTriggered": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /reminders
Create a new reminder.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "taskId": "uuid",
  "reminderDateTime": "2024-01-15T09:00:00Z",
  "message": "Don't forget to submit the report",
  "isEmailNotification": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "taskId": "uuid",
    "reminderDateTime": "2024-01-15T09:00:00Z",
    "message": "Don't forget to submit the report",
    "isEmailNotification": true,
    "isTriggered": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Reminder created successfully"
}
```

#### PUT /reminders/:id
Update a reminder.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reminderDateTime": "2024-01-15T10:00:00Z",
  "message": "Updated reminder message",
  "isEmailNotification": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "taskId": "uuid",
    "reminderDateTime": "2024-01-15T10:00:00Z",
    "message": "Updated reminder message",
    "isEmailNotification": false,
    "isTriggered": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  },
  "message": "Reminder updated successfully"
}
```

#### DELETE /reminders/:id
Delete a reminder.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Reminder deleted successfully"
}
```

#### GET /reminders/upcoming
Get upcoming reminders for the user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "taskId": "uuid",
      "reminderDateTime": "2024-01-15T09:00:00Z",
      "message": "Don't forget to submit the report",
      "isEmailNotification": true,
      "isTriggered": false,
      "task": {
        "id": "uuid",
        "title": "Submit monthly report"
      }
    }
  ]
}
```

---

### Testimonials

#### GET /testimonials
Get all active testimonials (public endpoint).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Sarah Johnson",
      "role": "Product Manager",
      "content": "Prioritizze has transformed how I manage my daily tasks. The interface is intuitive and the features are exactly what I needed.",
      "avatar": "https://example.com/avatar1.jpg"
    }
  ]
}
```

#### POST /testimonials
Create a new testimonial (admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "role": "Software Developer",
  "content": "Amazing tool for task management!",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Smith",
    "role": "Software Developer",
    "content": "Amazing tool for task management!",
    "avatar": "https://example.com/avatar.jpg"
  },
  "message": "Testimonial created successfully"
}
```

#### PUT /testimonials/:id
Update a testimonial (admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "John Smith Jr.",
  "role": "Senior Software Developer",
  "content": "Updated testimonial content"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Smith Jr.",
    "role": "Senior Software Developer",
    "content": "Updated testimonial content",
    "avatar": "https://example.com/avatar.jpg"
  },
  "message": "Testimonial updated successfully"
}
```

#### DELETE /testimonials/:id
Delete a testimonial (admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "message": "Testimonial deleted successfully"
}
```

---

### Feedback

#### POST /feedback
Submit feedback.

**Request Body:**
```json
{
  "type": "feature",
  "title": "Add dark mode",
  "description": "It would be great to have a dark mode option for better user experience during night time."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "feature",
    "title": "Add dark mode",
    "description": "It would be great to have a dark mode option for better user experience during night time.",
    "status": "open"
  },
  "message": "Feedback submitted successfully"
}
```

#### GET /feedback
Get all feedback (admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "feature",
      "title": "Add dark mode",
      "description": "It would be great to have a dark mode option.",
      "status": "open",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Statistics

#### GET /stats/public
Get public statistics (no authentication required).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalTasks": 15000,
    "completedTasks": 12000,
    "reach": 50000,
    "feedbackCount": 150
  }
}
```

#### GET /stats/admin
Get admin statistics (admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalTasks": 15000,
    "completedTasks": 12000,
    "reach": 50000,
    "feedbackCount": 150,
    "activeUsers": 800,
    "newUsersThisMonth": 120,
    "tasksCreatedThisMonth": 2500
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute
- File upload endpoints: 10 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Pagination

List endpoints support pagination using query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Paginated responses include metadata:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```