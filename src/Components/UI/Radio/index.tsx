import React from 'react';

import css from './Radio.module.css';

type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export default function Radio(props: RadioProps): JSX.Element {
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
      <input type="radio" className={css.Radio} id={id} {...inputProps} />
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
