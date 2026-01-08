import { useState, useRef } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './TextToSpeech.css';

const TextToSpeech = ({ text }) => {
    const { language } = useLanguage();
    const [isPlaying, setIsPlaying] = useState(false);
    const utteranceRef = useRef(null);

    const languageVoiceMap = {
        en: 'en-US',
        te: 'te-IN',
        hi: 'hi-IN',
    };

    const speak = () => {
        if ('speechSynthesis' in window) {
            // Stop any ongoing speech
            window.speechSynthesis.cancel();

            if (isPlaying) {
                setIsPlaying(false);
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = languageVoiceMap[language] || 'en-US';
            utterance.rate = 0.9; // Slightly slower for better comprehension
            utterance.pitch = 1;
            utterance.volume = 1;

            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-speech is not supported in your browser');
        }
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    };

    return (
        <button
            className={`tts-button ${isPlaying ? 'playing' : ''}`}
            onClick={isPlaying ? stop : speak}
            title={isPlaying ? 'Stop Reading' : 'Read Aloud'}
            aria-label={isPlaying ? 'Stop Reading' : 'Read Aloud'}
        >
            {isPlaying ? <FiVolumeX /> : <FiVolume2 />}
        </button>
    );
};

export default TextToSpeech;
