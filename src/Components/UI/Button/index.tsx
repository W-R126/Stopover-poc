import React from 'react';

import css from './Button.module.css';

interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  type?: 'primary' | 'secondary';
}

export default function Button({
  className,
  type = 'primary',
  children,
  ...props
}: ButtonProps): JSX.Element {
  const classList = [css.Button];

  if (className) {
    classList.push(className);
  }

  switch (type) {
    case 'primary':
      classList.push(css.Primary);
      break;
    case 'secondary':
      classList.push(css.Secondary);
      break;
    default:
      break;
  }

  return (
    <button type="button" className={classList.join(' ')} {...props}>
      {children}
    </button>
  );
}
