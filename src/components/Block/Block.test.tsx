import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Block from './Block';
import { Block as ParsedBlock } from '../../hooks/useSummaryParser';

const baseBlock = (overrides: Partial<ParsedBlock>): ParsedBlock => ({
  id: 'test-id',
  type: 'info',
  priority: 'routine',
  title: 'Test Title',
  content: 'Verbatim source sentence.',
  plain_summary: 'Plain summary text.',
  fields: {},
  missing: [],
  source: { section: 'Section', text: 'Verbatim source sentence.' },
  ...overrides,
});

describe('Block', () => {
  it('renders medication blocks with dose and frequency fields', () => {
    const block = baseBlock({
      type: 'medication',
      title: 'Paracetamol',
      plain_summary: 'Take this for pain relief.',
      fields: { dose: '500 mg', frequency: 'every 6 hours' },
    });

    render(<Block block={block} />);

    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    expect(screen.getByText('Take this for pain relief.')).toBeInTheDocument();
    expect(screen.getByText('500 mg')).toBeInTheDocument();
    expect(screen.getByText('every 6 hours')).toBeInTheDocument();
  });

  it('renders redFlag blocks with critical priority styling', () => {
    const block = baseBlock({
      type: 'redFlag',
      priority: 'critical',
      title: 'Chest pain warning',
      fields: { action: 'Call 000', items: ['Chest pain', 'Difficulty breathing'] },
    });

    const { container } = render(<Block block={block} />);

    expect(screen.getByText('Chest pain warning')).toBeInTheDocument();
    expect(screen.getByText('Call 000')).toBeInTheDocument();
    expect(screen.getByText('Chest pain')).toBeInTheDocument();
    expect(screen.getByText('Difficulty breathing')).toBeInTheDocument();
    expect(container.querySelector('[data-block-priority="critical"]')).toBeInTheDocument();
  });

  it('renders appointment blocks with who/when/where/booked_by', () => {
    const block = baseBlock({
      type: 'appointment',
      title: 'Follow-up with GP',
      fields: { when: 'Next Monday', where: 'Clinic A', booked_by: 'hospital' },
    });

    render(<Block block={block} />);

    expect(screen.getByText('Next Monday')).toBeInTheDocument();
    expect(screen.getByText('Clinic A')).toBeInTheDocument();
    expect(screen.getByText('The hospital')).toBeInTheDocument();
  });

  it('shows a "check with your nurse" notice when fields are missing', () => {
    const block = baseBlock({
      type: 'medication',
      title: 'Ibuprofen',
      missing: ['dose', 'frequency'],
    });

    render(<Block block={block} />);

    expect(screen.getByText(/Check this with your nurse/i)).toBeInTheDocument();
    expect(screen.getByText(/dose, frequency/)).toBeInTheDocument();
  });

  it('does not show the missing-fields notice when nothing is missing', () => {
    const block = baseBlock({ missing: [] });

    render(<Block block={block} />);

    expect(screen.queryByText(/Check this with your nurse/i)).not.toBeInTheDocument();
  });

  it('applies the correct data attributes for type and priority', () => {
    const block = baseBlock({ type: 'task', priority: 'important' });

    const { container } = render(<Block block={block} />);

    const el = container.querySelector('.block');
    expect(el).toHaveAttribute('data-block-type', 'task');
    expect(el).toHaveAttribute('data-block-priority', 'important');
  });
});

