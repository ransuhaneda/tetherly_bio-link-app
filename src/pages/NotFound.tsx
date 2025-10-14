import { Link } from 'react-router-dom';

import { SEOHelmet } from '@components/common/SEOHelmet';
import { Button } from '@components/ui/Button';

import sty from './NotFound.module.scss';

export const ErrorNotFound = () => {
  return (
    <>
      <SEOHelmet
        title="Page Not Found! | Example.com"
        description="You got lost, Turn back now."
        keywords="react, typescript, vite, boilerplate, template, laravel, scss modules"
        url="https://example.com/"
      />

      <div className={sty.container}>
        <div className={sty.content}>
          <h1 className={sty.errorCode}>404</h1>
          <h2 className={sty.title}>Page Not Found</h2>
          <p className={sty.description}>
            Oops! The page you're looking for doesn't exist. It might have been
            moved, deleted, or you entered the wrong URL.
          </p>
          <div className={sty.actions}>
            <Link to="/">Go Home</Link>

            <Button
              onClick={() => window.history.back()}
              variant="tertiary"
              size="md"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export const ErrorServer = () => {
  return (
    <>
      <SEOHelmet
        title="Page Not Found! | Example.com"
        description="You got lost, Turn back now."
        keywords="react, typescript, vite, boilerplate, template, laravel, scss modules"
        url="https://example.com/"
      />

      <div className={sty.container}>
        <div className={sty.content}>
          <h1 className={sty.errorCode}>505</h1>
          <h2 className={sty.title}>Internal server error occurred.</h2>
          <p className={sty.description}>
            There seems to be a problem on our end right now. Take a walk :)
          </p>
          <div className={sty.actions}>
            <Link to="/">Go Home</Link>

            <Button
              onClick={() => window.history.back()}
              variant="tertiary"
              size="md"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export const ErrorGeneral = () => {
  return (
    <>
      <SEOHelmet
        title="Page Not Found! | Example.com"
        description="You got lost, Turn back now."
        keywords="react, typescript, vite, boilerplate, template, laravel, scss modules"
        url="https://example.com/"
      />

      <div className={sty.container}>
        <div className={sty.content}>
          <h1 className={sty.errorCode}>505</h1>
          <h2 className={sty.title}>Internal server error occurred.</h2>
          <p className={sty.description}>
            There seems to be a problem on our end right now. Take a walk :)
          </p>
          <div className={sty.actions}>
            <Link to="/">Go Home</Link>

            <Button
              onClick={() => window.history.back()}
              variant="tertiary"
              size="md"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
