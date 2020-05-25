import React from 'react';

import './Radio.css';

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export default function Radio(props: RadioProps): JSX.Element {
  const {
    id,
    label,
    ...inputProps
  } = props;

  return (
    <div className="radio-ui-component">
      <input type="radio" id={id} {...inputProps} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
