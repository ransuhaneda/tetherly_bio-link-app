import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiMoreHorizontal } from 'react-icons/fi';

import studioImage from '@assets/images/ahmet-yuksek-zSiqe6j9Aao-unsplash.jpg';
import portraitImage from '@assets/images/toa-heftiba-IrpBb-5YGZw-unsplash.jpg';
import { SEOHelmet } from '@components/common/SEOHelmet';
import { Button } from '@components/ui/Button';
import { Link } from '@components/ui/Link';

import sty from './LandingPage.module.scss';

gsap.registerPlugin(ScrollTrigger);

const previewLinks = [
  { label: 'Latest work / Studio notes', meta: 'Featured', tone: 'orange' },
  { label: 'Listen to the new mix', meta: 'Audio', tone: 'violet' },
  { label: 'Join the monthly dispatch', meta: 'Newsletter', tone: 'lime' },
];

const steps = [
  [
    '01',
    'Claim your corner',
    'Pick a handle people can remember and make it yours in under a minute.',
  ],
  [
    '02',
    'Add what matters',
    'Bring in your work, shop, newsletter, socials, and next big thing.',
  ],
  [
    '03',
    'Send people somewhere good',
    'Share one clean URL everywhere and keep your audience moving.',
  ],
];

const faqs = [
  [
    'Can I start for free?',
    'Yes. You can create a Starter page with your essential links at no cost. Upgrade only when you need more customization or team tools.',
  ],
  [
    'Can I change my links later?',
    'Absolutely. Update, reorder, schedule, or remove links whenever your work changes. Your Tetherly URL stays the same.',
  ],
  [
    'What can I add to my page?',
    'Add links to your work, shop, newsletter, social profiles, playlists, community spaces, and anywhere else you want your audience to go.',
  ],
  [
    'Do I need a custom domain?',
    'No. Every account includes a Tetherly URL. Paid plans also let you connect a custom domain you already own.',
  ],
];

