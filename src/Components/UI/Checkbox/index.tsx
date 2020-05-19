import React from 'react';

import './Checkbox.css';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export default function Checkbox(props: CheckboxProps): JSX.Element {
  const {
    id,
    label: placeholder,
    ...inputProps
  } = props;

  return (
    <div className="checkbox-ui-component">
      <input type="checkbox" id={id} {...inputProps} />
      <label htmlFor={id}>
        <div />
        {placeholder}
      </label>
    </div>
  );
}
