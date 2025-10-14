import heroImage from '@assets/images/ahmet-yuksek-zSiqe6j9Aao-unsplash.jpg?responsive';
import { SEOHelmet } from '@components/common/SEOHelmet';
import { Link } from '@components/ui/Link';
import { ResponsiveImage } from '@components/ui/ResponsiveImage';

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

      <div className={sty.container}>
        <header className={sty.hero}>
          <div className={sty.heroContent}>
            <h1 className={sty.title}>
              <span className={sty.highlight}>Front-End Boilerplate</span>
            </h1>
            <p className={sty.subtitle}>React 19 + TypeScript + Vite</p>
            <div className={sty.badges}>
              <span className={sty.badge}>React 19</span>
              <span className={sty.badge}>TypeScript</span>
              <span className={sty.badge}>Vite</span>
              <span className={sty.badge}>SCSS Modules</span>
            </div>
          </div>
        </header>
        <ResponsiveImage
          src={heroImage}
          alt="Hero banner showcasing our product"
          priority={true}
          aspectRatio="16:9"
          sizes="100vw"
          className="hero-image"
        />

        <main className={sty.main}>
          <section className={sty.features}>
            <h2 className={sty.sectionTitle}>What's Included</h2>

            <div className={sty.featureGrid}>
              <div className={sty.featureCard}>
                <h3 className={sty.featureTitle}>Fast</h3>
                <p className={sty.featureDescription}>
                  Vite dev server, optimized builds with Terser
                </p>
              </div>

              <div className={sty.featureCard}>
                <h3 className={sty.featureTitle}>Dev Tools</h3>
                <p className={sty.featureDescription}>
                  ESLint, Prettier, Stylelint, Husky git hooks, and Commitlint
                  configured
                </p>
              </div>

              <div className={sty.featureCard}>
                <h3 className={sty.featureTitle}>Testing</h3>
                <p className={sty.featureDescription}>
                  Vitest + React Testing Library setup with coverage reporting
                </p>
              </div>

              <div className={sty.featureCard}>
                <h3 className={sty.featureTitle}>Styling</h3>
                <p className={sty.featureDescription}>
                  SCSS modules, PostCSS, cssnano optimization, and variables
                  support
                </p>
              </div>

              <div className={sty.featureCard}>
                <h3 className={sty.featureTitle}>SEO</h3>
                <p className={sty.featureDescription}>
                  React Helmet integration for meta tags and social media
                  optimization
                </p>
              </div>

              <div className={sty.featureCard}>
                <h3 className={sty.featureTitle}>Laravel Ready</h3>
                <p className={sty.featureDescription}>
                  Configured API service with Axios for backend integration
                </p>
              </div>
            </div>
          </section>

          <section className={sty.techStack}>
            <h2 className={sty.sectionTitle}>Technologies Used</h2>
            <div className={sty.stackList}>
              <div className={sty.stackCategory}>
                <h3 className={sty.stackTitle}>Core</h3>
                <ul className={sty.stackItems}>
                  <li>React 19</li>
                  <li>TypeScript</li>
                  <li>Vite</li>
                  <li>React Router v6</li>
                </ul>
              </div>

              <div className={sty.stackCategory}>
                <h3 className={sty.stackTitle}>Development</h3>
                <ul className={sty.stackItems}>
                  <li>ESLint + Prettier</li>
                  <li>Husky + Commitlint</li>
                  <li>Lint-staged</li>
                  <li>TypeScript strict mode</li>
                </ul>
              </div>

              <div className={sty.stackCategory}>
                <h3 className={sty.stackTitle}>Styling</h3>
                <ul className={sty.stackItems}>
                  <li>SCSS Modules</li>
                  <li>PostCSS</li>
                  <li>Stylelint</li>
                  <li>cssnano</li>
                </ul>
              </div>

              <div className={sty.stackCategory}>
                <h3 className={sty.stackTitle}>Testing</h3>
                <ul className={sty.stackItems}>
                  <li>Vitest</li>
                  <li>React Testing Library</li>
                  <li>Jest DOM matchers</li>
                  <li>Coverage reports</li>
                </ul>
              </div>
            </div>
          </section>
        </main>

        <footer className={sty.footer}>
          <p className={sty.footerText}>
            Made by{' '}
            <Link to={'https://linktr.ee/ransuhaneda'}>ransuhaneda</Link>
          </p>
        </footer>
      </div>
    </>
  );
};
