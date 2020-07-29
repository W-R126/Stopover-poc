import React from 'react';

import css from './OriginDestinationPicker.module.css';
import toggleBtn from '../../../../../../Assets/Images/NDC/Points Transfer.svg';
import { AirportModel } from '../../../../../../Models/AirportModel';
import AirportSearch from './Components/AirportSearch';
import AirportService from '../../../../../../Services/AirportService';
import Utils from '../../../../../../Utils';

interface OriginDestinationPickerProps {
  origin?: AirportModel;
  destination?: AirportModel;
  airportService: AirportService;
  onChange: (origin?: AirportModel, destination?: AirportModel) => void;
  className?: string;
}

interface OriginDestinationPickerState {
  airports: AirportModel[];
}

export default class OriginDestinationPicker extends React.Component<
  OriginDestinationPickerProps,
  OriginDestinationPickerState
> {
  constructor(props: OriginDestinationPickerProps) {
    super(props);

    this.state = {
      airports: [],
    };

    this.swapDirections = this.swapDirections.bind(this);
    this.onOriginChange = this.onOriginChange.bind(this);
    this.onDestinationChange = this.onDestinationChange.bind(this);
    this.setOriginAirportFromPosition = this.setOriginAirportFromPosition.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { airportService } = this.props;

    const airports = await airportService.getAirports();

    await new Promise((resolve) => this.setState({ airports }, resolve));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setOriginAirportFromPosition);
    }
  }

  private onOriginChange(origin?: AirportModel): void {
    const { destination, onChange } = this.props;

    onChange(origin, destination);
  }

  private onDestinationChange(destination?: AirportModel): void {
    const { origin, onChange } = this.props;

    onChange(origin, destination);
  }

  private setOriginAirportFromPosition(position: Position): void {
    const { origin } = this.props;

    if (origin) {
      return;
    }

    const { longitude: long, latitude: lat } = position.coords;
    const { airports } = this.state;

    let nextOrigin = airports[0];
    let distance = Utils.getDistance(nextOrigin.coordinates, { long, lat });

    airports.forEach((airport) => {
      const nextDistance = Utils.getDistance(airport.coordinates, { long, lat });

      if (nextDistance < distance) {
        distance = nextDistance;
        nextOrigin = airport;
      }
    });

    this.onOriginChange(nextOrigin);
  }

  private swapDirections(): void {
    const { origin, destination, onChange } = this.props;

    onChange(destination, origin);
  }

  render(): JSX.Element {
    const { airports } = this.state;
    const { origin, destination, className } = this.props;

    const classList = [css.OriginDestinationPicker];

    if (className) {
      classList.push(className);
    }

    return (
      <div className={classList.join(' ')}>
        <div className={css.Origin}>
          <label htmlFor="trip-origin">Flying from</label>
          <AirportSearch
            className={css.AirportSearch}
            wrapperClassName={css.AirportSearchWrapper}
            focusedClassName={css.AirportSearchFocused}
            airports={airports.filter((airport) => airport.code !== destination?.code)}
            onChange={this.onOriginChange}
            id="trip-origin"
            placeholder="Where are you flying from?"
            value={origin}
          />
        </div>

        <button
          type="button"
          tabIndex={-1}
          onClick={this.swapDirections}
        >
          <img src={toggleBtn} alt="Switch direction" />
        </button>

        <div className={css.Destination}>
          <label htmlFor="trip-destination">Flying to</label>
          <AirportSearch
            className={css.AirportSearch}
            wrapperClassName={css.AirportSearchWrapper}
            focusedClassName={css.AirportSearchFocused}
            airports={airports.filter((airport) => airport.code !== origin?.code)}
            onChange={this.onDestinationChange}
            id="trip-destination"
            placeholder="Where are you headed?"
            value={destination}
          />
        </div>
      </div>
    );
  }
}
