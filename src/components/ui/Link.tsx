import { Link as RouterLink, type LinkProps } from 'react-router-dom';

import sty from './Action.module.scss';

interface Props extends LinkProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'underline';
  size?: 'none' | 'sm' | 'md' | 'lg';
}

export function Link({ variant = 'underline', size, ...props }: Props) {
  const customClass = [
    sty[`link`],
    sty[`variant__${variant}`],
    sty[`size__${size}`],
  ].join(' ');

  return (
    <RouterLink {...props} className={`${sty.link} ${customClass}`} role="link">
      {props.children}
    </RouterLink>
  );
}
