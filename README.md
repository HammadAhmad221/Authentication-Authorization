# Secure Authentication & Authorization System

A full-stack MERN (MongoDB, Express, React, Node.js) application implementing secure authentication and authorization with professional standards.

## Features

### Backend
- ✅ User registration with validation
- ✅ Secure login with JWT tokens
- ✅ Access tokens (short-lived) and refresh tokens (long-lived)
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Role-based access control (User, Admin, Moderator)
- ✅ Protected routes with authentication middleware
- ✅ Authorization middleware for role-based access
- ✅ Rate limiting for authentication endpoints
- ✅ Input validation with express-validator
- ✅ CORS configuration
- ✅ HTTP-only cookies for refresh tokens
- ✅ Automatic token refresh mechanism

### Frontend
- ✅ Modern React application with Vite
- ✅ Login and Registration pages
- ✅ Protected routes
- ✅ Role-based route protection
- ✅ Token management with automatic refresh
- ✅ User dashboard
- ✅ Admin panel (admin only)
- ✅ User profile page
- ✅ Toast notifications
- ✅ Form validation
- ✅ Responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- express-rate-limit
- cookie-parser
- cors

### Frontend
- React 18
- React Router DOM
- Axios
- React Toastify
- Vite

## Project Structure

```
Authentication & Authorization/
├── backend/
│   ├── models/
│   │   └── User.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── user.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── utils/
│   │   ├── jwt.utils.js
│   │   └── rateLimiter.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── Auth.css
│   │   │   └── Dashboard.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## 🚀 Quick Start - Daily Development

### Daily Workflow (Recommended) ⭐

**Run backend and frontend locally, connect to MongoDB Atlas**

```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend (open new terminal)
cd frontend
npm run dev
```

**Access your application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs


**Benefits:**
- ⚡ Fast hot reload
- 🔧 Native debugging tools
- 🧪 Easy testing
- ☁️ MongoDB Atlas (no database setup)
- 🌍 Accessible from anywhere

### Option 2: Docker Development (No Node.js Required)

**Best for machines without Node.js** - Apps in Docker, MongoDB Atlas in cloud

```bash
# 1. Create root .env file with MongoDB Atlas connection string
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth_db

# 2. Start all services
npm run dev:docker
# Or: docker-compose up --build

# 3. Access your application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# API Docs: http://localhost:5000/api-docs
```

**Benefits:**
- ✅ No Node.js installation needed
- ✅ Hot reload works automatically
- ✅ Code changes sync instantly
- ✅ Consistent environment
- ☁️ MongoDB Atlas (cloud database)

**Note:** Create a root `.env` file (same directory as `docker-compose.yml`) with your MongoDB Atlas connection string and other environment variables.


---

## Installation & Setup

### Prerequisites

**For Local Development:**
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- npm or yarn

**For Docker Development:**
- Docker Desktop - [Download here](https://www.docker.com/products/docker-desktop)
- MongoDB Atlas account (free tier available)
- No Node.js installation required

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth_db?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000

# Email Configuration (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM_NAME=Auth System
```

**Getting MongoDB Atlas Connection String:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your database user credentials

**Important**: Change the JWT secrets to strong, random strings in production!

4. Start the backend server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Register a new user
  - Body: `{ username, email, password }`
  - Returns: User object and access token

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: User object and access token

- `POST /api/auth/refresh` - Refresh access token
  - Uses refresh token from cookie or body
  - Returns: New access token

- `POST /api/auth/logout` - Logout user
  - Requires: Authentication
  - Clears refresh token

- `GET /api/auth/me` - Get current user
  - Requires: Authentication
  - Returns: Current user object

### User Routes (`/api/user`)

- `GET /api/user/all` - Get all users (Admin only)
  - Requires: Authentication + Admin role
  - Returns: Array of users

- `GET /api/user/:id` - Get user by ID
  - Requires: Authentication
  - Returns: User object