export const LandingPage = () => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const pageRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.from(`.${sty.heroCopy}`, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: 'power3.out',
      });
      gsap.from(`.${sty.previewWrap}`, {
        opacity: 0,
        y: 34,
        duration: 0.9,
        delay: 0.12,
        ease: 'power3.out',
      });
      gsap.utils
        .toArray<HTMLElement>(
          `.${sty.featureCard}, .${sty.toolkitCard}, .${sty.step}`
        )
        .forEach(element => {
          gsap.from(element, {
            opacity: 0,
            y: 30,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 86%', once: true },
          });
        });
    }, pageRef);

    return () => context.revert();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim()) {
      setStatus('Choose a username to get started.');
      return;
    }
    setStatus(`Your tether is ready for ${username.trim()}.`);
  };

  return (
    <>
      <SEOHelmet
        title="Tetherly — All your links, neatly tethered."
        description="A calmer, more authored home for everything you share online."
        keywords="link in bio, creator page, links, Tetherly"
        url="https://tetherly.ink/"
      />

      <main ref={pageRef} className={sty.page}>
        <section className={`lg-wrapper ${sty.heroSection}`}>
          <div className={`motion-rise ${sty.heroCopy}`}>
            <p className={sty.kicker}>A home for your whole internet</p>
            <h1 className={sty.hero}>
              All your links, <em>neatly tethered.</em>
            </h1>
            <p className={sty.subheading}>
              Your Instagram, TikTok, Twitter - they all limit you to one link.
              With Tetherly, that single link becomes a curated gateway to your
              entire digital universe.
            </p>
            <form className={sty.ctaForm} onSubmit={handleSubmit}>
              <label className={sty.srOnly} htmlFor="username">
                Choose your Tetherly username
              </label>
              <div className={sty.usernameField}>
                <span>tetherly.ink/</span>
                <input
                  id="username"
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                  placeholder="username"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                customClass={sty.submitButton}
              >
                Create Your Tether
              </Button>
            </form>
            <p className={sty.formStatus} role="status">
              {status}
            </p>
          </div>

          <div className={`motion-rise motion-rise-delay ${sty.previewWrap}`}>
            <div className={sty.previewCard}>
              <div className={sty.previewTop}>
                <span className={sty.liveDot} /> <span>tetherly.ink/sol</span>
                <FiMoreHorizontal
                  className={sty.previewMenu}
                  aria-hidden="true"
                />
              </div>
              <img
                src={portraitImage}
                alt="Creator portrait"
                className={sty.avatar}
              />
              <p className={sty.previewName}>Sol / visual notes</p>
              <p className={sty.previewBio}>
                Ideas, images and things worth sending on.
              </p>
              <div className={sty.previewLinks}>
                {previewLinks.map(link => (
                  <a
                    href="#features"
                    key={link.label}
                    className={`${sty.previewLink} ${sty[link.tone]}`}
                  >
                    <span>{link.label}</span>
                    <small>{link.meta}</small>
                    <FiArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
            <span className={sty.previewNote}>
              A considered alternative to the link list.
            </span>
          </div>
        </section>

        <section id="features" className={`lg-wrapper ${sty.featureSection}`}>
          <div className={sty.sectionIntro}>
            <p className={sty.kicker}>Why Tetherly</p>
            <h2>Make one link feel like a destination.</h2>
            <p>
              Bring your work, community, and next move into one clear, ownable
              space.
            </p>
          </div>
          <div className={sty.featureGrid}>
            <article className={`${sty.featureCard} ${sty.featureWide}`}>
              <span className={sty.cardIndex}>01 / Gather</span>
              <h3>Everything in one place.</h3>
              <p>
                Share your latest project, shop, playlist, newsletter, and
                social channels without sending people on a scavenger hunt.
              </p>
              <img
                src={studioImage}
                alt="Desk and creative tools"
                loading="lazy"
              />
            </article>
            <article className={sty.featureCard}>
              <span className={sty.cardIndex}>02 / Shape</span>
              <h3>Made to sound like you.</h3>
              <p>
                Give every link a little context. Your page should read like a
                profile, not a directory.
              </p>
              <div className={sty.stat}>
                01 <span>authored page</span>
              </div>
            </article>
            <article className={`${sty.featureCard} ${sty.featureAccent}`}>
              <span className={sty.cardIndex}>03 / Notice</span>
              <h3>See what resonates.</h3>
              <p>
                Keep the important things visible and learn which paths your
                audience actually takes.
              </p>
              <Link to="/signup" variant="tertiary" customClass={sty.cardLink}>
                Start shaping yours <FiArrowUpRight aria-hidden="true" />
              </Link>
            </article>
            <article className={`${sty.featureCard} ${sty.featureDark}`}>
              <span className={sty.cardIndex}>04 / Share</span>
              <h3>One URL, many directions.</h3>
              <p>
                Keep your handle consistent across every profile, campaign, and
                conversation.
              </p>
              <div className={sty.shareLine}>
                <span>tetherly.ink/you</span>
                <FiArrowUpRight aria-hidden="true" />
              </div>
            </article>
            <article className={`${sty.featureCard} ${sty.featureSignal}`}>
              <span className={sty.cardIndex}>05 / Measure</span>
              <h3>Know what earns attention.</h3>
              <p>
                See which links get clicked so you can keep your page useful,
                current, and easy to trust.
              </p>
              <div className={sty.signalValue}>
                <strong>24%</strong>
                <span>click-through lift</span>
              </div>
            </article>
          </div>
        </section>

        <section className={`lg-wrapper ${sty.toolkitSection}`}>
          <div className={sty.toolkitIntro}>
            <p className={sty.kicker}>A better kind of link page</p>
            <h2>Small details. More reasons to stay.</h2>
            <p>
              Tetherly gives every destination enough room to be useful, without
              asking your audience to decode a wall of buttons.
            </p>
          </div>
          <div className={sty.toolkitGrid}>
            <article className={`${sty.toolkitCard} ${sty.toolkitPrimary}`}>
              <span className={sty.cardIndex}>01 / Curate</span>
              <h3>Lead with what is new.</h3>
              <p>
                Pin a launch, a recent essay, or the thing you want people to
                see first.
              </p>
              <FiArrowUpRight className={sty.toolkitArrow} aria-hidden="true" />
            </article>
            <article className={`${sty.toolkitCard} ${sty.toolkitSecondary}`}>
              <span className={sty.cardIndex}>02 / Context</span>
              <h3>Give every click a little meaning.</h3>
              <p>Short descriptions turn a link into an invitation.</p>
            </article>
            <article className={`${sty.toolkitCard} ${sty.toolkitImage}`}>
              <img
                src={studioImage}
                alt="Creative workspace with notes and tools"
                loading="lazy"
              />
              <div>
                <span className={sty.cardIndex}>03 / Rhythm</span>
                <h3>A page that changes with you.</h3>
              </div>
            </article>
            <article className={`${sty.toolkitCard} ${sty.toolkitQuote}`}>
              <p>“Finally, a link page that feels like part of my practice.”</p>
              <span>— Jo, photographer</span>
            </article>
          </div>
        </section>

        <section className={`lg-wrapper ${sty.storySection}`}>
          <div className={sty.sectionIntro}>
            <p className={sty.kicker}>A little less scattered</p>
            <h2>
              Stop rebuilding your bio every time you launch something new.
            </h2>
            <p>
              Your profile should keep up with your work. Tetherly gives every
              project a clear place to land, so you can spend less time
              rearranging links and more time making things worth clicking.
            </p>
          </div>
          <div className={sty.stepGrid}>
            {steps.map(([number, title, copy]) => (
              <article className={sty.step} key={number}>
                <span className={sty.cardIndex}>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`lg-wrapper ${sty.quoteSection}`}>
          <p className={sty.quote}>
            “It feels less like a link list and more like a tiny, living studio
            door.”
          </p>
          <p className={sty.quoteByline}>— Mina, independent designer</p>
        </section>

        <section className={`lg-wrapper ${sty.audienceSection}`}>
          <div className={sty.audienceHeader}>
            <p className={sty.kicker}>Made for momentum</p>
            <h2>Whatever you are building, give it a front door.</h2>
          </div>
          <div className={sty.audienceGrid}>
            <div>
              <strong>For creators</strong>
              <p>
                Turn followers into regulars with a page that keeps your latest
                work impossible to miss.
              </p>
            </div>
            <div>
              <strong>For small teams</strong>
              <p>
                Make launches, resources, and contact points easy to find
                without another microsite.
              </p>
            </div>
            <div>
              <strong>For everyone in between</strong>
              <p>
                Keep your internet in one place, even when the rest of it keeps
                changing.
              </p>
            </div>
          </div>
        </section>

        <section className={`lg-wrapper ${sty.faqSection}`}>
          <div className={sty.faqIntro}>
            <p className={sty.kicker}>Good to know</p>
            <h2>Questions, answered.</h2>
            <p>
              A few useful details before you make your corner of the internet.
            </p>
          </div>
          <div className={sty.faqList}>
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={`lg-wrapper ${sty.finalCta}`}>
          <p className={sty.kicker}>Your next click starts here</p>
          <h2>
            Make your one link
            <br />
            <em>feel like you.</em>
          </h2>
          <p>
            Join the people making their corner of the internet a little more
            considered.
          </p>
          <Link to="/signup" variant="primary">
            Create your Tether <FiArrowUpRight aria-hidden="true" />
          </Link>
        </section>
      </main>
    </>
  );
};
