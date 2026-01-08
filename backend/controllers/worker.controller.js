import WorkerProfile from '../models/WorkerProfile.js';
import User from '../models/User.js';

/**
 * @desc    Create worker profile
 * @route   POST /api/workers/profile
 * @access  Private (Worker only)
 */
export const createWorkerProfile = async (req, res) => {
    try {
        // Check if profile already exists
        const existingProfile = await WorkerProfile.findOne({ user: req.user.id });

        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: 'Worker profile already exists',
            });
        }

        const profile = await WorkerProfile.create({
            user: req.user.id,
            ...req.body,
        });

        res.status(201).json({
            success: true,
            message: 'Worker profile created successfully',
            profile,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create worker profile',
            error: error.message,
        });
    }
};

/**
 * @desc    Get worker profile
 * @route   GET /api/workers/:id
 * @access  Public
 */
export const getWorkerProfile = async (req, res) => {
    try {
        const profile = await WorkerProfile.findOne({ user: req.params.id })
            .populate('user', 'name email phone location rating profilePicture');

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Worker profile not found',
            });
        }

        res.status(200).json({
            success: true,
            profile,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get worker profile',
            error: error.message,
        });
    }
};

/**
 * @desc    Update worker profile
 * @route   PUT /api/workers/profile
 * @access  Private (Worker only)
 */
export const updateWorkerProfile = async (req, res) => {
    try {
        const profile = await WorkerProfile.findOneAndUpdate(
            { user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Worker profile not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profile,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message,
        });
    }
};

/**
 * @desc    Get all workers
 * @route   GET /api/workers
 * @access  Public
 */
export const getAllWorkers = async (req, res) => {
    try {
        const { page = 1, limit = 20, skillCategory, availability } = req.query;

        const query = {};
        if (skillCategory) query.skillCategory = skillCategory;
        if (availability) query.availability = availability;

        const workers = await WorkerProfile.find(query)
            .populate('user', 'name phone location rating profilePicture')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await WorkerProfile.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            workers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get workers',
            error: error.message,
        });
    }
};

/**
 * @desc    Search workers
 * @route   GET /api/workers/search
 * @access  Public
 */
export const searchWorkers = async (req, res) => {
    try {
        const { skill, location, minPay, maxPay, availability } = req.query;

        const query = {};

        if (skill) {
            query.$or = [
                { skillCategory: new RegExp(skill, 'i') },
                { skills: new RegExp(skill, 'i') },
            ];
        }

        if (availability) query.availability = availability;

        if (minPay || maxPay) {
            query['expectedPay.amount'] = {};
            if (minPay) query['expectedPay.amount'].$gte = Number(minPay);
            if (maxPay) query['expectedPay.amount'].$lte = Number(maxPay);
        }

        let workers = await WorkerProfile.find(query)
            .populate('user', 'name phone location rating profilePicture');

        // Filter by location if provided
        if (location) {
            workers = workers.filter(worker => {
                const userLocation = worker.user.location;
                return (
                    userLocation.district?.toLowerCase().includes(location.toLowerCase()) ||
                    userLocation.state?.toLowerCase().includes(location.toLowerCase()) ||
                    userLocation.village?.toLowerCase().includes(location.toLowerCase())
                );
            });
        }

        res.status(200).json({
            success: true,
            count: workers.length,
            workers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message,
        });
    }
};

/**
 * @desc    Add review to worker
 * @route   POST /api/workers/:id/review
 * @access  Private
 */
export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const profile = await WorkerProfile.findOne({ user: req.params.id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Worker not found',
            });
        }

        // Check if user already reviewed
        const alreadyReviewed = profile.reviews.find(
            r => r.user.toString() === req.user.id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this worker',
            });
        }

        profile.reviews.push({
            user: req.user.id,
            rating,
            comment,
        });

        await profile.save();

        // Update user rating
        const avgRating = profile.calculateAverageRating();
        await User.findByIdAndUpdate(req.params.id, {
            rating: avgRating,
            reviewCount: profile.reviews.length,
        });

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add review',
            error: error.message,
        });
    }
};

/**
 * @desc    Update availability
 * @route   PUT /api/workers/availability
 * @access  Private (Worker only)
 */
export const updateAvailability = async (req, res) => {
    try {
        const { availability } = req.body;

        const profile = await WorkerProfile.findOneAndUpdate(
            { user: req.user.id },
            { availability },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Availability updated',
            availability: profile.availability,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update availability',
            error: error.message,
        });
    }
};
