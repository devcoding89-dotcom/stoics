'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { supportedLanguages } from '@/lib/languages';


export function LanguageGate({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const storedLanguage = localStorage.getItem('preferred_language');
        if (storedLanguage) {
            setLanguage(storedLanguage);
        }
    }, []);

    const handleLanguageSelect = (langCode: string) => {
        localStorage.setItem('preferred_language', langCode);
        setLanguage(langCode);
    };

    if (!isClient || language === null) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
                 <div className="mb-8 flex items-center gap-2">
                    <Logo className="h-8 w-8" />
                    <span className="text-2xl font-bold font-headline">Stoics Educational Services</span>
                </div>
                <Card className="w-full max-w-sm text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl">Select Your Language</CardTitle>
                        <CardDescription>
                            Choose your preferred language to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {supportedLanguages.map(lang => (
                            <Button key={lang.code} onClick={() => handleLanguageSelect(lang.code)} variant="outline" size="lg">
                                {lang.name}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <>{children}</>;
}
