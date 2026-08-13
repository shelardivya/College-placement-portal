import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Registration from './Registration';

vi.mock('../../auth/authService', () => ({
  registerStudent: vi.fn()
}));

describe('Registration Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form fields', () => {
    render(<Registration onNavigate={() => {}} />);
    expect(screen.getByText(/Launch Your Career from Campus/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Priya Sharma/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/priya@college.edu.in/i)).toBeInTheDocument();
  });

  it('allows filling out registration form fields', () => {
    render(<Registration onNavigate={() => {}} />);
    const nameInput = screen.getByPlaceholderText(/Priya Sharma/i);
    const emailInput = screen.getByPlaceholderText(/priya@college.edu.in/i);

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@college.edu' } });

    expect(nameInput.value).toBe('Jane Doe');
    expect(emailInput.value).toBe('jane@college.edu');
  });

  it('navigates back to landing page on back button click', () => {
    const onNavigateMock = vi.fn();
    render(<Registration onNavigate={onNavigateMock} />);
    const backBtn = screen.getByText(/Back to Home/i);
    fireEvent.click(backBtn);
    expect(onNavigateMock).toHaveBeenCalledWith('landing');
  });
});
