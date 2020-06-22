import React from 'react';

import css from './Range.module.css';

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

export default class Range extends React.Component<RangeProps, RangeState> {
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

    this.onChange = this.onChange.bind(this);
  }

  private onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { onChange } = this.props;

    onChange(Number.parseInt(e.target.value, 10));
  }

  private getValuePos(): number {
    const selfRef = this.selfRef.current;
    const valueRef = this.valueRef.current;

    if (!(selfRef && valueRef)) {
      return 0;
    }

    const { value, min, max } = this.props;
    const delta = Math.abs(min - max);
    const percent = ((value - min) / delta);
    const valueWidth = valueRef.getBoundingClientRect().width;
    const selfWidth = selfRef.getBoundingClientRect().width - 16;

    return (8 - valueWidth / 2) + selfWidth * percent;
  }

  private async showValue(
    e: React.MouseEvent<HTMLInputElement>,
    showValue: boolean,
  ): Promise<void> {
    this.showingValue = showValue;

    const { onMouseUp, onMouseDown } = this.props;

    if (showValue && onMouseDown) {
      onMouseDown(e);
    }

    if (!showValue && onMouseUp) {
      onMouseUp(e);
    }

    if (!showValue) {
      const cancel = await new Promise((resolve) => setTimeout(
        () => resolve(this.showingValue),
        250,
      ));

      if (cancel) {
        return;
      }
    }

    this.setState({ showValue });
  }

  render(): JSX.Element {
    const {
      className,
      style,
      displayValue,
      onChange,
      onMouseDown,
      onMouseUp,
      value,
      valueFormatter,
      ...props
    } = this.props;

    const { showValue } = this.state;
    const classList = [css.Range];

    if (className) {
      classList.push(className);
    }

    return (
      <div
        ref={this.selfRef}
        className={classList.join(' ')}
        style={style}
      >
        <div
          ref={this.valueRef}
          className={css.Value}
          style={{ left: this.getValuePos(), visibility: showValue ? undefined : 'hidden' }}
        >
          {valueFormatter(value)}
        </div>
        <input
          type="range"
          value={value}
          onChange={this.onChange}
          onMouseDown={(e): Promise<void> => this.showValue(e, true)}
          onMouseUp={(e): Promise<void> => this.showValue(e, false)}
          {...props}
        />
      </div>
    );
  }
}
