import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    createJob,
    getAllJobs,
    getJob,
    updateJob,
    deleteJob,
    searchJobs,
    applyForJob,
    getMyJobs,
    getMyApplications,
    updateApplicationStatus,
} from '../controllers/job.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/search', searchJobs);
router.get('/:id', getJob);

// Protected routes
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);
router.post('/:id/apply', protect, applyForJob);
router.get('/my/posted', protect, getMyJobs);
router.get('/my/applications', protect, getMyApplications);
router.put('/:jobId/applications/:applicationId', protect, updateApplicationStatus);

export default router;
