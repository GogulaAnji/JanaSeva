import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
    createWorkerProfile,
    getWorkerProfile,
    updateWorkerProfile,
    getAllWorkers,
    searchWorkers,
    addReview,
    updateAvailability,
} from '../controllers/worker.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllWorkers);
router.get('/search', searchWorkers);
router.get('/:id', getWorkerProfile);

// Protected routes - Worker only
router.post('/profile', protect, authorize('worker'), createWorkerProfile);
router.put('/profile', protect, authorize('worker'), updateWorkerProfile);
router.put('/availability', protect, authorize('worker'), updateAvailability);

// Protected routes - Any authenticated user can review
router.post('/:id/review', protect, addReview);

export default router;
