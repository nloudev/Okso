import React, { useState } from 'react';
import DischargeSummary from '../components/DischargeSummary/DischargeSummary';
import LanguageSelector from '../components/LanguageSelector/LanguageSelector';
import { Block } from '../hooks/useSummaryParser';
import { getTranslations } from '../services/api';

const sampleBlocks: Block[] = [
    {
        id: '1',
        type: 'medication',
        priority: 'important',
        title: 'Paracetamol',
        content: 'Take paracetamol 500mg every 6 hours as needed.',
        plain_summary: 'Take this for pain relief.',
        fields: { dose: '500 mg', frequency: 'every 6 hours' },
        missing: [],
        source: { section: 'Medications', text: 'Take paracetamol 500mg every 6 hours as needed.' },
    },
];

/** Translates the patient-facing text of a block; falls back to the original on a bad response. */
const translateBlock = async (block: Block, language: string): Promise<Block> => {
    const [title, plain_summary] = await Promise.all([
        getTranslations(block.title, language),
        getTranslations(block.plain_summary, language),
    ]);
    return {
        ...block,
        title: typeof title?.translatedText === 'string' ? title.translatedText : block.title,
        plain_summary:
            typeof plain_summary?.translatedText === 'string' ? plain_summary.translatedText : block.plain_summary,
    };
};

const SummaryView: React.FC = () => {
    const [language, setLanguage] = useState('en');
    const [displayBlocks, setDisplayBlocks] = useState<Block[]>(sampleBlocks);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationError, setTranslationError] = useState<string | null>(null);

    const handleLanguageChange = async (nextLanguage: string) => {
        setLanguage(nextLanguage);
        setTranslationError(null);

        if (nextLanguage === 'en') {
            setDisplayBlocks(sampleBlocks);
            return;
        }

        setIsTranslating(true);
        try {
            const translated = await Promise.all(
                sampleBlocks.map((block) => translateBlock(block, nextLanguage)),
            );
            setDisplayBlocks(translated);
        } catch {
            setTranslationError('Could not translate this summary. Showing the original text.');
            setDisplayBlocks(sampleBlocks);
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <div className="summary-view">
            <h1 className="text-2xl font-bold mb-4">Discharge Summary</h1>
            <LanguageSelector value={language} onChange={handleLanguageChange} disabled={isTranslating} />
            {translationError && <p className="text-red-600 text-sm mt-2">{translationError}</p>}
            <DischargeSummary summaryBlocks={displayBlocks} />
        </div>
    );
};

export default SummaryView;