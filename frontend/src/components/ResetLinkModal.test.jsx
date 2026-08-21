import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResetLinkModal from './ResetLinkModal';

describe('ResetLinkModal Component', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ResetLinkModal isOpen={false} onClose={() => {}} onSimulateClick={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when isOpen is true', () => {
    render(<ResetLinkModal isOpen={true} onClose={() => {}} onSimulateClick={() => {}} />);
    expect(screen.getByText('Reset Link Sent!')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
    expect(screen.getByText(/Simulate Link CLick/i)).toBeInTheDocument();
  });

  it('triggers onClose when Close button is clicked', () => {
    const onCloseMock = vi.fn();
    render(<ResetLinkModal isOpen={true} onClose={onCloseMock} onSimulateClick={() => {}} />);
    fireEvent.click(screen.getByText('Close'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('triggers onSimulateClick when Simulate button is clicked', () => {
    const onSimulateMock = vi.fn();
    render(<ResetLinkModal isOpen={true} onClose={() => {}} onSimulateClick={onSimulateMock} />);
    fireEvent.click(screen.getByText(/Simulate Link CLick/i));
    expect(onSimulateMock).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when clicking modal-overlay backdrop', () => {
    const onCloseMock = vi.fn();
    render(<ResetLinkModal isOpen={true} onClose={onCloseMock} onSimulateClick={() => {}} />);
    const overlay = screen.getByLabelText('Close reset link modal backdrop');
    fireEvent.click(overlay);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
