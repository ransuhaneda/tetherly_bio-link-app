import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { authApi } from '@/features/auth/authApi';
import { useAuth } from '@/features/auth/useAuth';

import { RestoreAccount } from './RestoreAccount';

vi.mock('@/features/auth/authApi', () => ({
  authApi: {
    recovery: vi.fn(),
    restore: vi.fn(),
  },
}));
vi.mock('@/features/auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

const deletion = {
  state: 'pending' as const,
  requested_at: '2026-08-31T01:30:00.000Z',
  recovery_deadline: '2026-09-30T01:30:00.000Z',
  deletion_date: '2026-09-30',
  username: 'recoverable',
};

describe('RestoreAccount', () => {
  const setUser = vi.fn();
  const logout = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      setUser,
      logout,
    });
    vi.mocked(authApi.recovery).mockResolvedValue({
      status: 'restoration_required',
      deletion,
    });
  });

  it('requires an explicit restore action and shows the calendar deletion date', async () => {
    const restoredUser = {
      id: 1,
      name: 'Creator',
      email: 'recoverable@example.com',
      profile: { id: 1, username: 'recoverable' },
    };
    vi.mocked(authApi.restore).mockResolvedValue({
      status: 'authenticated',
      user: restoredUser,
    });

    render(
      <MemoryRouter initialEntries={['/restore-account']}>
        <Routes>
          <Route path="/restore-account" element={<RestoreAccount />} />
          <Route path="/dashboard/profile" element={<p>Workspace</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole('heading', {
        name: 'Restore your Tetherly account',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('September 30, 2026')).toBeInTheDocument();
    expect(setUser).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Restore account/i }));

    await waitFor(() => expect(authApi.restore).toHaveBeenCalledOnce());
    expect(setUser).toHaveBeenCalledWith(restoredUser);
    expect(await screen.findByText('Workspace')).toBeInTheDocument();
  });

  it('lets the creator leave without restoring', async () => {
    render(
      <MemoryRouter initialEntries={['/restore-account']}>
        <Routes>
          <Route path="/restore-account" element={<RestoreAccount />} />
          <Route path="/login" element={<p>Login screen</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole('button', { name: 'Log out' })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Log out' }));

    await waitFor(() => expect(logout).toHaveBeenCalledOnce());
    expect(setUser).not.toHaveBeenCalled();
    expect(await screen.findByText('Login screen')).toBeInTheDocument();
  });
});
