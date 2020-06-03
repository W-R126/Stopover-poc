import React from 'react';

import './OriginDestinationPicker.css';
import toggleBtn from '../../Assets/Images/toggle-btn.svg';
import { AirportModel } from '../../Models/AirportModel';
import AirportSearch from '../AirportSearch';
import AirportService from '../../Services/AirportService';

export interface OriginDestinationPickerData {
  origin?: AirportModel;
  destination?: AirportModel;
}

interface OriginDestinationPickerProps {
  data: OriginDestinationPickerData;
  airportService: AirportService;
  onChange: (data: OriginDestinationPickerData) => void;
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
    this.setAirportFromPosition = this.setAirportFromPosition.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { airportService } = this.props;

    const airports = await airportService.getOriginAirports();

    await new Promise((resolve) => this.setState({ airports }, resolve));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setAirportFromPosition);
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

  private setAirportFromPosition(position: Position): void {
    const { longitude: long, latitude: lat } = position.coords;
    const { airports } = this.state;

    let origin = airports[0];
    let currDistance = Math.abs(
      (origin.coordinates.lat - lat) + (origin.coordinates.long - long),
    );

    airports.forEach((airport) => {
      const distance = Math.abs(
        (airport.coordinates.lat - lat) + (airport.coordinates.long - long),
      );

      if (distance < currDistance) {
        currDistance = distance;
        origin = airport;
      }
    });

    this.onOriginChange(origin);
  }

  private swapDirections(): void {
    const { data, onChange } = this.props;

    Object.assign(data, { origin: data.destination, destination: data.origin });

    onChange(data);
  }

  render(): JSX.Element {
    const { airports } = this.state;

    const { data } = this.props;

    return (
      <div className="origin-destination-picker">
        <div className="origin">
          <label htmlFor="trip-origin">Flying from</label>
          <AirportSearch
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

        <div className="destination">
          <label htmlFor="trip-destination">Flying to</label>
          <AirportSearch
            airports={airports}
            exclude={data.origin ? [data.origin] : []}
            onChange={this.onDestinationChange}
            className="destination"
            id="trip-destination"
            placeholder="Where are you headed?"
            value={data.destination}
          />
        </div>
      </div>
    );
  }
}
