# 📱 Mobile Testing Guide - Access from Anywhere

Test your JanaSeva website on mobile devices from different locations using these methods:

---

## 🚀 Option 1: Using ngrok (Recommended - Easiest!)

### Step 1: Install ngrok
1. Download from: https://ngrok.com/download
2. Extract the zip file
3. Sign up for free account at: https://dashboard.ngrok.com/signup
4. Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken

### Step 2: Setup ngrok
```powershell
# Navigate to where you extracted ngrok
cd path\to\ngrok

# Add your auth token (one-time setup)
.\ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### Step 3: Expose Your Frontend
```powershell
# In a new terminal, run:
.\ngrok http 5173
```

You'll get a URL like: `https://abc123.ngrok-free.app`

### Step 4: Update Backend CORS
Open `C:\Users\Gogul\JanaSeva\backend\.env` and add your ngrok URL to CORS_ORIGIN:
```
CORS_ORIGIN=http://localhost:5173,https://abc123.ngrok-free.app
```

### Step 5: Restart Backend
Stop and restart your backend server to apply CORS changes.

### Step 6: Access on Mobile! 🎉
Open the ngrok URL on any mobile device, anywhere in the world!

---

## 🌐 Option 2: Using LocalTunnel (No signup required!)

### Step 1: Install LocalTunnel
```powershell
npm install -g localtunnel
```

### Step 2: Expose Your Frontend
```powershell
lt --port 5173
```

You'll get a URL like: `https://funny-name-12.loca.lt`

### Step 3: Update Backend CORS
Same as ngrok - add the localtunnel URL to `CORS_ORIGIN` in backend `.env`

### Step 4: Access on Mobile
Open the URL on your mobile. First time, you'll see a page asking to continue - click "Continue"

---

## 📡 Option 3: Same WiFi Network (Local Testing Only)

### Step 1: Find Your Computer's IP Address
```powershell
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (e.g., `192.168.1.100`)

### Step 2: Update Vite Config
Edit `C:\Users\Gogul\JanaSeva\frontend\vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
```

### Step 3: Update Backend CORS
Add your IP to CORS_ORIGIN:
```
CORS_ORIGIN=http://localhost:5173,http://192.168.1.100:5173
```

### Step 4: Restart Servers
Restart both frontend and backend servers.

### Step 5: Access on Mobile
On your mobile (connected to SAME WiFi):
Open: `http://192.168.1.100:5173`

⚠️ **Limitation**: Only works when mobile is on the same WiFi network!

---

## 🎯 Recommended Approach

**For testing from different locations (4G, different WiFi, etc.):**
✅ Use **ngrok** (Option 1) - Most reliable and secure

**For quick local testing on same WiFi:**
✅ Use **Same WiFi Network** (Option 3) - Fastest setup

---

## 🔧 Complete Setup Example with ngrok

### Terminal 1 - Backend:
```powershell
cd C:\Users\Gogul\JanaSeva\backend
npm run dev
```

### Terminal 2 - Frontend:
```powershell
cd C:\Users\Gogul\JanaSeva\frontend
npm run dev
```

### Terminal 3 - ngrok:
```powershell
cd path\to\ngrok
.\ngrok http 5173
```

### Update backend\.env:
```
CORS_ORIGIN=http://localhost:5173,https://YOUR-NGROK-URL.ngrok-free.app
```

### Restart backend (Ctrl+C in Terminal 1, then):
```powershell
npm run dev
```

---

## 📱 Testing Checklist

- [ ] Backend running on localhost:5000
- [ ] Frontend running on localhost:5173
- [ ] ngrok/localtunnel running and showing public URL
- [ ] CORS_ORIGIN updated in backend/.env
- [ ] Backend restarted after CORS update
- [ ] Mobile can access the public URL
- [ ] All features working (location, language, etc.)

---

## 🐛 Troubleshooting

### Issue: "CORS Error" on mobile
**Solution:** 
- Ensure your ngrok URL is added to `CORS_ORIGIN` in backend `.env`
- Restart backend server after updating `.env`

### Issue: "Cannot connect to backend"
**Solution:**
- Check if backend is running
- Verify backend is accessible at `http://localhost:5000`
- Check browser console for errors

### Issue: ngrok URL shows "Visit Site" button
**Solution:**
- This is normal for free ngrok accounts
- Just click "Visit Site" to continue
- Upgrade to paid plan to remove this

### Issue: LocalTunnel connection refused
**Solution:**
- Try a different subdomain: `lt --port 5173 --subdomain myapp`
- Or just restart localtunnel

---

## 💡 Pro Tips

1. **ngrok URLs change** every time you restart ngrok (free plan)
   - Remember to update CORS_ORIGIN each time
   - Or upgrade to paid plan for permanent URLs

2. **Share the URL** with anyone to test
   - Send ngrok URL to friends/testers
   - They can access from anywhere!

3. **Monitor traffic** in ngrok dashboard
   - See all requests in real-time
   - Great for debugging

4. **Use HTTPS** automatically
   - ngrok provides HTTPS for free
   - No SSL certificate needed!

---

## 🎉 You're Ready to Test on Mobile!

Now you can test your JanaSeva app on any mobile device, from anywhere in the world! 🌍📱
