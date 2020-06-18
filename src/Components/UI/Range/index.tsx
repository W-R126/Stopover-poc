import React from 'react';

import css from './Range.module.css';

interface RangeProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'| 'value' | 'onChange'
> {
  unit?: {
    plural: string;
    singular: string;
  };
  value: number;
  onChange: (value: number) => void;
  displayValue: boolean;
}

export default class Range extends React.Component<RangeProps, {}> {
  static readonly defaultProps: Pick<RangeProps, 'displayValue'> = {
    displayValue: true,
  };

  constructor(props: RangeProps) {
    super(props);

    this.state = {};

    this.onChange = this.onChange.bind(this);
  }

  private onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { onChange } = this.props;

    onChange(Number.parseInt(e.target.value, 10));
  }

  render(): JSX.Element {
    const {
      unit,
      className,
      style,
      displayValue,
      onChange,
      value,
      ...props
    } = this.props;

    const classList = [css.Range];

    if (className) {
      classList.push(className);
    }

    return (
      <div className={classList.join(' ')} style={style}>
        <div className={css.Value}>
          {`${value}${unit ? ` ${value === 1 ? unit.singular : unit.plural}` : ''}`}
        </div>
        <input type="range" value={value} {...props} onChange={this.onChange} />
      </div>
    );
  }
}
