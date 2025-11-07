# Daily Workflow - Quick Start Guide

## 🚀 Daily Development Commands

Since you're using **MongoDB Atlas** (cloud database), you just need to run the backend and frontend locally.

---

## 📋 Step-by-Step Daily Workflow

### Step 1: Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

**You should see:**
```
Server is running on port 5000
MongoDB connected successfully
Email transporter ready and verified (if configured)
```

### Step 2: Start Frontend (Terminal 2)

Open a **new terminal window** and run:

```bash
cd frontend
npm run dev
```

**You should see:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### Step 3: Access Your Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000/api-docs

---

## 🎯 Quick Commands Reference

### Daily Development (Most Common)

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2 (new terminal)
cd frontend && npm run dev
```

### Using Root Package.json Scripts

You can also use the root scripts:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

---

## 📝 Complete Daily Routine

### Morning - Start Development

1. **Open Terminal 1:**
   ```bash
   cd "C:\Users\LAPTOP WALA\Desktop\Authentication-Authorization\backend"
   npm run dev
   ```

2. **Open Terminal 2:**
   ```bash
   cd "C:\Users\LAPTOP WALA\Desktop\Authentication-Authorization\frontend"
   npm run dev
   ```

3. **Open Browser:**
   - Go to http://localhost:3000

### During Development

- **Backend changes:** Automatically restart (nodemon)
- **Frontend changes:** Hot reload automatically
- **Database:** Connected to MongoDB Atlas (cloud)

### End of Day - Stop Development

**Press `Ctrl + C` in both terminals to stop the servers**

---

## 🔄 Alternative: Run Both Together (Advanced)

If you want to run both in one command, you can install `concurrently`:

```bash
# Install concurrently (one-time)
npm install -g concurrently

# Then create a script in root package.json
# Already included: npm run dev (if concurrently is installed)
```

**Or use two terminals** (recommended - easier to see logs)

---

## 🐳 Docker Option (For Testing Only)

If you want to test with Docker instead:

```bash
# Make sure MONGODB_URI is in root .env file
docker-compose up --build

# Stop when done
docker-compose down
```

**Note:** Use Docker only for testing deployment. For daily development, use local commands above.

---

## ✅ Checklist for First Time Setup

Before daily development, make sure you've done this once:

- [ ] MongoDB Atlas connection string is in `backend/.env`
- [ ] Backend dependencies installed: `cd backend && npm install`
- [ ] Frontend dependencies installed: `cd frontend && npm install`
- [ ] Email credentials configured (optional): In `backend/.env`

---

## 🎯 Summary - What to Run Daily

### **Recommended: Run Locally** ⭐

**Two terminals:**

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

**That's it!** Both connect to MongoDB Atlas automatically.

---

## 💡 Pro Tips

1. **Keep terminals open:** Don't close terminals while developing
2. **Check MongoDB Atlas:** Make sure your IP is whitelisted
3. **Environment variables:** Set in `backend/.env` (never commit)
4. **Hot reload:** Changes auto-reload (no manual restart needed)
5. **Logs:** Check terminal outputs for errors

---

## 🔍 Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is in use
# Check backend/.env file exists
# Check MongoDB Atlas connection string
```

### Frontend won't start?
```bash
# Check if port 3000 is in use
# Check if backend is running first
```

### Can't connect to database?
```bash
# Check MongoDB Atlas IP whitelist
# Verify connection string in backend/.env
# Check internet connection
```

---

## 📊 Quick Reference Table

| Task | Command | Terminal |
|------|---------|----------|
| **Start Backend** | `cd backend && npm run dev` | Terminal 1 |
| **Start Frontend** | `cd frontend && npm run dev` | Terminal 2 |
| **Stop Server** | `Ctrl + C` | Any terminal |
| **Test Docker** | `docker-compose up --build` | Root directory |
| **Install Dependencies** | `npm install` | In backend/frontend |

---

**For daily development, just run backend and frontend in two separate terminals!** 🚀

