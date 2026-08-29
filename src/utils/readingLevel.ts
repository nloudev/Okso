// This utility function assesses the reading level of the discharge summary text to determine the appropriate presentation format.

export const assessReadingLevel = (text: string): string => {
    // Simple logic to determine reading level based on average word length and sentence length
    const words = text.split(' ').length;
    const sentences = text.split('.').length - 1;
    const syllables = text.split(/[aeiouy]{1,2}/).length - 1; // Rough estimate of syllables

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