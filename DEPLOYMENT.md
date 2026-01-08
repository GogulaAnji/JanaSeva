# JanaSeva Platform - Deployment Guide

## 🚀 Deploy to Render (Access from Anywhere!)

Follow these simple steps to deploy your app online:

---

## Step 1: Create MongoDB Atlas Database (5 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free
3. Create a new cluster (Free tier - M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. **Save this connection string** - you'll need it later!

---

## Step 2: Push Code to GitHub (5 minutes)

### If you don't have Git installed:
Download from: https://git-scm.com/downloads

### Initialize and Push:

```powershell
# Navigate to your project
cd c:\Users\Gogul\JanaSeva

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - JanaSeva Platform"

# Create repository on GitHub:
# 1. Go to https://github.com/new
# 2. Name it: JanaSeva
# 3. Click "Create repository"
# 4. Copy the commands shown and run them:

git remote add origin https://github.com/YOUR_USERNAME/JanaSeva.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Render (10 minutes)

### A. Sign Up for Render

1. Go to: https://render.com/
2. Click "Get Started for Free"
3. Sign up with GitHub (easiest option)

### B. Deploy Using Blueprint

1. Click "New" → "Blueprint"
2. Connect your GitHub repository (JanaSeva)
3. Render will detect `render.yaml` automatically
4. Click "Apply"

### C. Configure Environment Variables

Render will ask for these:

**For Backend Service:**
- `MONGODB_URI`: Paste your MongoDB Atlas connection string from Step 1
- `JWT_SECRET`: Automatically generated ✅
- `CORS_ORIGIN`: `https://janaseva.onrender.com` (already set)

**For Frontend Service:**
- `VITE_API_URL`: `https://janaseva-backend.onrender.com` (already set)

### D. Deploy!

1. Click "Create Services"
2. Wait 5-10 minutes for deployment
3. You'll get two URLs:
   - **Frontend**: `https://janaseva.onrender.com`
   - **Backend**: `https://janaseva-backend.onrender.com`

---

## Step 4: Test Your Live App! 🎉

1. Open the frontend URL on any device
2. Test from your mobile (any WiFi, 4G, anywhere!)
3. Features that will work:
   - ✅ Multi-language (English/Telugu/Hindi)
   - ✅ Location detection
   - ✅ Workers search
   - ✅ All pages and features

---

## 🔄 Auto-Deploy on Updates

Every time you push code to GitHub:
```powershell
git add .
git commit -m "Your update message"
git push
```

Render will automatically redeploy! 🚀

---

## 📱 Share Your App

Send this link to anyone:
```
https://janaseva.onrender.com
```

They can access it from:
- 📱 Mobile (any network)
- 💻 Computer (anywhere in the world)
- 🌍 Any device with internet

---

## ⚠️ Important Notes

### Free Tier Limitations:
- Backend sleeps after 15 min of inactivity
- First request after sleep takes 30-60 seconds
- Perfect for testing and demos!

### To Keep Backend Always Active (Optional):
- Upgrade to paid plan ($7/month)
- Or use a cron job to ping it every 10 minutes

---

## 🆘 Troubleshooting

### Backend not connecting?
- Check MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)
- Verify `MONGODB_URI` is correct in Render dashboard

### Frontend can't reach backend?
- Check `VITE_API_URL` in frontend environment variables
- Should be: `https://janaseva-backend.onrender.com`

### Build failing?
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`

---

## 📞 Need Help?

Check Render logs:
1. Go to Render Dashboard
2. Click on your service
3. Click "Logs" tab
4. See what went wrong

---

## ✅ Quick Checklist

- [ ] MongoDB Atlas database created
- [ ] Connection string saved
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Blueprint deployed
- [ ] Environment variables configured
- [ ] Both services running
- [ ] Tested on mobile

---

**That's it! Your app is now live and accessible from anywhere! 🎊**
