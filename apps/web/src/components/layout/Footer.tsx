import { Link } from '@components/ui/Link';
import {
  FiArrowUpRight,
  FiInstagram,
  FiTwitter,
  FiYoutube,
} from 'react-icons/fi';

import sty from './Footer.module.scss';

export const Footer = () => (
  <footer className={sty.footer}>
    <div className={sty.footerInner}>
      <div className={sty.footerLead}>
        <p className={sty.eyebrow}>One link. Every direction.</p>
        <h2>
          Keep your corner
          <br />
          of the internet <em>close.</em>
        </h2>
        <Link to="/signup" variant="primary" customClass={sty.footerCta}>
          Create your tether <FiArrowUpRight aria-hidden="true" />
        </Link>
      </div>
      <div className={sty.footerGrid}>
        <div className={sty.footerColumn}>
          <span className={sty.columnLabel}>Explore</span>
          <Link to="/about">About Tetherly</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/signup">Get started</Link>
        </div>
        <div className={sty.footerColumn}>
          <span className={sty.columnLabel}>Say hello</span>
          <a href="mailto:hello@tetherly.ink">hello@tetherly.ink</a>
          <div className={sty.socials} aria-label="Social links">
            <a href="https://instagram.com" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="https://x.com" aria-label="X / Twitter">
              <FiTwitter />
            </a>
            <a href="https://youtube.com" aria-label="YouTube">
              <FiYoutube />
            </a>
          </div>
        </div>
        <div className={sty.footerColumn}>
          <span className={sty.columnLabel}>The details</span>
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms of service</Link>
        </div>
      </div>
      <div className={sty.footerBottom}>
        <span>© {new Date().getFullYear()} Tetherly</span>
        <span className={sty.madeBy}>
          Made with intention by{' '}
          <a href="https://linktr.ee/ransuhaneda">ransuhaneda</a>
        </span>
        <span className={sty.backTop}>
          <a href="#top">Back to top ↑</a>
        </span>
      </div>
    </div>
  </footer>
);
