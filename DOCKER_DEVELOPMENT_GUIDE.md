# Docker Development Guide

## 🚀 Developing with Docker (No Node.js Required)

This guide explains how to develop the project using Docker without installing Node.js locally.

---

## ✅ What's Optimized

### Backend Dockerfile
- ✅ Installs **all dependencies** (including dev dependencies)
- ✅ Uses **nodemon** for hot reload
- ✅ Auto-restarts on code changes

### Frontend Dockerfile
- ✅ Already configured for development
- ✅ Uses Vite dev server with hot reload
- ✅ Volume mounting for live code updates

### Docker Compose
- ✅ Volume mounting for both backend and frontend
- ✅ Code changes sync automatically
- ✅ Hot reload works for both services

---

## 🚀 Quick Start

### Step 1: Install Docker
```bash
# Download Docker Desktop from:
# https://www.docker.com/products/docker-desktop
```

### Step 2: Clone Repository
```bash
git clone https://github.com/your-username/Authentication-Authorization.git
cd Authentication-Authorization
```

### Step 3: Configure Environment
Create root `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth_db
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Step 4: Start Development
```bash
docker-compose up --build
```

**That's it!** No Node.js installation needed.

---

## 💻 Development Workflow

### Start Development
```bash
# Start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### Make Code Changes
1. **Edit files** in your editor (VS Code, etc.)
2. **Save the file**
3. **Changes sync automatically** (volume mounting)
4. **Backend restarts automatically** (nodemon)
5. **Frontend hot reloads automatically** (Vite)

### View Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services
```bash
# Stop services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

---

## 🔥 Hot Reload Features

### Backend Hot Reload
- ✅ **Nodemon** watches for file changes
- ✅ **Auto-restarts** on code changes
- ✅ **Instant updates** (no manual restart needed)

### Frontend Hot Reload
- ✅ **Vite** dev server with HMR (Hot Module Replacement)
- ✅ **Instant browser updates** on code changes
- ✅ **Fast refresh** for React components

---

## 📝 Development Tips

### 1. Edit Code Locally
- Edit files on your local machine
- Changes automatically sync to Docker containers
- No need to rebuild containers

### 2. Check Logs
```bash
# Watch backend logs
docker-compose logs -f backend

# Watch frontend logs
docker-compose logs -f frontend
```

### 3. Install New Dependencies
If you add new npm packages:

```bash
# Stop containers
docker-compose down

# Rebuild to install new dependencies
docker-compose up --build
```

### 4. Access Services
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000/api-docs

---

## 🔧 Troubleshooting

### Changes Not Reflecting?

1. **Check volume mounting:**
   ```bash
   docker-compose ps
   docker-compose logs backend
   ```

2. **Restart containers:**
   ```bash
   docker-compose restart backend
   docker-compose restart frontend
   ```

3. **Rebuild if needed:**
   ```bash
   docker-compose up --build
   ```

### Port Already in Use?

```bash
# Find process using port
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill process or change ports in docker-compose.yml
```

### Docker Build Fails?

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
docker-compose up
```

---

## 📊 Performance Tips

### Faster Rebuilds
```bash
# Use build cache (default)
docker-compose up --build

# Skip cache if needed
docker-compose build --no-cache
```

### Resource Usage
- Docker uses more resources than local development
- Consider allocating more RAM to Docker Desktop
- Close unnecessary containers

---

## 🎯 Best Practices

### 1. Use Volume Mounting
- ✅ Code changes sync automatically
- ✅ No need to rebuild on every change
- ✅ Fast development workflow

### 2. Watch Logs
- Monitor logs for errors
- Check hot reload is working
- Debug issues quickly

### 3. Clean Up
```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune

# Remove everything unused
docker system prune
```

---

## 📋 Comparison: Docker vs Local

| Aspect | Docker Development | Local Development |
|--------|-------------------|-------------------|
| **Node.js Required** | ❌ No | ✅ Yes |
| **Setup Time** | ⚡⚡⚡ Quick (5 min) | ⚡⚡ Quick (10 min) |
| **Hot Reload** | ✅✅ Works | ✅✅✅ Instant |
| **Debugging** | ⚠️ Limited | ✅✅✅ Excellent |
| **Resource Usage** | ⚠️ High | ✅ Low |
| **Consistency** | ✅✅✅ Perfect | ✅✅ Good |

---

## 🚀 Summary

**With Docker for Development:**
- ✅ No Node.js installation needed
- ✅ Hot reload works automatically
- ✅ Code changes sync instantly
- ✅ Consistent environment
- ✅ Works on any OS

**Workflow:**
1. Start: `docker-compose up --build`
2. Edit code locally
3. Changes reflect automatically
4. Stop: `docker-compose down`

---

## 📚 Next Steps

1. **Start developing:**
   ```bash
   docker-compose up --build
   ```

2. **Edit code** in your favorite editor

3. **See changes** instantly in browser

4. **Check logs** if needed:
   ```bash
   docker-compose logs -f
   ```

---

**Happy coding with Docker! 🐳🚀**

