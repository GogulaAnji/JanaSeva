# 🌐 Complete Mobile Access Setup - Both Frontend & Backend

## ✅ Your Public URLs

**Frontend (Website):**
```
https://honest-coats-enter.loca.lt
```

**Backend (API):**
```
https://social-ghosts-marry.loca.lt
```

Both are now accessible from **anywhere** - Android, iOS, Windows, Mac, any device with internet!

---

## 🔧 Configuration Steps

### Step 1: Update Backend CORS

**File:** `C:\Users\Gogul\JanaSeva\backend\.env`

Add or update the `CORS_ORIGIN` or `FRONTEND_URL` line:
```env
CORS_ORIGIN=http://localhost:5173,https://honest-coats-enter.loca.lt
```

Or:
```env
FRONTEND_URL=http://localhost:5173,https://honest-coats-enter.loca.lt
```

**Then restart the backend:**
```powershell
# Press Ctrl+C in backend terminal, then:
cd C:\Users\Gogul\JanaSeva\backend
npm run dev
```

---

### Step 2: Update Frontend API URL

**File:** `C:\Users\Gogul\JanaSeva\frontend\.env`

Create this file if it doesn't exist, and add:
```env
VITE_API_URL=https://social-ghosts-marry.loca.lt/api
```

**Then restart the frontend:**
```powershell
# Press Ctrl+C in frontend terminal, then:
cd C:\Users\Gogul\JanaSeva\frontend
npm run dev
```

---

## 🚀 Currently Running Services

| Service | Local URL | Public URL |
|---------|-----------|------------|
| Backend | http://localhost:5000 | https://social-ghosts-marry.loca.lt |
| Frontend | http://localhost:5173 | https://honest-coats-enter.loca.lt |

---

## 📱 How to Test on Mobile

### Option 1: Test from Anywhere (Recommended)
1. Open **https://honest-coats-enter.loca.lt** on your mobile
2. Click "Continue" if prompted
3. The app will load and connect to the backend automatically!

### Option 2: Test Locally (Same WiFi)
1. Find your computer's IP: Run `ipconfig` in PowerShell
2. Open **http://YOUR_IP:5173** on mobile (same WiFi only)

---

## 🧪 Test the Connection

### Test Backend API:
Open this URL in your mobile browser:
```
https://social-ghosts-marry.loca.lt/api/health
```

You should see a JSON response like:
```json
{
  "status": "ok",
  "message": "JanaSeva API is running"
}
```

### Test Frontend:
Open this URL in your mobile browser:
```
https://honest-coats-enter.loca.lt
```

You should see the JanaSeva homepage!

---

## ✅ Complete Checklist

- [ ] Backend `.env` updated with frontend tunnel URL
- [ ] Backend restarted
- [ ] Frontend `.env` created with backend tunnel URL
- [ ] Frontend restarted
- [ ] Tested backend API on mobile (health endpoint)
- [ ] Tested frontend on mobile
- [ ] Tested login/registration on mobile
- [ ] Tested location features on mobile

---

## 🔄 Keep All Services Running

You need **4 terminals** running simultaneously:

1. **Terminal 1 - Backend Server:**
   ```powershell
   cd C:\Users\Gogul\JanaSeva\backend
   npm run dev
   ```

2. **Terminal 2 - Frontend Server:**
   ```powershell
   cd C:\Users\Gogul\JanaSeva\frontend
   npm run dev
   ```

3. **Terminal 3 - Frontend Tunnel:**
   ```powershell
   npx localtunnel --port 5173
   ```

4. **Terminal 4 - Backend Tunnel:**
   ```powershell
   npx localtunnel --port 5000
   ```

---

## 🌍 Share Your App

Send these links to anyone:

**For Users:**
```
https://honest-coats-enter.loca.lt
```

**For Developers (API):**
```
https://social-ghosts-marry.loca.lt/api
```

---

## ⚠️ Important Notes

### Tunnel URLs Change on Restart
- If you stop and restart localtunnel, you'll get **new URLs**
- You'll need to update `.env` files with the new URLs
- Remember to restart both servers after updating

### Free Tier Limitations
- "Click to Continue" page on first visit (localtunnel)
- URLs expire when you close the tunnel
- Perfect for testing and demos!

### For Permanent URLs
Use **ngrok** with a paid plan, or deploy to **Render/Vercel** (see `DEPLOYMENT.md`)

---

## 🐛 Troubleshooting

### Issue: "Network Error" on mobile
**Solution:**
1. Check if backend tunnel is running
2. Verify `VITE_API_URL` in frontend `.env` points to backend tunnel
3. Restart frontend after updating `.env`

### Issue: "CORS Error"
**Solution:**
1. Check `CORS_ORIGIN` in backend `.env` includes frontend tunnel URL
2. Restart backend after updating `.env`

### Issue: Backend tunnel not working
**Solution:**
1. Check if backend server is running on localhost:5000
2. Restart the tunnel: `npx localtunnel --port 5000`
3. Update frontend `.env` with new tunnel URL

### Issue: Features not working on mobile
**Solution:**
1. Open browser console on mobile (Chrome Remote Debugging)
2. Check for JavaScript errors
3. Verify API calls are going to the correct backend URL

---

## 📊 Architecture Diagram

```
Mobile Device (Anywhere) ──→ Frontend Tunnel ──→ Local Frontend (5173)
                                                         ↓
                                                    API Calls
                                                         ↓
Mobile Device (Anywhere) ──→ Backend Tunnel ──→ Local Backend (5000)
                                                         ↓
                                                    MongoDB
```

---

## 🎉 You're All Set!

Your JanaSeva app is now fully accessible from:
- ✅ Android phones
- ✅ iPhones
- ✅ Windows computers
- ✅ Mac computers
- ✅ Any device with internet access

Test all features and enjoy! 🚀📱
