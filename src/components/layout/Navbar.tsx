import { NavLink } from 'react-router-dom';

import { Link } from '@components/ui/Link';

import sty from './Navbar.module.scss';

const NAV_LINKS = [
  { id: '01', name: 'Tetherly', href: '/' },
  { id: '02', name: 'About', href: '/about' },
  { id: '03', name: 'Pricing', href: '/pricing' },
  { id: '04', name: 'Contact', href: '/contact' },
  { id: '05', name: 'Mockapi', href: '/mockapi' },
];

export const Navbar = () => {
  const isMobile = ''; // Mobile nav implementation

  return (
    <header className={`lg-wrapper ${sty.navigation}`}>
      <nav className={sty.wrapper}>
        <ul className={sty.navbar__main}>
          {NAV_LINKS.map(link => (
            <li key={link.name} className={sty.link}>
              {isMobile ? (
                <span>
                  <NavLink to={link.href} aria-label={link.name}>
                    <span>{link.id}/ </span>
                    {link.name}
                  </NavLink>
                </span>
              ) : (
                <NavLink to={link.href} aria-label={link.name}>
                  {link.name}
                </NavLink>
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
