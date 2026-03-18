# DigitalNewtaManager - Vercel Deployment Guide (Updated)

## ✅ GitHub Repository

- **URL**: https://github.com/Khushdil380/digitalnewtamanager
- **Branch**: main

---

## 🚀 VERCEL DEPLOYMENT STEPS

### STEP 1: Deploy Backend First

1. Go to: https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository: `digitalnewtamanager`
5. Click **"Import"**
6. ⚙️ **Configuration:**
   - **Root Directory**: `backend`
   - **Build Command**: Default (leave blank)
   - **Output Directory**: Default

7. 📝 **Add Environment Variables** (IMPORTANT - NO TRAILING SLASHES):

   ```
   MONGODB_URI = mongodb+srv://khushdilansari345_db_user:aYJqycDOzEpuN0pW@digitalnewtamanager-ser.sycrcfe.mongodb.net/?appName=digitalnewtamanager-server
   JWT_SECRET = your-super-secret-jwt-key-12345
   EMAIL_USER = helpdigitalnewtamanager@gmail.com
   EMAIL_PASSWORD = aYJqycDOzEpuN0pW
   CORS_ORIGIN = https://digitalnewtamanager.vercel.app
   PORT = 3001
   ```

   ⚠️ **IMPORTANT**: Do NOT add trailing slash (/) to CORS_ORIGIN

8. Click **"Deploy"** and wait for green checkmark ✅

9. **Copy your Backend URL** when deployment completes (looks like: `https://digitalnewtamanager-backend.vercel.app`)

---

### STEP 2: Deploy Frontend

1. Go back to: https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your repository again
5. Click **"Import"**
6. ⚙️ **Configuration:**
   - **Root Directory**: `frontend`
   - **Build Command**: Default (leave blank)
   - **Output Directory**: Default

7. 📝 **Add Environment Variables**:

   ```
   REACT_APP_API_URL = https://digitalnewtamanager-backend.vercel.app
   REACT_APP_API_BASE_URL = https://digitalnewtamanager-backend.vercel.app
   ```

   ⚠️ **IMPORTANT**: Do NOT add trailing slash (/) to these URLs

8. Click **"Deploy"** and wait for green checkmark ✅

9. **Copy your Frontend URL** (looks like: `https://digitalnewtamanager.vercel.app`)

---

### STEP 3: Update Backend CORS_ORIGIN (if needed)

If you already deployed without the frontend URL, update it:

1. Go to your **Backend** project on Vercel
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in sidebar
4. Find `CORS_ORIGIN`
5. **Edit** the value to your frontend URL:
   ```
   https://digitalnewtamanager.vercel.app
   ```
6. Click **"Save"**
7. Go to **"Deployments"** tab
8. Click **three dots (...)** on latest deployment
9. Click **"Redeploy"** ✅

---

## 🧪 TESTING

### Test Backend Health Check

Visit in browser:

```
https://digitalnewtamanager-backend.vercel.app/api/health
```

Should see:

```json
{ "message": "Backend is running" }
```

### Test Frontend

Visit: https://digitalnewtamanager.vercel.app/

1. Click **"Get Started"** (Login button)
2. Click **"Create Account"**
3. Fill in details:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: 9999999999
   - Password: Test@123
   - Confirm Password: Test@123
4. Click **"Register"**
5. Should receive OTP via email
6. Enter OTP and complete registration ✅

---

## 🔧 LOCAL DEVELOPMENT

To test locally before deploying:

### Terminal 1 - Backend:

```bash
cd backend
npm install
npm start
```

### Terminal 2 - Frontend:

```bash
cd frontend
npm install
npm start
```

Frontend will open at: http://localhost:3000
Backend runs on: http://localhost:5000

---

## ❌ TROUBLESHOOTING

### Issue: "Failed to load resource: 404"

- **Solution**: Make sure `Root Directory` is set correctly (backend or frontend)
- Check that environment variables are saved (should have green checkmark)

### Issue: "CORS policy: Response to preflight request doesn't pass access control check"

- **Solution**:
  - Check `CORS_ORIGIN` doesn't have trailing slash
  - Verify backend has been redeployed after setting CORS_ORIGIN
  - Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Double slash in URL: //api/auth/register"

- **Solution**: Make sure REACT_APP_API_URL doesn't have trailing slash
- Frontend code now automatically removes trailing slashes

### Issue: "Backend API not responding"

- Check: https://digitalnewtamanager-backend.vercel.app/api/health
- Check Vercel logs: Backend project → Deployments → click deployment → "View Logs"

### Issue: "Email not received after registration"

- Check backend logs for email errors
- Verify EMAIL_USER and EMAIL_PASSWORD are correct

---

## 📚 Environment Variable Reference

### Backend (.env or Vercel):

```
MONGODB_URI = your-mongodb-connection-string
JWT_SECRET = any-random-secure-string
EMAIL_USER = helpdigitalnewtamanager@gmail.com
EMAIL_PASSWORD = aYJqycDOzEpuN0pW
CORS_ORIGIN = https://digitalnewtamanager.vercel.app
PORT = 3001
```

### Frontend (.env or Vercel):

```
REACT_APP_API_URL = https://digitalnewtamanager-backend.vercel.app
REACT_APP_API_BASE_URL = https://digitalnewtamanager-backend.vercel.app
```

---

## ✅ Success Indicators

After following all steps:

- ✅ Frontend loads without 404
- ✅ Login/Register button appears
- ✅ Can register and receive OTP email
- ✅ Can login with registered credentials
- ✅ Dashboard loads after login
- ✅ No CORS errors in browser console

---

## 🎯 Next Steps

After successful deployment:

1. Test all authentication flows (register, login, logout)
2. Begin Phase 3 implementation (Wedding Management)
3. Implement Phase 4 (Guest Management)
4. Implement Phase 5 (Attendance & Contribution Tracking)
