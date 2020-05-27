import React from 'react';

import './Select.css';
import arrowDown from '../../../Assets/Images/arrow-down.svg';
import checkedIcon from '../../../Assets/Images/checked-icon.svg';

interface SelectProps<T> {
  value: T;
  tabIndex: number;
  onChange: (value: T) => void;
  className?: string;
}

interface SelectState {
  expanded: boolean;
}

export default class Select<T> extends React.Component<SelectProps<T>, SelectState> {
  static readonly defaultProps: { tabIndex: number } = {
    tabIndex: 0,
  };

  constructor(props: SelectProps<T>) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.select = this.select.bind(this);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
  }

  private select(value: T): void {
    const { onChange } = this.props;

    this.collapse();

    onChange(value);
  }

  private expand(): void {
    this.setState({ expanded: true });
  }

  private collapse(): void {
    this.setState({ expanded: false });
  }

  render(): JSX.Element {
    const {
      children,
      value,
      tabIndex,
      className,
    } = this.props;
    const { expanded } = this.state;

    const options = React.Children.toArray(children) as JSX.Element[];
    const selected = options.find((option) => option.props.value === value);

    return (
      <div
        className={`ui-select${className ? ` ${className}` : ''}`}
        aria-expanded={expanded}
        tabIndex={tabIndex}
        onBlur={this.collapse}
      >
        <div
          className="selected"
          role="button"
          onClick={this.expand}
        >
          <label className="input-label">{selected?.props.children}</label>
          <img src={arrowDown} alt="Expand" />
        </div>
        <div className="options">
          {options.map((option, idx) => (
            <div
              className="ui-option input-label"
              key={`ui-option-${idx}`}
              role="button"
              onClick={(): void => this.select(option.props.value)}
            >
              {option === selected && (
                <img src={checkedIcon} alt="checked" />
              )}
              {option.props.children}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
