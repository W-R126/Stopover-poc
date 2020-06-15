import React from 'react';

import css from './OriginDestinationPicker.module.css';
import toggleBtn from '../../../../Assets/Images/toggle-btn.svg';
import { AirportModel } from '../../../../Models/AirportModel';
import AirportSearch from '../AirportSearch';
import AirportService from '../../../../Services/AirportService';
import Utils from '../../../../Utils';

export interface OriginDestinationPickerData {
  origin?: AirportModel;
  destination?: AirportModel;
}

interface OriginDestinationPickerProps {
  data: OriginDestinationPickerData;
  airportService: AirportService;
  onChange: (data: OriginDestinationPickerData) => void;
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
    this.onKeyChange('origin', origin);
  }

  private onDestinationChange(destination?: AirportModel): void {
    this.onKeyChange('destination', destination);
  }

  private onKeyChange(key: string, value: any): void {
    const { data, onChange } = this.props;

    Object.assign(data, { [key]: value });

    onChange(data);
  }

  private setOriginAirportFromPosition(position: Position): void {
    const { longitude: long, latitude: lat } = position.coords;
    const { data } = this.props;
    const { airports } = this.state;

    let origin = airports[0];
    let distance = Utils.getDistance(origin.coordinates, { long, lat });

    airports.forEach((airport) => {
      const nextDistance = Utils.getDistance(airport.coordinates, { long, lat });

      if (nextDistance < distance) {
        distance = nextDistance;
        origin = airport;
      }
    });

    if (!data.origin) {
      this.onOriginChange(origin);
    }
  }

  private swapDirections(): void {
    const { data, onChange } = this.props;

    Object.assign(data, { origin: data.destination, destination: data.origin });

    onChange(data);
  }

  render(): JSX.Element {
    const { airports } = this.state;
    const { data, className } = this.props;

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
            airports={airports}
            exclude={data.destination ? [data.destination] : []}
            onChange={this.onOriginChange}
            id="trip-origin"
            placeholder="Where are you flying from?"
            value={data.origin}
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
            airports={airports}
            exclude={data.origin ? [data.origin] : []}
            onChange={this.onDestinationChange}
            id="trip-destination"
            placeholder="Where are you headed?"
            value={data.destination}
          />
        </div>
      </div>
    );
  }
}
