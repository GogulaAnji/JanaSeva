import express from 'express';
import {
    getOrCreateChat,
    getUserChats,
    getChat,
    sendMessage,
    getChatMessages,
    markChatAsRead,
} from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', getOrCreateChat);
router.get('/', getUserChats);
router.get('/:id', getChat);
router.post('/:id/messages', sendMessage);
router.get('/:id/messages', getChatMessages);
router.put('/:id/read', markChatAsRead);

export default router;
