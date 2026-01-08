import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    chatWithAI,
    matchJobsToSkills,
    analyzeResume,
    explainScheme,
    healthSymptomGuidance,
    getRecommendations,
} from '../controllers/ai.controller.js';

const router = express.Router();

// All AI routes are protected
router.post('/chat', protect, chatWithAI);
router.post('/match-jobs', protect, matchJobsToSkills);
router.post('/analyze-resume', protect, analyzeResume);
router.post('/explain-scheme', protect, explainScheme);
router.post('/health-guidance', protect, healthSymptomGuidance);
router.get('/recommendations', protect, getRecommendations);

export default router;
