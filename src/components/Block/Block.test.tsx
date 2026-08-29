import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Block from './Block';
import { SummaryBlock } from '../../types';

describe('Block', () => {
  it('renders medication blocks with the medication class', () => {
    const block: SummaryBlock = {
      id: '1',
      type: 'medication',
      content: 'Take paracetamol 500mg every 6 hours.',
    };

    render(<Block block={block} />);

    const content = screen.getByText(block.content);
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('block', 'medication');
  });

  it('renders schedule blocks with the schedule class', () => {
    const block: SummaryBlock = {
      id: '2',
      type: 'schedule',
      content: 'Morning: Paracetamol',
    };

    render(<Block block={block} />);

    const content = screen.getByText(block.content);
    expect(content).toHaveClass('block', 'schedule');
  });

  it('renders redFlag blocks with the red-flag class', () => {
    const block: SummaryBlock = {
      id: '3',
      type: 'redFlag',
      content: 'Call 000 if you experience chest pain.',
    };

    render(<Block block={block} />);

    const content = screen.getByText(block.content);
    expect(content).toHaveClass('block', 'red-flag');
  });

  it('falls back to the default class for unhandled types', () => {
    const block: SummaryBlock = {
      id: '4',
      type: 'appointment',
      content: 'See Dr. Smith next Monday.',
    };

    render(<Block block={block} />);

    const content = screen.getByText(block.content);
    expect(content).toHaveClass('block', 'default');
  });

  it('wraps rendered content in a block-container', () => {
    const block: SummaryBlock = {
      id: '5',
      type: 'contact',
      content: 'Ward 5: 1800 022 222',
    };

    const { container } = render(<Block block={block} />);
    expect(container.querySelector('.block-container')).toBeInTheDocument();
  });
});
