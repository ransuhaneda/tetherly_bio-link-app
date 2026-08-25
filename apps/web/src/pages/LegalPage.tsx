import { SEOHelmet } from '@components/common/SEOHelmet';

import sty from './ContentPage.module.scss';

type LegalSection = { title: string; paragraphs: string[] };

const privacySections: LegalSection[] = [
  {
    title: 'Information we collect',
    paragraphs: [
      'When you create an account, we collect the information you provide, such as your name, email address, username, profile content, and links. We also receive basic usage information, including device and log data, so we can keep Tetherly secure and improve the service.',
    ],
  },
  {
    title: 'How we use information',
    paragraphs: [
      'We use information to provide, maintain, and personalize Tetherly; process account and billing requests; communicate with you about the service; prevent abuse; and understand how the product is used. We do not sell your personal information.',
    ],
  },
  {
    title: 'Sharing and retention',
    paragraphs: [
      'We share information only with service providers that help us operate Tetherly, when required by law, or when needed to protect users and the service. We retain account information while your account is active and for as long as reasonably necessary for legitimate business, legal, or security purposes.',
    ],
  },
  {
    title: 'Your choices',
    paragraphs: [
      'You can review or update account information from your account settings, and you can ask us to delete your account or personal information by emailing hello@tetherly.ink. Some information may remain where retention is required by law or necessary to resolve disputes.',
    ],
  },
];

const termsSections: LegalSection[] = [
  {
    title: 'Using Tetherly',
    paragraphs: [
      'You may use Tetherly if you can legally enter into this agreement. Keep your account credentials secure and make sure the information on your page is accurate. You are responsible for activity carried out through your account.',
    ],
  },
  {
    title: 'Your content',
    paragraphs: [
      'You keep ownership of the content you publish. You give Tetherly permission to host, display, and technically adapt that content only as needed to provide and improve the service. Do not publish content that is unlawful, deceptive, infringing, abusive, or harmful.',
    ],
  },
  {
    title: 'Plans and changes',
    paragraphs: [
      'Some features may require a paid plan. Prices and plan features are shown before purchase; applicable taxes are your responsibility. We may change the service or these terms, and will provide reasonable notice of material changes.',
    ],
  },
  {
    title: 'Ending an account',
    paragraphs: [
      'You can stop using Tetherly or request account deletion at any time. We may suspend or end access when an account violates these terms, creates risk, or is used unlawfully. Provisions that should continue by their nature will survive termination.',
    ],
  },
  {
    title: 'Disclaimers and liability',
    paragraphs: [
      'Tetherly is provided on an “as available” basis. To the fullest extent permitted by law, Tetherly is not liable for indirect, incidental, or consequential losses arising from your use of the service. Nothing in these terms limits rights that cannot legally be limited.',
    ],
  },
];

export const LegalPage = ({ type }: { type: 'privacy' | 'terms' }) => {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy policy' : 'Terms of service';
  const sections = isPrivacy ? privacySections : termsSections;
  return (
    <div className={sty.page}>
      <SEOHelmet
        title={`${title} — Tetherly`}
        description={`${title} for Tetherly.`}
      />
      <div className={sty.shell}>
        <section className={sty.hero}>
          <div className={sty.heroCopy}>
            <p className={sty.eyebrow}>
              Tetherly {isPrivacy ? 'privacy' : 'terms'}
            </p>
            <h1>
              {title}
              <br />
              <em>Plain and clear.</em>
            </h1>
            <p className={sty.lede}>
              Last updated August 24, 2026. This page explains how Tetherly
              works with you and your information.
            </p>
          </div>
        </section>
        {sections.map(section => (
          <section className={sty.section} key={section.title}>
            <div className={sty.twoCol}>
              <div>
                <h2>{section.title}</h2>
              </div>
              <div className={sty.body}>
                {section.paragraphs.map(paragraph => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>
        ))}
        <section className={sty.section}>
          <div className={sty.cta}>
            <div>
              <h2>Questions?</h2>
              <p>Contact us at hello@tetherly.ink and we’ll help.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
