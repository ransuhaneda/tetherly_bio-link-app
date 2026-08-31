import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import { accountDeletionApi } from '@/features/account-deletion/accountDeletionApi';
import { useAuth } from '@/features/auth/useAuth';
import { getApiError } from '@/services/api';

import { AccountDangerZone } from './AccountDangerZone';

vi.mock('@/features/account-deletion/accountDeletionApi', () => ({
  accountDeletionApi: { request: vi.fn() },
}));
vi.mock('@/features/auth/useAuth', () => ({
  useAuth: vi.fn(),
}));
vi.mock('@/services/api', () => ({
  getApiError: vi.fn(),
}));

function LoginConfirmation() {
  const location = useLocation();
  const state = location.state as {
    accountDeletion?: { deletionDate?: string };
  } | null;
  return <p>Deletion date: {state?.accountDeletion?.deletionDate}</p>;
}

const deletion = {
  state: 'pending' as const,
  requested_at: '2026-08-31T01:30:00.000Z',
  recovery_deadline: '2026-09-30T01:30:00.000Z',
  deletion_date: '2026-09-30',
  username: 'creator',
};

function renderDangerZone() {
  return render(
    <MemoryRouter initialEntries={['/dashboard/profile']}>
      <Routes>
        <Route path="/dashboard/profile" element={<AccountDangerZone />} />
        <Route path="/login" element={<LoginConfirmation />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('AccountDangerZone', () => {
  const setUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: 1,
        name: 'Creator',
        email: 'creator@example.com',
        profile: { id: 1, username: 'creator' },
      },
      isLoading: false,
      setUser,
      logout: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('opens an accessible confirmation dialog and restores focus on cancel', () => {
    renderDangerZone();
    const trigger = screen.getByRole('button', {
      name: 'Request account deletion',
    });

    fireEvent.click(trigger);

    expect(
      screen.getByRole('dialog', {
        name: 'Schedule permanent account deletion',
      })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Current password')).toHaveFocus();
    expect(
      screen.getByText('Every Tetherly session is signed out.')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('requires the current password before sending a request', () => {
    renderDangerZone();
    fireEvent.click(
      screen.getByRole('button', { name: 'Request account deletion' })
    );
    fireEvent.click(screen.getByRole('button', { name: 'Schedule deletion' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter your current password.'
    );
    expect(accountDeletionApi.request).not.toHaveBeenCalled();
  });

  it('signs out local state and shows the exact API deletion date after success', async () => {
    vi.mocked(accountDeletionApi.request).mockResolvedValue(deletion);
    renderDangerZone();
    fireEvent.click(
      screen.getByRole('button', { name: 'Request account deletion' })
    );
    fireEvent.change(screen.getByLabelText('Current password'), {
      target: { value: 'password-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Schedule deletion' }));

    await waitFor(() =>
      expect(accountDeletionApi.request).toHaveBeenCalledWith(
        'password-password'
      )
    );
    expect(setUser).toHaveBeenCalledWith(null);
    expect(
      await screen.findByText('Deletion date: 2026-09-30')
    ).toBeInTheDocument();
  });

  it('uses the API retry value for a countdown while keeping cancel available', async () => {
    vi.useFakeTimers();
    vi.mocked(accountDeletionApi.request).mockRejectedValue(new Error('rate'));
    vi.mocked(getApiError).mockReturnValue({
      status: 429,
      message: 'Rate limited',
      retry_after: 2,
    });
    renderDangerZone();
    fireEvent.click(
      screen.getByRole('button', { name: 'Request account deletion' })
    );
    fireEvent.change(screen.getByLabelText('Current password'), {
      target: { value: 'incorrect' },
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Schedule deletion' })
      );
      await Promise.resolve();
    });

    const retryButton = screen.getByRole('button', {
      name: 'Try again in 2 seconds',
    });
    expect(retryButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();

    act(() => vi.advanceTimersByTime(1000));
    expect(
      screen.getByRole('button', { name: 'Try again in 1 seconds' })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
