import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

/**
 * Chat Controller
 * Handles chat and messaging operations
 */

// @desc    Get or create a chat between two users
// @route   POST /api/chats
// @access  Private
export const getOrCreateChat = async (req, res) => {
    try {
        const { otherUserId, producePostId } = req.body;

        // Check if chat already exists
        let chat = await Chat.findOne({
            participants: { $all: [req.user._id, otherUserId] },
            producePost: producePostId,
        }).populate('participants', 'name phone location')
            .populate('producePost', 'productName images price');

        if (!chat) {
            // Create new chat
            chat = await Chat.create({
                participants: [req.user._id, otherUserId],
                producePost: producePostId,
            });

            chat = await chat.populate('participants', 'name phone location');
            chat = await chat.populate('producePost', 'productName images price');
        }

        res.json({
            success: true,
            chat,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all chats for current user
// @route   GET /api/chats
// @access  Private
export const getUserChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: req.user._id,
            isActive: true,
        })
            .populate('participants', 'name phone location')
            .populate('producePost', 'productName images price')
            .sort('-lastMessageAt');

        // Add unread count for current user
        const chatsWithUnread = chats.map(chat => {
            const chatObj = chat.toObject();
            chatObj.myUnreadCount = chat.getUnreadCount(req.user._id);
            return chatObj;
        });

        res.json({
            success: true,
            count: chats.length,
            chats: chatsWithUnread,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single chat
// @route   GET /api/chats/:id
// @access  Private
export const getChat = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate('participants', 'name phone location')
            .populate('producePost', 'productName images price farmer');

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        // Check if user is participant
        if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this chat',
            });
        }

        res.json({
            success: true,
            chat,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Send message in chat
// @route   POST /api/chats/:id/messages
// @access  Private
export const sendMessage = async (req, res) => {
    try {
        const { content, type = 'text', imageUrl, location } = req.body;

        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        // Check if user is participant
        if (!chat.participants.some(p => p.toString() === req.user._id.toString())) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to send messages in this chat',
            });
        }

        // Create message
        const message = await Message.create({
            chat: chat._id,
            sender: req.user._id,
            content,
            type,
            imageUrl,
            location,
        });

        await message.populate('sender', 'name');

        // Update chat
        chat.lastMessage = type === 'text' ? content : `Sent a ${type}`;
        chat.lastMessageAt = new Date();

        // Increment unread for other participant
        const otherParticipant = chat.getOtherParticipant(req.user._id);
        await chat.incrementUnread(otherParticipant);

        // Create notification for other participant
        await Notification.createNotification({
            user: otherParticipant,
            type: 'new_message',
            title: 'New Message',
            message: `${req.user.name} sent you a message`,
            relatedTo: {
                model: 'Chat',
                id: chat._id,
            },
            actionUrl: `/chats/${chat._id}`,
        });

        res.status(201).json({
            success: true,
            message: message,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get messages in a chat
// @route   GET /api/chats/:id/messages
// @access  Private
export const getChatMessages = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;

        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        // Check if user is participant
        if (!chat.participants.some(p => p.toString() === req.user._id.toString())) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these messages',
            });
        }

        const skip = (page - 1) * limit;
        const total = await Message.countDocuments({ chat: chat._id });

        const messages = await Message.find({ chat: chat._id })
            .populate('sender', 'name')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        res.json({
            success: true,
            count: messages.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            messages: messages.reverse(), // Reverse to show oldest first
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Mark chat as read
// @route   PUT /api/chats/:id/read
// @access  Private
export const markChatAsRead = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        // Check if user is participant
        if (!chat.participants.some(p => p.toString() === req.user._id.toString())) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        await chat.markAsRead(req.user._id);

        // Mark all unread messages as read
        await Message.updateMany(
            {
                chat: chat._id,
                sender: { $ne: req.user._id },
                isRead: false,
            },
            {
                isRead: true,
                readAt: new Date(),
                status: 'read',
            }
        );

        res.json({
            success: true,
            message: 'Chat marked as read',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
