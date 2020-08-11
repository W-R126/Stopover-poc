import React from 'react';

import css from './SearchPanel.module.css';

import AirportService from '../../../../../Services/AirportService';
import { AirportModel } from '../../../../../Models/AirportModel';
import AirportSearch from '../../../../../Components/TripSearch/Components/OriginDestinationPicker/Components/AirportSearch';

import Utils from '../../../../../Utils';
import DestinationAirport from './Components/DestinationAirport';

interface SearchPanelProps {
  origin?: AirportModel;
  destination?: AirportModel;
  airportService: AirportService;
  onChange: (origin?: AirportModel, destination?: AirportModel) => void;
}

interface SearchPanelState {
  selectedPane: string;
  airports: AirportModel[];
}

class SearchPanel extends React.Component<
  SearchPanelProps, SearchPanelState
> {
  private readonly TAB_CONTENTS = ['FLIGHTS', 'HOTELS', 'CARS', 'ACTIVITIES']

  constructor(props: SearchPanelProps) {
    super(props);
    this.state = {
      selectedPane: 'FLIGHTS',
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
    const { selectedPane, airports } = this.state;
    const { origin, destination } = this.props;

    return (
      <div className={css.ComponentContainer}>
        <div className={css.TabSelector}>
          {this.TAB_CONTENTS.map((item) => (
            <div className={`${css.TabItem} ${item === selectedPane ? css.Active : ''}`}>
              {item}
            </div>
          ))}
        </div>
        <div className={css.FlightSelector}>
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
          <DestinationAirport
            className={css.AirportSearch}
            wrapperClassName={css.AirportSearchWrapper}
            focusedClassName={css.AirportSearchFocused}
            airports={airports.filter((airport) => airport.code !== origin?.code)}
            onChange={this.onDestinationChange}
            id="trip-destination"
            placeholder="Where do you want to go?"
            value={destination}
          />
          <button
            className={css.SwapButton}
            type="button"
            tabIndex={-1}
            onClick={this.swapDirections}
          />
        </div>
      </div>
    );
  }
}

export default SearchPanel;
