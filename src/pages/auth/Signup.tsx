import { useState, type FormEvent } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

import { Button } from '@components/ui/Button';
import { Link } from '@components/ui/Link';

import sty from './Signup.module.scss';

export const Signup = () => {
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
          >
            <FcGoogle className={sty.googleIcon} aria-hidden="true" />
            Continue with Google
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
            />
            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
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
                Your account details are ready to send.
              </p>
            )}
            <Button
              type="submit"
              variant="primary"
              customClass={sty.submitButton}
            >
              Create your account <FiArrowRight aria-hidden="true" />
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
