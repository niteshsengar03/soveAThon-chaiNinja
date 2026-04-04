# 🏨 Hostel Management Backend

A comprehensive Node.js/Express backend system for hostel management with role-based authentication, complaint management, worker assignment, and movement tracking.

## 🚀 Features

- **Role-based Authentication**: Student and Admin user management
- **Complaint Management**: Create, assign, and resolve complaints
- **Worker Management**: CRUD operations for maintenance workers
- **Movement Tracking**: Garage and prayer movement requests
- **Email Notifications**: Automated notifications for assignments
- **Automated Monitoring**: Alerts for long-resolved complaints
- **College DB Integration**: Student verification against college database
- **Block-based Access Control**: Admins restricted to their assigned blocks
- **Background Processing**: Redis queues for email notifications

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES6 modules)
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Queue System**: Redis with BullMQ
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi schemas
- **Email**: Nodemailer with Gmail SMTP
- **Security**: bcrypt password hashing
- **Logging**: Winston

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MongoDB (via Docker)
- Redis (via Docker)

## 🐳 Quick Start with Docker

1. **Clone and navigate:**

   ```bash
   cd backend
   ```

2. **Start database services:**

   ```bash
   docker compose up -d
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Setup environment:**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## 📝 Environment Configuration

Create a `.env` file with:

```env
PORT=5000
NODE_ENV=development
LOG_LEVEL=info

# Database
MONGODB_URI=mongodb://admin:password@localhost:27017/hostel_db?authSource=admin

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME=Hostel Management
SMTP_FROM_EMAIL=your_email@gmail.com

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Head of Hostels Email
HEAD_OF_HOSTELS_EMAIL=head@hostel.edu
```

## 🏃‍♂️ Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Database Management

```bash
# Start databases
npm run db:up

# Stop databases
npm run db:down
```

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── common/
│   │   ├── config/            # Database, email, redis configs
│   │   ├── services/          # Notification, scheduler services
│   │   ├── utils/             # JWT, API response utilities
│   │   └── middleware/        # Auth, validation middleware
│   └── modules/
│       ├── auth/              # Authentication module
│       ├── complaints/        # Complaint management
│       ├── workers/           # Worker management
│       ├── movements/         # Movement tracking
│       └── broadcast/         # Admin broadcasts
├── docker-compose.yml         # Docker services
├── package.json
├── API_DOCUMENTATION.md
└── README.md
```

## 🔧 Key Features Implementation

### Complaint Workflow

1. **Student creates complaint** → Auto-assigns if single worker available
2. **Admin assigns worker** → Email notification sent to worker
3. **Worker resolves issue** → Student marks as resolved
4. **System monitors** → Alerts head if resolved >2 days

### Email Notifications

- **Async Processing**: Redis queue prevents blocking
- **Templates**: HTML emails for assignments and alerts
- **Scheduling**: Daily cron job for resolved complaint checks

### Worker Management

- **CRUD Operations**: Admin can manage workers
- **Category-based**: Workers specialize in AC, plumbing, etc.
- **Block-specific**: Workers assigned to specific hostel blocks

## 🧪 Testing

```bash
# Test complaint creation
curl -X POST http://localhost:5000/api/complaints \
  -H "Authorization: Bearer <student_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"type":"ROOM","category":"ELECTRICITY","description":"Light not working","roomNo":"101"}'

# Test worker assignment
curl -X PATCH http://localhost:5000/api/complaints/{id}/assign \
  -H "Authorization: Bearer <admin_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"workerId":"worker_id"}'

# Get available workers
curl "http://localhost:5000/api/complaints/available-workers?category=ELECTRICITY&block=A" \
  -H "Authorization: Bearer <admin_jwt>"
```

## 📧 Email Configuration

1. **Gmail Setup**: Enable 2FA and generate app password
2. **Environment**: Set SMTP_USER and SMTP_PASS in .env
3. **Testing**: Use services like Mailtrap for development

## 🔄 Background Jobs

- **Redis Queue**: Processes email notifications
- **Scheduler**: Daily checks for resolved complaints
- **Monitoring**: Winston logging for job status

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

ISC License
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel_db
JWT_SECRET=your_super_secret_jwt_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME=Hostel Management
SMTP_FROM_EMAIL=noreply@hostel.com
CLIENT_URL=http://localhost:3000

