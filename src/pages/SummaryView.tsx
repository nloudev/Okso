import React, { useEffect, useState } from 'react';
import DischargeSummary from '../components/DischargeSummary/DischargeSummary';
import LanguageSelector from '../components/LanguageSelector/LanguageSelector';
import useSummaryParser, { Block } from '../hooks/useSummaryParser';
import { getTranslations } from '../services/api';

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

const statusMessages: Partial<Record<string, string>> = {
    transcribing: 'Reading the text from your photo…',
    parsing: 'Organising your letter into blocks…',
};

const SummaryView: React.FC = () => {
    const { parsedSummary, warnings, error, status, parseSummary } = useSummaryParser();

    const [pastedText, setPastedText] = useState('');
    const [images, setImages] = useState<File[]>([]);

    const [language, setLanguage] = useState('en');
    const [displayBlocks, setDisplayBlocks] = useState<Block[]>([]);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationError, setTranslationError] = useState<string | null>(null);

    // Every new (or updated) parse result starts out shown in English.
    useEffect(() => {
        setLanguage('en');
        setTranslationError(null);
        setDisplayBlocks(parsedSummary ?? []);
    }, [parsedSummary]);

    const isBusy = status === 'transcribing' || status === 'parsing';

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        parseSummary({ text: pastedText, images });
    };

    const handleLanguageChange = async (nextLanguage: string) => {
        setLanguage(nextLanguage);
        setTranslationError(null);

        if (nextLanguage === 'en') {
            setDisplayBlocks(parsedSummary ?? []);
            return;
        }

        setIsTranslating(true);
        try {
            const translated = await Promise.all(
                (parsedSummary ?? []).map((block) => translateBlock(block, nextLanguage)),
            );
            setDisplayBlocks(translated);
        } catch {
            setTranslationError('Could not translate this summary. Showing the original text.');
            setDisplayBlocks(parsedSummary ?? []);
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <div className="summary-view max-w-2xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-2xl font-bold">Discharge Summary</h1>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label htmlFor="summary-text" className="block font-semibold mb-1">
                        Paste your discharge letter
                    </label>
                    <textarea
                        id="summary-text"
                        className="w-full border rounded p-2 min-h-[8rem]"
                        value={pastedText}
                        onChange={(event) => setPastedText(event.target.value)}
                        placeholder="Paste the text from your discharge letter here…"
                    />
                </div>

                <div>
                    <label htmlFor="summary-images" className="block font-semibold mb-1">
                        Or upload a photo of it
                    </label>
                    <input
                        id="summary-images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) => setImages(Array.from(event.target.files ?? []))}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isBusy}
                    className="rounded bg-blue-600 text-white font-semibold px-4 py-2 disabled:opacity-50"
                >
                    {isBusy ? 'Working…' : 'Parse my letter'}
                </button>
            </form>

            {isBusy && (
                <p role="status" className="text-gray-600">
                    {statusMessages[status] ?? 'Working…'}
                </p>
            )}

            {error && <p role="alert" className="text-red-600">{error}</p>}

            {warnings.length > 0 && (
                <ul className="text-amber-700 text-sm list-disc pl-5">
                    {warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                    ))}
                </ul>
            )}

            {parsedSummary && parsedSummary.length > 0 && (
                <LanguageSelector value={language} onChange={handleLanguageChange} disabled={isTranslating} />
            )}
            {translationError && <p className="text-red-600 text-sm">{translationError}</p>}

            <DischargeSummary summaryBlocks={displayBlocks} />
        </div>
    );
};

export default SummaryView;