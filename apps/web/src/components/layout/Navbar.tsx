import { Button } from '@components/ui/Button';
import { Link } from '@components/ui/Link';
import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import sty from './Navbar.module.scss';

import { useAuth } from '@/features/auth/useAuth';

const NAV_LINKS = [
  { id: '01', name: 'About', href: '/about' },
  { id: '02', name: 'Pricing', href: '/pricing' },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isLoading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className={`lg-wrapper ${sty.navigation}`}>
      <nav className={sty.wrapper}>
        <div className={sty.topRow}>
          <Link to="/" customClass={sty.logo}>
            Tetherly
          </Link>
          <Button
            type="button"
            variant="tertiary"
            customClass={sty.menuButton}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen(open => !open)}
          >
            {isMenuOpen ? (
              <FiX aria-hidden="true" />
            ) : (
              <FiMenu aria-hidden="true" />
            )}
          </Button>
        </div>
        <ul className={sty.navbar__main}>
          {NAV_LINKS.map(link => (
            <li key={link.name} className={sty.link}>
              <Link to={link.href} aria-label={link.name}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className={sty.wrapper__auth}>
          {!isLoading && user ? (
            <>
              <span className={sty.link__auth}>@{user.profile?.username}</span>
              <Button
                type="button"
                variant="tertiary"
                size="md"
                customClass={sty.link__auth}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out…' : 'Log out'}
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                variant="tertiary"
                size="md"
                customClass={sty.link__auth}
              >
                Log In
              </Link>
              <Link to="/signup" variant="primary" size="md">
                Create an Account
              </Link>
            </>
          )}
        </div>
        <div
          id="mobile-navigation"
          className={`${sty.mobilePanel} ${isMenuOpen ? sty.mobilePanelOpen : ''}`}
          hidden={!isMenuOpen}
        >
          <ul className={sty.mobileLinks}>
            {NAV_LINKS.map(link => (
              <li key={link.name}>
                <Link to={link.href} aria-label={link.name}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className={sty.mobileActions}>
            {!isLoading && user ? (
              <>
                <span className={sty.link__auth}>
                  @{user.profile?.username}
                </span>
                <Button
                  type="button"
                  variant="tertiary"
                  customClass={sty.link__auth}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out…' : 'Log out'}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" variant="tertiary" size="md">
                  Log In
                </Link>
                <Link to="/signup" variant="primary" size="md">
                  Create an Account
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
