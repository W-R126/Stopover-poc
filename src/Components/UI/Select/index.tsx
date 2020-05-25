import React from 'react';

import './Select.css';

interface SelectProps<T> extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'tabIndex'
> {
  tabIndex: number;
  label?: string;
  value: T;
  defaultValue?: T;
  maxHeight: number;
  onChange?: (value: T) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
}

interface SelectState {
  hoveredIndex: number;
  expanded: boolean;
}

export default class Select<T> extends React.Component<SelectProps<T>, SelectState> {
  static defaultProps = {
    tabIndex: 0,
    maxHeight: 400,
  };

  private readonly optionsRef = React.createRef<HTMLDivElement>();

  constructor(props: SelectProps<T>) {
    super(props);

    this.state = {
      hoveredIndex: 0,
      expanded: false,
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  private onSelectIndex(index: number): void {
    const { onChange } = this.props;
    const { options } = this;

    this.setState({ hoveredIndex: index });

    if (onChange) {
      onChange(options[index].props.value);
    }
  }

  private onKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void {
    if (e.key === 'Tab') {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const { expanded, hoveredIndex } = this.state;
    const { options } = this;

    switch (e.key) {
      case 'Enter':
        if (expanded) {
          this.onSelectIndex(hoveredIndex);
        }

        this.toggleExpanded();

        break;
      case ' ':
        if (!expanded) {
          this.toggleExpanded();
        }

        break;
      case 'Escape':
        if (expanded) {
          this.toggleExpanded();
        }

        break;
      case 'ArrowUp':
        if (expanded) {
          if (hoveredIndex > 0) {
            this.onSelectIndex(hoveredIndex - 1);
          }
        } else {
          const { selectedIndex } = this;

          if (selectedIndex > 0) {
            this.onSelectIndex(selectedIndex - 1);
          }
        }

        break;
      case 'ArrowDown':
        if (expanded) {
          if (hoveredIndex < options.length - 1) {
            this.onSelectIndex(hoveredIndex + 1);
          }
        } else {
          const { selectedIndex } = this;

          if (selectedIndex < options.length - 1) {
            this.onSelectIndex(selectedIndex + 1);
          }
        }

        break;
      default:
        break;
    }
  }

  private get maxHeight(): number {
    const optionsRef = this.optionsRef.current;
    const baseHeight = 60;

    if (!optionsRef) {
      return baseHeight;
    }

    const { expanded } = this.state;
    const { maxHeight: propMaxHeight } = this.props;

    let maxHeight = 0;

    if (expanded) {
      Array.from(optionsRef.children).forEach((option) => {
        maxHeight += option.getBoundingClientRect().height;
      });

      if (maxHeight > propMaxHeight) {
        maxHeight = propMaxHeight;
      }
    }

    return baseHeight + maxHeight;
  }

  private get options(): JSX.Element[] {
    const { children } = this.props;

    return (React.Children.toArray(children) as JSX.Element[])
      .filter((option) => option.type === 'option');
  }

  private get selectedIndex(): number {
    const { value, defaultValue } = this.props;
    const { options } = this;

    return options.findIndex((option) => option.props.value === (value ?? defaultValue));
  }

  private toggleExpanded(): void {
    const { expanded } = this.state;

    const newState = { expanded: !expanded };

    if (!expanded) {
      Object.assign(newState, { hoveredIndex: this.selectedIndex });
    }

    this.setState(newState);
  }

  render(): JSX.Element {
    const { hoveredIndex, expanded } = this.state;
    const {
      tabIndex,
      id,
      label,
      maxHeight,
    } = this.props;
    const { options, selectedIndex } = this;

    return (
      <div
        id={id}
        tabIndex={tabIndex}
        role="combobox"
        aria-expanded={expanded}
        aria-controls={id ? `${id}-options` : undefined}
        className="select-ui-component"
        onKeyDown={this.onKeyDown}
        onBlur={expanded ? this.toggleExpanded : undefined}
        onClick={this.toggleExpanded}
      >
        <div className="select-wrapper" style={{ maxHeight: this.maxHeight }}>
          <div className="selected-option">
            <div className="selected-option-wrapper">
              <label htmlFor={id}>{label}</label>
              {options[selectedIndex].props.children}
            </div>
          </div>

          <div
            className="options"
            id={id ? `${id}-options` : undefined}
            ref={this.optionsRef}
            style={{ maxHeight }}
          >
            <div className="selected-option">
              <div className="selected-option-wrapper">
                <label htmlFor={id}>{label}</label>
                {options[selectedIndex].props.children}
              </div>
            </div>

            <div className="options-wrapper">

              {options.map((option, idx) => {
                const className = ['option'];

                if (hoveredIndex === idx) {
                  className.push('hover');
                }

                return (
                  <div
                    className={className.join(' ')}
                    role="button"
                    key={option.key ?? ''}
                    onClick={(): void => {
                      this.onSelectIndex(idx);
                      this.toggleExpanded();
                    }}
                    onMouseMove={(): void => {
                      if (hoveredIndex !== idx) {
                        this.setState({ hoveredIndex: idx });
                      }
                    }}
                  >
                    {option.props.children}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
