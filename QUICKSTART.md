# 🚀 Quick Start Guide - JanaSeva

## Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm

## 1️⃣ Install Dependencies

### Backend:
```bash
cd backend
npm install
```

### Frontend:
```bash
cd frontend
npm install
```

## 2️⃣ Configure Environment

### Backend (.env):
Already configured in `backend/.env`

### Frontend (.env):
Already configured in `frontend/.env`

## 3️⃣ Start MongoDB

### Option A: Local MongoDB
```bash
mongod
```

### Option B: MongoDB Atlas
Update `backend/.env` with your Atlas connection string

## 4️⃣ Run the Application

### Terminal 1 - Start Backend:
```bash
cd backend
npm run dev
```

Backend will run on: **http://localhost:5000**

### Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```

Frontend will run on: **http://localhost:5173**

## 5️⃣ Access the Application

Open your browser and visit:
**http://localhost:5173**

## 6️⃣ Test the Application

1. **Register** a new account
2. **Login** with your credentials
3. **Explore** all features
4. **Test** different user roles

## 📝 Default Test Accounts

You can create test accounts with these roles:
- Worker (electrician, plumber, etc.)
- Doctor (healthcare professional)
- Farmer (agricultural producer)
- Employer (job poster, common user)

## 🔍 API Testing

### Health Check:
```bash
curl http://localhost:5000/api/health
```

### Register User:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "password123",
    "role": "employer"
  }'
```

## ⚡ Quick Commands

### Backend:
```bash
# Development
npm run dev

# Production
npm start
```

### Frontend:
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Troubleshooting

### Issue: Port already in use
**Solution:** Change PORT in `backend/.env`

### Issue: MongoDB connection failed
**Solution:** 
- Check if MongoDB is running
- Verify connection string in `.env`

### Issue: Frontend can't connect to backend
**Solution:**
- Ensure backend is running
- Check `VITE_API_URL` in `frontend/.env`

## 📚 Next Steps

1. Read `README.md` for detailed documentation
2. Check `DEPLOYMENT.md` for deployment instructions
3. Review `PROJECT_SUMMARY.md` for project overview

## 🎉 You're Ready!

Start building amazing features on JanaSeva! 🌱

---

**Need Help?** Check the documentation or create an issue.
