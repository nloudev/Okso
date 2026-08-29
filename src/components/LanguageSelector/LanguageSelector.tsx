import React from 'react';
import { LanguageOption } from '../../types';

interface LanguageSelectorProps {
    /** Currently selected language code. Controlled by the parent so it can drive translation. */
    value: string;
    /** Called with the new language code whenever the patient picks one. */
    onChange: (languageCode: string) => void;
    languages?: LanguageOption[];
    /** True while a translation request is in flight. */
    disabled?: boolean;
}

const DEFAULT_LANGUAGES: LanguageOption[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'zh', label: 'Chinese' },
    { code: 'ar', label: 'Arabic' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    value,
    onChange,
    languages = DEFAULT_LANGUAGES,
    disabled = false,
}) => {
    return (
        <div className="language-selector flex items-center gap-2">
            <label htmlFor="language-select">Select Language:</label>
            <select
                id="language-select"
                value={value}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value)}
            >
                {languages.map((language) => (
                    <option key={language.code} value={language.code}>
                        {language.label}
                    </option>
                ))}
            </select>
            {disabled && (
                <span role="status" className="text-sm text-gray-500">
                    Translating…
                </span>
            )}
        </div>
    );
};

export default LanguageSelector;