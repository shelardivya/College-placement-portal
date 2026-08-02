import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QueriesStories from './QueriesStories';

vi.mock('../../auth/authService', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getAllQueries: vi.fn().mockResolvedValue({ data: [] }),
    getAllPlacementStories: vi.fn().mockResolvedValue({ data: [] }),
    getAllPlacementDrives: vi.fn().mockResolvedValue({ data: [] }),
    getAllStudentsForDrive: vi.fn().mockResolvedValue({ data: [] }),
    replyToQuery: vi.fn().mockResolvedValue({ data: {} }),
    publishPlacementStory: vi.fn().mockResolvedValue({ data: {} }),
    updatePlacementStory: vi.fn().mockResolvedValue({ data: {} }),
    deletePlacementStory: vi.fn().mockResolvedValue({ data: {} })
  };
});

describe('QueriesStories Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Queries and Stories panel titles', async () => {
    render(<QueriesStories onNavigate={() => {}} />);
    expect(screen.getAllByText(/Student Queries/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Create Placement Story/i)).toBeInTheDocument();
  });
});
