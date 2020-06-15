import React from 'react';

import css from './Checkbox.module.css';

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export default function Checkbox(props: CheckboxProps): JSX.Element {
  const {
    children,
    className,
    style,
    id,
    ...inputProps
  } = props;

  const classList = [css.Label];

  if (className) {
    classList.push(className);
  }

  return (
    <>
      <input type="checkbox" className={css.Checkbox} id={id} {...inputProps} />
      <label
        htmlFor={id}
        className={classList.join(' ')}
        style={style}
      >
        <span />
        {children}
      </label>
    </>
  );
}
