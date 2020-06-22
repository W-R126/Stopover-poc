import React from 'react';

import css from './Filters.module.css';
import Menu from '../../../../../../Components/UI/Menu';
import Range from '../../../../../../Components/UI/Range';

interface FiltersProps {
  headerClassName?: string;
  className?: string;
}

interface FiltersState {
  duration: number;
  departureTime: number;
  stops: number;
  price: number;
}

export default class Filters extends React.Component<FiltersProps, FiltersState> {
  constructor(props: FiltersProps) {
    super(props);

    this.state = {
      duration: 0,
      departureTime: 1,
      stops: 1,
      price: 1,
    };

    this.clearFilters = this.clearFilters.bind(this);
  }

  private clearFilters(e: React.MouseEvent<HTMLSpanElement>): void {
    e.preventDefault();
    e.stopPropagation();

    const {
      duration,
      departureTime,
      stops,
      price,
    } = this.state;

    // Object.assign(filters, {
    //   duration: undefined,
    //   stops: undefined,
    //   price: undefined,
    //   departureTime: undefined,
    // });

    // this.setState({ filters });
  }

  render(): JSX.Element {
    const filters = {};
    const { headerClassName, className } = this.props;

    const {
      duration,
      price,
      stops,
      departureTime,
    } = this.state;

    return (
      <Menu
        header={(
          <div>
            Filters
            {Object
              .keys(filters)
              .filter((key) => (filters as any)[key] !== undefined)
              .length !== 0 && (
              <span role="button" onClick={this.clearFilters}>
                ×
              </span>
            )}
          </div>
        )}
        className={className}
        headerClassName={headerClassName}
      >
        <div className={css.FilterOptions}>
          <label>Flight duration</label>
          <Range
            min={0}
            max={50}
            step={5}
            value={duration}
            onChange={(nextDuration): void => {
              this.setState({ duration: nextDuration });
            }}
          />

          <label>Departure time</label>
          <Range
            min={1}
            max={107}
            value={departureTime}
            onChange={(nextDepartureTime): void => {
              this.setState({ departureTime: nextDepartureTime });
            }}
          />

          <label>Number of stops</label>
          <Range
            min={1}
            max={50}
            value={stops}
            onChange={(nextStops): void => {
              this.setState({ stops: nextStops });
            }}
          />

          <label>Price</label>
          <Range
            min={1}
            max={50}
            value={price}
            onChange={(nextPrice): void => {
              this.setState({ price: nextPrice });
            }}
          />
        </div>
      </Menu>
    );
  }
}
