import React from 'react';

import './Radio.css';

type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export default function Radio(props: RadioProps): JSX.Element {
  const {
    children,
    className,
    style,
    id,
    ...inputProps
  } = props;

  return (
    <>
      <input type="radio" className="ui-radio-input" id={id} {...inputProps} />
      <label
        htmlFor={id}
        className={`ui-radio-label${className ? ` ${className}` : ''}`}
        style={style}
      >
        <span />
        {children}
      </label>
    </>
  );
}
