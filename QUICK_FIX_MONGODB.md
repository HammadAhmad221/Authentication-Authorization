# Quick Fix: MongoDB Connection Error in Docker

## 🐛 Error You're Seeing

```
MongoDB connection error: querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net
```

## ✅ Quick Solution (3 Steps)

### Step 1: Create `.env` File in Root Directory

Create a file named `.env` in the root directory (same folder as `docker-compose.yml`):

```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/auth_db?retryWrites=true&w=majority
```

**Replace with your actual values:**
- `your_username` → Your MongoDB Atlas username
- `your_password` → Your MongoDB Atlas password  
- `your_cluster.mongodb.net` → Your actual cluster hostname

### Step 2: Get Your Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your password
6. Replace `<dbname>` with `auth_db`

**Example:**
```
mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/auth_db?retryWrites=true&w=majority
```

### Step 3: Restart Docker

```bash
docker-compose down
docker-compose up --build
```

**That's it!** The error should be gone.

---

## 🔍 Verify It's Working

Check the logs:
```bash
docker-compose logs backend
```

You should see:
```
MongoDB connected successfully
```

Instead of the error.

---

## 📝 Complete .env File Example

Create `.env` file in root directory:

```env
# MongoDB Atlas (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth_db?retryWrites=true&w=majority

# JWT Secrets
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Email (optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

---

## ⚠️ Important Notes

1. **Never commit `.env` file** - It contains secrets!
2. **Use your actual connection string** - Don't use the placeholder
3. **Check MongoDB Atlas IP whitelist** - Your IP must be allowed
4. **Password encoding** - If password has special characters, URL encode them

---

## 🚀 After Fix

Once you've created the `.env` file and restarted Docker, the connection should work!

```bash
# Start Docker
docker-compose up --build

# Check logs
docker-compose logs -f backend
```

---

**Create the `.env` file and restart Docker - that's all you need!** ✅

