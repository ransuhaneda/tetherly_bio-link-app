import sty from './Footer.module.scss';

import { Link } from '@components/ui/Link';

export const Footer = () => {
  return (
    <footer className={sty.footer}>
      <p className={sty.footerText}>
        Made by <Link to={'https://linktr.ee/ransuhaneda'}>ransuhaneda</Link>
      </p>
    </footer>
  );
};
