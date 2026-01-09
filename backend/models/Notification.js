import mongoose from 'mongoose';

/**
 * Notification Schema
 * User notifications for various events
 */
const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        type: {
            type: String,
            required: true,
            enum: [
                'new_interest',      // Someone interested in farmer's product
                'new_message',       // New chat message
                'new_product',       // New product from favorite farmer
                'price_drop',        // Price reduced on saved product
                'product_available', // Saved product back in stock
                'chat_reply',        // Farmer replied to buyer
                'order_update',      // Order status update (future)
                'system',            // System notifications
            ],
        },

        title: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        // Reference to related entity
        relatedTo: {
            model: {
                type: String,
                enum: ['ProducePost', 'Chat', 'Message', 'User'],
            },
            id: {
                type: mongoose.Schema.Types.ObjectId,
            },
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        readAt: Date,

        // For click action
        actionUrl: String,

        // Icon/image for notification
        icon: String,
    },
    {
        timestamps: true,
    }
);

// Indexes
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

// Method to mark as read
notificationSchema.methods.markAsRead = function () {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = async function (data) {
    const notification = new this(data);
    await notification.save();
    return notification;
};

// Static method to mark all as read for a user
notificationSchema.statics.markAllAsRead = async function (userId) {
    return this.updateMany(
        { user: userId, isRead: false },
        { isRead: true, readAt: new Date() }
    );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function (userId) {
    return this.countDocuments({ user: userId, isRead: false });
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
