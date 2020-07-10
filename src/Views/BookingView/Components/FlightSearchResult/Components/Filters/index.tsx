import React from 'react';
import closeIcon from '../../../../../../Assets/Images/close-btn.svg';
import css from './Filters.module.css';
import RangeSlider from '../../../../../../Components/UI/RangeSlider';
import Radio from '../../../../../../Components/UI/Radio';
import Select from '../../../../../../Components/UI/Select';
import Option from '../../../../../../Components/UI/Select/Option';
import { GroupedOfferModel, OfferModel } from '../../../../../../Models/OfferModel';
import Utils from '../../../../../../Utils';

export interface PriceOptionItem {
  value: any;
  label: string;
}

interface FiltersProps {
  headerClassName?: string;
  className?: string;
  offers?: GroupedOfferModel[];
  onChange: (filters?: (groupedOffer: GroupedOfferModel) => boolean) => void;
  priceOptions: PriceOptionItem[];
}

interface FiltersState {
  collapsed: boolean;
  duration: number;
  departureTime: number;
  stops: number;
  price: number;
  priceType: string;
  durationSpan: {
    min: number;
    max: number;
  };
  departureTimeSpan: {
    min: number;
    max: number;
  };
  priceSpan: {
    min: number;
    max: number;
  };
  filtersActive: boolean;
}

