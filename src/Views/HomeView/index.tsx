import React from 'react';

import './HomeView.css';
import TripSearch, { TripSearchData } from '../../Components/TripSearch';
import AirportService from '../../Services/AirportService';

interface HomeViewProps {
  airportService: AirportService;
}

interface HomeViewState {
  tripSearchData: TripSearchData;
}

export default class HomeView extends React.Component<HomeViewProps, HomeViewState> {
  constructor(props: HomeViewProps) {
    super(props);

    this.state = {
      tripSearchData: {
        tripType: 'return',
        passengers: {
          adults: 1,
          children: 0,
          infants: 0,
        },
        cabinType: 'all',
        originDestination: {
          origin: undefined,
          destination: undefined,
        },
        dates: {
          start: undefined,
          end: undefined,
        },
        bookWithMiles: false,
      },
    };

    this.onTripSearchChange = this.onTripSearchChange.bind(this);
  }

  private onTripSearchChange(tripSearchData: TripSearchData): void {
    this.setState({ tripSearchData });
  }

  render(): JSX.Element {
    const { tripSearchData: data } = this.state;
    const { airportService } = this.props;

    return (
      <div className="home-view">
        <div className="top-image" />
        <div className="content-wrapper">
          <TripSearch
            data={data}
            onChange={this.onTripSearchChange}
            airportService={airportService}
          />
        </div>
      </div>
    );
  }
}
