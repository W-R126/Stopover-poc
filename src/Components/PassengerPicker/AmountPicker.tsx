import React from 'react';

import './AmountPicker.css';

interface AmountPickerProps {
  title: string;
  description: string;
  value: number;
  min: number;
  max: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

export default class AmountPicker extends React.Component<AmountPickerProps, {}> {
  static readonly defaultProps: Pick<AmountPickerProps, 'disabled'> = {
    disabled: false,
  };

  constructor(props: AmountPickerProps) {
    super(props);

    this.state = {};

    this.decrease = this.decrease.bind(this);
    this.increase = this.increase.bind(this);
  }

  private decrease(): void {
    const { value, onChange } = this.props;

    onChange(value - 1);
  }

  private increase(): void {
    const { value, onChange } = this.props;

    onChange(value + 1);
  }

  render(): JSX.Element {
    const {
      title,
      description,
      value,
      min,
      max,
      disabled,
    } = this.props;

    return (
      <div className="amount-picker">
        <div className="info">
          <span className="title input-label">{title}</span>
          <span className="description">{description}</span>
        </div>
        <div className="amount">
          <button
            type="button"
            className="decrease"
            disabled={disabled || value <= min}
            onClick={this.decrease}
          >
            -
          </button>
          <span className="value">
            {value}
          </span>
          <button
            type="button"
            className="increase"
            disabled={disabled || value >= max}
            onClick={this.increase}
          >
            +
          </button>
        </div>
      </div>
    );
  }
}
