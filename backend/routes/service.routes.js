import express from 'express';
import {
    createServicePost,
    getAllServices,
    getServicePost,
    updateServicePost,
    deleteServicePost,
    expressInterest,
    getMyServices,
    toggleAvailability,
} from '../controllers/service.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadProduceImages, handleUploadError } from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllServices);
router.get('/:id', getServicePost);

// Protected routes
router.use(protect);

// Image upload route (for service photos)
router.post('/upload-images', uploadProduceImages, handleUploadError, (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images uploaded',
            });
        }

        const imageUrls = req.files.map(file => `/uploads/produce/${file.filename}`);

        res.json({
            success: true,
            message: 'Images uploaded successfully',
            images: imageUrls,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

router.post('/', createServicePost);
router.get('/my/services', getMyServices);
router.put('/:id', updateServicePost);
router.delete('/:id', deleteServicePost);
router.post('/:id/interest', expressInterest);
router.patch('/:id/toggle-availability', toggleAvailability);

export default router;
