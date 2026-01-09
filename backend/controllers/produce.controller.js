import ProducePost from '../models/ProducePost.js';
import Notification from '../models/Notification.js';

/**
 * Produce Controller
 * Handles all produce/product related operations
 */

// @desc    Create new produce post
// @route   POST /api/produce
// @access  Private (Farmer only)
export const createProducePost = async (req, res) => {
    try {
        const {
            productName,
            category,
            images,
            price,
            quantity,
            quality,
            description,
            isOrganic,
            location,
            availableUntil,
        } = req.body;

        const producePost = await ProducePost.create({
            farmer: req.user._id,
            productName,
            category,
            images,
            price,
            quantity,
            quality,
            description,
            isOrganic,
            location: location || req.user.location,
            availableUntil,
        });

        await producePost.populate('farmer', 'name phone location');

        res.status(201).json({
            success: true,
            message: 'Product posted successfully',
            producePost,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all produce posts with filters
// @route   GET /api/produce
// @access  Public
export const getAllProduce = async (req, res) => {
    try {
        const {
            category,
            isOrganic,
            minPrice,
            maxPrice,
            district,
            state,
            search,
            sort = '-createdAt',
            page = 1,
            limit = 20,
        } = req.query;

        // Build query
        const query = { status: 'active', isAvailable: true };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (isOrganic === 'true') {
            query.isOrganic = true;
        }

        if (minPrice || maxPrice) {
            query['price.value'] = {};
            if (minPrice) query['price.value'].$gte = Number(minPrice);
            if (maxPrice) query['price.value'].$lte = Number(maxPrice);
        }

        if (district) {
            query['location.district'] = new RegExp(district, 'i');
        }

        if (state) {
            query['location.state'] = new RegExp(state, 'i');
        }

        if (search) {
            query.$text = { $search: search };
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const total = await ProducePost.countDocuments(query);

        const producePosts = await ProducePost.find(query)
            .populate('farmer', 'name phone location rating')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        res.json({
            success: true,
            count: producePosts.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            producePosts,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single produce post
// @route   GET /api/produce/:id
// @access  Public
export const getProducePost = async (req, res) => {
    try {
        const producePost = await ProducePost.findById(req.params.id)
            .populate('farmer', 'name phone location rating')
            .populate('interests.buyer', 'name phone');

        if (!producePost) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Increment views
        await producePost.incrementViews();

        res.json({
            success: true,
            producePost,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update produce post
// @route   PUT /api/produce/:id
// @access  Private (Farmer - own posts only)
export const updateProducePost = async (req, res) => {
    try {
        let producePost = await ProducePost.findById(req.params.id);

        if (!producePost) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check ownership
        if (producePost.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this product',
            });
        }

        producePost = await ProducePost.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('farmer', 'name phone location');

        res.json({
            success: true,
            message: 'Product updated successfully',
            producePost,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete produce post
// @route   DELETE /api/produce/:id
// @access  Private (Farmer - own posts only)
export const deleteProducePost = async (req, res) => {
    try {
        const producePost = await ProducePost.findById(req.params.id);

        if (!producePost) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check ownership
        if (producePost.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this product',
            });
        }

        // Soft delete - mark as deleted
        producePost.status = 'deleted';
        producePost.isAvailable = false;
        await producePost.save();

        res.json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Express interest in a product
// @route   POST /api/produce/:id/interest
// @access  Private
export const expressInterest = async (req, res) => {
    try {
        const producePost = await ProducePost.findById(req.params.id)
            .populate('farmer', 'name phone');

        if (!producePost) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Add interest
        await producePost.addInterest(req.user._id);

        // Create notification for farmer
        await Notification.createNotification({
            user: producePost.farmer._id,
            type: 'new_interest',
            title: 'New Interest in Your Product!',
            message: `${req.user.name} is interested in your ${producePost.productName}`,
            relatedTo: {
                model: 'ProducePost',
                id: producePost._id,
            },
            actionUrl: `/produce/${producePost._id}`,
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

// @desc    Get farmer's own produce posts
// @route   GET /api/produce/my-products
// @access  Private (Farmer)
export const getMyProducts = async (req, res) => {
    try {
        const producePosts = await ProducePost.find({
            farmer: req.user._id,
            status: { $ne: 'deleted' },
        }).sort('-createdAt');

        res.json({
            success: true,
            count: producePosts.length,
            producePosts,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Toggle product availability
// @route   PATCH /api/produce/:id/toggle-availability
// @access  Private (Farmer - own posts only)
export const toggleAvailability = async (req, res) => {
    try {
        const producePost = await ProducePost.findById(req.params.id);

        if (!producePost) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check ownership
        if (producePost.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        producePost.isAvailable = !producePost.isAvailable;
        await producePost.save();

        res.json({
            success: true,
            message: `Product marked as ${producePost.isAvailable ? 'available' : 'unavailable'}`,
            isAvailable: producePost.isAvailable,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
