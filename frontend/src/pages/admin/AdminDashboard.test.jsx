import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminDashboard from './AdminDashboard';

vi.mock('../../auth/authService', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getAdminProfile: vi.fn().mockResolvedValue({ data: { fullName: 'Admin User' } }),
    getAdminDashboardStats: vi.fn().mockResolvedValue({ data: {} }),
    getAdminRecentPosts: vi.fn().mockResolvedValue({ data: [] }),
    getAllPlacementDrives: vi.fn().mockResolvedValue({ data: [] }),
    getAdminNotifications: vi.fn().mockResolvedValue({ data: [] }),
    getAdminUnreadCount: vi.fn().mockResolvedValue({ data: { count: 0 } }),
    getAdminApplicantsMatching: vi.fn().mockResolvedValue({ data: [] }),
    getDrafts: vi.fn().mockResolvedValue({ data: [] }),
    getAdminStudentAnalyticsDashboard: vi.fn().mockResolvedValue({ data: {} }),
    markAllAdminNotificationsAsRead: vi.fn().mockResolvedValue({ data: {} }),
    addPlacementDrive: vi.fn().mockResolvedValue({ data: {} }),
    updatePlacementDrive: vi.fn().mockResolvedValue({ data: {} }),
    deletePlacementDrive: vi.fn().mockResolvedValue({ data: {} }),
    updateAdminProfile: vi.fn().mockResolvedValue({ data: {} }),
    changePassword: vi.fn().mockResolvedValue({ data: {} })
  };
});

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('admin_user', JSON.stringify({ fullName: 'Admin User', email: 'admin@college.edu' }));
  });

  it('renders admin dashboard heading and tabs', async () => {
    render(<AdminDashboard onNavigate={() => {}} />);
    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
  });
});
