import CommunityService from '../models/CommunityService.js';

export const createCommunityService = async (req, res) => {
    try {
        const service = await CommunityService.create({ postedBy: req.user.id, ...req.body });
        res.status(201).json({ success: true, message: 'Community service created successfully', service });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create community service', error: error.message });
    }
};

export const getAllCommunityServices = async (req, res) => {
    try {
        const { page = 1, limit = 20, serviceType, status = 'active' } = req.query;
        const query = { status };
        if (serviceType) query.serviceType = serviceType;
        const services = await CommunityService.find(query).populate('postedBy', 'name phone').limit(limit * 1).skip((page - 1) * limit).sort({ priority: -1, createdAt: -1 });
        const count = await CommunityService.countDocuments(query);
        res.status(200).json({ success: true, count, totalPages: Math.ceil(count / limit), currentPage: page, services });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get community services', error: error.message });
    }
};

export const getCommunityService = async (req, res) => {
    try {
        const service = await CommunityService.findById(req.params.id).populate('postedBy', 'name phone email');
        if (!service) return res.status(404).json({ success: false, message: 'Community service not found' });
        service.viewsCount += 1;
        await service.save();
        res.status(200).json({ success: true, service });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get community service', error: error.message });
    }
};

export const updateCommunityService = async (req, res) => {
    try {
        const service = await CommunityService.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Community service not found' });
        if (service.postedBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        Object.assign(service, req.body);
        await service.save();
        res.status(200).json({ success: true, message: 'Community service updated successfully', service });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update community service', error: error.message });
    }
};

export const deleteCommunityService = async (req, res) => {
    try {
        const service = await CommunityService.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Community service not found' });
        if (service.postedBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        await service.deleteOne();
        res.status(200).json({ success: true, message: 'Community service deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete community service', error: error.message });
    }
};

export const respondToService = async (req, res) => {
    try {
        const service = await CommunityService.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Community service not found' });
        service.responses.push({ user: req.user.id, message: req.body.message, contactPhone: req.body.contactPhone });
        await service.save();
        res.status(201).json({ success: true, message: 'Response submitted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to respond', error: error.message });
    }
};

export const searchCommunityServices = async (req, res) => {
    try {
        const { serviceType, location, priority } = req.query;
        const query = { status: 'active' };
        if (serviceType) query.serviceType = serviceType;
        if (priority) query.priority = priority;
        let services = await CommunityService.find(query).populate('postedBy', 'name phone');
        if (location) {
            services = services.filter(s => s.location.district?.toLowerCase().includes(location.toLowerCase()) || s.location.state?.toLowerCase().includes(location.toLowerCase()));
        }
        res.status(200).json({ success: true, count: services.length, services });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Search failed', error: error.message });
    }
};
