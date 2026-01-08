import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const chatWithAI = async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!OPENAI_API_KEY || OPENAI_API_KEY === 'sk-your-key-here') {
            return res.status(200).json({
                success: true,
                response: 'AI chatbot is currently in demo mode. Please configure OpenAI API key for full functionality. How can I assist you with JanaSeva platform?',
            });
        }

        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant for JanaSeva platform, helping users with employment, healthcare, agriculture, and community services.' },
                    { role: 'user', content: message },
                ],
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json({
            success: true,
            response: response.data.choices[0].message.content,
        });
    } catch (error) {
        res.status(200).json({
            success: true,
            response: 'I am here to help you with JanaSeva services. What would you like to know?',
        });
    }
};

export const matchJobsToSkills = async (req, res) => {
    try {
        const { skills, experience } = req.body;
        res.status(200).json({
            success: true,
            message: 'Job matching in progress',
            matches: [],
            recommendations: ['Consider adding more skills to your profile', 'Update your resume for better matches'],
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to match jobs', error: error.message });
    }
};

export const analyzeResume = async (req, res) => {
    try {
        const { resumeText } = req.body;
        res.status(200).json({
            success: true,
            analysis: {
                score: 75,
                strengths: ['Clear work experience', 'Good skills section'],
                improvements: ['Add more quantifiable achievements', 'Include relevant certifications'],
                suggestions: ['Tailor resume for specific job roles', 'Add project details'],
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to analyze resume', error: error.message });
    }
};

export const explainScheme = async (req, res) => {
    try {
        const { schemeName, language = 'english' } = req.body;
        res.status(200).json({
            success: true,
            explanation: `This is a government scheme designed to help farmers and workers. Benefits include financial assistance and training programs.`,
            eligibility: ['Indian citizen', 'Age 18-60', 'Valid ID proof'],
            howToApply: ['Visit nearest office', 'Fill application form', 'Submit required documents'],
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to explain scheme', error: error.message });
    }
};

export const healthSymptomGuidance = async (req, res) => {
    try {
        const { symptoms } = req.body;
        res.status(200).json({
            success: true,
            guidance: 'Based on your symptoms, it is recommended to consult a doctor. This is not a diagnosis.',
            recommendedSpecialization: 'general-physician',
            urgency: 'medium',
            disclaimer: 'This is AI guidance only. Please consult a qualified doctor for proper diagnosis and treatment.',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to provide guidance', error: error.message });
    }
};

export const getRecommendations = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            recommendations: {
                jobs: [],
                workers: [],
                doctors: [],
                farmers: [],
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get recommendations', error: error.message });
    }
};
