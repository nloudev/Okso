import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DischargeSummary from './DischargeSummary';
import { Block as ParsedBlock } from '../../hooks/useSummaryParser';

const makeBlock = (overrides: Partial<ParsedBlock>): ParsedBlock => ({
  id: 'id',
  type: 'info',
  priority: 'routine',
  title: 'Title',
  content: 'Content',
  plain_summary: 'Summary',
  fields: {},
  missing: [],
  source: { section: 'Section', text: 'Content' },
  ...overrides,
});

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

  it('renders one Block per entry, grouped under section headings', () => {
    const blocks: ParsedBlock[] = [
      makeBlock({ id: '1', type: 'medication', title: 'Paracetamol' }),
      makeBlock({ id: '2', type: 'redFlag', title: 'Chest pain' }),
      makeBlock({ id: '3', type: 'appointment', title: 'GP follow-up' }),
    ];

    render(<DischargeSummary summaryBlocks={blocks} />);

    expect(screen.getByText(/Red Flags/i)).toBeInTheDocument();
    expect(screen.getByText(/Medications/i)).toBeInTheDocument();
    expect(screen.getByText(/Appointments/i)).toBeInTheDocument();
    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    expect(screen.getByText('Chest pain')).toBeInTheDocument();
    expect(screen.getByText('GP follow-up')).toBeInTheDocument();
  });

  it('renders the redFlag section before the medication section', () => {
    const blocks: ParsedBlock[] = [
      makeBlock({ id: '1', type: 'medication', title: 'Paracetamol' }),
      makeBlock({ id: '2', type: 'redFlag', title: 'Chest pain' }),
    ];

    render(<DischargeSummary summaryBlocks={blocks} />);

    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    const redFlagIndex = headings.findIndex((t) => t?.includes('Red Flags'));
    const medicationIndex = headings.findIndex((t) => t?.includes('Medications'));

    expect(redFlagIndex).toBeGreaterThanOrEqual(0);
    expect(redFlagIndex).toBeLessThan(medicationIndex);
  });

  it('does not render a section heading for block types with no data', () => {
    const blocks: ParsedBlock[] = [makeBlock({ id: '1', type: 'task', title: 'Book blood test' })];

    render(<DischargeSummary summaryBlocks={blocks} />);

    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    expect(screen.queryByText(/Medications/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Red Flags/i)).not.toBeInTheDocument();
  });

  it('renders multiple blocks of the same type within one section', () => {
    const blocks: ParsedBlock[] = [
      makeBlock({ id: '1', type: 'appointment', title: 'Dr. Smith' }),
      makeBlock({ id: '2', type: 'appointment', title: 'Physiotherapist' }),
    ];

    render(<DischargeSummary summaryBlocks={blocks} />);

    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByText('Physiotherapist')).toBeInTheDocument();
  });

  it('does not produce React key warnings for unique ids', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const blocks: ParsedBlock[] = [
      makeBlock({ id: '1', type: 'medication', title: 'A' }),
      makeBlock({ id: '2', type: 'medication', title: 'B' }),
    ];

    render(<DischargeSummary summaryBlocks={blocks} />);

    const keyWarning = consoleErrorSpy.mock.calls.some((args) => String(args[0]).includes('key'));
    expect(keyWarning).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});

