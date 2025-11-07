# Fix MongoDB Connection Error in Docker

## 🐛 Error

```
MongoDB connection error: querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net
```

## 🔍 Why This Happens

This error occurs when:
1. Docker can't find the `MONGODB_URI` environment variable
2. It's using the placeholder connection string from `docker-compose.yml`
3. The root `.env` file is missing or doesn't have `MONGODB_URI`

---

## ✅ Solution

### Step 1: Create Root `.env` File

Create a `.env` file in the **root directory** (same level as `docker-compose.yml`):

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/auth_db?retryWrites=true&w=majority

# JWT Secrets
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Email Configuration (optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**Important:**
- Replace `your_username` with your MongoDB Atlas username
- Replace `your_password` with your MongoDB Atlas password
- Replace `cluster.mongodb.net` with your actual cluster hostname
- Use your actual connection string from MongoDB Atlas

### Step 2: Get Your Actual Connection String

1. Go to MongoDB Atlas Dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `auth_db`

Example:
```
mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/auth_db?retryWrites=true&w=majority
```

### Step 3: Restart Docker

```bash
# Stop containers
docker-compose down

# Start again with new .env file
docker-compose up --build
```

---

## 🔧 Alternative: Set Directly in docker-compose.yml

If you prefer, you can set it directly in `docker-compose.yml`:

```yaml
environment:
  MONGODB_URI: mongodb+srv://your_username:your_password@cluster.mongodb.net/auth_db
```

**Note:** This is less secure as the connection string will be visible in the file.

---

## 🌐 DNS Resolution Issue

If you still get DNS errors, add DNS configuration to `docker-compose.yml`:

```yaml
services:
  backend:
    # ... other config ...
    dns:
      - 8.8.8.8
      - 8.8.4.4
    networks:
      - auth_network
```

---

## ✅ Verification

After setting up `.env` file, verify:

1. **Check if .env file exists:**
   ```bash
   # Windows
   dir .env
   
   # Linux/Mac
   ls -la .env
   ```

2. **Check if Docker reads the variable:**
   ```bash
   docker-compose exec backend env | grep MONGODB_URI
   ```
   Should show your actual connection string.

3. **Check MongoDB Atlas IP Whitelist:**
   - Go to Atlas Dashboard → Network Access
   - Make sure your IP is whitelisted
   - Or use `0.0.0.0/0` for development

---

## 📝 Step-by-Step Setup

### Complete Setup Process:

1. **Create root `.env` file:**
   ```bash
   # In project root directory
   # Create .env file with your MongoDB Atlas connection string
   ```

2. **Add your connection string:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth_db?retryWrites=true&w=majority
   ```

3. **Stop and restart Docker:**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

4. **Check logs:**
   ```bash
   docker-compose logs backend
   ```
   Should see: `MongoDB connected successfully`

---

## 🔐 Security Note

**Never commit `.env` file to Git!**

Make sure `.env` is in `.gitignore`:

```gitignore
# .gitignore
.env
.env.local
*.env
```

---

## 🚀 Quick Fix Summary

1. ✅ Create root `.env` file
2. ✅ Add `MONGODB_URI` with your actual connection string
3. ✅ Restart Docker: `docker-compose down && docker-compose up --build`
4. ✅ Verify connection in logs

---

**After following these steps, your MongoDB connection should work!** ✅

