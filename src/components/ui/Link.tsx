import { Link as RouterLink, type LinkProps } from 'react-router-dom';

import sty from './Action.module.scss';

interface Props extends LinkProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'underline';
  size?: 'none' | 'sm' | 'md' | 'lg';
  customClass?: string;
}

export function Link({ variant, size, customClass, ...props }: Props) {
  const linkClass = [
    sty[`link`],
    sty[`variant__${variant}`],
    sty[`size__${size}`],
  ].join(' ');

  return (
    <RouterLink
      {...props}
      className={`${customClass} ${linkClass}`}
      role="link"
    >
      {props.children}
    </RouterLink>
  );
}
