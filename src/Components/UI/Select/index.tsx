import React from 'react';

import './Select.css';

interface SelectProps<T> {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  value: T;
  tabIndex: number;
  onChange: (value: T) => void;
}

interface SelectState {
  expanded: boolean;
}

export default class Select<T> extends React.Component<SelectProps<T>, SelectState> {
  static readonly defaultProps = {
    tabIndex: 0,
  };

  constructor(props: SelectProps<T>) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.toggle = this.toggle.bind(this);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
  }

  private onKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();

      this.navigate(e.key);
      return;
    }

    switch (e.key) {
      case 'Enter':
        this.toggle();
        break;
      case ' ':
        this.expand();
        break;
      case 'Escape':
        this.collapse();
        break;
      default:
        break;
    }
  }

  private get options(): JSX.Element[] {
    const { children } = this.props;

    return React.Children.toArray(children) as JSX.Element[];
  }

  private navigate(direction: 'ArrowUp' | 'ArrowDown'): void {
    const { value } = this.props;
    const { options } = this;
    const selectedIndex = options.findIndex((option) => option.props.value === value);
    const newIndex = selectedIndex + (direction === 'ArrowUp' ? -1 : 1);

    if (newIndex < 0 || newIndex === options.length) {
      return;
    }

    this.select(options[newIndex].props.value);
  }

  private select(value: T): void {
    const { onChange } = this.props;

    onChange(value);
  }

  private expand(): void {
    const { expanded } = this.state;

    if (!expanded) {
      this.toggle();
    }
  }

  private collapse(): void {
    const { expanded } = this.state;

    if (expanded) {
      this.toggle();
    }
  }

  private toggle(): void {
    const { expanded } = this.state;

    this.setState({ expanded: !expanded });
  }

  render(): JSX.Element {
    const {
      id,
      className,
      style,
      value,
      tabIndex,
    } = this.props;
    const { expanded } = this.state;
    const { options } = this;
    const selected = options.find((option) => option.props.value === value);

    return (
      <div
        id={id}
        className={`ui-select${className ? ` ${className}` : ''}`}
        style={style}
        aria-expanded={expanded}
        aria-controls={`${id ?? ''}-options`}
        tabIndex={tabIndex}
        role="combobox"
        onClick={this.toggle}
        onBlur={this.collapse}
        onKeyDown={this.onKeyDown}
      >
        <div className="wrapper">
          <div className="selected">
            {selected}
          </div>

          <div className="modal-wrapper">
            <div className="options" id={`${id ?? ''}-options`}>
              {options.map((option) => (
                <div
                  key={option.key ?? ''}
                  className="option"
                  role="option"
                  aria-selected={option === selected}
                  onClick={(): void => this.select(option.props.value)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
