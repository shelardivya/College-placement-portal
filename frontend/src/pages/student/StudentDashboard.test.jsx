import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentDashboard from './StudentDashboard';

vi.mock('../../auth/authService', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getStudentProfile: vi.fn().mockResolvedValue({ data: { fullName: 'Student User' } }),
    getStudentDashboardStats: vi.fn().mockResolvedValue({ data: {} }),
    getLatestJobs: vi.fn().mockResolvedValue({ data: [] }),
    getStudentNotifications: vi.fn().mockResolvedValue({ data: [] }),
    getStudentUnreadCount: vi.fn().mockResolvedValue({ data: { count: 0 } }),
    getStudentResumeMatch: vi.fn().mockResolvedValue({ data: [] }),
    markAllStudentNotificationsAsRead: vi.fn().mockResolvedValue({ data: {} }),
    updateStudentProfile: vi.fn().mockResolvedValue({ data: {} }),
    applyForJob: vi.fn().mockResolvedValue({ data: {} }),
    changePassword: vi.fn().mockResolvedValue({ data: {} })
  };
});

describe('StudentDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({ fullName: 'Student User', email: 'student@college.edu' }));
  });

  it('renders student dashboard header and overview', async () => {
    render(<StudentDashboard onNavigate={() => {}} />);
    expect(screen.getByText('Campus_Hire')).toBeInTheDocument();
  });
});
