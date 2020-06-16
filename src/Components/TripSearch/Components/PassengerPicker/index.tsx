import React from 'react';

import css from './PassengerPicker.module.css';
import adultsIcon from '../../../../Assets/Images/passenger-type-adult.svg';
import childrenIcon from '../../../../Assets/Images/passenger-type-child.svg';
import infantsIcon from '../../../../Assets/Images/passenger-type-infant.svg';
import AmountPicker from './Components/AmountPicker';
import { PassengerPickerData } from './PassengerPickerData';

interface PassengerPickerProps {
  id?: string;
  className?: string;
  wrapperClassName?: string;
  style?: React.CSSProperties;
  data: PassengerPickerData;
  tabIndex: number;
  onChange: (data: PassengerPickerData) => void;
}

interface PassengerPickerState {
  expanded: boolean;
}

export default class PassengerPicker extends React.Component<
  PassengerPickerProps,
  PassengerPickerState
> {
  static readonly defaultProps: Pick<PassengerPickerProps, 'tabIndex'> = {
    tabIndex: 0,
  };

  private readonly maxPassengers = 9;

  private readonly selfRef = React.createRef<HTMLDivElement>();

  private readonly passengersDetailedRef = React.createRef<HTMLSpanElement>();

  private readonly passengersRef = React.createRef<HTMLSpanElement>();

  constructor(props: PassengerPickerProps) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocusOutside = this.onFocusOutside.bind(this);
    this.onResize = this.onResize.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onAdultsChange = this.onAdultsChange.bind(this);
    this.onChildrenChange = this.onChildrenChange.bind(this);
    this.onInfantsChange = this.onInfantsChange.bind(this);
  }

  componentDidMount(): void {
    window.addEventListener('resize', this.onResize);
    document.addEventListener('focusin', this.onFocusOutside);
    document.addEventListener('mousedown', this.onFocusOutside);
    document.addEventListener('keydown', this.onKeyDown);

    this.onResize();
  }

  componentDidUpdate(): void {
    this.onResize();
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('focusin', this.onFocusOutside);
    document.removeEventListener('mousedown', this.onFocusOutside);
    document.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown(e: any): void {
    if (!(this.selfRef.current && this.selfRef.current.contains(e.target))) {
      return;
    }

    switch (e.key) {
      case 'Enter':
        if (this.selfRef.current === e.target) {
          this.toggle();
        }

        break;
      case ' ':
        this.expand();
        break;
      case 'Escape':
        this.collapse();
        this.selfRef.current.focus();

        break;
      default:
        break;
    }
  }

  private onFocusOutside(e: any): void {
    const { expanded } = this.state;

    if (!expanded || !this.selfRef.current || this.selfRef.current.contains(e.target)) {
      return;
    }

    this.collapse();
  }

  private onResize(): void {
    const passengersDetailedRef = this.passengersDetailedRef.current;
    const passengersRef = this.passengersRef.current;

    if (!(passengersDetailedRef && passengersRef)) {
      return;
    }

    if (passengersDetailedRef.getBoundingClientRect().height > 20) {
      passengersDetailedRef.style.visibility = 'hidden';
      passengersRef.style.display = 'inline';
    } else {
      passengersDetailedRef.style.visibility = '';
      passengersRef.style.display = 'none';
    }
  }

  private onAdultsChange(adults: number): void {
    const { data, onChange } = this.props;
    const newData = { adults };

    if (data.infants > adults) {
      // More infants than adults, reduce number of infants.
      Object.assign(newData, { infants: adults });
    }

    Object.assign(data, newData);

    onChange(data);
  }

  private onChildrenChange(children: number): void {
    this.onChange('children', children);
  }

  private onInfantsChange(infants: number): void {
    this.onChange('infants', infants);
  }

  private onChange(key: string, value: number): void {
    const { data, onChange } = this.props;

    Object.assign(data, { [key]: value });

    onChange(data);
  }

  private get passengersDetailed(): string {
    const { data: { adults, children, infants } } = this.props;
    const passengers: string[] = [];

    passengers.push(`${adults} ${adults > 1 ? 'Adults' : 'Adult'}`);

    if (children > 0) {
      passengers.push(`${children} ${children > 1 ? 'Children' : 'Child'}`);
    }

    if (infants > 0) {
      passengers.push(`${infants} ${infants > 1 ? 'Infants' : 'Infant'}`);
    }

    let result = passengers[0];

    if (passengers.length === 2) {
      result += ` and ${passengers[1]}`;
    } else if (passengers.length === 3) {
      result += `, ${passengers[1]} and ${passengers[2]}`;
    }

    return result;
  }

  private get passengers(): string {
    const { data: { adults, children, infants } } = this.props;

    const total = adults + children + infants;

    return `${total} ${total > 1 ? 'Passengers' : 'Passenger'}`;
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
      wrapperClassName,
      style,
      tabIndex,
      data,
    } = this.props;

    const { expanded } = this.state;
    const { passengersDetailed, passengers, maxPassengers } = this;

    const classList = [css.PassengerPicker];

    if (className) {
      classList.push(className);
    }

    const wrapperClassList = [css.Wrapper];

    if (wrapperClassName) {
      wrapperClassList.push(wrapperClassName);
    }

    return (
      <div
        ref={this.selfRef}
        id={id}
        className={classList.join(' ')}
        style={style}
        tabIndex={tabIndex}
        aria-expanded={expanded}
      >
        <div
          className={wrapperClassList.join(' ')}
          role="button"
          onClick={this.toggle}
        >
          <div className={css.Header}>
            <span className={css.PassengersDetailed} ref={this.passengersDetailedRef}>
              {passengersDetailed}
            </span>
            <span className={css.Passengers} ref={this.passengersRef}>
              {passengers}
            </span>
          </div>

          <div className={css.ModalWrapper}>
            <div
              className={css.Pickers}
              role="button"
              onClick={(e): void => {
                // Don't collapse.
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <AmountPicker
                className={css.AmountPicker}
                icon={adultsIcon}
                title="Adults"
                description="Age 12+"
                max={maxPassengers - data.children}
                min={1}
                onChange={this.onAdultsChange}
                value={data.adults}
              />
              <AmountPicker
                className={css.AmountPicker}
                icon={childrenIcon}
                title="Children"
                description="Age 2-11"
                max={maxPassengers - data.adults}
                min={0}
                onChange={this.onChildrenChange}
                value={data.children}
              />
              <AmountPicker
                className={css.AmountPicker}
                icon={infantsIcon}
                title="Infants"
                description="Under 2"
                max={data.adults}
                min={0}
                onChange={this.onInfantsChange}
                value={data.infants}
              />
              <button
                type="button"
                className="btn-done btn-primary"
                onClick={this.toggle}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
