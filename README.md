# JanaSeva - People Service Platform

## 🌱 Complete Production-Ready Platform

JanaSeva is a comprehensive, full-stack web platform connecting employment, healthcare, agriculture, and community services from village to city across India.

## 🚀 Features

### ✅ Complete Backend (Node.js + Express + MongoDB)
- JWT Authentication with role-based access control
- 6 User Roles: Doctor, Farmer, Worker, Employer, Admin
- RESTful API with 50+ endpoints
- Real-time features with Socket.IO
- AI integration ready (OpenAI API)
- Production-grade security (Helmet, Rate Limiting, CORS)
- Comprehensive data models for all modules

### ✅ Complete Frontend (Vite + React)
- Modern, responsive UI with stunning design
- React Router for navigation
- Context API for state management
- Authentication flow
- Role-based dashboards
- Mobile-first responsive design

### 📦 Modules Implemented

1. **Employment & Workers** - Local service providers (electricians, plumbers, etc.)
2. **Healthcare** - Doctor profiles, appointments, consultations
3. **Agriculture** - Farmer marketplace, produce listings
4. **Jobs Platform** - Job posting, applications, matching
5. **Community Services** - Blood donation, emergency help, lost & found
6. **AI Integration** - Job matching, resume analysis, health guidance

## 📁 Project Structure

```
JanaSeva/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── WorkerProfile.js
│   │   ├── DoctorProfile.js
│   │   ├── FarmerProfile.js
│   │   ├── Job.js
│   │   ├── Appointment.js
│   │   └── CommunityService.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── worker.controller.js
│   │   ├── doctor.controller.js
│   │   ├── farmer.controller.js
│   │   ├── job.controller.js
│   │   ├── appointment.controller.js
│   │   ├── community.controller.js
│   │   ├── ai.controller.js
│   │   └── admin.controller.js
│   ├── routes/
│   │   └── [all route files]
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── [all page files]
    │   ├── App.jsx
    │   └── index.css
    ├── .env
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/janaseva
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key (optional)
```

4. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🎯 Usage

1. **Register** - Create an account with your role (Worker, Doctor, Farmer, Employer)
2. **Login** - Access your personalized dashboard
3. **Explore** - Browse workers, doctors, farmers, jobs, and community services
4. **Connect** - Book appointments, apply for jobs, contact service providers
5. **Manage** - Update your profile, manage listings, track applications

## 🔐 User Roles

- **Worker** - Service providers (electrician, plumber, etc.)
- **Doctor** - Healthcare professionals
- **Farmer** - Agricultural producers
- **Employer** - Job posters and common users
- **Admin** - Platform administrators

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile

### Workers
- `GET /api/workers` - Get all workers
- `GET /api/workers/search` - Search workers
- `POST /api/workers/profile` - Create worker profile
- `PUT /api/workers/profile` - Update worker profile

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/search` - Search doctors
- `POST /api/doctors/profile` - Create doctor profile

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job posting
- `POST /api/jobs/:id/apply` - Apply for job

### Community
- `GET /api/community` - Get community services
- `POST /api/community` - Create service request

[And many more...]

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive grid layouts
- Card-based UI components
- Mobile-first design
- Professional color scheme (Green + Blue)
- Custom scrollbar styling

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- Rate limiting
- CORS protection
- Helmet security headers

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Touch-friendly interfaces

## 🚀 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Set build command: `npm run build`
4. Set environment variables
5. Deploy

## 📝 Environment Variables

### Backend
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d
OPENAI_API_KEY=your-openai-key
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🤝 Contributing

This is a production-ready platform. For contributions:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Built with ❤️ for the people of India

## 🙏 Acknowledgments

- React Team
- Node.js Community
- MongoDB Team
- All open-source contributors

---

**JanaSeva** - Empowering Communities, Connecting Lives 🌱
