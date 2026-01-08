import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    verifyProfile,
    getReports,
    moderateContent,
} from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/verify/:type/:id', verifyProfile);
router.get('/reports', getReports);
router.put('/moderate/:type/:id', moderateContent);

export default router;
