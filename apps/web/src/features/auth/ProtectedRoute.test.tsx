import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute';

import { useAuth } from '@/features/auth/useAuth';

vi.mock('@/features/auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe('ProtectedRoute', () => {
  it('shows a loading boundary while authentication is unresolved', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      setUser: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard/profile']}>
        <Routes>
          <Route element={<ProtectedRoute />} path="/dashboard/profile">
            <Route element={<p>Workspace</p>} path="" />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Workspace')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('redirects unauthenticated visitors while preserving the destination', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      setUser: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard/links?tab=all']}>
        <Routes>
          <Route element={<ProtectedRoute />} path="/dashboard/links">
            <Route element={<p>Workspace</p>} path="" />
          </Route>
          <Route element={<p>Login</p>} path="/login" />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders the protected outlet for authenticated visitors', () => {
    mockedUseAuth.mockReturnValue({
      user: {
        id: 1,
        name: 'Creator',
        email: 'creator@example.com',
        profile: { id: 1, username: 'creator' },
      },
      isLoading: false,
      setUser: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard/profile']}>
        <Routes>
          <Route element={<ProtectedRoute />} path="/dashboard/profile">
            <Route element={<p>Workspace</p>} path="" />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Workspace')).toBeInTheDocument();
  });
});
