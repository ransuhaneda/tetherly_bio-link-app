import sty from './LandingPage.module.scss';

import { SEOHelmet } from '@components/common/SEOHelmet';

export const LandingPage = () => {
  return (
    <>
      <SEOHelmet
        title="Modern React Boilerplate | Vite + React 19 + TypeScript"
        description="Production-ready React boilerplate with TypeScript, SCSS modules, testing, and seamless Laravel integration"
        keywords="react, typescript, vite, boilerplate, template, laravel, scss modules"
      />

      <div className={sty.container}>
        <header className={sty.hero}>
          <div className={sty.heroContent}>
            <h1 className={sty.title}>
              Modern React <span className={sty.highlight}>Boilerplate</span>
            </h1>
            <p className={sty.subtitle}>
              Production-ready React 19 + TypeScript + Vite template with all
              modern tooling
            </p>
            <div className={sty.badges}>
              <span className={sty.badge}>React 19</span>
              <span className={sty.badge}>TypeScript</span>
              <span className={sty.badge}>Vite</span>
              <span className={sty.badge}>SCSS Modules</span>
            </div>
          </div>
        </header>

        <main className={sty.main}>
          <section className={sty.features}>
            <h2 className={sty.sectionTitle}>What's Included</h2>

            <div className={sty.featureGrid}>
              <div className={sty.featureCard}>
                <h3 className={sty.featureTitle}>Lightning Fast</h3>
                <p className={sty.featureDescription}>
                  Vite dev server with HMR, optimized builds with Terser
                  minification
                </p>
              </div>

              <div className={sty.featureCard}>
                <h3 className={sty.featureTitle}>Developer Tools</h3>
                <p className={sty.featureDescription}>
                  ESLint, Prettier, Stylelint, Husky git hooks, and Commitlint
                  configured
                </p>
              </div>

              <div className={sty.featureCard}>
                <h3 className={sty.featureTitle}>Testing Ready</h3>
                <p className={sty.featureDescription}>
                  Vitest + React Testing Library setup with coverage reporting
                </p>
              </div>

              <div className={sty.featureCard}>
                <h3 className={sty.featureTitle}>Styling Solutions</h3>
                <p className={sty.featureDescription}>
                  SCSS modules, PostCSS, cssnano optimization, and variables
                  support
                </p>
              </div>

              <div className={sty.featureCard}>
                <h3 className={sty.featureTitle}>SEO Optimized</h3>
                <p className={sty.featureDescription}>
                  React Helmet integration for meta tags and social media
                  optimization
                </p>
              </div>

              <div className={sty.featureCard}>
                <h3 className={sty.featureTitle}>Laravel Ready</h3>
                <p className={sty.featureDescription}>
                  Pre-configured API service with Axios for seamless backend
                  integration
                </p>
              </div>
            </div>
          </section>

          <section className={sty.techStack}>
            <h2 className={sty.sectionTitle}>Tech Stack</h2>
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

          <section className={sty.quickStart}>
            <h2 className={sty.sectionTitle}>Quick Start</h2>
            <div className={sty.codeBlock}>
              <pre className={sty.code}>
                {`# Clone the boilerplate
git clone <your-repo-url>

# Install dependencies with PNPM
pnpm install

# Start development server
pnpm run dev

# Run tests
pnpm test

# Build for production
pnpm run build`}
              </pre>
            </div>
          </section>
        </main>

        <footer className={sty.footer}>
          <p className={sty.footerText}>React development</p>
        </footer>
      </div>
    </>
  );
};
