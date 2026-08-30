import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { authApi } from '@/features/auth/authApi';
import { useAuth } from '@/features/auth/useAuth';

import { Login } from './Login';

vi.mock('@/features/auth/authApi', () => ({
  authApi: { login: vi.fn() },
}));
vi.mock('@/features/auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Login account deletion states', () => {
  const setUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      setUser,
      logout: vi.fn(),
    });
  });

  it('shows the exact scheduled date after a deletion request', () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/login',
            state: {
              accountDeletion: { deletionDate: '2026-09-30' },
            },
          },
        ]}
      >
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toHaveTextContent('September 30, 2026');
  });

  it('routes valid pending-account credentials to explicit restoration', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      status: 'restoration_required',
      deletion: {
        state: 'pending',
        requested_at: '2026-08-31T01:30:00.000Z',
        recovery_deadline: '2026-09-30T01:30:00.000Z',
        deletion_date: '2026-09-30',
        username: 'recoverable',
      },
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/restore-account" element={<p>Restore screen</p>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'recoverable@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password-password' },
    });
    fireEvent.submit(screen.getByLabelText('Email address').closest('form')!);

    await waitFor(() =>
      expect(authApi.login).toHaveBeenCalledWith({
        email: 'recoverable@example.com',
        password: 'password-password',
      })
    );
    expect(setUser).toHaveBeenCalledWith(null);
    expect(await screen.findByText('Restore screen')).toBeInTheDocument();
  });
});
