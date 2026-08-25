import { Button } from '@components/ui/Button';
import { Link } from '@components/ui/Link';
import { useState, type FormEvent } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';

import sty from './Signup.module.scss';

import { authApi } from '@/features/auth/authApi';
import { useAuth } from '@/features/auth/useAuth';
import { getApiError } from '@/services/api';

export const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: searchParams.get('username') ?? '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      setUser(await authApi.register(form));
      navigate('/');
    } catch (submissionError) {
      const payload = getApiError(submissionError);
      setError(
        payload.errors
          ? (Object.values(payload.errors).flat()[0] ??
              payload.message ??
              'Unable to create your account.')
          : (payload.message ?? 'Unable to create your account.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={sty.page}>
      <div className={sty.shell}>
        <div className={sty.intro}>
          <span className={sty.kicker}>Start with your name</span>
          <h1>Make your corner of the internet feel like you.</h1>
          <p>
            Create one memorable home for everything you make, share, and care
            about.
          </p>
          <div className={sty.signal} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={sty.card}>
          <div className={sty.cardHeader}>
            <p className={sty.cardKicker}>Join Tetherly</p>
            <h2>Create an account</h2>
          </div>
          <Button
            type="button"
            variant="tertiary"
            customClass={sty.googleButton}
            disabled
            title="Google sign-up is coming soon"
          >
            <FcGoogle className={sty.googleIcon} aria-hidden="true" />
            Continue with Google (coming soon)
          </Button>
          <div className={sty.divider}>
            <span>or sign up with email</span>
          </div>
          <form onSubmit={handleSubmit} className={sty.form}>
            <label htmlFor="signup-name">Your name</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="What should we call you?"
              value={form.name}
              onChange={event => setForm({ ...form, name: event.target.value })}
            />
            <label htmlFor="signup-username">Your username</label>
            <input
              id="signup-username"
              name="username"
              type="text"
              autoComplete="username"
              required
              minLength={3}
              maxLength={30}
              pattern="[a-zA-Z0-9_-]+"
              placeholder="your-handle"
              value={form.username}
              onChange={event =>
                setForm({ ...form, username: event.target.value.toLowerCase() })
              }
            />
            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
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
            <label htmlFor="signup-password">Create a password</label>
            <div className={sty.passwordWrap}>
              <input
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                minLength={8}
                required
                placeholder="At least 8 characters"
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
            <label htmlFor="signup-password-confirmation">
              Confirm your password
            </label>
            <input
              id="signup-password-confirmation"
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Repeat your password"
              value={form.password_confirmation}
              onChange={event =>
                setForm({ ...form, password_confirmation: event.target.value })
              }
            />
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
                'Creating your account…'
              ) : (
                <>
                  Create your account <FiArrowRight aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
          <p className={sty.terms}>
            By continuing, you agree to our{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
          <p className={sty.switch}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </section>
  );
};
