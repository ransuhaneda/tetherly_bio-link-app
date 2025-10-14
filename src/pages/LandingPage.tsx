import { SEOHelmet } from '@components/common/SEOHelmet';

import sty from './LandingPage.module.scss';

export const LandingPage = () => {
  return (
    <>
      <SEOHelmet
        title="Modern React Boilerplate | Vite + React 19 + TypeScript"
        description="Production-ready React boilerplate with TypeScript, SCSS modules, testing, and seamless Laravel integration"
        keywords="react, typescript, vite, boilerplate, template, laravel, scss modules"
        url="https://example.com/"
      />

      <div className={`lg-wrapper ${sty.container}`}>
        <h1>Hhello World</h1>
      </div>
    </>
  );
};