export default class Filters extends React.Component<FiltersProps, FiltersState> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  private readonly durationStep = 900000;

  private readonly departureStep = 900000;

  constructor(props: FiltersProps) {
    super(props);

    this.state = {
      collapsed: true,
      duration: 0,
      departureTime: 0,
      stops: -1,
      price: 0,
      priceType: '',
      durationSpan: {
        min: 0,
        max: 0,
      },
      departureTimeSpan: {
        min: 0,
        max: 0,
      },
      priceSpan: {
        min: 0,
        max: 0,
      },
      filtersActive: false,
    };

    this.onClickOutside = this.onClickOutside.bind(this);
    this.toggle = this.toggle.bind(this);

    this.clearFilters = this.clearFilters.bind(this);
    this.handleChangePriceOption = this.handleChangePriceOption.bind(this);
  }

  componentDidMount(): void {
    this.setFilterSpans();
    document.addEventListener('click', this.onClickOutside);
    document.addEventListener('focusin', this.onClickOutside);
  }

  componentDidUpdate(prevProps: FiltersProps): void {
    const { offers } = this.props;

    if (prevProps.offers !== offers) {
      this.setFilterSpans();
    }
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

  private async onFiltersChange(filter: any): Promise<void> {
    Object.assign(filter, { filtersActive: true });
    await new Promise((resolve) => this.setState(filter, resolve));

    const { onChange } = this.props;
    const {
      duration,
      durationSpan,
      departureTime,
      departureTimeSpan,
      stops,
      price,
      priceSpan,
    } = this.state;

    onChange((groupedOffer: GroupedOfferModel): boolean => {
      if (stops !== -1 && groupedOffer.stops.length > stops) {
        return false;
      }

      let priceOk = false;
      ['Economy', 'Business'].forEach((cc) => {
        if (!(groupedOffer.cabinClasses as any)[cc]) {
          return;
        }

        (groupedOffer.cabinClasses as any)[cc].offers.forEach((ccOffer: OfferModel) => {
          if (price >= priceSpan.max || ccOffer.total.amount <= price) {
            priceOk = true;
          }
        });
      });

      if (!priceOk) {
        return false;
      }

      const departureTemp = groupedOffer.departure.valueOf();
      const durationDelta = groupedOffer.arrival.valueOf() - departureTemp;

      if (duration < durationSpan.max
        && duration < durationDelta) {
        return false;
      }
      if (departureTime < departureTimeSpan.max
        && departureTime < groupedOffer.departure.valueOf()) {
        return false;
      }
      return true;
    });
  }

  setFilterSpans(): void {
    const { offers, priceOptions } = this.props;

    if (!offers) {
      return;
    }

    const durationSpan = {
      min: -1,
      max: -1,
    };

    const departureTimeSpan = {
      min: -1,
      max: -1,
    };

    const priceSpan = {
      min: -1,
      max: -1,
    };

    const priceType = priceOptions.length > 0 ? priceOptions[0].value : '';

    offers.forEach((offer) => {
      [priceType].forEach((cabinClass) => {
        if (!(offer.cabinClasses as any)[cabinClass]) {
          return;
        }

        (offer.cabinClasses as any)[cabinClass].offers.forEach((ccOffer: OfferModel) => {
          // Get price span.
          const { amount } = ccOffer.total;

          if (priceSpan.min === -1) {
            priceSpan.min = amount;
          }

          if (priceSpan.max === -1) {
            priceSpan.max = amount;
          }

          if (priceSpan.min > amount) {
            priceSpan.min = amount;
          }

          if (priceSpan.max < amount) {
            priceSpan.max = amount;
          }
        });
      });

      // Get departure time span.
      const departure = offer.departure.valueOf();

      if (departureTimeSpan.min === -1) {
        departureTimeSpan.min = departure;
      }

      if (departureTimeSpan.max === -1) {
        departureTimeSpan.max = departure;
      }

      if (departureTimeSpan.min > departure) {
        departureTimeSpan.min = departure;
      }

      if (departureTimeSpan.max < departure) {
        departureTimeSpan.max = departure;
      }

      // Get duration span.
      const durationDelta = offer.arrival.valueOf() - departure;

      if (durationSpan.min === -1) {
        durationSpan.min = durationDelta;
      }

      if (durationSpan.max === -1) {
        durationSpan.max = durationDelta;
      }

      if (durationSpan.min > durationDelta) {
        durationSpan.min = durationDelta;
      }

      if (durationSpan.max < durationDelta) {
        durationSpan.max = durationDelta;
      }
    });

    this.setState({
      priceSpan,
      departureTimeSpan,
      durationSpan,
      price: priceSpan.max + 1,
      priceType,
      departureTime: departureTimeSpan.max + this.departureStep,
      duration: durationSpan.max + this.durationStep,
      stops: -1,
    });
  }

  private getStopsLabel(): JSX.Element {
    const { stops } = this.state;
    switch (stops) {
      case -1:
        return <span>Any number of stops</span>;
      case 0:
        return <span className={css.ColorLabel}>Direct flights only</span>;
      case 1:
        return <span className={css.ColorLabel}>One stop or fewer</span>;
      case 2:
        return <span className={css.ColorLabel}>Two stops or fewer</span>;
      default:
        return <span>Any number of stops</span>;
    }
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

  private clearFilters(e: React.MouseEvent<HTMLSpanElement>): void {
    e.preventDefault();
    e.stopPropagation();

    this.setFilterSpans();
    this.setState({ filtersActive: false });

    const { onChange } = this.props;

    onChange(undefined);
  }

  private departureRangeFormat(date: Date): string {
    const { offers } = this.props;
    if (!offers) { return Utils.getFullDateString(date); }
    return Utils.getFullDateString(date, offers[0].origin.timeZone);
  }

  private handleChangePriceOption(value: string): void {
    const { price } = this.state;
    const { offers } = this.props;

    if (!offers) {
      return;
    }

    const priceSpan = {
      min: -1,
      max: -1,
    };

    offers.forEach((offer) => {
      [value].forEach((cabinClass) => {
        if (!(offer.cabinClasses as any)[cabinClass]) {
          return;
        }

        (offer.cabinClasses as any)[cabinClass].offers.forEach((ccOffer: OfferModel) => {
          // Get price span.
          const { amount } = ccOffer.total;

          if (priceSpan.min === -1) {
            priceSpan.min = amount;
          }

          if (priceSpan.max === -1) {
            priceSpan.max = amount;
          }

          if (priceSpan.min > amount) {
            priceSpan.min = amount;
          }

          if (priceSpan.max < amount) {
            priceSpan.max = amount;
          }
        });
      });
    });
    let priceTemp = price;
    if (price <= priceSpan.min || price >= priceSpan.max) { priceTemp = priceSpan.max + 1; }

    this.setState({
      priceType: value,
      priceSpan,
      price: priceTemp,
    });

    this.onFiltersChange({ price: priceTemp });
  }

  render(): JSX.Element {
    const { headerClassName, offers, priceOptions } = this.props;

    const headerClassList = [css.Header];

    if (headerClassName) {
      headerClassList.push(headerClassName);
    }

    let currency = '';

    if (offers) {
      currency = (offers[0].cabinClasses as any)[
        Object.keys(offers[0].cabinClasses)[0]
      ].startingFrom.currency;
    }

    const {
      collapsed,
      duration,
      price,
      priceType,
      stops,
      departureTime,
      departureTimeSpan,
      priceSpan,
      durationSpan,
      filtersActive,
    } = this.state;

    return (
      <div
        className={css.Container}
        ref={this.selfRef}
        aria-expanded={!collapsed}
        role="button"
      >
        <div
          className={css.Header}
          onClick={this.toggle}
          role="button"
        >
          Filter
          <span className={css.AngleDown} />
        </div>
        {!collapsed && (
        <div className={css.Dropdown}>
          <div className={css.ContentHeader}>
            <p className={css.Title}>Filters</p>
            {filtersActive
            && (
            <div className={css.CloseBtn} role="button" onClick={this.toggle}>
              <img src={closeIcon} alt="Close Icon" />
            </div>
            )}
          </div>

          <div className={css.RangeDiv}>
            <label className={css.FilterLabel}>
              Flight Duaration&nbsp;&nbsp;&nbsp;&nbsp;᛫
              {duration > durationSpan.max
                ? (<span>Any</span>)
                : (
                  <span className={css.ColorLabel}>
                    {`Under ${Utils.getTimeDeltaFromMs(duration)}`}
                  </span>
                )}
            </label>
            <RangeSlider
              min={durationSpan.min}
              max={durationSpan.max === -1
                ? durationSpan.max
                : durationSpan.max + this.durationStep}
              value={duration}
              step={this.durationStep}
              valueFormatter={(value): string => Utils.getTimeDeltaFromMs(value)}
              onChange={(nextDuration): void => {
                this.setState({
                  duration: nextDuration,
                });
              }}
              onMouseUp={(e: any): void => {
                this.onFiltersChange({ duration: parseInt(e.target.value, 10) });
              }}
              style={{ width: '100%' }}
              displayValue={false}
            />
          </div>
          <div className={css.RangeDiv}>
            <label className={css.FilterLabel}>
              Departure time&nbsp;&nbsp;&nbsp;&nbsp;᛫
              {departureTime > departureTimeSpan.max
                ? (<span>At any time</span>)
                : (
                  <span className={css.ColorLabel}>
                    {this.departureRangeFormat(new Date(departureTime))}
                  </span>
                )}
            </label>
            <RangeSlider
              min={departureTimeSpan.min}
              max={departureTimeSpan.max === -1
                ? departureTimeSpan.max
                : departureTimeSpan.max + this.departureStep}
              value={departureTime}
              step={this.departureStep}
              valueFormatter={(value): string => this.departureRangeFormat(new Date(value))}
              onChange={(nextDepartureTime): void => {
                this.setState({ departureTime: nextDepartureTime });
              }}
              onMouseUp={(e: any): void => {
                this.onFiltersChange({ departureTime: parseInt(e.target.value, 10) });
              }}
              style={{ width: '100%' }}
              displayValue={false}
            />
          </div>

          <div className={css.StopsDiv}>
            <label className={css.FilterLabel}>
              Stops&nbsp;&nbsp;&nbsp;&nbsp;᛫
              {this.getStopsLabel()}
            </label>
            <ul>
              <li>
                <Radio
                  id="any-number-stops"
                  name="any-number-stops"
                  checked={stops === -1}
                  value={-1}
                  onChange={(): void => {
                    this.onFiltersChange({ stops: -1 });
                  }}
                >
                  Any number of stops
                </Radio>
              </li>

              <li>
                <Radio
                  id="No-stops-only"
                  name="No-stops-only"
                  checked={stops === 0}
                  value={0}
                  onChange={(): void => {
                    this.onFiltersChange({ stops: 0 });
                  }}
                >
                  No stops only
                </Radio>
              </li>

              <li>
                <Radio
                  id="One-stop-or-fewer"
                  name="One-stop-or-fewer"
                  checked={stops === 1}
                  value={1}
                  onChange={(): void => {
                    this.onFiltersChange({ stops: 1 });
                  }}
                >
                  One stop or fewer
                </Radio>
              </li>

              <li>
                <Radio
                  id="Two-stops-or-fewer"
                  name="Two-stops-or-fewer"
                  checked={stops === 2}
                  value={2}
                  onChange={(): void => {
                    this.onFiltersChange({ stops: 2 });
                  }}
                >
                  Two stops or fewer
                </Radio>
              </li>
            </ul>
          </div>

          <div className={css.RangeDiv}>
            <label className={`${css.FilterLabel} ${css.PriceLabel}`}>
              Price&nbsp;&nbsp;&nbsp;&nbsp;᛫
              {price > priceSpan.max
                ? <span>Any price</span>
                : <span className={css.ColorLabel}>{`AED ${Utils.formatCurrency(price)}`}</span>}
              <Select
                className={css.PriceSelect}
                wrapperClassName={css.PriceSelectWrapper}
                id="flight-filter-price"
                value={priceType}
                onChange={this.handleChangePriceOption}
              >
                {priceOptions.map(
                  (item, idx) => (
                    <Option
                      value={item.value}
                      key={`price-cabin-type-${idx}`}
                    >
                      {item.label}
                    </Option>
                  ),
                )}
              </Select>
            </label>
            <RangeSlider
              min={priceSpan.min}
              max={priceSpan.max === -1 ? priceSpan.max : priceSpan.max + 1}
              value={price}
              step={1}
              valueFormatter={(value): string => `${currency} ${Utils.formatCurrency(value)}`}
              onChange={(nextPrice): void => {
                this.setState({ price: nextPrice });
              }}
              onMouseUp={(e: any): void => {
                this.onFiltersChange({ price: parseInt(e.target.value, 10) });
              }}
              style={{ width: '100%' }}
              displayValue={false}
            />
          </div>
        </div>
        )}

      </div>
    );
  }
}
