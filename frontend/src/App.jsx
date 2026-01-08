import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LocationProvider } from './context/LocationContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workers from './pages/Workers';
import WorkerProfile from './pages/WorkerProfile';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Farmers from './pages/Farmers';
import FarmerProfile from './pages/FarmerProfile';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Community from './pages/Community';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';

function App() {
  return (
    <LanguageProvider>
      <LocationProvider>
        <AuthProvider>
          <Router>
            <div className="app">
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Workers */}
                  <Route path="/workers" element={<Workers />} />
                  <Route path="/workers/:id" element={<WorkerProfile />} />

                  {/* Doctors */}
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/doctors/:id" element={<DoctorProfile />} />

                  {/* Farmers */}
                  <Route path="/farmers" element={<Farmers />} />
                  <Route path="/farmers/:id" element={<FarmerProfile />} />

                  {/* Jobs */}
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />

                  {/* Community */}
                  <Route path="/community" element={<Community />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </Router>
        </AuthProvider>
      </LocationProvider>
    </LanguageProvider>
  );
}

export default App;
