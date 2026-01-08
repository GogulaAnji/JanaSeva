import DoctorProfile from '../models/DoctorProfile.js';
import User from '../models/User.js';

export const createDoctorProfile = async (req, res) => {
    try {
        const existingProfile = await DoctorProfile.findOne({ user: req.user.id });
        if (existingProfile) {
            return res.status(400).json({ success: false, message: 'Doctor profile already exists' });
        }
        const profile = await DoctorProfile.create({ user: req.user.id, ...req.body });
        res.status(201).json({ success: true, message: 'Doctor profile created successfully', profile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create doctor profile', error: error.message });
    }
};

export const getDoctorProfile = async (req, res) => {
    try {
        const profile = await DoctorProfile.findOne({ user: req.params.id })
            .populate('user', 'name email phone location rating profilePicture');
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' });
        }
        res.status(200).json({ success: true, profile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get doctor profile', error: error.message });
    }
};

export const updateDoctorProfile = async (req, res) => {
    try {
        const profile = await DoctorProfile.findOneAndUpdate(
            { user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' });
        }
        res.status(200).json({ success: true, message: 'Profile updated successfully', profile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
    }
};

export const getAllDoctors = async (req, res) => {
    try {
        const { page = 1, limit = 20, specialization, availability } = req.query;
        const query = {};
        if (specialization) query.specialization = specialization;
        if (availability) query.availability = availability;

        const doctors = await DoctorProfile.find(query)
            .populate('user', 'name phone location rating profilePicture')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await DoctorProfile.countDocuments(query);
        res.status(200).json({ success: true, count, totalPages: Math.ceil(count / limit), currentPage: page, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get doctors', error: error.message });
    }
};

export const searchDoctors = async (req, res) => {
    try {
        const { specialization, location, availability } = req.query;
        const query = {};
        if (specialization) query.specialization = new RegExp(specialization, 'i');
        if (availability) query.availability = availability;

        let doctors = await DoctorProfile.find(query)
            .populate('user', 'name phone location rating profilePicture');

        if (location) {
            doctors = doctors.filter(doctor => {
                const userLocation = doctor.user.location;
                return (
                    userLocation.district?.toLowerCase().includes(location.toLowerCase()) ||
                    userLocation.state?.toLowerCase().includes(location.toLowerCase())
                );
            });
        }

        res.status(200).json({ success: true, count: doctors.length, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Search failed', error: error.message });
    }
};

export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const profile = await DoctorProfile.findOne({ user: req.params.id });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        const alreadyReviewed = profile.reviews.find(r => r.patient.toString() === req.user.id.toString());
        if (alreadyReviewed) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this doctor' });
        }
        profile.reviews.push({ patient: req.user.id, rating, comment });
        await profile.save();
        const avgRating = profile.calculateAverageRating();
        await User.findByIdAndUpdate(req.params.id, { rating: avgRating, reviewCount: profile.reviews.length });
        res.status(201).json({ success: true, message: 'Review added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add review', error: error.message });
    }
};

export const updateAvailability = async (req, res) => {
    try {
        const { availability } = req.body;
        const profile = await DoctorProfile.findOneAndUpdate(
            { user: req.user.id },
            { availability },
            { new: true }
        );
        res.status(200).json({ success: true, message: 'Availability updated', availability: profile.availability });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update availability', error: error.message });
    }
};

export const getSchedule = async (req, res) => {
    try {
        const profile = await DoctorProfile.findOne({ user: req.params.id }).select('schedule availability');
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.status(200).json({ success: true, schedule: profile.schedule, availability: profile.availability });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get schedule', error: error.message });
    }
};
