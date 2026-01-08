import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
    createDoctorProfile,
    getDoctorProfile,
    updateDoctorProfile,
    getAllDoctors,
    searchDoctors,
    addReview,
    updateAvailability,
    getSchedule,
} from '../controllers/doctor.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllDoctors);
router.get('/search', searchDoctors);
router.get('/:id', getDoctorProfile);
router.get('/:id/schedule', getSchedule);

// Protected routes - Doctor only
router.post('/profile', protect, authorize('doctor'), createDoctorProfile);
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.put('/availability', protect, authorize('doctor'), updateAvailability);

// Protected routes - Any authenticated user can review
router.post('/:id/review', protect, addReview);

export default router;
