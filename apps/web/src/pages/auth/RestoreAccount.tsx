import { useEffect, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { formatDeletionDate } from '@/features/account-deletion/formatDeletionDate';
import { authApi } from '@/features/auth/authApi';
import { useAuth } from '@/features/auth/useAuth';
import { getApiError } from '@/services/api';
import type { AccountDeletion } from '@/types/api';

import sty from './RestoreAccount.module.scss';

export function RestoreAccount() {
  const navigate = useNavigate();
  const { setUser, logout } = useAuth();
  const [deletion, setDeletion] = useState<AccountDeletion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    authApi
      .recovery()
      .then(result => {
        if (active) setDeletion(result.deletion);
      })
      .catch(recoveryError => {
        if (active) {
          const status = getApiError(recoveryError).status;
          setError(
            status === 403
              ? 'This account can no longer be restored.'
              : 'Sign in again to continue account restoration.'
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const restore = async () => {
    setError('');
    setIsRestoring(true);
    try {
      const result = await authApi.restore();
      setUser(result.user);
      navigate('/dashboard/profile', { replace: true });
    } catch (restoreError) {
      const status = getApiError(restoreError).status;
      setError(
        status === 403
          ? 'This account can no longer be restored.'
          : 'Your account could not be restored. Try signing in again.'
      );
    } finally {
      setIsRestoring(false);
    }
  };

  const leave = async () => {
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <section className={sty.page}>
      <div className={sty.card}>
        <h1>Restore your Tetherly account</h1>
        {isLoading && (
          <p role="status">Checking your account recovery window…</p>
        )}
        {!isLoading && deletion && (
          <>
            <p>
              The account for <strong>@{deletion.username}</strong> is scheduled
              for permanent deletion on{' '}
              <strong>{formatDeletionDate(deletion.deletion_date)}</strong>.
            </p>
            <ul>
              <li>Your profile, links, and publication history will remain.</li>
              <li>Your profile will return as an unpublished draft.</li>
              <li>You choose when to publish it again.</li>
            </ul>
            <div className={sty.actions}>
              <Button
                type="button"
                onClick={() => void restore()}
                disabled={isRestoring}
              >
                {isRestoring ? 'Restoring…' : 'Restore account'}
                {!isRestoring && <FiArrowRight aria-hidden="true" />}
              </Button>
              <Button
                type="button"
                variant="tertiary"
                customClass={sty.secondaryAction}
                onClick={() => void leave()}
                disabled={isRestoring}
              >
                Log out
              </Button>
            </div>
          </>
        )}
        {!isLoading && error && (
          <>
            <p className={sty.error} role="alert">
              {error}
            </p>
            <Button type="button" onClick={() => void leave()}>
              Return to login
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
