import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageSelector from './LanguageSelector';

describe('LanguageSelector', () => {
  it('renders the default language options with the selected value', () => {
    render(<LanguageSelector value="en" onChange={() => {}} />);

    const select = screen.getByLabelText(/select language/i) as HTMLSelectElement;
    expect(select.value).toBe('en');
    expect(screen.getByText('Spanish')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
  });

  it('calls onChange with the chosen language code', () => {
    const onChange = jest.fn();
    render(<LanguageSelector value="en" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText(/select language/i), { target: { value: 'es' } });

    expect(onChange).toHaveBeenCalledWith('es');
  });

  it('disables the select and shows a status message while translating', () => {
    render(<LanguageSelector value="en" onChange={() => {}} disabled />);

    expect(screen.getByLabelText(/select language/i)).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent(/translating/i);
  });

  it('supports a custom list of languages', () => {
    render(
      <LanguageSelector
        value="de"
        onChange={() => {}}
        languages={[{ code: 'de', label: 'German' }]}
      />,
    );

    expect(screen.getByText('German')).toBeInTheDocument();
    expect(screen.queryByText('Spanish')).not.toBeInTheDocument();
  });
});
