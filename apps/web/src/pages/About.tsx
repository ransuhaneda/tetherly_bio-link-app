import { SEOHelmet } from '@components/common/SEOHelmet';
import { Link } from '@components/ui/Link';

import sty from './ContentPage.module.scss';

export const About = () => (
  <div className={sty.page}>
    <SEOHelmet
      title="About Tetherly — Your internet, in one place"
      description="Tetherly gives creators a calmer, more expressive home for everything they share online."
    />
    <div className={sty.shell}>
      <section className={sty.hero}>
        <div className={sty.heroCopy}>
          <p className={sty.eyebrow}>About Tetherly</p>
          <h1>
            One link.
            <br />
            <em>More of you.</em>
          </h1>
          <p className={sty.lede}>
            The internet is scattered by default. Tetherly brings your work,
            words, and favorite places into one small, memorable destination.
          </p>
        </div>
        <aside className={sty.heroMeta}>
          <strong>Built for people with somewhere to go.</strong>
          <p>
            Creators, studios, artists, freelancers, and small businesses who
            want their link to feel like a welcome, not a waypoint.
          </p>
        </aside>
      </section>
      <section className={sty.section}>
        <div className={sty.twoCol}>
          <div>
            <p className={sty.eyebrow}>Our point of view</p>
            <h2>Your link is part of your identity.</h2>
          </div>
          <div className={sty.body}>
            <p>
              We think the best profile pages do more than collect buttons. They
              set a mood, tell people what matters, and make the next click feel
              obvious.
            </p>
            <p>
              Tetherly is intentionally simple: a flexible canvas, thoughtful
              defaults, and enough context to make every destination worth
              visiting. No noise. No platform lock-in theater. Just a better
              front door to your internet.
            </p>
          </div>
        </div>
      </section>
      <section className={sty.section}>
        <div className={sty.twoCol}>
          <div>
            <p className={sty.eyebrow}>What you can do</p>
            <h2>Make the small space work harder.</h2>
          </div>
          <ul className={sty.list}>
            <li>Introduce your work with a custom bio and profile</li>
            <li>Group links by launches, projects, or seasons</li>
            <li>Share products, playlists, writing, and community spaces</li>
            <li>Understand what your audience is actually clicking</li>
          </ul>
        </div>
      </section>
      <section className={sty.section}>
        <div className={sty.cta}>
          <div>
            <h2>Ready to make a home for your links?</h2>
            <p>Claim your handle and publish a page that sounds like you.</p>
          </div>
          <Link to="/signup" variant="secondary">
            Create your Tether ↗
          </Link>
        </div>
      </section>
    </div>
  </div>
);
