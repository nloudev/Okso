// This utility function assesses the reading level of the discharge summary text to determine the appropriate presentation format.

export type ReadingLevel = 'Very Easy' | 'Easy' | 'Medium' | 'Difficult';

const LEVEL_ORDER: ReadingLevel[] = ['Very Easy', 'Easy', 'Medium', 'Difficult'];

export const calculateReadingLevel = (text: string): ReadingLevel => {
    // Simple logic to determine reading level based on average word length and sentence length
    const words = (text.trim().match(/\S+/g) ?? []).length;
    
    //No words to assess - return early so the formula never divides by zero.
    if (words == 0) return 'Very Easy';
    const sentences = Math.max(text.split(/[.!?]+/).filter(s => s.trim()).length, 1);
    const syllables = Math.max(text.toLowerCase().split(/[aeiouy]{1,2}/).length - 1, words);

    const readingLevel = (0.39 * (words / sentences)) + (11.8 * (syllables / words)) - 15.59;

    if (readingLevel < 5) {
        return 'Very Easy';
    } else if (readingLevel < 8) {
        return 'Easy';
    } else if (readingLevel < 12) {
        return 'Medium';
    } else {
        return 'Difficult';
    }
};

// Filler phrases that can be dropped or shortened without changing clinical meaning.
const FILLER_REPLACEMENTS: Array<[RegExp, string]> = [
    [/\bin order to\b/gi, 'to'],
    [/\bdue to the fact that\b/gi, 'because'],
    [/\bat this point in time\b/gi, 'now'],
    [/\bin the event that\b/gi, 'if'],
    [/\bfor the purpose of\b/gi, 'for'],
    [/\bwith regard to\b/gi, 'about'],
    [/\bplease be advised that\b/gi, ''],
    [/\bit is important to note that\b/gi, ''],
    [/\bbasically\b/gi, ''],
    [/\bessentially\b/gi, ''],
    [/\bactually\b/gi, ''],
];

/** Drops filler phrases and tidies the spacing/punctuation left behind. */
function removeFillers(text: string): string {
    const stripped = FILLER_REPLACEMENTS.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
    return stripped.replace(/\s{2,}/g, ' ').replace(/\s+([,.!?])/g, '$1').trim();
}

const capitalise = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1);

// Coordinating conjunctions a long sentence can safely be split at without changing its wording.
const SPLIT_POINT = /,\s+(and|but|or|so)\s+/i;

const wordCount = (text: string): number => (text.trim().match(/\S+/g) ?? []).length;

/** Splits the longest splittable sentence in two at its first coordinating conjunction. */
function splitLongestSentence(text: string): string {
    const sentences = text.split(/(?<=[.!?])\s+/);

    let targetIndex = -1;
    let mostWords = 0;
    sentences.forEach((sentence, i) => {
        if (SPLIT_POINT.test(sentence) && wordCount(sentence) > mostWords) {
            targetIndex = i;
            mostWords = wordCount(sentence);
        }
    });
    if (targetIndex === -1) return text;

    const sentence = sentences[targetIndex];
    const match = sentence.match(SPLIT_POINT);
    if (!match || match.index === undefined) return text;

    const before = sentence.slice(0, match.index).replace(/[,\s]+$/, '');
    const after = sentence.slice(match.index + match[0].length);

    sentences[targetIndex] = `${before}. ${capitalise(match[1])} ${capitalise(after)}`;
    return sentences.join(' ');
}

/** Mechanically simplifies text toward a target reading level without changing wording. */
export const adjustReadingLevel = (text: string, targetLevel: ReadingLevel = 'Easy'): string => {
    const targetIndex = LEVEL_ORDER.indexOf(targetLevel);
    let current = text;

    // Bounded loop: each pass should simplify a little more; stop at the target level or
    // once a pass changes nothing (there's nothing left it's safe to simplify further).
    for (let i = 0; i < 10; i++) {
        if (LEVEL_ORDER.indexOf(calculateReadingLevel(current)) <= targetIndex) break;

        const next = splitLongestSentence(removeFillers(current));
        if (next === current) break;
        current = next;
    }

    return current;
};