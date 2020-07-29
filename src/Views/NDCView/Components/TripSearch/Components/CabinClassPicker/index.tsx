import React from 'react';
import { CabinClassEnum } from '../../../../Enums/CabinClassEnum';

import checkedIcon from '../../../../../../Assets/Images/NDC/checked.svg';

import css from './CabinClassPicker.module.css';

interface CabinClassPickerProps {
  value: keyof typeof CabinClassEnum;
  onChange: (value: CabinClassEnum) => void;
  className?: string;
  cabinClasses: { [key: string]: string };
}

interface CabinClassPickerState {
  collapsed: boolean;
}

export default class CabinClassPicker extends React.Component<
  CabinClassPickerProps, CabinClassPickerState
> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  constructor(props: CabinClassPickerProps) {
    super(props);
    this.state = {
      collapsed: true,
    };

    this.onClickOutside = this.onClickOutside.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('click', this.onClickOutside);
    document.addEventListener('focusin', this.onClickOutside);
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.onClickOutside);
    document.addEventListener('focusin', this.onClickOutside);
  }

  private onClickOutside(e: any): void {
    if (!this.selfRef.current || this.selfRef.current.contains(e.target)) {
      return;
    }

    this.collapse();
  }

  private onChange(cabinClass: CabinClassEnum): void {
    const { onChange } = this.props;

    onChange(cabinClass);

    setTimeout(() => {
      this.toggle();
    }, 100);
  }

  private toggle(): void {
    const { collapsed } = this.state;

    if (collapsed) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  private expand(): void {
    const { collapsed } = this.state;

    if (collapsed) {
      this.setState({ collapsed: false });
    }
  }

  private collapse(): void {
    const { collapsed } = this.state;

    if (!collapsed) {
      this.setState({ collapsed: true });
    }
  }

  render(): JSX.Element {
    const { value, className, cabinClasses } = this.props;
    const { collapsed } = this.state;
    const classList = [css.CabinClassPicker];

    if (className) {
      classList.push(className);
    }

    return (
      <div
        className={css.CabinClassPicker}
        ref={this.selfRef}
        aria-expanded={!collapsed}
        role="button"
      >
        <div
          className={css.Header}
          onClick={this.toggle}
          role="button"
        >
          {cabinClasses[value] ?? ''}
        </div>
        {!collapsed && (
          <ul className={css.Dropdown}>
            {Object.keys(CabinClassEnum).map((cc, idx) => (
              <li
                className={css.DropdownItem}
                value={CabinClassEnum[cc as keyof typeof CabinClassEnum]}
                key={`cabin-type-option-${idx}`}
                onClick={(): void => this.onChange(CabinClassEnum[cc as keyof typeof CabinClassEnum])}
                role="button"
              >
                {value === cc && <img src={checkedIcon} alt="Checked Icon" />}
                {cabinClasses[cc] ?? ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
