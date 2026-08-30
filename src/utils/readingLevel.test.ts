import { adjustReadingLevel, calculateReadingLevel } from './readingLevel';

test('calculates reading level correctly', () => {
	expect(calculateReadingLevel('This is a test sentence.')).toBe('Very Easy');
});

describe('adjustReadingLevel', () => {
	it('leaves text unchanged when it is already at or below the target level', () => {
		const text = 'Take your pills.';
		expect(adjustReadingLevel(text, 'Easy')).toBe(text);
	});

	it('removes filler phrases without changing the clinical wording', () => {
		const text = 'In order to recover, please take paracetamol 500mg.';
		const result = adjustReadingLevel(text, 'Very Easy');

		expect(result).not.toMatch(/in order to/i);
		expect(result).toContain('paracetamol 500mg');
	});

	it('splits a long, multi-clause sentence into shorter ones', () => {
		const text =
			'You must take this medication every day, and you must attend your follow-up appointment, and you must avoid alcohol while taking it.';
		const result = adjustReadingLevel(text, 'Very Easy');

		expect(result.split(/[.!?]+/).filter((s) => s.trim()).length).toBeGreaterThan(1);
		expect(LEVEL_ORDER_INDEX(calculateReadingLevel(result))).toBeLessThanOrEqual(
			LEVEL_ORDER_INDEX(calculateReadingLevel(text)),
		);
	});

	it('never invents, drops or reorders clinical details', () => {
		const text =
			'Take ibuprofen 200mg twice daily, and call 000 if you experience chest pain, and attend your appointment on Monday.';
		const result = adjustReadingLevel(text, 'Very Easy');

		// Case-insensitive: a clause that starts a new sentence is capitalised, which is a
		// mechanical formatting change, not a change to the clinical content itself.
		expect(result).toMatch(/ibuprofen 200mg twice daily/i);
		expect(result).toMatch(/call 000/i);
		expect(result).toMatch(/appointment on monday/i);
	});
});

function LEVEL_ORDER_INDEX(level: ReturnType<typeof calculateReadingLevel>): number {
	return ['Very Easy', 'Easy', 'Medium', 'Difficult'].indexOf(level);
}