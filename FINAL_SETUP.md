# ⚡ Quick Setup - Final Step

## ✅ What's Already Done:
- ✅ Backend tunnel running: `https://social-ghosts-marry.loca.lt`
- ✅ Frontend tunnel running: `https://honest-coats-enter.loca.lt`
- ✅ Frontend configured to use backend tunnel
- ✅ Frontend server restarted

---

## 🔧 Final Step: Update Backend CORS

### Option 1: Manual Update (Recommended)

1. **Open this file:** `C:\Users\Gogul\JanaSeva\backend\.env`

2. **Find the line with `CORS_ORIGIN` or `FRONTEND_URL`**

3. **Update it to:**
   ```
   CORS_ORIGIN=http://localhost:5173,https://honest-coats-enter.loca.lt
   ```
   
   Or if you have `FRONTEND_URL`:
   ```
   FRONTEND_URL=http://localhost:5173,https://honest-coats-enter.loca.lt
   ```

4. **Save the file**

5. **Restart backend server:**
   - Go to the terminal running backend
   - Press `Ctrl+C`
   - Run: `npm run dev`

---

### Option 2: Quick Copy-Paste

If the file doesn't have `CORS_ORIGIN` or `FRONTEND_URL`, just add this line at the end:

```
CORS_ORIGIN=http://localhost:5173,https://honest-coats-enter.loca.lt
```

---

## 🎉 After Restart - You're Done!

### Test on Mobile:

1. **Open on your mobile:** `https://honest-coats-enter.loca.lt`
2. **Click "Continue"** if prompted
3. **Test the app!** All features should work

### Test Backend API:

Open this on mobile browser:
```
https://social-ghosts-marry.loca.lt/api/health
```

You should see a JSON response!

---

## 📱 All Your URLs:

| Service | URL |
|---------|-----|
| **Frontend (Mobile)** | https://honest-coats-enter.loca.lt |
| **Backend API** | https://social-ghosts-marry.loca.lt |
| **Frontend (Local)** | http://localhost:5173 |
| **Backend (Local)** | http://localhost:5000 |

---

## 🚀 Currently Running:

You should have **4 terminals** running:
1. ✅ Backend server (`npm run dev`)
2. ✅ Frontend server (`npm run dev`)
3. ✅ Frontend tunnel (`localtunnel --port 5173`)
4. ✅ Backend tunnel (`localtunnel --port 5000`)

---

## ⚠️ Remember:

- Keep all 4 terminals running
- If you restart tunnels, URLs will change
- Update `.env` files if URLs change

---

**See `COMPLETE_MOBILE_SETUP.md` for full documentation!**
