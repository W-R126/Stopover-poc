import React from 'react';

import css from './AmountPicker.module.css';

interface AmountPickerProps {
  value: number;
  min: number;
  max: number;
  icon: string;
  title: string;
  description: string;
  onChange: (value: number) => void;
  className?: string;
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
      className,
    } = this.props;

    const classList = [css.AmountPicker];

    if (className) {
      classList.push(className);
    }

    return (
      <div className={classList.join(' ')}>
        <img src={icon} alt={title} />
        <div className={css.Info}>
          <span className={css.Title}>{title}</span>
          <span className={css.Description}>{description}</span>
        </div>
        <div className={css.Amount}>
          <button
            className={css.Decrease}
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
            className={css.Increase}
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
