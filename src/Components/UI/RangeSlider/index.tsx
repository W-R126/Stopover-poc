import React from 'react';

import css from './RangeSlider.module.css';

interface RangeProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'| 'value' | 'onChange' | 'min' | 'max'
> {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  valueFormatter: (value: number) => string;
  displayValue: boolean;
}

interface RangeState {
  showValue: boolean;
}

export default class RangeSlider extends React.Component<RangeProps, RangeState> {
  static readonly defaultProps: Pick<RangeProps, 'displayValue' | 'valueFormatter'> = {
    displayValue: true,
    valueFormatter: (value: number) => value.toString(),
  };

  private readonly valueRef = React.createRef<HTMLDivElement>();

  private readonly selfRef = React.createRef<HTMLDivElement>();

  private showingValue = false;

  constructor(props: RangeProps) {
    super(props);

    this.state = {
      showValue: false,
    };
  }

  componentDidUpdate(): void {
    this.setValuePos();
  }

  private setValuePos(): void {
    const selfRef = this.selfRef.current;
    const valueRef = this.valueRef.current;

    if (!(selfRef && valueRef)) {
      return;
    }

    const { value, min, max } = this.props;
    const delta = Math.abs(min - max);
    let percent = ((value - min) / delta);
    const valueWidth = valueRef.getBoundingClientRect().width;
    const selfWidth = selfRef.getBoundingClientRect().width - 16;

    if (Number.isNaN(percent)) {
      percent = 0;
    }

    valueRef.style.left = `${(8 - valueWidth / 2) + selfWidth * percent}px`;
  }

  private async showValue(showValue: boolean): Promise<void> {
    this.showingValue = showValue;

    if (!showValue) {
      const cancel = await new Promise((resolve) => setTimeout(
        () => resolve(this.showingValue),
        250,
      ));

      if (cancel) {
        return;
      }
    }

    this.setValuePos();
    this.setState({ showValue });
  }

  render(): JSX.Element {
    const {
      className,
      style,
      value,
      valueFormatter,
      displayValue,
      onMouseDown,
      onMouseUp,
      onChange,
      ...props
    } = this.props;

    const { showValue } = this.state;
    const classList = [css.RangeSlider];

    if (className) {
      classList.push(className);
    }

    return (
      <div
        ref={this.selfRef}
        className={classList.join(' ')}
        style={style}
      >
        {!displayValue
          ? undefined
          : (
            <div
              ref={this.valueRef}
              className={css.Value}
              style={{ visibility: showValue ? undefined : 'hidden' }}
            >
              {valueFormatter(value)}
            </div>
          )}
        <input
          type="range"
          value={value}
          onChange={(e): void => {
            if (onChange) {
              onChange(Number.parseInt(e.target.value, 10));
            }
          }}
          onMouseDown={(e): void => {
            if (onMouseDown) {
              onMouseDown(e);
            }

            this.showValue(true);
          }}
          onMouseUp={(e): void => {
            if (onMouseUp) {
              onMouseUp(e);
            }

            this.showValue(false);
          }}
          {...props}
        />
      </div>
    );
  }
}
