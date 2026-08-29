import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DischargeSummary from './DischargeSummary';
import { SummaryBlock } from '../../types';

describe('DischargeSummary', () => {
  it('renders a fallback message when there are no blocks', () => {
    render(<DischargeSummary summaryBlocks={[]} />);
    expect(screen.getByText(/No summary loaded yet/i)).toBeInTheDocument();
  });

  it('renders a fallback message when summaryBlocks is not provided as an array', () => {
    // @ts-expect-error - intentionally testing runtime guard against bad input
    render(<DischargeSummary summaryBlocks={null} />);
    expect(screen.getByText(/No summary loaded yet/i)).toBeInTheDocument();
  });

  it('renders one Block per entry in summaryBlocks', () => {
    const blocks: SummaryBlock[] = [
      { id: '1', type: 'medication', content: 'Take paracetamol 500mg.' },
      { id: '2', type: 'redFlag', content: 'Call 000 if chest pain.' },
      { id: '3', type: 'appointment', content: 'See GP next week.' },
    ];

    render(<DischargeSummary summaryBlocks={blocks} />);

    expect(screen.getByText('Take paracetamol 500mg.')).toBeInTheDocument();
    expect(screen.getByText('Call 000 if chest pain.')).toBeInTheDocument();
    expect(screen.getByText('See GP next week.')).toBeInTheDocument();
  });

  it('renders blocks in the same order they were provided', () => {
    const blocks: SummaryBlock[] = [
      { id: '1', type: 'medication', content: 'First block' },
      { id: '2', type: 'schedule', content: 'Second block' },
      { id: '3', type: 'contact', content: 'Third block' },
    ];

    const { container } = render(<DischargeSummary summaryBlocks={blocks} />);
    const renderedTexts = Array.from(
      container.querySelectorAll('.discharge-summary .block')
    ).map((el) => el.textContent);

    expect(renderedTexts).toEqual(['First block', 'Second block', 'Third block']);
  });

  it('uses block id as the React key (no duplicate-key warning) for unique ids', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const blocks: SummaryBlock[] = [
      { id: '1', type: 'medication', content: 'A' },
      { id: '2', type: 'medication', content: 'B' },
    ];

    render(<DischargeSummary summaryBlocks={blocks} />);

    const keyWarning = consoleErrorSpy.mock.calls.some((args) =>
      String(args[0]).includes('key')
    );
    expect(keyWarning).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});
