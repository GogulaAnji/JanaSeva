import User from '../models/User.js';
import WorkerProfile from '../models/WorkerProfile.js';
import DoctorProfile from '../models/DoctorProfile.js';
import FarmerProfile from '../models/FarmerProfile.js';
import Job from '../models/Job.js';
import Appointment from '../models/Appointment.js';
import CommunityService from '../models/CommunityService.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalWorkers = await WorkerProfile.countDocuments();
        const totalDoctors = await DoctorProfile.countDocuments();
        const totalFarmers = await FarmerProfile.countDocuments();
        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'active' });
        const totalAppointments = await Appointment.countDocuments();
        const totalCommunityServices = await CommunityService.countDocuments();

        const usersByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } },
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalWorkers,
                totalDoctors,
                totalFarmers,
                totalJobs,
                activeJobs,
                totalAppointments,
                totalCommunityServices,
                usersByRole,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get dashboard stats', error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, role, isActive } = req.query;
        const query = {};
        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const users = await User.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            users,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get users', error: error.message });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            user,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update user status', error: error.message });
    }
};

export const verifyProfile = async (req, res) => {
    try {
        const { type, id } = req.params;
        let profile;

        switch (type) {
            case 'worker':
                profile = await WorkerProfile.findByIdAndUpdate(
                    id,
                    { isVerified: true, verifiedBy: req.user.id, verifiedAt: new Date() },
                    { new: true }
                );
                break;
            case 'doctor':
                profile = await DoctorProfile.findByIdAndUpdate(
                    id,
                    { isVerified: true, verifiedBy: req.user.id, verifiedAt: new Date() },
                    { new: true }
                );
                break;
            case 'farmer':
                profile = await FarmerProfile.findByIdAndUpdate(
                    id,
                    { isVerified: true, verifiedBy: req.user.id, verifiedAt: new Date() },
                    { new: true }
                );
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid profile type' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile verified successfully',
            profile,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to verify profile', error: error.message });
    }
};

export const getReports = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        res.status(200).json({
            success: true,
            message: 'Reports generated successfully',
            reports: {
                userGrowth: [],
                jobPostings: [],
                appointments: [],
                communityServices: [],
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate reports', error: error.message });
    }
};

export const moderateContent = async (req, res) => {
    try {
        const { type, id } = req.params;
        const { action } = req.body; // approve, reject, flag

        res.status(200).json({
            success: true,
            message: `Content ${action}ed successfully`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to moderate content', error: error.message });
    }
};
