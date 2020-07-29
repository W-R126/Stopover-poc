import React from 'react';
import { TripTypeEnum } from '../../../../../../Enums/TripTypeEnum';
import checkedIcon from '../../../../../../Assets/Images/NDC/checked.svg';

import css from './TripTypePicker.module.css';

interface TripTypePickerProps {
  value: TripTypeEnum;
  onChange: (value: TripTypeEnum) => void;
  className?: string;
}

interface TripTypePickerState {
  collapsed: boolean;
}

export default class TripTypePicker extends React.Component<
  TripTypePickerProps, TripTypePickerState
> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  constructor(props: TripTypePickerProps) {
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

  private onChange(value: TripTypeEnum): void {
    const { onChange } = this.props;

    onChange(TripTypeEnum[value as keyof typeof TripTypeEnum]);

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
    const { value, className } = this.props;
    const { collapsed } = this.state;
    const classList = [css.TripTypePicker];

    if (className) {
      classList.push(className);
    }

    return (
      <div
        className={css.TripTypePicker}
        ref={this.selfRef}
        aria-expanded={!collapsed}
        role="button"
      >
        <div
          className={css.Header}
          onClick={this.toggle}
          role="button"
        >
          {value === TripTypeEnum.roundTrip && 'Return trip'}
          {value === TripTypeEnum.oneWay && 'One way trip'}
        </div>
        {!collapsed && (
          <ul className={css.Dropdown}>
            <li
              className={css.DropdownItem}
              onClick={(): void => this.onChange(TripTypeEnum.roundTrip)}
              role="button"
            >
              {value === TripTypeEnum.roundTrip && <img src={checkedIcon} alt="Checked Icon" />}
              Return trip
            </li>
            <li
              className={css.DropdownItem}
              onClick={(): void => this.onChange(TripTypeEnum.oneWay)}
              role="button"
            >

              {value === TripTypeEnum.oneWay && <img src={checkedIcon} alt="Checked Icon" />}
              One way trip
            </li>
          </ul>
        )}
      </div>
    );
  }
}
