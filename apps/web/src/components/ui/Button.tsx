import type { ButtonHTMLAttributes, ReactNode } from 'react';

import sty from './Action.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  customClass?: string | undefined;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  customClass,
  children,
  className,
  ...props
}: ButtonProps) {
  const buttonClass = [
    sty[`btn`],
    sty[`variant__${variant}`],
    sty[`size__${size}`],
  ].join(' ');

  return (
    <button
      className={[buttonClass, customClass, className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
