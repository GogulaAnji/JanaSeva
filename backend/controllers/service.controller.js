import ServicePost from '../models/ServicePost.js';
import Notification from '../models/Notification.js';

/**
 * Service Controller
 * Handles all service posting and management operations
 */

// @desc    Create new service post
// @route   POST /api/services
// @access  Private (Worker only)
export const createServicePost = async (req, res) => {
    try {
        const {
            serviceName,
            category,
            images,
            pricing,
            description,
            serviceArea,
            availability,
            skills,
            experience,
            includes,
            hasOwnTools,
        } = req.body;

        const servicePost = await ServicePost.create({
            worker: req.user._id,
            serviceName,
            category,
            images,
            pricing,
            description,
            serviceArea,
            availability,
            skills,
            experience,
            includes,
            hasOwnTools,
        });

        await servicePost.populate('worker', 'name phone location');

        res.status(201).json({
            success: true,
            message: 'Service posted successfully',
            servicePost,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all service posts with filters
// @route   GET /api/services
// @access  Public
export const getAllServices = async (req, res) => {
    try {
        const {
            category,
            district,
            minPrice,
            maxPrice,
            search,
            sort = '-createdAt',
            page = 1,
            limit = 20,
        } = req.query;

        const query = { status: 'active', isAvailable: true };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (district) {
            query['serviceArea.districts'] = new RegExp(district, 'i');
        }

        if (search) {
            query.$text = { $search: search };
        }

        const skip = (page - 1) * limit;
        const total = await ServicePost.countDocuments(query);

        const servicePosts = await ServicePost.find(query)
            .populate('worker', 'name phone location rating')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        res.json({
            success: true,
            count: servicePosts.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            servicePosts,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single service post
// @route   GET /api/services/:id
// @access  Public
export const getServicePost = async (req, res) => {
    try {
        const servicePost = await ServicePost.findById(req.params.id)
            .populate('worker', 'name phone location rating')
            .populate('interests.user', 'name phone');

        if (!servicePost) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        await servicePost.incrementViews();

        res.json({
            success: true,
            servicePost,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update service post
// @route   PUT /api/services/:id
// @access  Private (Worker - own posts only)
export const updateServicePost = async (req, res) => {
    try {
        let servicePost = await ServicePost.findById(req.params.id);

        if (!servicePost) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        if (servicePost.worker.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this service',
            });
        }

        servicePost = await ServicePost.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('worker', 'name phone location');

        res.json({
            success: true,
            message: 'Service updated successfully',
            servicePost,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete service post
// @route   DELETE /api/services/:id
// @access  Private (Worker - own posts only)
export const deleteServicePost = async (req, res) => {
    try {
        const servicePost = await ServicePost.findById(req.params.id);

        if (!servicePost) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        if (servicePost.worker.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this service',
            });
        }

        servicePost.status = 'deleted';
        servicePost.isAvailable = false;
        await servicePost.save();

        res.json({
            success: true,
            message: 'Service deleted successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Express interest in a service
// @route   POST /api/services/:id/interest
// @access  Private
export const expressInterest = async (req, res) => {
    try {
        const { message } = req.body;
        const servicePost = await ServicePost.findById(req.params.id)
            .populate('worker', 'name phone');

        if (!servicePost) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        await servicePost.addInterest(req.user._id, message);

        // Create notification for worker
        await Notification.createNotification({
            user: servicePost.worker._id,
            type: 'new_interest',
            title: 'New Service Inquiry!',
            message: `${req.user.name} is interested in your ${servicePost.serviceName}`,
            relatedTo: {
                model: 'ServicePost',
                id: servicePost._id,
            },
            actionUrl: `/services/${servicePost._id}`,
        });

        res.json({
            success: true,
            message: 'Interest expressed successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get worker's own service posts
// @route   GET /api/services/my/services
// @access  Private (Worker)
export const getMyServices = async (req, res) => {
    try {
        const servicePosts = await ServicePost.find({
            worker: req.user._id,
            status: { $ne: 'deleted' },
        }).sort('-createdAt');

        res.json({
            success: true,
            count: servicePosts.length,
            servicePosts,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Toggle service availability
// @route   PATCH /api/services/:id/toggle-availability
// @access  Private (Worker - own posts only)
export const toggleAvailability = async (req, res) => {
    try {
        const servicePost = await ServicePost.findById(req.params.id);

        if (!servicePost) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        if (servicePost.worker.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        servicePost.isAvailable = !servicePost.isAvailable;
        await servicePost.save();

        res.json({
            success: true,
            message: `Service marked as ${servicePost.isAvailable ? 'available' : 'unavailable'}`,
            isAvailable: servicePost.isAvailable,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
