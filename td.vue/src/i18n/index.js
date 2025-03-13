import { createI18n } from 'vue-i18n';

// the language codes follow
// Internet Engineering Task Force (IETF) Best Current Practice (BCP) 47
// using codes from ISO 639-2

// Default language loaded immediately
import eng from './en.js';

// Other languages loaded on demand
const loadLocale = (locale) => {
    switch (locale) {
        case 'ara':
        return import('./ar.js').then((module) => module.default);
        case 'deu':
        return import('./de.js').then((module) => module.default);
        case 'ell':
        return import('./el.js').then((module) => module.default);
        case 'fin':
        return import('./fi.js').then((module) => module.default);
        case 'fra':
        return import('./fr.js').then((module) => module.default);
        case 'hin':
        return import('./hi.js').then((module) => module.default);
        case 'ind':
        return import('./id.js').then((module) => module.default);
        case 'jpn':
        return import('./ja.js').then((module) => module.default);
        case 'ms':
        return import('./ms.js').then((module) => module.default);
        case 'por':
        return import('./pt.js').then((module) => module.default);
        case 'spa':
        return import('./es.js').then((module) => module.default);
        case 'zho':
        return import('./zh.js').then((module) => module.default);
        // hide RUS & UKR for now
        default:
        return Promise.resolve(null);
    }
};

// Create i18n instance with initially only English
const i18n = createI18n({
    legacy: false, // You want to use Composition API
    locale: 'eng',
    fallbackLocale: 'eng',
    messages: { eng },
    silentTranslationWarn: true, // Suppress warnings for missing translations
    missingWarn: false,
});

// Function to dynamically load language messages
export async function loadLanguageAsync(locale) {
    // If locale is already loaded, just set it as active
    if (i18n.global.availableLocales.includes(locale)) {
        i18n.global.locale.value = locale;
        return Promise.resolve(locale);
    }

    // Otherwise load it
    try {
        const messages = await loadLocale(locale);

        if (messages) {
            // Add the new locale messages
            i18n.global.setLocaleMessage(locale, messages);
            // Set as current locale
            i18n.global.locale.value = locale;
        } else {
            // Fallback to English if the locale couldn't be loaded
            i18n.global.locale.value = 'eng';
        }

        return Promise.resolve(locale);
    } catch (error) {
        console.error(`Error loading locale ${locale}:`, error);
        // Fallback to English if there was an error
        i18n.global.locale.value = 'eng';
        return Promise.resolve('eng');
    }
}

// Helper function for compatibility
export const tc = (key) => i18n.global.tc(key);

// Add errorComponent translations to English
i18n.global.mergeLocaleMessage('eng', {
    errorComponent: {
        loading: 'Failed to load component. Please try again.',
    },
});

export default i18n;
