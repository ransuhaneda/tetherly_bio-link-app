import { SEOHelmet } from '@components/common/SEOHelmet';
import { Link } from '@components/ui/Link';

import sty from './ContentPage.module.scss';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Create an account and reserve your Tetherly username.',
    features: [
      'Username reservation',
      'Account creation',
      'Publishing tools in development',
    ],
  },
  {
    name: 'Studio',
    price: 'Coming later',
    description: 'Planned tools for creators who want more control.',
    features: [
      'Custom colors, fonts, and domains (planned)',
      'Link scheduling and featured links (planned)',
      'Email capture and analytics (planned)',
    ],
    featured: true,
  },
  {
    name: 'Collective',
    price: 'Coming later',
    description: 'Planned collaboration tools for teams and client work.',
    features: [
      'Team profiles (planned)',
      'Shared asset library (planned)',
      'Priority support (planned)',
    ],
  },
];

export const Pricing = () => (
  <div className={sty.page}>
    <SEOHelmet
      title="Tetherly pricing — A clear starting point"
      description="Create an account and reserve your Tetherly username. Paid plans are planned for a later release."
    />
    <div className={sty.shell}>
      <section className={sty.hero}>
        <div className={sty.heroCopy}>
          <p className={sty.eyebrow}>A clear starting point</p>
          <h1>
            A better link
            <br />
            <em>at every stage.</em>
          </h1>
          <p className={sty.lede}>
            Create an account and reserve your username now. Paid plans are
            planned, not available in this prototype.
          </p>
        </div>
        <aside className={sty.heroMeta}>
          <strong>Every account includes a Tetherly URL.</strong>
          <p>
            Profile publishing and paid features will arrive in later releases.
          </p>
        </aside>
      </section>
      <section className={sty.section}>
        <div className={sty.plans}>
          {plans.map(plan => (
            <article
              key={plan.name}
              className={`${sty.plan} ${plan.featured ? sty.featured : ''}`}
            >
              <span className={sty.planTag}>
                {plan.featured ? 'Planned paid plan' : 'Available now'}
              </span>
              <h3>{plan.name}</h3>
              <p className={sty.price}>
                {plan.price}
                {plan.price !== 'Free' && <small> Not available yet</small>}
              </p>
              <p>{plan.description}</p>
              <ul className={sty.features}>
                {plan.features.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              {plan.price === 'Free' ? (
                <Link to="/signup" variant="tertiary">
                  Create an account ↗
                </Link>
              ) : (
                <span className={sty.deferredAction}>Planned for later</span>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className={sty.section}>
        <p className={sty.eyebrow}>Good to know</p>
        <h2>Questions, answered.</h2>
        <div className={sty.faq}>
          <details>
            <summary>Can I create an account now?</summary>
            <p>
              Yes. Account creation and username reservation are available now;
              profile publishing is still in development.
            </p>
          </details>
          <details>
            <summary>When will paid plans be available?</summary>
            <p>
              Studio and Collective are planned for a later release. No paid
              features are enabled in this prototype.
            </p>
          </details>
          <details>
            <summary>Do I need a custom domain?</summary>
            <p>Custom domains are planned for a future paid plan.</p>
          </details>
          <details>
            <summary>What can I do with Starter?</summary>
            <p>
              You can reserve a username and create an account. The profile
              editor and publishing tools are being built next.
            </p>
          </details>
        </div>
      </section>
    </div>
  </div>
);
