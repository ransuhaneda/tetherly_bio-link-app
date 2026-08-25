import { Button } from '@components/ui/Button';
import { Link } from '@components/ui/Link';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import sty from './Navbar.module.scss';

import { useAuth } from '@/features/auth/useAuth';

const NAV_LINKS = [
  { id: '01', name: 'About', href: '/about' },
  { id: '02', name: 'Pricing', href: '/pricing' },
  { id: '03', name: 'Contact', href: '/contact' },
  { id: '04', name: 'Mockapi', href: '/mockapi' },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
        <Link to="/" customClass={sty.logo}>
          Tetherly
        </Link>
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
      </nav>
    </header>
  );
};
