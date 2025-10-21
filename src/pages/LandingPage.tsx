import { SEOHelmet } from '@components/common/SEOHelmet';
import { Button } from '@components/ui/Button';

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

      <section className={`lg-wrapper ${sty.container}`}>
        <div className={sty.wrapper__hero}>
          <h1 className={sty.hero}>
            All your links, <br /> neatly tethered.
          </h1>
          <h2 className={sty.subheading}>
            Your Instagram, TikTok, Twitter - they all limit you to one link.
            With Tetherly, that single link becomes a curated gateway to your
            entire digital universe.
          </h2>
        </div>
        <form action="" className={sty.cta__form}>
          <span className={sty.cta__wrapper}>
            <span className={sty.cta__link}>tetherly.ink/</span>
            <input
              type="text"
              className={sty.form__input}
              placeholder="username"
            />
          </span>
          <Button type="submit" variant="primary" customClass={sty.btn__submit}>
            Create Your Tether
          </Button>
        </form>
      </section>
    </>
  );
};
