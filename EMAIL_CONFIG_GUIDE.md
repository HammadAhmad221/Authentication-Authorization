# Email Configuration Guide

## 🔧 Fixing the Email Warning in Docker

### Problem
You're seeing this warning even though you set `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`:
```
Email transporter not configured properly
Email functionality will be disabled. Set EMAIL_USER and EMAIL_PASSWORD in .env
```

### Why This Happens

When running with Docker, environment variables from `backend/.env` are **NOT automatically available** to the Docker container. Docker Compose needs environment variables to be:

1. **In a root `.env` file** (same directory as `docker-compose.yml`)
2. **Or explicitly set in `docker-compose.yml`**

## ✅ Solution Options

### Option 1: Create Root `.env` File (Recommended)

Create a `.env` file in the **root directory** (same level as `docker-compose.yml`):

```bash
# In project root directory
touch .env
```

Add your email configuration:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM_NAME=Auth System
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# JWT Secrets (if not already set)
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
```

**Important:** Docker Compose automatically reads variables from a root `.env` file!

### Option 2: Set in docker-compose.yml Directly

The `docker-compose.yml` now reads from environment variables. You can set them in your shell before running docker-compose:

```bash
# Windows PowerShell
$env:EMAIL_USER="your_email@gmail.com"
$env:EMAIL_PASSWORD="your_app_password"
docker-compose up --build

# Windows CMD
set EMAIL_USER=your_email@gmail.com
set EMAIL_PASSWORD=your_app_password
docker-compose up --build

# Linux/Mac
export EMAIL_USER="your_email@gmail.com"
export EMAIL_PASSWORD="your_app_password"
docker-compose up --build
```

### Option 3: Use backend/.env (For Local Development Only)

If running **locally without Docker**, your `backend/.env` file will work fine:

```bash
cd backend
npm run dev
```

But for Docker, you need Option 1 or 2.

## 📋 Gmail Setup

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Security → 2-Step Verification
3. Enable it

### Step 2: Generate App Password
1. Go to Google Account → Security → App Passwords
2. Select "Mail" as the app
3. Generate password
4. Use this password (not your regular password) in `EMAIL_PASSWORD`

### Step 3: Configure
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # App password (16 characters)
```

## 🐳 Docker Setup Steps

1. **Create root `.env` file:**
   ```bash
   # In project root
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

2. **Restart Docker containers:**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

3. **Verify in logs:**
   You should now see:
   ```
   Email transporter ready and verified
   ```
   Instead of the warning.

## 🔍 Troubleshooting

### Still seeing the warning?

1. **Check if variables are set in Docker:**
   ```bash
   docker-compose exec backend env | grep EMAIL
   ```
   Should show `EMAIL_USER` and `EMAIL_PASSWORD`

2. **Check root `.env` file exists:**
   ```bash
   # Should be in same directory as docker-compose.yml
   ls -la .env
   ```

3. **Verify `.env` file format:**
   - No spaces around `=`
   - No quotes needed (unless value has spaces)
   - One variable per line

4. **Restart containers:**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

### Wrong credentials error?

- Make sure you're using Gmail **App Password**, not your regular password
- Verify 2FA is enabled on your Google account
- Check email and password are correct

## 📝 Summary

**The Fix:**
- ✅ Updated `email.utils.js` to check credentials before creating transporter
- ✅ Updated `docker-compose.yml` to include email environment variables
- ✅ Warning will only show if credentials are truly missing

**To Configure:**
1. Create root `.env` file with `EMAIL_USER` and `EMAIL_PASSWORD`
2. Use Gmail App Password (not regular password)
3. Restart Docker containers

**Result:**
- No more warning if credentials are set correctly
- Email functionality will work
- Better error messages if something is wrong

---

**Your email configuration should now work properly!** ✅

