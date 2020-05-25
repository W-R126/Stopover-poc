import React from 'react';

import './Input.css';

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type' | 'placeholder'
> {
  label?: string;
  value?: string;
  type: 'text' | 'number' | 'phone' | 'email' | 'password';
  onChange?: (value: string) => void;
  validators: (() => string | undefined)[];
}

interface InputState {
  errors: string[];
}

export default class Input extends React.Component<InputProps, InputState> {
  static defaultProps: Pick<InputProps, 'validators' | 'type'> = {
    validators: [],
    type: 'text',
  };

  private readonly inputRef = React.createRef<HTMLInputElement>();

  constructor(props: InputProps) {
    super(props);

    this.state = {
      errors: [],
    };

    this.onChange = this.onChange.bind(this);
  }

  private onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { onChange } = this.props;

    if (onChange) {
      onChange(e.target.value);
    }

    // Always force update.
    this.forceUpdate();
  }

  private get className(): string {
    const result = ['input-ui-component'];

    if (this.inputRef.current) {
      if (this.inputRef.current.value.length !== 0) {
        result.push('has-value');
      }
    }

    return result.join(' ');
  }

  validate(): boolean {
    const { validators } = this.props;

    const errors = validators
      .map((validator) => validator())
      .filter((error) => error !== undefined) as string[];

    this.setState({ errors });

    return errors.length > 0;
  }

  render(): JSX.Element {
    const {
      value,
      label: placeholder,
      id,
      /* eslint-disable */
      onChange, // Don't propagate.
      /* eslint-enable */
      ...inputProps
    } = this.props;

    const { errors } = this.state;

    return (
      <div className={this.className}>
        <div className="label-wrapper">
          {placeholder && (<label htmlFor={id}>{placeholder}</label>)}
        </div>
        <input
          ref={this.inputRef}
          value={value}
          id={id}
          onChange={this.onChange}
          {...inputProps}
        />
        <div className="errors">
          <span>{errors}</span>
        </div>
      </div>
    );
  }
}
