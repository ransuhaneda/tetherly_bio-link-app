import { useEffect, useState, type FormEvent } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import { formatDeletionDate } from '@/features/account-deletion/formatDeletionDate';
import { authApi } from '@/features/auth/authApi';
import { getAuthRedirect } from '@/features/auth/authRedirect';
import { useAuth } from '@/features/auth/useAuth';
import { getApiError } from '@/services/api';
import { Button } from '@components/ui/Button';
import { Link } from '@components/ui/Link';

import sty from './Login.module.scss';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const deletionDate = (
    location.state as
      | { accountDeletion?: { deletionDate?: unknown } }
      | null
      | undefined
  )?.accountDeletion?.deletionDate;
  const confirmedDeletionDate =
    typeof deletionDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(deletionDate)
      ? deletionDate
      : null;

  useEffect(() => {
    if (!isLoading && user)
      navigate(getAuthRedirect(location), { replace: true });
  }, [isLoading, location, navigate, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading || user) {
      navigate(getAuthRedirect(location), { replace: true });
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const result = await authApi.login(form);
      if (result.status === 'restoration_required') {
        setUser(null);
        navigate('/restore-account', { replace: true });
      } else {
        setUser(result.user);
        navigate(getAuthRedirect(location), { replace: true });
      }
    } catch (submissionError) {
      const payload = getApiError(submissionError);
      if (payload.status === 403) {
        setError('This account is unavailable.');
      } else {
        setError(
          payload.errors
            ? (Object.values(payload.errors).flat()[0] ??
                payload.message ??
                'Unable to log in.')
            : (payload.message ?? 'Unable to log in.')
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={sty.page}>
      <div className={sty.shell}>
        <div className={sty.intro}>
          <span className={sty.kicker}>Welcome back</span>
          <h1>Pick up where you left off.</h1>
          <p>
            Sign in to keep your links, audience, and next idea in one place.
          </p>
          <div className={sty.signal} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={sty.card}>
          {confirmedDeletionDate && (
            <div className={sty.deletionNotice} role="status">
              <strong>Account deletion requested.</strong>
              <span>
                Your account is scheduled for permanent deletion on{' '}
                {formatDeletionDate(confirmedDeletionDate)}. Sign in before then
                to review account restoration.
              </span>
            </div>
          )}
          <div className={sty.cardHeader}>
            <p className={sty.cardKicker}>Your Tether</p>
            <h2>Log in</h2>
          </div>
          <Button
            type="button"
            variant="tertiary"
            customClass={sty.googleButton}
            disabled
            title="Google sign-in is coming soon"
          >
            <FcGoogle className={sty.googleIcon} aria-hidden="true" />
            Continue with Google (coming soon)
          </Button>
          <div className={sty.divider}>
            <span>or continue with email</span>
          </div>
          <form onSubmit={handleSubmit} className={sty.form}>
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={event =>
                setForm({ ...form, email: event.target.value })
              }
            />
            <div className={sty.passwordLabel}>
              <label htmlFor="login-password">Password</label>
              <span className={sty.forgot}>Password reset coming soon</span>
            </div>
            <div className={sty.passwordWrap}>
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                value={form.password}
                onChange={event =>
                  setForm({ ...form, password: event.target.value })
                }
              />
              <button
                type="button"
                className={sty.passwordToggle}
                onClick={() => setShowPassword(value => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <FiEyeOff aria-hidden="true" />
                ) : (
                  <FiEye aria-hidden="true" />
                )}
              </button>
            </div>
            {error && (
              <p className={sty.feedback} role="alert">
                {error}
              </p>
            )}
            <Button
              type="submit"
              variant="primary"
              customClass={sty.submitButton}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                'Logging in…'
              ) : (
                <>
                  Log in <FiArrowRight aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
          <p className={sty.switch}>
            New to Tetherly? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
};
