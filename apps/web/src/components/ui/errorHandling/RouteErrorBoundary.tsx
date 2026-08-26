import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { ErrorNotFound, ErrorServer } from '@pages/NotFound';

import { Button } from '../Button';
import { Link } from '../Link';

import sty from './ErrorHandling.module.scss';

export const RouteErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <div className={sty.wrapper}>
          {error.status === 404 ? (
            <ErrorNotFound />
          ) : error.status === 500 ? (
            <ErrorServer />
          ) : (
            <p className={sty.error_desc}>
              {error.data || 'An error occurred while loading this page.'}
            </p>
          )}
        </div>
      </>
    );
  }

  if (error instanceof Error) {
    return (
      <div className={sty.wrapper}>
        <div className={sty.error_boundary}>
          <div className={sty.error_content}>
            <h1 className={sty.error_title}>Loading Error</h1>
            <p className={sty.error_desc}>Failed to load page data.</p>

            {process.env.NODE_ENV === 'development' && (
              <details className={sty.error_details}>
                <summary>Error Details (Dev Only)</summary>
                <pre>{error.message}</pre>
              </details>
            )}

            {/* <details style={{ color: '#fff3e0' }}>
              <summary>Error Details (staging)</summary>
              <pre>{error.message}</pre>
            </details> */}

            <div className={sty.error_actions}>
              <Link to="/" className={sty.btn_home}>
                Go Home
              </Link>
              <Button
                onClick={() => window.location.reload()}
                variant="tertiary"
                size="md"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={sty.wrapper}>
      <div className={sty.error_boundary}>
        <div className={sty.error_content}>
          <h1>Unknown Error</h1> <p>Something unexpected happened</p>
          <Link to="/" className={sty.btn_home}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};
