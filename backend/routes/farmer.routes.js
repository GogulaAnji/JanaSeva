import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
    createFarmerProfile,
    getFarmerProfile,
    updateFarmerProfile,
    getAllFarmers,
    addProduceListing,
    updateProduceListing,
    deleteProduceListing,
    searchProduce,
    addReview,
} from '../controllers/farmer.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllFarmers);
router.get('/produce/search', searchProduce);
router.get('/:id', getFarmerProfile);

// Protected routes - Farmer only
router.post('/profile', protect, authorize('farmer'), createFarmerProfile);
router.put('/profile', protect, authorize('farmer'), updateFarmerProfile);
router.post('/produce', protect, authorize('farmer'), addProduceListing);
router.put('/produce/:produceId', protect, authorize('farmer'), updateProduceListing);
router.delete('/produce/:produceId', protect, authorize('farmer'), deleteProduceListing);

// Protected routes - Any authenticated user can review
router.post('/:id/review', protect, addReview);

export default router;
