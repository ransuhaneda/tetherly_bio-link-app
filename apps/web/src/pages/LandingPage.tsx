import studioImage from '@assets/images/ahmet-yuksek-zSiqe6j9Aao-unsplash.jpg?responsive';
import portraitImage from '@assets/images/toa-heftiba-IrpBb-5YGZw-unsplash.jpg?responsive';
import { SEOHelmet } from '@components/common/SEOHelmet';
import { Button } from '@components/ui/Button';
import { Link } from '@components/ui/Link';
import { ResponsiveImage } from '@components/ui/ResponsiveImage';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiMoreHorizontal } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import sty from './LandingPage.module.scss';

import { authApi } from '@/features/auth/authApi';
import { getApiStatus } from '@/services/api';

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
    'Pick a handle people can remember and reserve it for your Tetherly account.',
  ],
  [
    '02',
    'Add what matters',
    'The profile editor and publishing tools are being built around your work.',
  ],
  [
    '03',
    'Send people somewhere good',
    'Share one clean URL everywhere once your profile is ready to publish.',
  ],
];

const faqs = [
  [
    'Can I start for free?',
    'Yes. Account creation and username reservation are free while publishing tools are in development.',
  ],
  [
    'Can I change my links later?',
    'Profile editing and publishing are planned next. Your reserved Tetherly URL will stay the same.',
  ],
  [
    'What can I add to my page?',
    'The planned editor will support links to your work, shop, newsletter, social profiles, playlists, and community spaces.',
  ],
  [
    'Do I need a custom domain?',
    'No. Every account includes a Tetherly URL. Custom domains are planned for a future paid plan.',
  ],
];

type UsernameFormState =
  | 'idle'
  | 'validating'
  | 'loading'
  | 'success'
  | 'unavailable'
  | 'invalid'
  | 'rateLimited'
  | 'serverError';

const FORM_MESSAGES: Record<Exclude<UsernameFormState, 'idle'>, string> = {
  validating: 'Validating that handle…',
  loading: 'Checking that handle…',
  success: 'That handle is available. Taking you to account creation…',
  unavailable: 'That handle is already taken. Try another one.',
  invalid: 'Use 3–30 letters, numbers, hyphens, or underscores.',
  rateLimited: 'Too many checks right now. Please wait and try again.',
  serverError: 'We could not check that handle. Please try again.',
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [formState, setFormState] = useState<UsernameFormState>('idle');
  const pageRef = useRef<HTMLElement>(null);
  const redirectTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current);
    },
    []
  );

  useLayoutEffect(() => {
    const motion = gsap.matchMedia();
    motion.add('(prefers-reduced-motion: no-preference)', () => {
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
    });
    return () => motion.revert();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedUsername = username.trim().toLowerCase();
    setFormState('validating');
    await new Promise(resolve => window.setTimeout(resolve, 0));
    if (!/^[a-z0-9](?:[a-z0-9_-]{1,28}[a-z0-9])?$/.test(normalizedUsername)) {
      setFormState('invalid');
      return;
    }
    setFormState('loading');
    try {
      const available = await authApi.usernameAvailability(normalizedUsername);
      if (!available) {
        setFormState('unavailable');
        return;
      }
      setFormState('success');
      redirectTimer.current = window.setTimeout(() => {
        navigate(`/signup?username=${encodeURIComponent(normalizedUsername)}`);
      }, 450);
    } catch (error) {
      const apiStatus = getApiStatus(error);
      setFormState(
        apiStatus === 422
          ? 'invalid'
          : apiStatus === 429
            ? 'rateLimited'
            : 'serverError'
      );
    }
  };

  const isSubmitting =
    formState === 'validating' ||
    formState === 'loading' ||
    formState === 'success';
  const formMessage = formState === 'idle' ? '' : FORM_MESSAGES[formState];

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
                  onChange={event => {
                    setUsername(event.target.value.toLowerCase());
                    setFormState('idle');
                  }}
                  placeholder="username"
                  autoComplete="off"
                  aria-invalid={formState === 'invalid'}
                  aria-describedby="username-status"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                customClass={sty.submitButton}
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {formState === 'loading' || formState === 'validating'
                  ? 'Checking…'
                  : formState === 'success'
                    ? 'Handle available'
                    : 'Create Your Tether'}
              </Button>
            </form>
            <p
              id="username-status"
              className={sty.formStatus}
              role="status"
              aria-live="polite"
            >
              {formMessage}
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
              <ResponsiveImage
                src={portraitImage}
                alt="Creator portrait"
                className={sty.avatar}
                aspectRatio="1:1"
                sizes="144px"
                priority
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
              <ResponsiveImage
                src={studioImage}
                alt="Desk and creative tools"
                className={sty.featureImage}
                aspectRatio="16:9"
                sizes="(max-width: 767px) 100vw, 50vw"
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
                <span>Focused, authored page</span>
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
                <strong>Planned</strong>
                <span>click insights</span>
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
              <ResponsiveImage
                src={studioImage}
                alt="Creative workspace with notes and tools"
                aspectRatio="16:9"
                sizes="(max-width: 767px) 100vw, 40vw"
                loading="lazy"
              />
              <div>
                <span className={sty.cardIndex}>03 / Rhythm</span>
                <h3>A page that changes with you.</h3>
              </div>
            </article>
            <article className={`${sty.toolkitCard} ${sty.toolkitQuote}`}>
              <p>Publishing tools are still in development.</p>
              <span>Account creation and username reservation come first.</span>
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
          <p className={sty.quoteByline}>Prototype direction</p>
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
