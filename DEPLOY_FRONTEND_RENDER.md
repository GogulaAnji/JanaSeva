# 🚀 Deploy Frontend to Render - Step by Step

## ✅ Backend Status: LIVE
**Backend URL:** https://janaseva-backend.onrender.com  
**Status:** ✅ Working perfectly!

---

## 📋 Frontend Deployment Steps

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com
2. You should already be logged in (you deployed the backend)

---

### Step 2: Create New Static Site
1. Click the **"New +"** button (top right)
2. Select **"Static Site"**

---

### Step 3: Connect Repository
1. You should see your repository: **GogulaAnji/JanaSeva**
2. Click **"Connect"** next to it
3. If you don't see it, click "Configure account" and grant access

---

### Step 4: Configure Build Settings

Fill in these exact values:

**Name:**
```
janaseva-frontend
```

**Root Directory:**
```
frontend
```

**Build Command:**
```
npm install && npm run build
```

**Publish Directory:**
```
frontend/dist
```

**Auto-Deploy:**
- ✅ Keep "Yes" selected (auto-deploy on git push)

---

### Step 5: Add Environment Variable

**IMPORTANT:** Click on "Advanced" to expand environment variables section

Add this variable:

**Key:**
```
VITE_API_URL
```

**Value:**
```
https://janaseva-backend.onrender.com/api
```

Click **"Add Environment Variable"** or the **"+"** button to save it.

---

### Step 6: Create Static Site

1. Review all settings one more time
2. Click **"Create Static Site"** button at the bottom

---

### Step 7: Wait for Deployment (3-5 minutes)

Render will now:
1. ✅ Clone your repository
2. ✅ Install dependencies (`npm install`)
3. ✅ Build your frontend (`npm run build`)
4. ✅ Deploy the static files

**Watch the logs** - you'll see the build progress in real-time.

---

### Step 8: Get Your Website URL

Once deployment completes (status shows "Live"):

1. You'll see your URL at the top, something like:
   ```
   https://janaseva-frontend.onrender.com
   ```

2. **Copy this URL** - this is your live website!

---

### Step 9: Update Backend CORS

**IMPORTANT:** Now that you have the frontend URL, update the backend:

1. Go back to Render Dashboard
2. Click on your **janaseva-backend** service
3. Go to **"Environment"** tab
4. Find the `FRONTEND_URL` variable
5. Update its value to your frontend URL:
   ```
   https://janaseva-frontend.onrender.com
   ```
6. Click **"Save Changes"**
7. Render will automatically redeploy the backend (takes 1-2 minutes)

---

## 🎉 Your Website is Live!

**Frontend (Website):** `https://janaseva-frontend.onrender.com`  
**Backend (API):** `https://janaseva-backend.onrender.com`

### Test It:

1. **Open the frontend URL** on any device
2. **Test on mobile** - open the same URL on your phone
3. **Try all features:**
   - Register a new account
   - Login
   - Browse Workers, Jobs, Farmers, Doctors
   - Test location detection
   - Try language switching (English/Telugu/Hindi)

---

## 📱 Share Your Website

Send this link to anyone:
```
https://janaseva-frontend.onrender.com
```

They can access it from **anywhere in the world** on **any device**! 🌍

---

## ⚠️ Important Notes

### Free Tier Behavior:
- Services sleep after **15 minutes** of inactivity
- First request after sleep takes **30-60 seconds** to wake up
- This is normal for free tier!

### If Frontend Shows Errors:
1. Check browser console (F12)
2. Verify `VITE_API_URL` is set correctly in Render
3. Make sure backend `FRONTEND_URL` is updated
4. Check Render logs for build errors

---

## 🐛 Troubleshooting

### Build Failed?
**Check Render logs for:**
- Missing dependencies
- Build errors
- Incorrect paths

**Common fixes:**
- Verify Root Directory is `frontend`
- Verify Publish Directory is `frontend/dist`
- Check if build command is correct

### Frontend Loads but API Errors?
**Solution:**
1. Verify backend is running (green status)
2. Check `VITE_API_URL` environment variable
3. Update backend `FRONTEND_URL` with frontend URL
4. Wait for backend to redeploy

### CORS Errors?
**Solution:**
1. Backend `FRONTEND_URL` must match your frontend URL exactly
2. No trailing slash in URLs
3. Use `https://` not `http://`

---

**Ready? Follow the steps above and your website will be live in 5 minutes! 🚀**
