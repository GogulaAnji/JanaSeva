import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    createCommunityService,
    getAllCommunityServices,
    getCommunityService,
    updateCommunityService,
    deleteCommunityService,
    respondToService,
    searchCommunityServices,
} from '../controllers/community.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllCommunityServices);
router.get('/search', searchCommunityServices);
router.get('/:id', getCommunityService);

// Protected routes
router.post('/', protect, createCommunityService);
router.put('/:id', protect, updateCommunityService);
router.delete('/:id', protect, deleteCommunityService);
router.post('/:id/respond', protect, respondToService);

export default router;
