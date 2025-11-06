'use client';

import { useState, useEffect, useCallback } from 'react';
import { get } from 'lodash';

// Helper to get the initial language, ensuring it runs only on the client
const getInitialLanguage = (): string => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('preferred_language') || 'en';
    }
    return 'en';
};

export const useTranslation = () => {
    const [language, setLanguage] = useState<string>(getInitialLanguage);
    const [translations, setTranslations] = useState<any>({});
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        const loadTranslations = async (lang: string) => {
            try {
                const module = await import(`@/locales/${lang}.json`);
                setTranslations(module.default);
            } catch (error) {
                console.error(`Could not load translations for ${lang}, falling back to English.`, error);
                // Fallback to English if the chosen language file is missing
                const fallbackModule = await import(`@/locales/en.json`);
                setTranslations(fallbackModule.default);
            } finally {
                setIsLoaded(true);
            }
        };

        loadTranslations(language);
    }, [language]);
    
    // Listen for storage changes to sync across tabs
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'preferred_language' && event.newValue) {
                setLanguage(event.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
        const translation = get(translations, key, key);

        if (typeof translation !== 'string' || !replacements) {
            return translation;
        }

        return Object.entries(replacements).reduce((acc, [k, v]) => {
            return acc.replace(`{${k}}`, String(v));
        }, translation);

    }, [translations]);

    return { t, setLanguage, language, isLoaded };
};
