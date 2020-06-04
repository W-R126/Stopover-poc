import React from 'react';

import './FlightSearchResult.css';
import spinner from '../../../../Assets/Images/spinner.svg';
import flightIcon from '../../../../Assets/Images/flight.svg';
import { TripSearchData } from '../../../../Components/TripSearch/TripSearchData';
import { FlightModel } from '../../../../Models/FlightModel';
import FlightService from '../../../../Services/FlightService';

interface FlightSearchResultProps {
  tripSearchData: TripSearchData;
  flightService: FlightService;
}

interface FlightSearchResultState {
  flights?: FlightModel[];
}

export default class FlightSearchResult extends React.Component<
  FlightSearchResultProps,
  FlightSearchResultState
> {
  constructor(props: FlightSearchResultProps) {
    super(props);

    this.state = {
      flights: undefined,
    };
  }

  componentDidMount(): void {
    this.search();
  }

  componentDidUpdate(prevProps: FlightSearchResultProps): void {
    const { tripSearchData } = this.props;

    if (tripSearchData !== prevProps.tripSearchData) {
      this.search();
    }
  }

  private async search(): Promise<void> {
    const { tripSearchData, flightService } = this.props;

    this.setState({ flights: undefined });
    this.setState({
      flights: await flightService.getFlights(tripSearchData),
    });
  }

  private renderResult(flights: FlightModel[]): JSX.Element {
    if (flights.length === 0) {
      return (
        <div className="no-result">
          No flights found.
        </div>
      );
    }

    return (
      <>
        <div className="day-picker">
          Bye!
        </div>
        <div className="flight-entry">
          Hello!
        </div>
      </>
    );
  }

  render(): JSX.Element {
    const { tripSearchData } = this.props;
    const { originDestination } = tripSearchData;
    const { flights } = this.state;

    return (
      <div className="flight-search-result">
        <div className="header">
          <div className="origin-destination">
            <img src={flightIcon} alt="Flight" />
            <strong>
              {`${
                originDestination.origin?.cityName
              } to ${
                originDestination.destination?.cityName
              }`}
            </strong>
          </div>
        </div>
        <div className="result">
          {!flights
            ? (
              <strong className="searching">
                <img src={spinner} alt="Searching" />
                Searching
              </strong>
            )
            : (this.renderResult(flights))}
        </div>
      </div>
    );
  }
}