````

4. **Database Setup**

```bash
# Start MongoDB (if using Docker)
npm run db:up

# Or use your own MongoDB instance
````

5. **Seed Data**
   - Create college student records in the database
   - Create admin accounts for each hostel block

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:4000`

## 🧪 Testing

### Automated Testing Script

```bash
./test-api.sh
```

This script will test all major endpoints with sample data.

### Manual Testing

Use tools like Postman, Insomnia, or curl to test the API endpoints.

## 📚 API Documentation

Detailed API documentation is available in `API_DOCUMENTATION.md` which includes:

- Complete endpoint specifications
- Request/response formats
- Authentication requirements
- Data flow diagrams
- Error handling
- Testing examples

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── app.js                 # Main application setup
│   ├── server.js              # Server entry point
│   ├── models/                # Database models
│   │   ├── user.model.js
│   │   └── collegeStudent.model.js
│   ├── modules/               # Feature modules
│   │   ├── auth/              # Authentication module
│   │   ├── complaints/        # Complaint management
│   │   ├── workers/           # Worker management
│   │   └── movement/          # Movement tracking
│   └── common/                # Shared utilities
│       ├── config/            # Configuration files
│       ├── dto/               # Data transfer objects
│       ├── middleware/        # Custom middleware
│       └── utils/             # Utility functions
├── API_DOCUMENTATION.md       # Complete API docs
├── test-api.sh               # Testing script
├── package.json
├── env.example               # Environment template
└── README.md
```

## 🔐 Authentication

The system uses JWT (JSON Web Token) based authentication:

- **Students**: Can access their own data and create requests
- **Admins**: Can manage data for their assigned hostel block
- **Token Expiry**: 1 day
- **Header Format**: `Authorization: Bearer <token>`

## 📊 Database Models

### User Model

- Student registration numbers (unique for students)
- Admin email addresses (unique for admins)
- Role-based access control
- Hostel block assignments
- Password hashing with bcrypt

### College Student DB

- Mock college database for student verification
- Contains student details: regNo, name, block, room, mess type

### Complaint Model

- Student complaints with categories and priorities
- Worker assignment system
- Status tracking with audit logs
- Block-based restrictions

### Worker Model

- Maintenance workers by category and block
- Active/inactive status management
- Contact information for notifications

### Movement Model

- Garage and prayer movement requests
- Approval workflow with timestamps
- Block-based access control

## 🔧 Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Start MongoDB container (if using Docker)
npm run db:up

# Stop MongoDB container
npm run db:down
```

## 🚀 Deployment

### Environment Variables for Production

- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production MongoDB URI
- Set up SMTP for email notifications
- Enable HTTPS

### Security Considerations

- Use HTTPS in production
- Implement rate limiting
- Set up monitoring and logging
- Regular security audits
- Database backups

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check `MONGODB_URI` format
   - Verify network connectivity
   - Ensure MongoDB is running

2. **JWT Authentication Errors**
   - Verify `JWT_SECRET` is set
   - Check token expiry (1 day limit)
   - Validate Authorization header format

3. **Email Notifications Not Working**
   - Configure SMTP settings properly
   - Check email credentials
   - Verify SMTP server connectivity

4. **Validation Errors**
   - Check Joi schema requirements
   - Verify data types and required fields
   - Review API documentation for correct formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 📞 Support

For questions or support, please check the API documentation or create an issue in the repository.

---

## 🎯 Quick Start Example

1. **Start the server**

   ```bash
   npm start
   ```

2. **Student Registration**

   ```bash
   curl -X POST http://localhost:4000/api/auth/student/signup \
     -H "Content-Type: application/json" \
     -d '{"regNo": "12345", "password": "password123"}'
   ```

3. **Student Login**

   ```bash
   curl -X POST http://localhost:4000/api/auth/student/login \
     -H "Content-Type: application/json" \
     -d '{"regNo": "12345", "password": "password123"}'
   ```

4. **Create Complaint** (use token from login)
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

For complete API documentation, see `API_DOCUMENTATION.md`.</content>
<parameter name="filePath">/home/nitesh/nitesh/Work/soveAThon-chaiNinja/backend/README.md
