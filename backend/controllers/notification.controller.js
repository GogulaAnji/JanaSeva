import Notification from '../models/Notification.js';

/**
 * Notification Controller
 * Handles user notifications
 */

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly = false } = req.query;

        const query = { user: req.user._id };
        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const skip = (page - 1) * limit;
        const total = await Notification.countDocuments(query);

        const notifications = await Notification.find(query)
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        const unreadCount = await Notification.getUnreadCount(req.user._id);

        res.json({
            success: true,
            count: notifications.length,
            total,
            unreadCount,
            page: Number(page),
            pages: Math.ceil(total / limit),
            notifications,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        // Check ownership
        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        await notification.markAsRead();

        res.json({
            success: true,
            message: 'Notification marked as read',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.markAllAsRead(req.user._id);

        res.json({
            success: true,
            message: 'All notifications marked as read',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.getUnreadCount(req.user._id);

        res.json({
            success: true,
            count,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        // Check ownership
        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        await notification.deleteOne();

        res.json({
            success: true,
            message: 'Notification deleted',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
