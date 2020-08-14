import React from 'react';

import css from './CabinClassSelector.module.css';

interface CabinClassSelectorProps<T> {
  style?: React.CSSProperties;
  value: T;
  onChange: (value: T) => void;
}

interface CabinClassSelectorState {
  collapsed: boolean;
}

export default class CabinClassSelector<T> extends React.Component<
  CabinClassSelectorProps<T>, CabinClassSelectorState
> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  constructor(props: CabinClassSelectorProps<T>) {
    super(props);

    this.state = {
      collapsed: true,
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.toggle = this.toggle.bind(this);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.onFocusOutside = this.onFocusOutside.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('focusin', this.onFocusOutside);
  }

  componentWillUnmount(): void {
    document.removeEventListener('focusin', this.onFocusOutside);
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

  private onFocusOutside(e: any): void {
    if (!this.selfRef.current || this.selfRef.current.contains(e.target)) {
      return;
    }

    this.collapse();
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
    const { collapsed } = this.state;

    if (collapsed) {
      this.toggle();
    }
  }

  private collapse(): void {
    const { collapsed } = this.state;

    if (!collapsed) {
      this.toggle();
    }
  }

  private toggle(): void {
    const { collapsed } = this.state;

    this.setState({ collapsed: !collapsed });
  }

  render(): JSX.Element {
    const {
      value,
    } = this.props;
    const { collapsed } = this.state;
    const { options } = this;
    const selected = options.find((option) => option.props.value === value);

    return (
      <div
        ref={this.selfRef}
        id="cabinclass-selector"
        className={css.Select}
        aria-expanded={!collapsed}
        aria-controls="cabinclass-selector-options"
        role="combobox"
        onClick={this.toggle}
        onBlur={this.collapse}
        onKeyDown={this.onKeyDown}
      >
        <div className={css.Wrapper}>
          <div className={css.Selected}>
            <span>
              Class
              <span className={css.ActiveText}><strong>{selected}</strong></span>

            </span>
          </div>
          {
            !collapsed && (
              <div className={css.Options} id="cabinclass-selector-options">
                {options.map((option) => (
                  <div
                    key={option.key ?? ''}
                    className={css.Option}
                    role="option"
                    aria-selected={option === selected}
                    onClick={(): void => this.select(option.props.value)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
