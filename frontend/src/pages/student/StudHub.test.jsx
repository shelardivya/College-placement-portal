import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudHub from './StudHub';

vi.mock('../../auth/authService', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getStudentQueries: vi.fn().mockResolvedValue({ data: [] }),
    submitStudentQuery: vi.fn().mockResolvedValue({ data: {} }),
    resolveStudentQuery: vi.fn().mockResolvedValue({ data: {} }),
    getStudentPlacementStories: vi.fn().mockResolvedValue({ data: [] }),
    getStudentPlacementDrives: vi.fn().mockResolvedValue({ data: [] })
  };
});

describe('StudHub Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders student hub panel headings', async () => {
    render(<StudHub onNavigate={() => {}} />);
    expect(screen.getByText(/Raise a Query/i)).toBeInTheDocument();
  });
});
