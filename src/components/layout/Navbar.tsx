import { Link } from '@components/ui/Link';

import sty from './Navbar.module.scss';

const NAV_LINKS = [
  { id: '01', name: 'About', href: '/about' },
  { id: '02', name: 'Pricing', href: '/pricing' },
  { id: '03', name: 'Contact', href: '/contact' },
  { id: '04', name: 'Mockapi', href: '/mockapi' },
];

export const Navbar = () => {
  const isMobile = ''; // Mobile nav implementation

  return (
    <header className={`lg-wrapper ${sty.navigation}`}>
      <nav className={sty.wrapper}>
        <Link to="/" customClass={sty.logo ?? ''}>
          Tetherly
        </Link>

        <ul className={sty.navbar__main}>
          {NAV_LINKS.map(link => (
            <li key={link.name} className={sty.link}>
              {isMobile ? (
                <span>
                  <Link to={link.href} aria-label={link.name}>
                    <span>{link.id}/ </span>
                    {link.name}
                  </Link>
                </span>
              ) : (
                <Link to={link.href} aria-label={link.name}>
                  {link.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className={sty.wrapper__auth}>
          <Link
            to="/login"
            variant="tertiary"
            size="md"
            customClass={sty.link__auth ?? ''}
          >
            Log In
          </Link>
          <Link to="/signup" variant="primary" size="md">
            Create an Account
          </Link>
        </div>
      </nav>
    </header>
  );
};
