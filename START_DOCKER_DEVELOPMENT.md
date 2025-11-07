# Start Development with Docker - Step by Step Guide

## 🚀 Complete Setup for Docker Development

### Prerequisites
- ✅ Docker Desktop installed
- ✅ MongoDB Atlas account (or connection string)
- ✅ Git repository cloned

---

## 📋 Step-by-Step Setup

### Step 1: Create Root `.env` File

**Create a `.env` file in the root directory** (same folder as `docker-compose.yml`):

```env
# MongoDB Atlas Connection String (REQUIRED)
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/auth_db?retryWrites=true&w=majority

# JWT Secrets
JWT_SECRET=your_jwt_secret_change_this_in_production
JWT_REFRESH_SECRET=your_refresh_secret_change_this_in_production

# Email Configuration (optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail
EMAIL_FROM_NAME=Auth System
```

**How to get MongoDB Atlas connection string:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `auth_db`

---

### Step 2: Navigate to Project Directory

```bash
cd "C:\Users\LAPTOP WALA\Desktop\Authentication-Authorization"
```

---

### Step 3: Start Docker Development

```bash
# Start all services
docker-compose up --build
```

**Or run in background (detached mode):**
```bash
docker-compose up -d --build
```

---

### Step 4: Access Your Application

Once Docker starts, access:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/api-docs

---

## 💻 Development Workflow

### Making Code Changes

1. **Edit files locally** in your editor (VS Code, etc.)
   - Edit `backend/server.js` or any backend file
   - Edit `frontend/src/App.jsx` or any frontend file

2. **Save the file**
   - Backend automatically restarts (nodemon)
   - Frontend automatically reloads (Vite HMR)

3. **See changes instantly** in browser

**No need to rebuild or restart Docker!**

---

### View Logs

```bash
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View frontend logs only
docker-compose logs -f frontend
```

---

### Stop Development

```bash
# Stop containers
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

---

## 🎯 Quick Commands Reference

### Start Development
```bash
docker-compose up --build
```

### Start in Background
```bash
docker-compose up -d --build
```

### View Logs
```bash
docker-compose logs -f
```

### Stop Development
```bash
docker-compose down
```

### Restart a Service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild After Code Changes
```bash
docker-compose up --build
```

---

## ✅ Verify Everything is Working

### Check Services are Running
```bash
docker-compose ps
```

Should show:
- `auth_backend` - Up
- `auth_frontend` - Up

### Check Backend Logs
```bash
docker-compose logs backend
```

Should see:
```
MongoDB connected successfully
Server is running on port 5000
Email transporter ready and verified (if configured)
```

### Check Frontend Logs
```bash
docker-compose logs frontend
```

Should see:
```
VITE v5.x.x  ready in xxx ms
Local:   http://localhost:3000/
```

---

## 🔧 Troubleshooting

### MongoDB Connection Error?

1. **Check `.env` file exists** in root directory
2. **Verify connection string** is correct
3. **Check MongoDB Atlas IP whitelist** (add your IP or use `0.0.0.0/0`)
4. **Restart Docker:**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

### Port Already in Use?

```bash
# Find process using port
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Change ports in docker-compose.yml if needed
```

### Changes Not Reflecting?

1. **Check volume mounting** is working
2. **Restart the service:**
   ```bash
   docker-compose restart backend
   ```
3. **Check logs for errors:**
   ```bash
   docker-compose logs -f backend
   ```

---

## 📝 Complete Example Workflow

```bash
# 1. Navigate to project
cd "C:\Users\LAPTOP WALA\Desktop\Authentication-Authorization"

# 2. Create .env file (if not exists)
# Add your MongoDB Atlas connection string

# 3. Start Docker
docker-compose up --build

# 4. Open browser
# Frontend: http://localhost:3000
# API Docs: http://localhost:5000/api-docs

# 5. Edit code in your editor
# Changes reflect automatically!

# 6. View logs (optional)
docker-compose logs -f

# 7. Stop when done
docker-compose down
```

---

## 🎉 You're Ready!

Once Docker is running:

1. ✅ **Backend** is running on port 5000
2. ✅ **Frontend** is running on port 3000
3. ✅ **Hot reload** is working
4. ✅ **Code changes** sync automatically
5. ✅ **Start developing!**

---

## 💡 Pro Tips

1. **Keep Docker Desktop running** while developing
2. **Check logs** if something doesn't work
3. **Use volume mounting** - no rebuild needed for code changes
4. **Stop containers** when not developing to save resources

---

**Happy coding with Docker! 🐳🚀**

