import enTranslations from './en';
import teTranslations from './te';
import hiTranslations from './hi';

// Extract the translations objects
const en = enTranslations.translations || enTranslations;
const te = teTranslations.translations || teTranslations;
const hi = hiTranslations.translations || hiTranslations;

export const translations = {
    en,
    te,
    hi,
};

export const getTranslation = (language, key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
        if (value && typeof value === 'object') {
            value = value[k];
        } else {
            console.warn(`Translation not found for key: ${key} in language: ${language}`);
            return key; // Return key if translation not found
        }
    }

    return value || key;
};

export default translations;
