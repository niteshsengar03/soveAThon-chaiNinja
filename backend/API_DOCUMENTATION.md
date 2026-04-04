# Hostel Management Backend API Documentation

## Overview

A comprehensive Node.js/Express backend for hostel management system with role-based authentication, complaint management, worker assignment, and movement tracking.

**Tech Stack:**

- **Runtime:** Node.js with ES6 modules
- **Framework:** Express.js v5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (1-day expiry)
- **Validation:** Joi schemas
- **Email:** Nodemailer
- **Security:** bcrypt password hashing

**Base URL:** `http://localhost:4000/api`

---

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME=Hostel Management
SMTP_FROM_EMAIL=noreply@hostel.com
CLIENT_URL=http://localhost:3000
```

---

## 🐳 Docker Setup

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### Quick Start with Docker

1. **Clone the repository and navigate to backend:**

   ```bash
   cd backend
   ```

2. **Start all services (MongoDB + Redis):**

   ```bash
   docker compose up -d
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Create environment file:**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start the application:**
   ```bash
   npm run dev
   ```

### Docker Services

- **MongoDB**: Database on port 27017
- **Redis**: Queue system on port 6379

### Useful Docker Commands

```bash
# View running containers
docker ps

# View logs
docker logs mongodb
docker logs redis

# Stop all services
docker compose down

# Rebuild and restart
docker compose up --build
```

---

## Authentication System

### User Roles & Permissions

1. **STUDENT**: Can create complaints, request movements, view own data
2. **ADMIN**: Can manage complaints, workers, movements for their assigned block

### Data Models

#### User Model

```javascript
{
  regNo: String, // Required for students, null for admins
  name: String, // Required
  email: String, // Required for admins
  phone: String,
  role: "STUDENT" | "ADMIN", // Required
  password: String, // Required, hashed with bcrypt
  hostelBlock: "A" | "B" | "C" | "D", // Required
  roomNo: String,
  messType: "VEG" | "NON_VEG",
  isActive: Boolean, // Default: true
}
```

#### College Student DB (Mock)

```javascript
{
  regNo: String, // Required, unique
  name: String, // Required
  hostelBlock: "A" | "B" | "C" | "D", // Required
  roomNo: String, // Required
  messType: "VEG" | "NON_VEG", // Required
}
```

---

## API Endpoints Documentation

## 🔐 Authentication Module

### Student Signup

**Endpoint:** `POST /api/auth/student/signup`

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "regNo": "12345",
  "password": "mypassword123"
}
```

**Validation:**

- `regNo`: Required string
- `password`: Required string, minimum 8 characters

**Process Flow:**

1. Validate input using Joi schema
2. Check if student exists in college database
3. Verify student is not already registered
4. Create user account with student details
5. Generate JWT token
6. Return user data and token

**Success Response (201):**

```json
{
  "success": true,
  "message": "Student account created successfully",
  "data": {
    "user": {
      "id": "...",
      "regNo": "12345",
      "name": "John Doe",
      "hostelBlock": "A",
      "roomNo": "101",
      "messType": "VEG",
      "role": "STUDENT"
    },
    "token": "jwt_token_here"
  }
}
```

**Error Responses:**

- `400`: Invalid input data
- `404`: Student not found in college database
- `409`: Student already registered

---

### Student Login

**Endpoint:** `POST /api/auth/student/login`

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "regNo": "12345",
  "password": "mypassword123"
}
```

**Validation:**

- `regNo`: Required string
- `password`: Required string

**Process Flow:**

1. Validate input using Joi schema
2. Find user by regNo
3. Verify password using bcrypt
4. Generate JWT token
5. Return user data and token

**Success Response (200):**

```json
{
  "success": true,
  "message": "Student login successful",
  "data": {
    "user": {
      "id": "...",
      "regNo": "12345",
      "name": "John Doe",
      "hostelBlock": "A",
      "role": "STUDENT"
    },
    "token": "jwt_token_here"
  }
}
```

---

### Admin Login

