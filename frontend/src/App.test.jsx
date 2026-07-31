import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Sanity Test', () => {
  it('renders a simple element correctly', () => {
    render(<div>Vitest Setup Verification</div>);
    expect(screen.getByText('Vitest Setup Verification')).toBeInTheDocument();
  });
});
