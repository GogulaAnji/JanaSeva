import FarmerProfile from '../models/FarmerProfile.js';
import User from '../models/User.js';

export const createFarmerProfile = async (req, res) => {
    try {
        const existingProfile = await FarmerProfile.findOne({ user: req.user.id });
        if (existingProfile) return res.status(400).json({ success: false, message: 'Farmer profile already exists' });
        const profile = await FarmerProfile.create({ user: req.user.id, ...req.body });
        res.status(201).json({ success: true, message: 'Farmer profile created successfully', profile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create farmer profile', error: error.message });
    }
};

export const getFarmerProfile = async (req, res) => {
    try {
        const profile = await FarmerProfile.findOne({ user: req.params.id }).populate('user', 'name email phone location rating profilePicture');
        if (!profile) return res.status(404).json({ success: false, message: 'Farmer profile not found' });
        res.status(200).json({ success: true, profile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get farmer profile', error: error.message });
    }
};

export const updateFarmerProfile = async (req, res) => {
    try {
        const profile = await FarmerProfile.findOneAndUpdate({ user: req.user.id }, req.body, { new: true, runValidators: true });
        if (!profile) return res.status(404).json({ success: false, message: 'Farmer profile not found' });
        res.status(200).json({ success: true, message: 'Profile updated successfully', profile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
    }
};

export const getAllFarmers = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const farmers = await FarmerProfile.find().populate('user', 'name phone location rating profilePicture').limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 });
        const count = await FarmerProfile.countDocuments();
        res.status(200).json({ success: true, count, totalPages: Math.ceil(count / limit), currentPage: page, farmers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get farmers', error: error.message });
    }
};

export const addProduceListing = async (req, res) => {
    try {
        const profile = await FarmerProfile.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ success: false, message: 'Farmer profile not found' });
        profile.produceListings.push(req.body);
        await profile.save();
        res.status(201).json({ success: true, message: 'Produce listing added successfully', profile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add produce listing', error: error.message });
    }
};

export const updateProduceListing = async (req, res) => {
    try {
        const profile = await FarmerProfile.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ success: false, message: 'Farmer profile not found' });
        const produce = profile.produceListings.id(req.params.produceId);
        if (!produce) return res.status(404).json({ success: false, message: 'Produce listing not found' });
        Object.assign(produce, req.body);
        await profile.save();
        res.status(200).json({ success: true, message: 'Produce listing updated successfully', profile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update produce listing', error: error.message });
    }
};

export const deleteProduceListing = async (req, res) => {
    try {
        const profile = await FarmerProfile.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ success: false, message: 'Farmer profile not found' });
        profile.produceListings.pull(req.params.produceId);
        await profile.save();
        res.status(200).json({ success: true, message: 'Produce listing deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete produce listing', error: error.message });
    }
};

export const searchProduce = async (req, res) => {
    try {
        const { crop, location } = req.query;
        let farmers = await FarmerProfile.find({ 'produceListings.isActive': true }).populate('user', 'name phone location');
        if (crop) {
            farmers = farmers.filter(f => f.produceListings.some(p => p.cropName.toLowerCase().includes(crop.toLowerCase()) && p.isActive));
        }
        if (location) {
            farmers = farmers.filter(f => f.farmLocation.district?.toLowerCase().includes(location.toLowerCase()) || f.farmLocation.state?.toLowerCase().includes(location.toLowerCase()));
        }
        res.status(200).json({ success: true, count: farmers.length, farmers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Search failed', error: error.message });
    }
};

export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const profile = await FarmerProfile.findOne({ user: req.params.id });
        if (!profile) return res.status(404).json({ success: false, message: 'Farmer not found' });
        const alreadyReviewed = profile.reviews.find(r => r.buyer.toString() === req.user.id.toString());
        if (alreadyReviewed) return res.status(400).json({ success: false, message: 'You have already reviewed this farmer' });
        profile.reviews.push({ buyer: req.user.id, rating, comment });
        await profile.save();
        const avgRating = profile.calculateAverageRating();
        await User.findByIdAndUpdate(req.params.id, { rating: avgRating, reviewCount: profile.reviews.length });
        res.status(201).json({ success: true, message: 'Review added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add review', error: error.message });
    }
};
