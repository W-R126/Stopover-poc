import React from 'react';

import './AmountPicker.css';

interface AmountPickerProps {
  value: number;
  min: number;
  max: number;
  icon: string;
  title: string;
  description: string;
  onChange: (value: number) => void;
}

export default class AmountPicker extends React.Component<AmountPickerProps, {}> {
  constructor(props: AmountPickerProps) {
    super(props);

    this.decrease = this.decrease.bind(this);
    this.increase = this.increase.bind(this);
  }

  private decrease(): void {
    const { value, onChange, min } = this.props;

    if (value > min) {
      onChange(value - 1);
    }
  }

  private increase(): void {
    const { value, onChange, max } = this.props;

    if (value < max) {
      onChange(value + 1);
    }
  }

  render(): JSX.Element {
    const {
      value,
      min,
      max,
      icon,
      title,
      description,
    } = this.props;

    return (
      <div className="amount-picker">
        <img src={icon} alt={title} />
        <div className="info">
          <span className="title">{title}</span>
          <span className="description">{description}</span>
        </div>
        <div className="amount">
          <button
            className="decrease"
            type="button"
            onClick={this.decrease}
            disabled={value === min}
          >
            -
          </button>
          <span>
            {value}
          </span>
          <button
            className="increase"
            type="button"
            onClick={this.increase}
            disabled={value === max}
          >
            +
          </button>
        </div>
      </div>
    );
  }
}
