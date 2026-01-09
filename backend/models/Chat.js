import mongoose from 'mongoose';

/**
 * Chat Schema
 * Conversations between farmers and buyers
 */
const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],

        // Reference to the product being discussed
        producePost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProducePost',
        },

        lastMessage: {
            type: String,
            default: '',
        },

        lastMessageAt: {
            type: Date,
            default: Date.now,
        },

        // Unread count for each participant
        unreadCount: {
            type: Map,
            of: Number,
            default: {},
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        // Chat type
        type: {
            type: String,
            enum: ['produce', 'general'],
            default: 'produce',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
chatSchema.index({ participants: 1, updatedAt: -1 });
chatSchema.index({ lastMessageAt: -1 });
chatSchema.index({ producePost: 1 });

// Validate that there are exactly 2 participants
chatSchema.pre('save', function (next) {
    if (this.participants.length !== 2) {
        next(new Error('Chat must have exactly 2 participants'));
    } else {
        next();
    }
});

// Method to get unread count for a user
chatSchema.methods.getUnreadCount = function (userId) {
    return this.unreadCount.get(userId.toString()) || 0;
};

// Method to increment unread count for a user
chatSchema.methods.incrementUnread = function (userId) {
    const currentCount = this.getUnreadCount(userId);
    this.unreadCount.set(userId.toString(), currentCount + 1);
    return this.save();
};

// Method to mark as read for a user
chatSchema.methods.markAsRead = function (userId) {
    this.unreadCount.set(userId.toString(), 0);
    return this.save();
};

// Method to get the other participant
chatSchema.methods.getOtherParticipant = function (userId) {
    return this.participants.find(p => p.toString() !== userId.toString());
};

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
