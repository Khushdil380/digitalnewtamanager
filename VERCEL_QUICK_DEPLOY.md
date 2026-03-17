# Quick Vercel Deployment Guide

## ⚡ FASTEST WAY TO DEPLOY

### STEP 1: Deploy Backend (3 minutes)
1. Go to: https://vercel.com (sign in with GitHub)
2. Click **"Add New"** → **"Project"**
3. Find and click your **digitalnewtamanager** repository
4. Select **Root Directory**: `backend` (use dropdown)
5. Scroll down to **Environment Variables** section
6. Add these variables:
   - `MONGODB_URI` = `mongodb+srv://khushdilansari345_db_user:aYJqycDOzEpuN0pW@digitalnewtamanager-ser.sycrcfe.mongodb.net/?appName=digitalnewtamanager-server`
   - `JWT_SECRET` = `super-secret-jwt-key-change-later`
   - `EMAIL_USER` = `helpdigitalnewtamanager@gmail.com`
   - `EMAIL_PASSWORD` = `aYJqycDOzEpuN0pW`
   - `CORS_ORIGIN` = `http://localhost:3000` (change this later)
   - `PORT` = `3001`
7. Click **"Deploy"** button
8. ✅ **WAIT FOR DEPLOYMENT TO COMPLETE** (shows green checkmark)
9. **COPY YOUR BACKEND URL** (you'll need this!)

---

### STEP 2: Deploy Frontend (3 minutes)
1. Go back to: https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Select your **digitalnewtamanager** repository again
4. Select **Root Directory**: `frontend` (use dropdown)
5. Scroll down to **Environment Variables**
6. Add these variables:
   - `REACT_APP_API_URL` = **PASTE YOUR BACKEND URL FROM STEP 1**
   - `REACT_APP_API_BASE_URL` = **SAME AS ABOVE**
   
   **Example:** 
   ```
   https://digitalnewtamanager-backend.vercel.app
   ```
7. Click **"Deploy"** button
8. ✅ **WAIT FOR DEPLOYMENT TO COMPLETE**
9. **COPY YOUR FRONTEND URL** (this is your live website!)

---

### STEP 3: Fix Backend CORS (2 minutes)
1. Go back to: https://vercel.com/dashboard
2. Click on your **BACKEND** project (the one you deployed first)
3. Click **"Settings"** tab at top
4. Click **"Environment Variables"** in left sidebar
5. Find `CORS_ORIGIN` variable
6. Click the **edit button** (pencil icon)
7. **Replace** with your **FRONTEND URL from Step 2**
8. Click **"Save"**
9. Click **"Deployments"** tab
10. Click the **three dots (...)** on the latest deployment
11. Click **"Redeploy"**
12. ✅ **WAIT FOR REDEPLOY TO COMPLETE**

---

## 🎉 You're LIVE!

**Your Frontend URL**: https://your-frontend.vercel.app
**Your Backend API URL**: https://your-backend.vercel.app

Visit your frontend URL in a browser to see your website live!

---

## ❌ If Something Goes Wrong...

### Backend not working?
- Check the "Deployments" tab in your backend project
- Click on the deployment to view **logs**
- Look for red error messages
- Most common: Wrong MongoDB connection string

### Frontend shows blank page?
- Open browser DevTools (F12)
- Check Console tab for errors
- Make sure REACT_APP_API_URL is exactly your backend URL

### Can't see your URL after deployment?
- Go to your project page
- Look for a **Domain** section (usually top right)
- Your URL is listed there
