import { Button } from '@components/ui/Button';
import { Link } from '@components/ui/Link';
import { useState, type FormEvent } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

import sty from './Login.module.scss';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
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
          >
            <FcGoogle className={sty.googleIcon} aria-hidden="true" />
            Continue with Google
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
            />
            <div className={sty.passwordLabel}>
              <label htmlFor="login-password">Password</label>
              <Link to="/forgot-password" customClass={sty.forgot}>
                Forgot password?
              </Link>
            </div>
            <div className={sty.passwordWrap}>
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Enter your password"
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
            {submitted && (
              <p className={sty.feedback} role="status">
                Ready to connect your Tether.
              </p>
            )}
            <Button
              type="submit"
              variant="primary"
              customClass={sty.submitButton}
            >
              Log in <FiArrowRight aria-hidden="true" />
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
