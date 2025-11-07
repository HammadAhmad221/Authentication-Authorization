# MongoDB Atlas Setup Guide

## 🎯 Quick Setup for MongoDB Atlas

Since you're using MongoDB Atlas (cloud database), the setup is simpler - no local MongoDB needed!

---

## 📋 Step-by-Step Setup

### Step 1: Get MongoDB Atlas Connection String

1. **Go to MongoDB Atlas:**
   - Visit [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account (if you don't have one)

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose free tier (M0)
   - Select a cloud provider and region
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password
   - Save credentials (you'll need them)

4. **Whitelist IP Address:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (`0.0.0.0/0`)
   - Or add your specific IP address
   - Click "Confirm"

5. **Get Connection String:**
   - Go back to "Database" → "Connect"
   - Click "Connect your application"
   - Choose "Driver" (Node.js) and version
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority`

---

### Step 2: Configure Your Application

#### For Local Development:

1. **Update `backend/.env`:**
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/auth_db?retryWrites=true&w=majority
   ```

2. **Replace placeholders:**
   - `<username>` → Your database username
   - `<password>` → Your database password
   - `<dbname>` → `auth_db` (or your preferred database name)

#### For Docker:

1. **Create root `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/auth_db?retryWrites=true&w=majority
   ```

2. **Docker Compose will automatically use it**

---

## 🔐 Security Best Practices

### 1. IP Whitelisting

**For Development:**
- Use `0.0.0.0/0` to allow from anywhere (convenient but less secure)
- Or add specific IP addresses

**For Production:**
- Always use specific IP addresses
- Add your server IP addresses only
- Never use `0.0.0.0/0` in production

### 2. Database User

- Create dedicated database user (not admin)
- Use strong password
- Limit permissions (read/write only for your database)

### 3. Connection String

- **Never commit** connection string to Git
- Store in `.env` file (already in `.gitignore`)
- Use environment variables in production
- Rotate passwords regularly

---

## 🚀 Quick Start Commands

### Local Development:
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Docker:
```bash
# Make sure MONGODB_URI is in root .env
docker-compose up --build
```

---

## 🔍 Troubleshooting

### Connection Failed?

1. **Check IP Whitelist:**
   - Make sure your IP is whitelisted in Atlas
   - Or use `0.0.0.0/0` for development

2. **Check Connection String:**
   - Verify username and password are correct
   - Check database name is correct
   - Ensure URL encoding for special characters in password

3. **Check Network:**
   - Ensure internet connection
   - Check firewall settings
   - Try from different network

### Authentication Failed?

1. **Verify Database User:**
   - Check username and password
   - Ensure user has proper permissions
   - Try creating new database user

2. **Check Connection String Format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

### Docker Can't Connect?

1. **Check Root `.env` File:**
   - Make sure `MONGODB_URI` is set in root `.env`
   - Not just in `backend/.env`

2. **Verify IP Whitelist:**
   - Docker containers might use different IP
   - Use `0.0.0.0/0` for development
   - Or add Docker host IP

---

## 💡 Pro Tips

1. **Use Different Databases:**
   - Development: `auth_db_dev`
   - Production: `auth_db_prod`
   - Testing: `auth_db_test`

2. **Connection Pooling:**
   - Atlas handles connection pooling automatically
   - No need to configure manually

3. **Monitoring:**
   - Use Atlas dashboard to monitor connections
   - Check metrics and performance
   - Set up alerts

4. **Backups:**
   - Atlas provides automatic backups (paid plans)
   - For free tier, export data regularly
   - Use `mongodump` for backups

---

## 📝 Connection String Format

```
mongodb+srv://[username:password@]host[/[database][?options]]

Example:
mongodb+srv://admin:password123@cluster0.abc123.mongodb.net/auth_db?retryWrites=true&w=majority
```

**Components:**
- `mongodb+srv://` - Protocol (SRV record)
- `username:password` - Database credentials
- `host` - Cluster hostname
- `database` - Database name (optional)
- `?options` - Connection options

**Common Options:**
- `retryWrites=true` - Enable retry writes
- `w=majority` - Write concern
- `maxPoolSize=10` - Connection pool size
- `ssl=true` - Enable SSL (default)

---

## ✅ Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created (free tier)
- [ ] Database user created
- [ ] IP address whitelisted
- [ ] Connection string copied
- [ ] `backend/.env` updated with connection string
- [ ] Root `.env` updated (for Docker)
- [ ] Connection tested locally
- [ ] Connection tested in Docker

---

**Your MongoDB Atlas setup is complete!** 🎉

Now you can develop locally and connect to the cloud database - no local MongoDB installation needed!

