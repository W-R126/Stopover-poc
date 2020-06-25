import React from 'react';

import css from './Filters.module.css';
import Menu from '../../../../../../Components/UI/Menu';
import RangeSlider from '../../../../../../Components/UI/RangeSlider';
import { GroupedOfferModel, OfferModel } from '../../../../../../Models/OfferModel';
import Utils from '../../../../../../Utils';

interface FiltersProps {
  headerClassName?: string;
  className?: string;
  offers?: GroupedOfferModel[];
  onChange: (filters?: (groupedOffer: GroupedOfferModel) => boolean) => void;
}

interface FiltersState {
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
  stopsSpan: {
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
  constructor(props: FiltersProps) {
    super(props);

    this.state = {
      duration: 0,
      departureTime: 0,
      stops: 0,
      price: 0,
      durationSpan: {
        min: 0,
        max: 0,
      },
      departureTimeSpan: {
        min: 0,
        max: 0,
      },
      stopsSpan: {
        min: 0,
        max: 0,
      },
      priceSpan: {
        min: 0,
        max: 0,
      },
      filtersActive: false,
    };

    this.clearFilters = this.clearFilters.bind(this);
  }

  componentDidMount(): void {
    this.setFilterSpans();
  }

  componentDidUpdate(prevProps: FiltersProps): void {
    const { offers } = this.props;

    if (prevProps.offers !== offers) {
      this.setFilterSpans();
    }
  }

  private async onFiltersChange(filter: any): Promise<void> {
    Object.assign(filter, { filtersActive: true });

    await new Promise((resolve) => this.setState(filter, resolve));

    const { onChange } = this.props;
    const {
      // duration,
      // departureTime,
      stops,
      price,
    } = this.state;

    onChange((groupedOffer: GroupedOfferModel): boolean => {
      if (groupedOffer.stops.length > stops) {
        return false;
      }

      let priceOk = false;

      ['Economy', 'Business'].forEach((cc) => {
        if (!(groupedOffer.cabinClasses as any)[cc]) {
          return;
        }

        (groupedOffer.cabinClasses as any)[cc].offers.forEach((ccOffer: OfferModel) => {
          if (ccOffer.total.amount >= price) {
            priceOk = true;
          }
        });
      });

      if (!priceOk) {
        return false;
      }

      return true;
    });
  }

  private setFilterSpans(): void {
    const { offers } = this.props;

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

    const stopsSpan = {
      min: -1,
      max: -1,
    };

    const priceSpan = {
      min: -1,
      max: -1,
    };

    offers.forEach((offer) => {
      ['Economy', 'Business'].forEach((cabinClass) => {
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

      // Get stops span.
      const stops = offer.stops.length;

      if (stopsSpan.min === -1) {
        stopsSpan.min = stops;
      }

      if (stopsSpan.max === -1) {
        stopsSpan.max = stops;
      }

      if (stopsSpan.min > stops) {
        stopsSpan.min = stops;
      }

      if (stopsSpan.max < stops) {
        stopsSpan.max = stops;
      }

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
      stopsSpan,
      departureTimeSpan,
      durationSpan,
      price: priceSpan.min,
      departureTime: departureTimeSpan.min,
      duration: durationSpan.min,
      stops: stopsSpan.max,
    });
  }

  private clearFilters(e: React.MouseEvent<HTMLSpanElement>): void {
    e.preventDefault();
    e.stopPropagation();

    this.setFilterSpans();

    this.setState({ filtersActive: false });

    const { onChange } = this.props;

    onChange(undefined);
  }

  render(): JSX.Element {
    const { headerClassName, className, offers } = this.props;

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
      duration,
      price,
      stops,
      departureTime,
      departureTimeSpan,
      priceSpan,
      stopsSpan,
      durationSpan,
      filtersActive,
    } = this.state;

    return (
      <Menu
        header={(
          <div>
            Filters
            {filtersActive && (
              <span role="button" onClick={this.clearFilters}>
                ×
              </span>
            )}
          </div>
        )}
        className={className}
        headerClassName={headerClassList.join(' ')}
        innerHeaderClassName={css.Header}
      >
        <div className={css.FilterOptions}>
          <label>Flight duration</label>
          <RangeSlider
            min={durationSpan.min}
            max={durationSpan.max}
            value={duration}
            step={1800000}
            valueFormatter={(value): string => Utils.getTimeDeltaFromMs(value)}
            onChange={(nextDuration): void => {
              this.onFiltersChange({ duration: nextDuration });
            }}
          />

          <label>Departure time</label>
          <RangeSlider
            min={departureTimeSpan.min}
            max={departureTimeSpan.max}
            value={departureTime}
            step={900000}
            valueFormatter={(value): string => Utils.getHourMinuteString(new Date(value))}
            onChange={(nextDepartureTime): void => {
              this.onFiltersChange({ departureTime: nextDepartureTime });
            }}
          />

          <label>Max number of stops</label>
          <RangeSlider
            min={stopsSpan.min}
            max={stopsSpan.max}
            value={stops}
            valueFormatter={(value): string => `${value} stops`}
            onChange={(nextStops): void => {
              this.onFiltersChange({ stops: nextStops });
            }}
          />

          <label>Price</label>
          <RangeSlider
            min={priceSpan.min}
            max={priceSpan.max}
            value={price}
            valueFormatter={(value): string => `${currency} ${Utils.formatCurrency(value)}`}
            onChange={(nextPrice): void => {
              this.onFiltersChange({ price: nextPrice });
            }}
          />
        </div>
      </Menu>
    );
  }
}
