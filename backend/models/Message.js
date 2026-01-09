import mongoose from 'mongoose';

/**
 * Message Schema
 * Individual messages in a chat
 */
const messageSchema = new mongoose.Schema(
    {
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
            required: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        content: {
            type: String,
            required: function () {
                return this.type === 'text';
            },
            maxlength: 1000,
        },

        type: {
            type: String,
            enum: ['text', 'image', 'location'],
            default: 'text',
        },

        // For image messages
        imageUrl: {
            type: String,
            required: function () {
                return this.type === 'image';
            },
        },

        // For location messages
        location: {
            latitude: Number,
            longitude: Number,
            address: String,
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        readAt: Date,

        // For message status
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read'],
            default: 'sent',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ isRead: 1 });

// Method to mark as read
messageSchema.methods.markAsRead = function () {
    this.isRead = true;
    this.readAt = new Date();
    this.status = 'read';
    return this.save();
};

const Message = mongoose.model('Message', messageSchema);

export default Message;
