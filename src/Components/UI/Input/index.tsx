import React from 'react';

import css from './Input.module.css';

export default function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  const classList = [css.Input];

  if (className) {
    classList.push(className);
  }

  return (
    <input {...props} className={classList.join(' ')} />
  );
}
