import express from 'express';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Placeholder for user-specific routes
router.get('/profile/:id', async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User profile endpoint',
    });
});

export default router;
