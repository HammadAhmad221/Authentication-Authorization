# Complete Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Configuration

#### Backend (.env)
Copy `backend/env.example` to `backend/.env` and configure:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000

# Email Configuration (Required for email verification & password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM_NAME=Auth System

LOG_LEVEL=info
```

**Email Setup:**
- **Gmail**: Use App Password (not regular password)
  1. Enable 2FA on your Google account
  2. Go to Google Account → Security → App Passwords
  3. Generate app password for "Mail"
  4. Use that password in EMAIL_PASSWORD

- **Production**: Use SendGrid, AWS SES, or similar service

### 3. Create Logs Directory

```bash
mkdir -p backend/logs
```

### 4. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Or use local MongoDB installation
mongod
```

### 5. Start Backend

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`
API Docs available at `http://localhost:5000/api-docs`

### 6. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 🐳 Docker Setup (Alternative)

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

This will start:
- MongoDB on port 27017
- Backend on port 5000
- Frontend on port 3000

---

## 📧 Email Configuration Details

### Development (Gmail)

1. **Enable App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use generated password in `.env`

2. **Alternative - Less Secure Apps (Not Recommended):**
   - Enable "Allow less secure apps" in Google Account
   - Use regular password (not recommended for security)

### Production Options

1. **SendGrid:**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your_sendgrid_api_key
   ```

2. **AWS SES:**
   ```env
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   EMAIL_USER=your_aws_access_key
   EMAIL_PASSWORD=your_aws_secret_key
   ```

3. **Mailgun:**
   ```env
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   EMAIL_USER=your_mailgun_username
   EMAIL_PASSWORD=your_mailgun_password
   ```

---

## 🧪 Testing

### Run Tests

```bash
cd backend
npm test
```

### Test Coverage

```bash
npm test -- --coverage
```

---

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:5000/api-docs`

All API endpoints are documented with:
- Request/Response schemas
- Authentication requirements
- Example requests
- Error responses

---

## 🔐 Security Features

### Implemented Features

1. ✅ **Email Verification** - Users must verify email after registration
2. ✅ **Password Reset** - Secure token-based password reset
3. ✅ **Password Change** - Change password with current password verification
4. ✅ **Password History** - Prevents reusing last 5 passwords
5. ✅ **Account Lockout** - Locks after 5 failed login attempts
6. ✅ **Session Management** - Track and manage active sessions
7. ✅ **Audit Logging** - Log all security events
8. ✅ **Token Rotation** - Refresh tokens rotate on use
9. ✅ **Security Headers** - Helmet.js for security headers
10. ✅ **Rate Limiting** - Prevent brute-force attacks

---

## 📝 New API Endpoints

### Email Verification
- `GET /api/verification/verify-email?token=xxx` - Verify email
- `POST /api/verification/resend-verification` - Resend verification email (auth required)

### Password Management
- `POST /api/password/forgot-password` - Request password reset
- `POST /api/password/reset-password` - Reset password with token
- `POST /api/password/change-password` - Change password (auth required)

### Session Management
- `GET /api/auth/sessions` - Get active sessions (auth required)
- `POST /api/auth/logout-all` - Logout from all devices (auth required)

### Audit Logs (Admin)
- `GET /api/admin/audit-logs` - View audit logs (admin only) - *To be implemented*

---

## 🛠️ Troubleshooting

### Email Not Sending

1. **Check email credentials in `.env`**
2. **Verify SMTP settings**
3. **Check logs**: `backend/logs/error.log`
4. **Development mode**: Emails are logged to console if not configured

### MongoDB Connection Error

1. **Check MongoDB is running**: `mongosh` or `mongo`
2. **Verify MONGODB_URI in `.env`**
3. **Check firewall settings**

### Port Already in Use

```bash
# Find process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Logs Directory Missing

```bash
mkdir -p backend/logs
```

---

## 📦 Production Deployment

### Environment Variables

Set all environment variables in production:
- Use strong, random JWT secrets
- Use production MongoDB URI
- Configure production email service
- Set `NODE_ENV=production`

### Security Checklist

- [ ] Change all default secrets
- [ ] Enable HTTPS
- [ ] Use secure cookies (`secure: true`)
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and alerts
- [ ] Enable database backups
- [ ] Configure rate limiting for production
- [ ] Set up log rotation
- [ ] Enable audit logging
- [ ] Review and update dependencies

---

## 🎯 Next Steps

1. **Configure Email Service** - Set up Gmail or production email service
2. **Test Email Verification** - Register and verify email
3. **Test Password Reset** - Test forgot password flow
4. **Review API Documentation** - Check Swagger docs at `/api-docs`
5. **Set Up Testing** - Write and run tests
6. **Deploy to Production** - Follow production checklist

---

## 📞 Support

For issues or questions:
1. Check logs in `backend/logs/`
2. Review API documentation at `/api-docs`
3. Check error messages in console
4. Review this setup guide

---

**Happy Coding! 🚀**

