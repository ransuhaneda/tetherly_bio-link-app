import { NavLink } from 'react-router-dom';

import sty from './Navbar.module.scss';

const NAV_LINKS = [
  { id: '01', name: 'Home', href: '/' },
  { id: '02', name: 'Samplepage', href: '/samplepage' },
  { id: '03', name: 'Mockapi', href: '/mockapi' },
];

export const Navbar = () => {
  const isMobile = ''; // Mobile nav implementation

  return (
    <header className={sty.navigation}>
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
      </nav>
    </header>
  );
};
