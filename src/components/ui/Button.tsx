import sty from './Action.module.scss';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  disabled,
}: ButtonProps) {
  const buttonClass = [
    sty[`btn`],
    sty[`variant__${variant}`],
    sty[`size__${size}`],
  ].join(' ');

  return (
    <button
      className={`${sty.btn} ${buttonClass}`}
      onClick={onClick}
      disabled={disabled}
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </button>
  );
}
