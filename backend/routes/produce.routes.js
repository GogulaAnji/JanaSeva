import express from 'express';
import {
    createProducePost,
    getAllProduce,
    getProducePost,
    updateProducePost,
    deleteProducePost,
    expressInterest,
    getMyProducts,
    toggleAvailability,
} from '../controllers/produce.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadProduceImages, handleUploadError } from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProduce);
router.get('/:id', getProducePost);

// Protected routes
router.use(protect);

// Image upload route
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

router.post('/', createProducePost);
router.get('/my/products', getMyProducts);
router.put('/:id', updateProducePost);
router.delete('/:id', deleteProducePost);
router.post('/:id/interest', expressInterest);
router.patch('/:id/toggle-availability', toggleAvailability);

export default router;
