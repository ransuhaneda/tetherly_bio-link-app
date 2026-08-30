import { useEffect, useRef, useState, type FormEvent } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { accountDeletionApi } from '@/features/account-deletion/accountDeletionApi';
import { useAuth } from '@/features/auth/useAuth';
import { getApiError } from '@/services/api';

import sty from './AccountDangerZone.module.scss';

export function AccountDangerZone() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  const dialogRef = useRef<HTMLElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  useEffect(() => {
    if (!isOpen) return;

    const trigger = triggerRef.current;
    passwordRef.current?.focus();
    const focusable = () => [
      ...(dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
      ) ?? []),
    ];
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmittingRef.current) {
        setIsOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || retryAfter < 1) return;

    const timer = window.setInterval(() => {
      setRetryAfter(value => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, retryAfter]);

  const open = () => {
    setPassword('');
    setError('');
    setRetryAfter(0);
    setIsOpen(true);
  };

  const close = () => {
    if (isSubmitting) return;
    setIsOpen(false);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) {
      setError('Enter your current password.');
      passwordRef.current?.focus();
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const deletion = await accountDeletionApi.request(password);
      setUser(null);
      navigate('/login', {
        replace: true,
        state: {
          accountDeletion: { deletionDate: deletion.deletion_date },
        },
      });
    } catch (requestError) {
      const apiError = getApiError(requestError);
      if (apiError.status === 429) {
        const seconds = Math.max(1, apiError.retry_after ?? 60);
        setRetryAfter(seconds);
        setError('Too many password attempts. Wait before trying again.');
      } else {
        setError(
          apiError.errors?.current_password?.[0] ??
            'Account deletion could not be requested. Try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className={sty.dangerZone} aria-labelledby="danger-zone-title">
        <h2 id="danger-zone-title">Delete your account</h2>
        <ul>
          <li>Your public Tether becomes unavailable immediately.</li>
          <li>You are signed out and cannot use the workspace.</li>
          <li>Your username stays reserved during a 30-day recovery window.</li>
          <li>
            After that window, your profile, links, publication history, and
            uploaded files are permanently deleted.
          </li>
        </ul>
        <button
          ref={triggerRef}
          className={sty.dangerButton}
          type="button"
          onClick={open}
        >
          <FiTrash2 aria-hidden="true" />
          Request account deletion
        </button>
      </section>

      {isOpen && (
        <div className={sty.backdrop} role="presentation">
          <section
            ref={dialogRef}
            className={sty.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            aria-describedby="delete-account-consequences"
          >
            <h2 id="delete-account-title">
              Schedule permanent account deletion
            </h2>
            <div id="delete-account-consequences">
              <p>This request takes effect immediately:</p>
              <ul>
                <li>Your public profile is unpublished.</li>
                <li>Every Tetherly session is signed out.</li>
                <li>
                  Your username remains reserved until deletion completes.
                </li>
                <li>
                  Sign in normally before the deletion date to review and
                  explicitly restore an unpublished draft.
                </li>
              </ul>
            </div>
            <form onSubmit={event => void submit(event)}>
              <label htmlFor="account-deletion-password">
                Current password
              </label>
              <input
                ref={passwordRef}
                id="account-deletion-password"
                name="current_password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'account-deletion-error' : undefined}
              />
              {error && (
                <p
                  id="account-deletion-error"
                  className={sty.error}
                  role="alert"
                >
                  {error}
                </p>
              )}
              <div className={sty.modalActions}>
                <button type="button" onClick={close} disabled={isSubmitting}>
                  Cancel
                </button>
                <button
                  className={sty.confirmButton}
                  type="submit"
                  disabled={isSubmitting || retryAfter > 0}
                >
                  {isSubmitting
                    ? 'Requesting deletion…'
                    : retryAfter > 0
                      ? `Try again in ${retryAfter} seconds`
                      : 'Schedule deletion'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
