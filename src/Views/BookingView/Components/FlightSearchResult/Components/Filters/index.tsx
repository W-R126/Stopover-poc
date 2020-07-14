import React from 'react';
import closeIcon from '../../../../../../Assets/Images/close-btn.svg';
import css from './Filters.module.css';
import RangeSlider from '../../../../../../Components/UI/RangeSlider';
import Radio from '../../../../../../Components/UI/Radio';
import Utils from '../../../../../../Utils';
import DateUtils from '../../../../../../DateUtils';
import { FlightOfferModel } from '../../../../../../Models/FlightOfferModel';

interface FiltersProps {
  headerClassName?: string;
  className?: string;
  offers?: FlightOfferModel[];
  onChange: (filter?: (offer: FlightOfferModel) => boolean) => void;
}

interface FiltersState {
  collapsed: boolean;
  duration: number;
  departureTime: number;
  stops: number;
  price: number;
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

  constructor(props: FiltersProps) {
    super(props);

    this.state = {
      collapsed: true,
      duration: 0,
      departureTime: 0,
      stops: -1,
      price: 0,
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
      departureTime,
      departureTimeSpan,
      stops,
      price,
      priceSpan,
    } = this.state;

    onChange((offer: FlightOfferModel): boolean => {
      if (stops !== -1 && offer.stops.length > stops) {
        return false;
      }

      let priceOk = false;

      offer.fares.forEach((fare) => {
        if (fare.price.total >= priceSpan.max || fare.price.total <= price) {
          priceOk = true;
        }
      });

      if (!priceOk) {
        return false;
      }

      if (offer.duration > duration) {
        return false;
      }

      if (departureTime < departureTimeSpan.max && departureTime < offer.departure.valueOf()) {
        return false;
      }

      return true;
    });
  }

  setFilterSpans(): void {
    const { offers } = this.props;

    if (!offers) {
      return;
    }

    const durations = offers.map((offer) => offer.duration);
    const durationSpan = {
      min: Math.min(...durations),
      max: Math.max(...durations),
    };

    const departureTimes = offers.map((offer) => offer.departure.valueOf());
    const departureTimeSpan = {
      min: Math.min(...departureTimes),
      max: Math.max(...departureTimes),
    };

    let prices: number[] = [];
    offers.forEach((offer) => {
      prices = prices.concat(offer.fares.map((fare) => fare.price.total));
    });

    const priceSpan = {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };

    this.setState({
      priceSpan,
      departureTimeSpan,
      durationSpan,
      price: priceSpan.max,
      departureTime: departureTimeSpan.max,
      duration: durationSpan.max,
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
    if (!offers) { return DateUtils.getFullDateString(date); }
    return DateUtils.getFullDateString(date);
  }

  render(): JSX.Element {
    const { headerClassName, offers } = this.props;

    const headerClassList = [css.Header];

    if (headerClassName) {
      headerClassList.push(headerClassName);
    }

    const {
      collapsed,
      duration,
      price,
      stops,
      departureTime,
      departureTimeSpan,
      priceSpan,
      durationSpan,
      filtersActive,
    } = this.state;

    const currency = offers ? offers[0].cheapestFares[0].price.currency : '';

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
              Flight Daration&nbsp;&nbsp;&nbsp;&nbsp;᛫

              {duration === durationSpan.max
                ? (<span>Any</span>)
                : (
                  <span className={css.ColorLabel}>
                    {`Under ${DateUtils.getDDHHMMFromMinutes(duration)}`}
                  </span>
                )}
            </label>

            <RangeSlider
              min={durationSpan.min}
              max={durationSpan.max}
              value={duration}
              valueFormatter={(value): string => DateUtils.getTimeDeltaFromMs(value)}
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
              max={departureTimeSpan.max}
              value={departureTime}
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
                  Direct only
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
                : (
                  <span className={css.ColorLabel}>
                    {`${currency} ${Utils.formatCurrency(price)}`}
                  </span>
                )}
            </label>

            <RangeSlider
              min={priceSpan.min}
              max={priceSpan.max}
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
