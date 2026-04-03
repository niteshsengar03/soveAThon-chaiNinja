# 🏨 Hostel Management Backend

A comprehensive Node.js/Express backend system for hostel management with role-based authentication, complaint management, worker assignment, and movement tracking.

## 🚀 Features

- **Role-based Authentication**: Student and Admin user management
- **Complaint Management**: Create, assign, and resolve complaints
- **Worker Management**: CRUD operations for maintenance workers
- **Movement Tracking**: Garage and prayer movement requests
- **Email Notifications**: Automated notifications for assignments
- **College DB Integration**: Student verification against college database
- **Block-based Access Control**: Admins restricted to their assigned blocks

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES6 modules)
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi schemas
- **Email**: Nodemailer
- **Security**: bcrypt password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   PORT=4000
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
   ```

4. **Database Setup**

   ```bash
   # Start MongoDB (if using Docker)
   npm run db:up

   # Or use your own MongoDB instance
   ```

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
