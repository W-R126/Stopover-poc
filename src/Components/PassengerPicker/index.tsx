import React from 'react';

import './PassengerPicker.css';
import arrowDown from '../../Assets/Images/arrow-down.svg';
import AmountPicker from './AmountPicker';

export interface PassengerPickerData {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerPickerProps {
  data: PassengerPickerData;
  maximumPassengers: number;
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
  static readonly defaultProps: Pick<PassengerPickerProps, 'tabIndex' | 'maximumPassengers'> = {
    maximumPassengers: 9,
    tabIndex: 0,
  };

  private readonly selfRef = React.createRef<HTMLDivElement>();

  constructor(props: PassengerPickerProps) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.onClickOutside = this.onClickOutside.bind(this);
    this.onTabOutside = this.onTabOutside.bind(this);
    this.onAdultsChange = this.onAdultsChange.bind(this);
    this.onChildrenChange = this.onChildrenChange.bind(this);
    this.onInfantsChange = this.onInfantsChange.bind(this);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('click', this.onClickOutside);
    document.addEventListener('keyup', this.onTabOutside);
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.onClickOutside);
    document.removeEventListener('keyup', this.onTabOutside);
  }

  private onTabOutside(e: any): void {
    const { expanded } = this.state;

    if (!expanded
      || e.key !== 'Tab'
      || !this.selfRef.current
      || this.selfRef.current.contains(e.target)
    ) {
      return;
    }

    this.collapse();
  }

  private onClickOutside(e: any): void {
    if (!this.selfRef.current || this.selfRef.current.contains(e.target)) {
      return;
    }

    const { expanded } = this.state;

    if (expanded) {
      this.collapse();
    }
  }

  private onAdultsChange(adults: number): void {
    const { data, onChange } = this.props;

    const newData = { adults };

    if (data.infants > adults) {
      Object.assign(newData, { infants: adults });
    }

    Object.assign(data, newData);

    onChange(data);
  }

  private onChildrenChange(children: number): void {
    const { data, onChange } = this.props;

    Object.assign(data, { children });

    onChange(data);
  }

  private onInfantsChange(infants: number): void {
    const { data, onChange } = this.props;

    Object.assign(data, { infants });

    onChange(data);
  }

  private expand(): void {
    this.setState({ expanded: true });
  }

  private collapse(): void {
    this.setState({ expanded: false });
  }

  render(): JSX.Element {
    const { data, tabIndex, maximumPassengers } = this.props;
    const { expanded } = this.state;

    const totalPassengers = data.adults + data.children + data.infants;

    return (
      <div
        ref={this.selfRef}
        className="passenger-picker"
        tabIndex={tabIndex}
        aria-expanded={expanded}
      >
        <div
          className="header input-label"
          role="button"
          onClick={this.expand}
        >
          {`${totalPassengers} Passenger${totalPassengers > 1 ? 's' : ''}`}
          <img src={arrowDown} alt="Expand" />
        </div>

        <div className="pickers">
          <AmountPicker
            title="Adults"
            description="Ages 12+"
            value={data.adults}
            min={1}
            max={maximumPassengers - data.children}
            onChange={this.onAdultsChange}
          />

          <AmountPicker
            title="Children"
            description="Ages 2-11"
            value={data.children}
            min={0}
            max={maximumPassengers - data.adults}
            onChange={this.onChildrenChange}
          />

          <AmountPicker
            title="Infants"
            description="Under 2"
            value={data.infants}
            min={0}
            max={data.adults}
            onChange={this.onInfantsChange}
          />

          <div className="actions">
            <button
              type="button"
              onClick={(): void => {
                this.collapse();

                if (this.selfRef.current) {
                  this.selfRef.current.focus();
                }
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }
}
