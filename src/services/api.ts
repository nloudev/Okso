// This file contains functions for making API calls, such as sending the discharge summary for processing and retrieving translations.
//
// Both calls go through the same same-origin `/api/claude` proxy that `useSummaryParser` uses,
// which keeps the model API key server-side instead of shipping it to the browser.

const ENDPOINT = '/api/claude';

export type ContentBlock =
    | { type: 'text'; text: string }
    | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } };

export interface TranslationResult {
    translatedText: string;
}

/** Sends a request to the Claude proxy and returns the concatenated text of the response. */
export async function callClaude(content: ContentBlock[], system?: string): Promise<string> {
    const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 8000,
            ...(system ? { system } : {}),
            messages: [{ role: 'user', content }],
        }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Request failed (${res.status})`);
    }
    const data = await res.json();
    return (data.content ?? [])
        .map((c: { type: string; text?: string }) => (c.type === 'text' ? c.text ?? '' : ''))
        .join('')
        .trim();
}

/** Sends discharge letter content (text and/or transcribed images) to the model for processing. */
export const sendDischargeSummary = async (content: ContentBlock[], system?: string): Promise<string> => {
    try {
        return await callClaude(content, system);
    } catch (error) {
        console.error('Error sending discharge summary:', error);
        throw error;
    }
};

const TRANSLATE_SYSTEM_PROMPT = `You translate short patient-facing medical text.
Return ONLY the translated text: no preamble, no quotes, no explanation.
Preserve meaning exactly; do not add or omit information.`;

/** Translates a short piece of patient-facing text into the target language. */
export const getTranslations = async (text: string, language: string): Promise<TranslationResult> => {
    try {
        const translatedText = await callClaude(
            [{ type: 'text', text: `Translate the following into ${language}:\n\n${text}` }],
            TRANSLATE_SYSTEM_PROMPT,
        );
        return { translatedText: translatedText || text };
    } catch (error) {
        console.error('Error retrieving translations:', error);
        throw error;
    }
};