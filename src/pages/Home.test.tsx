import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Home from './Home';

describe('Home', () => {
  it('renders the introductory heading and description', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Okso' })).toBeInTheDocument();
    expect(screen.getByText(/broken into blocks you can actually follow/i)).toBeInTheDocument();
  });

  it('lists the how-it-works steps', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByText('Share your letter')).toBeInTheDocument();
    expect(screen.getByText('Get plain-language blocks')).toBeInTheDocument();
    expect(screen.getByText('Read it your way')).toBeInTheDocument();
  });

  it('links to the discharge summary page', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: /view discharge summary/i });
    expect(link).toHaveAttribute('href', '/summary');
  });
});
