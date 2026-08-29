import React, { useState } from 'react';

const LanguageSelector: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Spanish' },
        { code: 'fr', label: 'French' },
        // Add more languages as needed
    ];

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLanguage(event.target.value);
        // Trigger translation process here
    };

    return (
        <div className="language-selector">
            <label htmlFor="language-select">Select Language:</label>
            <select id="language-select" value={selectedLanguage} onChange={handleLanguageChange}>
                {languages.map((language) => (
                    <option key={language.code} value={language.code}>
                        {language.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;