- `PUT /api/user/:id` - Update user
  - Requires: Authentication (own profile or admin)
  - Body: `{ username?, email? }`
  - Returns: Updated user object

- `DELETE /api/user/:id` - Delete user
  - Requires: Authentication (own account or admin)
  - Returns: Success message

## Security Features

1. **Password Security**
   - Passwords are hashed using bcrypt with 12 salt rounds
   - Passwords are never returned in API responses
   - Password validation requires uppercase, lowercase, and number

2. **Token Security**
   - Access tokens are short-lived (15 minutes)
   - Refresh tokens are long-lived (7 days) and stored in HTTP-only cookies
   - Refresh tokens are stored in the database
   - Automatic token refresh on frontend

3. **Rate Limiting**
   - Authentication endpoints: 5 requests per 15 minutes per IP
   - General API endpoints: 100 requests per 15 minutes per IP

4. **Input Validation**
   - Server-side validation using express-validator
   - Client-side validation for better UX
   - Email format validation
   - Username format validation

5. **CORS Configuration**
   - Configured for specific frontend origin
   - Credentials enabled for cookie support

6. **Role-Based Access Control**
   - Three roles: user, admin, moderator
   - Middleware for role checking
   - Protected routes based on roles

## User Roles

- **user**: Default role, can access own profile and dashboard
- **moderator**: Can access moderator features (extendable)
- **admin**: Full access, can view all users and manage system

## Testing the Application

1. **Register a new user:**
   - Go to `http://localhost:3000/register`
   - Fill in username, email, and password
   - Password must contain uppercase, lowercase, and number

2. **Login:**
   - Go to `http://localhost:3000/login`
   - Use your registered credentials

3. **Access Dashboard:**
   - After login, you'll be redirected to the dashboard
   - View your user information

4. **Test Admin Panel:**
   - Create an admin user: `cd backend && npm run create-admin`
   - Login with: `admin@test.com` / `Admin123`
   - Or manually update a user's role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```
   - Then access `/admin` route

5. **Test Moderator Dashboard:**
   - Create a moderator user: `cd backend && npm run create-moderator`
   - Login with: `moderator@test.com` / `Moderator123`
   - Or manually update a user's role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "moderator" } }
   )
   ```

6. **Test Protected Routes:**
   - Try accessing `/dashboard` without logging in (should redirect to login)
   - Try accessing `/admin` as a regular user (should show access denied)

## Docker Development

### Setup with Docker

1. **Create root `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth_db?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **View logs:**
   ```bash
   # All logs
   docker-compose logs -f
   
   # Backend only
   docker-compose logs -f backend
   
   # Frontend only
   docker-compose logs -f frontend
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

**Note:** Hot reload is enabled. Code changes sync automatically without restarting containers.

## Troubleshooting

### MongoDB Connection Error
- Ensure `.env` file exists in root directory with correct `MONGODB_URI`
- Verify MongoDB Atlas IP whitelist includes your IP
- Check connection string format

### Port Already in Use
- Change ports in `docker-compose.yml` if needed
- Or stop the process using the port

### Changes Not Reflecting
- For Docker: Wait 1-2 seconds (polling interval)
- Hard refresh browser: `Ctrl + Shift + R`
- Check Docker logs for errors

## Production Considerations

1. **Environment Variables**
   - Use strong, random JWT secrets
   - Use environment-specific MongoDB URI
   - Set `NODE_ENV=production`
   - Configure proper CORS origins

2. **Security**
   - Enable HTTPS
   - Use secure cookies in production
   - Implement additional rate limiting
   - Add request logging and monitoring

3. **Database**
   - Use MongoDB Atlas or managed database
   - Enable database authentication
   - Set up database backups

4. **Frontend**
   - Build for production: `npm run build`
   - Serve static files through a CDN
   - Implement error boundary
   - Add loading states

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC

## Author

Created as a professional authentication and authorization system following industry best practices.

