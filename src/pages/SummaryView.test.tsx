import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SummaryView from './SummaryView';

describe('SummaryView', () => {
  it('shows the empty state and input form before anything is parsed', () => {
    render(<SummaryView />);

    expect(screen.getByText(/no summary loaded yet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/paste your discharge letter/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /parse my letter/i })).toBeInTheDocument();
  });

  it('parses pasted text into blocks on submit', () => {
    render(<SummaryView />);

    fireEvent.change(screen.getByLabelText(/paste your discharge letter/i), {
      target: { value: 'Take paracetamol 500mg every 6 hours as needed.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /parse my letter/i }));

    expect(screen.queryByText(/no summary loaded yet/i)).not.toBeInTheDocument();
    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
  });

  it('shows an error when submitting with no text or image', () => {
    render(<SummaryView />);

    fireEvent.click(screen.getByRole('button', { name: /parse my letter/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/no readable text/i);
  });

  it('only shows the language selector once there are blocks to translate', () => {
    render(<SummaryView />);

    expect(screen.queryByLabelText(/select language/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/paste your discharge letter/i), {
      target: { value: 'Take paracetamol 500mg every 6 hours as needed.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /parse my letter/i }));

    expect(screen.getByLabelText(/select language/i)).toBeInTheDocument();
  });
});
