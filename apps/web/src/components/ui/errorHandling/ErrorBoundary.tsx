import React, { Component, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { Button } from '../Button';

import sty from './ErrorHandling.module.scss';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  resetOnLocationChange?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  lastLocation?: string;
}

class ErrorBoundaryClass extends Component<
  Props & { location?: string },
  State
> {
  constructor(props: Props & { location?: string }) {
    super(props);
    this.state = { hasError: false, error: null, lastLocation: props.location };
  }

  static getDerivedStateFromProps(
    props: Props & { location?: string },
    state: State
  ) {
    if (props.resetOnLocationChange && props.location != state.lastLocation) {
      return {
        hasError: false,
        error: null,
        lastLocation: props.location,
      };
    }

    return null;
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Apply error logging later (sentry)
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

export const ErrorBoundary: React.FC<Props> = ({
  resetOnLocationChange = true,
  ...props
}) => {
  const location = useLocation();
  return (
    <ErrorBoundaryClass
      {...props}
      location={resetOnLocationChange ? location.pathname : undefined}
      resetOnLocationChange={resetOnLocationChange}
    />
  );
};

const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({
  error,
  retry,
}) => {
  return (
    <div className={sty.wrapper}>
      <div className={sty.error_boundary}>
        <div className={sty.error_content}>
          <h2 className={sty.error_title}>Oops! Something went wrong</h2>
          <p className={sty.error_desc}>
            {error.message || 'An unexpected error occured'}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className={sty.error_details}>
              <summary className={sty.error_summary}>
                Dev Only | Technical Details
              </summary>
              <pre className={sty.error_stack}>{error.stack}</pre>
            </details>
          )}
          <div className={sty.error_actions}>
            <Button variant="primary" size="sm" onClick={retry}>
              Try Again
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => (window.location.href = '/')}
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
