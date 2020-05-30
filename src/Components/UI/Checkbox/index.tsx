import React from 'react';

import './Checkbox.css';

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export default function Checkbox(props: CheckboxProps): JSX.Element {
  const {
    children,
    className,
    style,
    id,
    ...inputProps
  } = props;

  return (
    <>
      <input type="checkbox" className="ui-checkbox-input" id={id} {...inputProps} />
      <label
        htmlFor={id}
        className={`ui-checkbox-label${className ? ` ${className}` : ''}`}
        style={style}
      >
        <span />
        {children}
      </label>
    </>
  );
}
