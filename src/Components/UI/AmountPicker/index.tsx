import React from 'react';

import './AmountPicker.css';

interface AmountPickerProps {
  value: number;
  max?: number;
  min?: number;
  label?: JSX.Element;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

export default class AmountPicker extends React.Component<AmountPickerProps, {}> {
  constructor(props: AmountPickerProps) {
    super(props);

    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
  }

  private onChange(value: number): void {
    const { onChange } = this.props;

    if (onChange) {
      onChange(value);
    }
  }

  private increase(): void {
    const { value } = this.props;

    this.onChange(value + 1);
  }

  private decrease(): void {
    const { value } = this.props;

    this.onChange(value - 1);
  }

  render(): JSX.Element {
    const {
      label,
      value,
      max,
      min,
      disabled,
    } = this.props;

    return (
      <div className="amount-picker-ui-component">
        <div className="header">
          {label}
        </div>
        <div className="controls">
          <button
            type="button"
            onClick={this.decrease}
            className="decrease"
            disabled={disabled || (min !== undefined && value <= min)}
          >
            Decrease
          </button>
          <span>{value ?? 0}</span>
          <button
            type="button"
            onClick={this.increase}
            className="increase"
            disabled={disabled || (max !== undefined && value >= max)}
          >
            Increase
          </button>
        </div>
      </div>
    );
  }
}