**Endpoint:** `POST /api/auth/admin/login`

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "admin@hostel.com",
  "password": "adminpassword123"
}
```

**Validation:**

- `email`: Required valid email
- `password`: Required string

**Process Flow:**

1. Validate input using Joi schema
2. Find admin user by email
3. Verify password using bcrypt
4. Generate JWT token
5. Return admin data and token

**Success Response (200):**

```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@hostel.com",
      "name": "Admin User",
      "hostelBlock": "A",
      "role": "ADMIN"
    },
    "token": "jwt_token_here"
  }
}
```

---

## 🛠️ Complaint Management Module

### Complaint Model

```javascript
{
  studentId: ObjectId, // Reference to User
  regNo: String, // Required
  type: "ROOM" | "ROOMMATE", // Required
  category: "AC" | "FAN" | "ELECTRICITY" | "PLUMBING" | "CARPENTRY" | "OTHER", // Required
  description: String, // Required
  status: "PENDING" | "ASSIGNED" | "RESOLVED" | "UNRESOLVED", // Default: PENDING
  priority: "LOW" | "MEDIUM" | "HIGH", // Default: MEDIUM
  block: String, // Required
  roomNo: String, // Required
  assignedWorker: {
    workerId: ObjectId, // Reference to Worker
    name: String,
    email: String,
    phone: String
  },
  logs: [{
    oldStatus: String,
    newStatus: String,
    changedBy: ObjectId, // Reference to User
    timestamp: Date
  }],
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Create Complaint

**Endpoint:** `POST /api/complaints`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "type": "ROOM",
  "category": "ELECTRICITY",
  "description": "Light not working in room",
  "roomNo": "101"
}
```

**Authorization:** STUDENT role required

**Process Flow:**

1. Authenticate user via JWT
2. Validate user is STUDENT
3. Extract student data from token
4. Validate input data
5. Check for available workers in same category and block
6. Auto-assign if only one worker available, send email notification
7. Create complaint record with logs
8. Return complaint data

**Success Response (201):**

```json
{
  "success": true,
  "message": "Complaint created successfully",
  "data": {
    "complaint": {
      "id": "...",
      "studentId": "...",
      "regNo": "12345",
      "type": "ROOM",
      "category": "ELECTRICITY",
      "description": "Light not working in room",
      "status": "ASSIGNED",
      "block": "A",
      "roomNo": "101",
      "assignedWorker": {
        "workerId": "...",
        "name": "John Electrician",
        "email": "john@workers.com",
        "phone": "9876543210"
      },
      "logs": [...],
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  }
}
```

---

### Update Complaint Status

**Endpoint:** `PATCH /api/complaints/:id/status`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "status": "RESOLVED"
}
```

**Authorization:** STUDENT role required

**Process Flow:**

1. Authenticate user via JWT
2. Validate user is STUDENT
3. Find complaint by ID
4. Verify complaint belongs to student
5. Validate status transition
6. Update complaint status
7. Add log entry
8. Set resolvedAt if status is RESOLVED
9. Return updated complaint

**Success Response (200):**

```json
{
  "success": true,
  "message": "Complaint status updated successfully",
  "data": {
    "complaint": {
      "id": "...",
      "status": "RESOLVED",
      "resolvedAt": "2024-01-01T12:00:00.000Z",
      "logs": [...]
    }
  }
}
```

---

### Assign Worker to Complaint

**Endpoint:** `PATCH /api/complaints/:id/assign`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "workerId": "worker_object_id"
}
```

**Authorization:** ADMIN role required

**Process Flow:**

1. Authenticate user via JWT
2. Validate user is ADMIN
3. Find complaint by ID
4. Verify complaint belongs to admin's block
5. Find worker by ID
6. Verify worker belongs to same block and category
7. Update complaint with worker assignment
8. Send email notification to worker
9. Add log entry
10. Return updated complaint

---

### Get My Complaints

**Endpoint:** `GET /api/complaints/my`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Authorization:** STUDENT role required

**Query Parameters:** None

**Process Flow:**

1. Authenticate user via JWT
2. Validate user is STUDENT
3. Find all complaints for student ID
4. Populate assigned worker data
5. Sort by creation date (newest first)
6. Return complaints array

**Success Response (200):**

```json
{
  "success": true,
  "message": "Complaints retrieved successfully",
  "data": {
    "complaints": [
      {
        "id": "...",
        "type": "ROOM",
        "category": "ELECTRICITY",
        "description": "Light not working",
        "status": "ASSIGNED",
        "assignedWorker": {
          "name": "John Electrician",
          "email": "john@workers.com"
        },
        "createdAt": "2024-01-01T10:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Available Workers for Complaint

**Endpoint:** `GET /api/complaints/available-workers`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `category` (required): Complaint category (AC, FAN, ELECTRICITY, etc.)
- `block` (required): Block where complaint occurred

**Authorization:** ADMIN role required

**Process Flow:**

1. Authenticate user via JWT
2. Validate user is ADMIN
3. Find all active workers matching category and block
4. Return workers list for admin to choose from

**Success Response (200):**

```json
{
  "success": true,
  "message": "Available workers retrieved successfully",
  "data": {
    "workers": [
      {
        "id": "...",
        "name": "John Electrician",
        "email": "john@workers.com",
        "phone": "9876543210",
        "category": "ELECTRICIAN",
        "block": "A"
      }
    ]
  }
}
```

---

### Get Admin Complaints

**Endpoint:** `GET /api/complaints/admin`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Authorization:** ADMIN role required

**Query Parameters:**

- `status` (optional): Filter by status
- `category` (optional): Filter by category

**Process Flow:**

1. Authenticate user via JWT
2. Validate user is ADMIN
3. Find all complaints for admin's block
4. Apply filters if provided
5. Populate student and worker data
6. Sort by creation date (newest first)
7. Return complaints array

---

### Automated Complaint Monitoring

**Background Processing:**

The system includes automated monitoring for resolved complaints:

1. **Daily Check (9:00 AM)**: System checks for complaints in "RESOLVED" status older than 2 days
2. **Email Alert**: Sends notification to head of hostels if complaint remains resolved for >2 days
3. **Alert Tracking**: Marks alerts as sent to prevent duplicate notifications

**Email Notifications:**

- **Worker Assignment**: Email sent to worker when complaint is assigned
- **Resolution Alert**: Email sent to head of hostels for long-resolved complaints
- **Queue Processing**: All emails processed asynchronously using Redis queue

**Environment Variables for Notifications:**

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Head of Hostels Email
HEAD_OF_HOSTELS_EMAIL=head@hostel.edu
```

---

## 👷 Worker Management Module

### Worker Model

```javascript
{
  name: String, // Required
  category: "ELECTRICIAN" | "PLUMBER" | "CARPENTER" | "OTHER", // Required
  block: "A" | "B" | "C" | "D", // Required
  email: String, // Required, unique
  phone: String, // Required
  isActive: Boolean, // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

### Create Worker

**Endpoint:** `POST /api/workers`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "name": "John Electrician",
  "category": "ELECTRICIAN",
  "block": "A",
  "email": "john@workers.com",
  "phone": "9876543210"
}
```

**Authorization:** ADMIN role required

**Process Flow:**

1. Authenticate user via JWT
2. Validate user is ADMIN
3. Validate input data
4. Check for duplicate email
5. Create worker record
6. Return worker data

---

### Get Workers

**Endpoint:** `GET /api/workers`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `block` (optional): Filter by block
- `category` (optional): Filter by category
- `isActive` (optional): Filter by active status

**Authorization:** ADMIN role required

**Process Flow:**

1. Authenticate user via JWT
2. Validate user is ADMIN
3. Build filter query from parameters
4. Find workers matching filters
5. Return workers array

---

### Update Worker

**Endpoint:** `PATCH /api/workers/:id`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "name": "John Smith",
  "phone": "9876543211",
  "isActive": false
}
```

**Authorization:** ADMIN role required

---

### Delete Worker

**Endpoint:** `DELETE /api/workers/:id`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Authorization:** ADMIN role required

---

## 🚶 Movement Tracking Module

### Movement Model

```javascript
{
  studentId: ObjectId, // Reference to User
  regNo: String, // Required
  type: "GARAGE" | "PRAYER", // Required
  reason: String, // Required
  requestedOutTime: Date, // Required
  expectedReturnTime: Date, // Required
  actualReturnTime: Date,
  status: "PENDING" | "APPROVED" | "REJECTED", // Default: PENDING
  approvedBy: ObjectId, // Reference to User (Admin)
  block: String, // Required
  roomNo: String, // Required
  createdAt: Date,
  updatedAt: Date
}
```

### Create Movement Request

**Endpoint:** `POST /api/movements`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "type": "GARAGE",
  "reason": "Need to get vehicle",
  "requestedOutTime": "2024-01-01T14:00:00.000Z",
  "expectedReturnTime": "2024-01-01T16:00:00.000Z",
  "roomNo": "101"
}
```

**Authorization:** STUDENT role required

**Process Flow:**

1. Authenticate user via JWT
2. Validate user is STUDENT
3. Validate input data and time logic
4. Create movement request
5. Return movement data

---

### Approve Movement Request

**Endpoint:** `PATCH /api/movements/:id/approve`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Authorization:** ADMIN role required

**Process Flow:**

1. Authenticate user via JWT
2. Validate user is ADMIN
3. Find movement by ID
4. Verify movement belongs to admin's block
5. Update status to APPROVED
6. Set approvedBy field
7. Return updated movement

---

### Reject Movement Request

**Endpoint:** `PATCH /api/movements/:id/reject`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Authorization:** ADMIN role required

---

### Update Return Time

**Endpoint:** `PATCH /api/movements/:id/return`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "actualReturnTime": "2024-01-01T15:30:00.000Z"
}
```

**Authorization:** ADMIN role required

---

### Get My Movements

**Endpoint:** `GET /api/movements/my`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Authorization:** STUDENT role required

---

### Get Admin Movements

**Endpoint:** `GET /api/movements/admin`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Authorization:** ADMIN role required

---

## � Broadcast Module

### Broadcast Model

```javascript
{
  adminId: ObjectId, // Reference to User
  block: String, // Required, admin's block
  content: String, // Required, post text
  imageUrl: String, // Optional image link
  createdAt: Date,
  updatedAt: Date
}
```

### Create Broadcast Post

**Endpoint:** `POST /api/broadcasts`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "content": "Important maintenance update for your block.",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Authorization:** ADMIN role required

**Process Flow:**

1. Authenticate user via JWT
2. Validate user is ADMIN
3. Validate content and optional imageUrl
4. Save broadcast post with admin's block
5. Return created broadcast

**Success Response (201):**

```json
{
  "success": true,
  "message": "Broadcast created successfully",
  "data": {
    "broadcast": {
      "id": "...",
      "adminId": "...",
      "block": "A",
      "content": "Important maintenance update for your block.",
      "imageUrl": "https://example.com/image.jpg",
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  }
}
```

---

### Get Admin Broadcasts

**Endpoint:** `GET /api/broadcasts/admin`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `limit` (optional): number of posts to return, default 20
- `before` (optional): ISO timestamp to fetch older posts before this date

**Authorization:** ADMIN role required

**Process Flow:**

1. Authenticate user via JWT
2. Validate user is ADMIN
3. Load broadcasts for admin's block
4. Sort newest first
5. Return posts with next cursor

---

### Get Student Broadcast Feed

**Endpoint:** `GET /api/broadcasts`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `limit` (optional): number of posts to return, default 20
- `before` (optional): ISO timestamp to fetch older posts

**Authorization:** STUDENT role required

**Process Flow:**

1. Authenticate user via JWT
2. Validate user is STUDENT
3. Load broadcasts for student's block
4. Sort newest first
5. Return posts with next cursor

**Success Response (200):**

```json
{
  "success": true,
  "message": "Broadcasts retrieved successfully",
  "data": {
    "broadcasts": [
      {
        "id": "...",
        "content": "Important maintenance update for your block.",
        "imageUrl": "https://example.com/image.jpg",
        "createdAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "nextCursor": "2024-01-01T09:50:00.000Z"
  }
}
```

---

## �🔧 Utility Endpoints

### Get Current User Profile

**Endpoint:** `GET /api/auth/me`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "user": {
    "id": "...",
    "role": "STUDENT",
    "name": "John Doe",
    "regNo": "12345",
    "hostelBlock": "A"
  }
}
```

---

## 📊 Data Flow Diagrams

### Authentication Flow

```
Student Signup:
Input → Joi Validation → College DB Check → User Creation → JWT Generation → Response

Student Login:
Input → Joi Validation → User Lookup → Password Verify → JWT Generation → Response

Admin Login:
Input → Joi Validation → Admin Lookup → Password Verify → JWT Generation → Response
```

### Complaint Management Flow

```
Create Complaint:
Student Request → Auth Check → Input Validation → Worker Assignment Logic → Email Notification → DB Save → Response

Status Update:
Student Request → Auth Check → Ownership Check → Status Validation → Log Creation → DB Update → Response

Worker Assignment:
Admin Request → Auth Check → Block Check → Worker Validation → Email Notification → DB Update → Response
```

### Movement Tracking Flow

```
Create Request:
Student Request → Auth Check → Time Validation → DB Save → Response

Admin Actions:
Admin Request → Auth Check → Block Check → Status Update → DB Save → Response
```

---

## 🧪 Testing Guide

### Prerequisites

1. MongoDB connection string
2. Environment variables configured
3. College student data seeded
4. Admin accounts created

### Test Scripts

#### Start Server

```bash
npm start
# or for development
npm run dev
```

#### Database Management

```bash
# Start MongoDB (if using Docker)
npm run db:up

# Stop MongoDB
npm run db:down
```

### Sample API Calls

#### 1. Student Registration

```bash
curl -X POST http://localhost:4000/api/auth/student/signup \
  -H "Content-Type: application/json" \
  -d '{"regNo": "12345", "password": "password123"}'
```

#### 2. Student Login

```bash
curl -X POST http://localhost:4000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"regNo": "12345", "password": "password123"}'
```

#### 3. Create Complaint (use token from login)

```bash
curl -X POST http://localhost:4000/api/complaints \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ROOM",
    "category": "ELECTRICITY",
    "description": "Light not working",
    "roomNo": "101"
  }'
```

#### 4. Get My Complaints

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:4000/api/complaints/my
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## 🔒 Security Features

1. **JWT Authentication**: Bearer token required for protected routes
2. **Password Hashing**: bcrypt with salt rounds
3. **Role-based Access**: STUDENT/ADMIN permissions
4. **Block Restrictions**: Admins can only access their assigned block
5. **Input Validation**: Joi schemas for all inputs
6. **SQL Injection Protection**: MongoDB/Mongoose ODM
7. **Rate Limiting**: Not implemented (can be added)

---

## 📈 Performance Optimizations

1. **Database Indexes**: Created on frequently queried fields
2. **Population**: Efficient data fetching with Mongoose populate
3. **Pagination**: Not implemented (can be added for large datasets)
4. **Caching**: Not implemented (can be added with Redis)

---

## 🚀 Deployment

### Environment Setup

1. Configure environment variables
2. Set up MongoDB database
3. Seed college student data
4. Create admin accounts
5. Configure SMTP settings

### Production Considerations

1. Use HTTPS in production
2. Set secure JWT secrets
3. Configure CORS properly
4. Add rate limiting
5. Set up monitoring and logging
6. Configure backup strategies

---

## 🐛 Common Issues & Solutions

### 1. MongoDB Connection Issues

- Check MONGODB_URI format
- Verify network connectivity
- Check MongoDB server status

### 2. JWT Token Issues

- Verify JWT_SECRET is set
- Check token expiry (1 day)
- Validate token format in Authorization header

### 3. Email Notification Issues

- Configure SMTP settings properly
- Check SMTP credentials
- Verify email templates

### 4. Validation Errors

- Check Joi schema requirements
- Verify data types
- Review required fields

---

## 📝 Future Enhancements

1. **Survey System**: Student feedback collection
2. **Broadcast Notifications**: Admin-to-student messaging
3. **File Upload**: Complaint images/attachments
4. **Leave Management**: Outing request system
5. **Analytics Dashboard**: Admin reporting
6. **Push Notifications**: Real-time updates
7. **Misconduct Tracking**: Disciplinary records
8. **Rate Limiting**: API protection
9. **Caching**: Performance optimization
10. **Audit Logs**: Comprehensive logging</content>
    <parameter name="filePath">/home/nitesh/nitesh/Work/soveAThon-chaiNinja/backend/API_DOCUMENTATION.md
