import React, { useRef } from 'react';

import css from './Checkbox.module.css';

interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  onChange?: (checked: boolean) => void;
}

export default function Checkbox(props: CheckboxProps): JSX.Element {
  const {
    children,
    className,
    style,
    id,
    disabled,
    onChange,
    ...inputProps
  } = props;

  const checkboxRef = useRef<HTMLInputElement>(null);

  const classList = [css.Label];

  if (className) {
    classList.push(className);
  }

  return (
    <>
      <input
        type="checkbox"
        className={css.Checkbox}
        id={id}
        {...inputProps}
        ref={checkboxRef}
        disabled={disabled}
        onChange={onChange
          ? (e: React.ChangeEvent<HTMLInputElement>): void => onChange(e.target.checked)
          : undefined}
      />

      <span
        onClick={(): void => {
          if (disabled) {
            return;
          }

          if (checkboxRef.current) {
            checkboxRef.current.checked = !checkboxRef.current.checked;
            checkboxRef.current.focus();

            if (onChange) {
              onChange(checkboxRef.current.checked);
            }
          }
        }}
        role="button"
        className={classList.join(' ')}
        style={style}
      >
        <span />

        {children}
      </span>
    </>
  );
}
