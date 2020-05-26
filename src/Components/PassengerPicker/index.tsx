import React from 'react';

import './PassengerPicker.css';
import passengerTypeAdult from '../../Assets/Images/UI/passenger-type-adult.svg';
import passengerTypeChild from '../../Assets/Images/UI/passenger-type-child.svg';
import passengerTypeInfant from '../../Assets/Images/UI/passenger-type-infant.svg';
import ContentService from '../../Services/ContentService';
import { SingularPlural } from '../../Models/SingularPlural';
import AmountPicker from '../UI/AmountPicker';

interface PassengerType extends SingularPlural {
  description?: string;
}

export interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerPickerProps {
  contentService: ContentService;
  tabIndex?: number;
  id?: string;
  value: Passengers;
  onChange?: (value: Passengers) => void;
}

interface PassengerPickerState {
  content: {
    guest?: SingularPlural;
    passenger?: SingularPlural;
    passengerTypes?: {
      adult?: PassengerType;
      child?: PassengerType;
      infant?: PassengerType;
    };
  };
  expanded: boolean;
  detailedPassengerCount: boolean;
}

export default class PassengerPicker extends React.Component<
  PassengerPickerProps,
  PassengerPickerState
> {
  static defaultProps: Pick<PassengerPickerProps, 'tabIndex' | 'value'> = {
    tabIndex: 0,
    value: {
      adults: 1,
      children: 0,
      infants: 0,
    },
  }

  private readonly pickerWrapperRef = React.createRef<HTMLDivElement>();

  private readonly detaildPassengersRef = React.createRef<HTMLDivElement>();

  private readonly selfRef = React.createRef<HTMLDivElement>();

  constructor(props: PassengerPickerProps) {
    super(props);

    this.state = {
      content: {},
      expanded: false,
      detailedPassengerCount: true,
    };

    this.onAdultsChange = this.onAdultsChange.bind(this);
    this.onChildrenChange = this.onChildrenChange.bind(this);
    this.onInfantsChange = this.onInfantsChange.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onTabOutside = this.onTabOutside.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { contentService } = this.props;

    document.addEventListener('click', this.onClickOutside);
    document.addEventListener('keyup', this.onTabOutside);

    this.setState({
      content: await contentService.get('common'),
    });
  }

  componentDidUpdate(): void {
    if (!this.detaildPassengersRef.current) {
      return;
    }

    const { detailedPassengerCount } = this.state;

    if (
      this.detaildPassengersRef.current.getBoundingClientRect().height > 20
    ) {
      if (detailedPassengerCount) {
        this.setState({ detailedPassengerCount: false });
      }
    } else if (!detailedPassengerCount) {
      this.setState({ detailedPassengerCount: true });
    }
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.onClickOutside);
    document.removeEventListener('keyup', this.onTabOutside);
  }

  private onClickOutside(e: any): void {
    if (!this.selfRef.current || this.selfRef.current.contains(e.target)) {
      return;
    }

    const { expanded } = this.state;

    if (expanded) {
      this.toggleExpanded();
    }
  }

  private onTabOutside(e: any): void {
    if (!this.selfRef.current || this.selfRef.current.contains(document.activeElement)) {
      return;
    }

    if (e.key === 'Tab') {
      const { expanded } = this.state;

      if (expanded) {
        this.toggleExpanded();
      }
    }
  }

  private onKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void {
    const { expanded } = this.state;

    if ([' ', 'Escape'].indexOf(e.key) !== -1) {
      e.preventDefault();
      e.stopPropagation();
    }

    switch (e.key) {
      case ' ':
      case 'Enter':
        if (!expanded) {
          this.toggleExpanded();
        }

        break;
      case 'Escape':
        if (expanded) {
          this.toggleExpanded();

          if (this.selfRef.current) {
            this.selfRef.current.focus();
          }
        }

        break;
      default:
        break;
    }
  }

  private onAdultsChange(adults: number): void {
    const { value } = this.props;

    this.onChange({ adults, children: value.children, infants: value.infants });
  }

  private onChildrenChange(children: number): void {
    const { value } = this.props;

    this.onChange({ adults: value.adults, children, infants: value.infants });
  }

  private onInfantsChange(infants: number): void {
    const { value } = this.props;

    this.onChange({ adults: value.adults, children: value.children, infants });
  }

  private onChange(value: Passengers): void {
    const { onChange } = this.props;

    if (value.infants > value.adults) {
      Object.assign(value, { infants: value.adults });
    }

    if (onChange) {
      onChange(value);
    }
  }

  private get maxHeight(): number {
    const { expanded } = this.state;

    if (expanded && this.pickerWrapperRef.current) {
      let maxHeight = 0;

      Array.from(this.pickerWrapperRef.current.children).forEach((element) => {
        maxHeight += element.getBoundingClientRect().height;
      });

      return maxHeight;
    }

    return 60;
  }

  private get detailedPassengers(): string {
    const { content: { passengerTypes } } = this.state;
    const { value } = this.props;

    let result = `${
      value.adults
    } ${
      value.adults > 1 ? passengerTypes?.adult?.plural : passengerTypes?.adult?.singular
    }`;

    if (value.children > 0) {
      if (value.infants > 0) {
        result += ', ';
      } else {
        result += ' and ';
      }

      result += `${
        value.children
      } ${
        value.children > 1 ? passengerTypes?.child?.plural : passengerTypes?.child?.singular
      }`;
    }

    if (value.infants > 0) {
      result += ` and ${
        value.infants
      } ${
        value.infants > 1 ? passengerTypes?.infant?.plural : passengerTypes?.infant?.singular
      }`;
    }

    return result;
  }

  private toggleExpanded(): void {
    const { expanded } = this.state;

    this.setState({ expanded: !expanded });
  }

  render(): JSX.Element {
    const { content, expanded, detailedPassengerCount } = this.state;
    const {
      tabIndex,
      id,
      value,
    } = this.props;

    const { maxHeight } = this;
    const passengerCount = value.adults + value.children + value.infants;

    return (
      <div
        className="passenger-picker-component"
        ref={this.selfRef}
        role="button"
        aria-expanded={expanded}
        id={id}
        tabIndex={tabIndex}
        onKeyDown={this.onKeyDown}
        onClick={this.toggleExpanded}
      >
        <div
          className="picker-wrapper"
          ref={this.pickerWrapperRef}
          style={{ maxHeight }}
        >
          <div className="header">
            <div className="header-wrapper">
              <label>{content.guest?.plural}</label>
              <div className="passenger-count">
                {!detailedPassengerCount && (
                  <div>
                    {`${
                      passengerCount
                    } ${
                      passengerCount > 1 ? content.passenger?.plural : content.passenger?.singular
                    }`}
                  </div>
                )}

                <div
                  ref={this.detaildPassengersRef}
                  style={{
                    visibility: !detailedPassengerCount ? 'hidden' : undefined,
                  }}
                >
                  {this.detailedPassengers}
                </div>
              </div>
            </div>
          </div>

          <div className="pickers">
            <div
              className="pickers-wrapper"
              role="button"
              onClick={(e): void => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <div
                className="modal-header"
                role="button"
                onClick={this.toggleExpanded}
              >
                <div className="header-wrapper">
                  <label>{content.guest?.plural}</label>
                  <div className="passenger-count">
                    {!detailedPassengerCount && (
                      <div>
                        {`${
                          passengerCount
                        } ${
                          passengerCount > 1
                            ? content.passenger?.plural
                            : content.passenger?.singular
                        }`}
                      </div>
                    )}

                    <div
                      style={{
                        visibility: !detailedPassengerCount ? 'hidden' : undefined,
                      }}
                    >
                      {this.detailedPassengers}
                    </div>
                  </div>
                </div>
              </div>
              <AmountPicker
                min={1}
                max={9 - value.children}
                value={value.adults}
                onChange={this.onAdultsChange}
                disabled={!expanded}
                label={(
                  <div className="passenger-type-picker">
                    <img src={passengerTypeAdult} alt={content.passengerTypes?.adult?.plural} />
                    <span>
                      <label>{content.passengerTypes?.adult?.plural}</label>
                      <span>{content.passengerTypes?.adult?.description}</span>
                    </span>
                  </div>
                )}
              />
              <AmountPicker
                min={0}
                max={9 - value.adults}
                value={value.children}
                onChange={this.onChildrenChange}
                disabled={!expanded}
                label={(
                  <div className="passenger-type-picker">
                    <img src={passengerTypeChild} alt={content.passengerTypes?.child?.plural} />
                    <span>
                      <label>{content.passengerTypes?.child?.plural}</label>
                      <span>{content.passengerTypes?.child?.description}</span>
                    </span>
                  </div>
                )}
              />
              <AmountPicker
                min={0}
                max={value.adults}
                value={value.infants}
                onChange={this.onInfantsChange}
                disabled={!expanded}
                label={(
                  <div className="passenger-type-picker">
                    <img src={passengerTypeInfant} alt={content.passengerTypes?.infant?.plural} />
                    <span>
                      <label>{content.passengerTypes?.infant?.plural}</label>
                      <span>{content.passengerTypes?.infant?.description}</span>
                    </span>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
