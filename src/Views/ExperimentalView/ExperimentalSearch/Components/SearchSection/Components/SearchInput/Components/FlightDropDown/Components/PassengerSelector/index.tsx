import React from 'react';

import css from './PassengerDropDown.module.css';
import adultsIcon from '../../../../../../../../../../../Assets/Images/passenger-type-adult.svg';
import childrenIcon from '../../../../../../../../../../../Assets/Images/passenger-type-child.svg';
import infantsIcon from '../../../../../../../../../../../Assets/Images/passenger-type-infant.svg';

import AmountPicker from '../../../../../../../../../../../Components/TripSearch/Components/PassengerPicker/Components/AmountPicker';

import { GuestsModel } from '../../../../../../../../../../../Models/GuestsModel';

interface PassengerSelectorProps {
  data: GuestsModel;
  onChange: (data: GuestsModel) => void;
}

interface PassengerSelectorState {
  collapsed: boolean;
}

export default class PassengerDropDown extends React.Component<
  PassengerSelectorProps, PassengerSelectorState
> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  private readonly maxPassengers = 9;

  constructor(props: PassengerSelectorProps) {
    super(props);
    this.state = {
      collapsed: true,
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocusOutside = this.onFocusOutside.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onAdultsChange = this.onAdultsChange.bind(this);
    this.onChildrenChange = this.onChildrenChange.bind(this);
    this.onInfantsChange = this.onInfantsChange.bind(this);
    this.expand = this.expand.bind(this);
  }

  componentDidMount(): void {
    // window.addEventListener('resize', this.onResize);
    document.addEventListener('focusin', this.onFocusOutside);
    document.addEventListener('mousedown', this.onFocusOutside);
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount(): void {
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
    if (!this.selfRef.current || this.selfRef.current.contains(e.target)) {
      return;
    }

    this.collapse();
  }

  private onAdultsChange(adults: number): void {
    const { data, onChange } = this.props;
    data.adults = adults;

    if (data.infants > adults) {
      // More infants than adults, reduce number of infants.
      data.infants = adults;
    }

    onChange(data);
  }

  private onChildrenChange(children: number): void {
    const { data, onChange } = this.props;
    data.children = children;

    onChange(data);
  }

  private onInfantsChange(infants: number): void {
    const { data, onChange } = this.props;
    data.infants = infants;

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
    const { collapsed } = this.state;
    const { data } = this.props;
    const titleClassList = [css.SelectedValue];
    if (collapsed) { titleClassList.push(css.Collapsed); }

    const { passengersDetailed, maxPassengers } = this;

    return (
      <div
        className={css.ComponentContainer}
        ref={this.selfRef}
        onFocus={this.expand}
      >
        <div
          className={titleClassList.join(' ')}
          onClick={(): void => {
            this.expand();
          }}
          role="button"
        >
          <span>{passengersDetailed}</span>
          <span className={css.ChevArrow} />
        </div>
        { !collapsed && (
        <div
          className={css.Pickers}
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
        </div>
        )}

      </div>
    );
  }
}
