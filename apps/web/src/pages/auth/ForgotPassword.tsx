import { Button } from '@components/ui/Button';
import { Link } from '@components/ui/Link';
import { useState, type FormEvent } from 'react';
import { FiArrowLeft, FiArrowRight, FiMail } from 'react-icons/fi';

import sty from './ForgotPassword.module.scss';

export const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className={sty.page}>
      <div className={sty.shell}>
        <div className={sty.intro}>
          <span className={sty.kicker}>Account access</span>
          <h1>A fresh start is one email away.</h1>
          <p>
            Enter the email you use for Tetherly and we’ll send a secure link to
            reset your password.
          </p>
          <div className={sty.signal} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={sty.card}>
          <Link to="/login" customClass={sty.backLink}>
            <FiArrowLeft aria-hidden="true" /> Back to log in
          </Link>
          <div className={sty.cardHeader}>
            <FiMail className={sty.mailIcon} aria-hidden="true" />
            <p className={sty.cardKicker}>Password reset</p>
            <h2>Forgot your password?</h2>
          </div>
          {submitted ? (
            <div className={sty.success} role="status">
              <h3>Check your inbox.</h3>
              <p>
                If an account exists for that email, a password reset link is on
                its way.
              </p>
              <Link to="/login" customClass={sty.successLink}>
                Return to log in <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={sty.form}>
              <label htmlFor="reset-email">Email address</label>
              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
              <p className={sty.hint}>
                We’ll only use this to send your reset link.
              </p>
              <Button
                type="submit"
                variant="primary"
                customClass={sty.submitButton}
              >
                Send reset link <FiArrowRight aria-hidden="true" />
              </Button>
            </form>
          )}
          {!submitted && (
            <p className={sty.switch}>
              Remembered your password? <Link to="/login">Log in</Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
