import { Button } from '@components/ui/Button';
import { Link } from '@components/ui/Link';
import { useState, type FormEvent } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import sty from './Login.module.scss';

import { authApi } from '@/features/auth/authApi';
import { useAuth } from '@/features/auth/useAuth';
import { getApiError } from '@/services/api';

export const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      setUser(await authApi.login(form));
      navigate('/');
    } catch (submissionError) {
      const payload = getApiError(submissionError);
      setError(
        payload.errors
          ? (Object.values(payload.errors).flat()[0] ??
              payload.message ??
              'Unable to log in.')
          : (payload.message ?? 'Unable to log in.')
      );
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
              disabled={isSubmitting}
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
