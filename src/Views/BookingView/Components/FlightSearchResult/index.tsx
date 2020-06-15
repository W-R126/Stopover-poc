import React from 'react';

import css from './FlightSearchResult.module.css';
import spinner from '../../../../Assets/Images/spinner.svg';
import flightIcon from '../../../../Assets/Images/flight.svg';
import { TripSearchData } from '../../../../Components/TripSearch/TripSearchData';
import { FlightModel } from '../../../../Models/FlightModel';
import FlightService from '../../../../Services/FlightService';
import DayRibbon from '../DayRibbon';
import FlightEntry from './Components/FlightEntry';

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
        <div className={css.NoResult}>
          No flights found.
        </div>
      );
    }

    return (
      <>
        <DayRibbon className={css.DayRibbon} />
        <div className={css.FlightEntries}>
          {flights.map((flight, idx) => (
            <FlightEntry
              className={css.FlightEntry}
              data={flight}
              key={`flight-entry-${idx}`}
            />
          ))}
        </div>
      </>
    );
  }

  render(): JSX.Element {
    const { tripSearchData } = this.props;
    const { originDestination } = tripSearchData;
    const { flights } = this.state;

    return (
      <div className={css.FlightSearchResult}>
        <div>
          <div className={css.OriginDestination}>
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
        <div className={css.Result}>
          {!flights
            ? (
              <strong className={css.Searching}>
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
