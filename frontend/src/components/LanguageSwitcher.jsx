import { useState } from 'react';
import { FiGlobe, FiCheck } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    ];

    const handleLanguageChange = (langCode) => {
        changeLanguage(langCode);
        setIsOpen(false);
    };

    const currentLanguage = languages.find(lang => lang.code === language);

    return (
        <div className="language-switcher">
            <button
                className="language-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={getTranslation(language, 'accessibility.changeLanguage')}
            >
                <FiGlobe />
                <span className="current-lang">{currentLanguage?.nativeName}</span>
            </button>

            {isOpen && (
                <>
                    <div className="language-overlay" onClick={() => setIsOpen(false)} />
                    <div className="language-dropdown">
                        <div className="dropdown-header">
                            {getTranslation(language, 'accessibility.selectLanguage')}
                        </div>
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                className={`language-option ${language === lang.code ? 'active' : ''}`}
                                onClick={() => handleLanguageChange(lang.code)}
                            >
                                <span className="lang-name">
                                    <span className="native-name">{lang.nativeName}</span>
                                    <span className="english-name">{lang.name}</span>
                                </span>
                                {language === lang.code && <FiCheck className="check-icon" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default LanguageSwitcher;
