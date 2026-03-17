# DigitalNewtaManager - Deployment Guide

## Deployment Status

### ✅ GitHub Setup Complete

- **Repository**: https://github.com/Khushdil380/digitalnewtamanager
- **Branch**: main
- **Vercel Configuration Files**: Added to both frontend and backend

## Vercel Deployment Instructions

### Backend Deployment (Node.js API)

1. Visit https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import the GitHub repository: **digitalnewtamanager**
4. Set **Root Directory** to: `backend`
5. Add these **Environment Variables**:
   ```
   MONGODB_URI = mongodb+srv://khushdilansari345_db_user:aYJqycDOzEpuN0pW@digitalnewtamanager-ser.sycrcfe.mongodb.net/?appName=digitalnewtamanager-server
   JWT_SECRET = your-secure-random-string-here
   EMAIL_USER = helpdigitalnewtamanager@gmail.com
   EMAIL_PASSWORD = aYJqycDOzEpuN0pW
   CORS_ORIGIN = (add frontend URL after deploying frontend)
   PORT = 3001
   ```
6. Click **Deploy**
7. Copy the deployment URL (e.g., `https://backend-abc123.vercel.app`)

### Frontend Deployment (React Web App)

1. In Vercel dashboard, click "Add New" → "Project" again
2. Import the same GitHub repository
3. Set **Root Directory** to: `frontend`
4. Add these **Environment Variables**:
   ```
   REACT_APP_API_URL = https://backend-abc123.vercel.app
   REACT_APP_API_BASE_URL = https://backend-abc123.vercel.app
   ```
5. Click **Deploy**
6. Copy the deployment URL

### Update Backend CORS (Final Step)

1. Go to Backend project settings → Environment Variables
2. Update `CORS_ORIGIN` to your frontend URL
3. Click "Redeploy" to apply changes

## Project Structure for Deployment

```
digital-newta-manager/
├── backend/                 (Node.js Express API)
│   ├── vercel.json         (Deployment config)
│   ├── package.json
│   ├── server.js
│   └── ...
├── frontend/               (React Web App)
│   ├── vercel.json         (Deployment config)
│   ├── package.json
│   ├── src/
│   └── ...
└── .gitignore
```

## Testing Your Deployment

1. Visit your frontend URL
2. Test the landing page and theme switcher
3. Click login and verify the authentication modal appears
4. Check browser console for API errors (open DevTools with F12)
5. Check Vercel logs if there are issues:
   - Backend logs: Vercel Dashboard → your backend project → Deployments → View Logs
   - Frontend logs: Same process for frontend

## Troubleshooting

### Backend API Not Responding

- Check MongoDB connection string is correct
- Verify environment variables are set
- Check Vercel logs for error messages
- Ensure CORS_ORIGIN includes the frontend URL

### Frontend Can't Connect to Backend

- Check that REACT_APP_API_URL is set correctly
- Verify it includes the full URL (https://...)
- Check browser console for CORS errors
- Ensure backend CORS_ORIGIN includes frontend domain

### Email Not Sending

- Verify EMAIL_USER and EMAIL_PASSWORD are correct
- Check if Gmail has 2FA enabled (you may need app password)
- Check backend logs for email service errors

## Important URLs to Track

- **GitHub Repository**: https://github.com/Khushdil380/digitalnewtamanager
- **Backend URL**: (will be provided by Vercel after deployment)
- **Frontend URL**: (will be provided by Vercel after deployment)
- **MongoDB Connection**: Configured and tested

## Next Steps

After successful deployment and verification:

1. Test the complete authentication flow
2. Begin Phase 3 implementation (Wedding Management)
3. Continue with Phase 4 (Guest Management)
4. Then Phase 5 (Attendance & Contribution Tracking)
