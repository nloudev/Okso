import { calculateReadingLevel } from './readingLevel';

test('calculates reading level correctly', () => {
	expect(calculateReadingLevel('This is a test sentence.')).toBe('Very Easy');
});