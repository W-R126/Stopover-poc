import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import TripSearch, { TripSearchData } from '../../Components/TripSearch';
import { TripType } from '../../Types/TripType';
import { CabinType } from '../../Types/CabinType';
import AirportService from '../../Services/AirportService';

interface BookingProps extends RouteComponentProps<{
  originCode: string;
  destinationCode: string;
  cabinType: CabinType;
  adults: string;
  children: string;
  infants: string;
  tripType: TripType;
  outbound: string;
  inbound?: string;
}> {
  airportService: AirportService;
}

interface BookingState {
  tripSearchData: TripSearchData;
}

class BookingView extends React.Component<BookingProps, BookingState> {
  constructor(props: BookingProps) {
    super(props);

    const { match } = this.props;
    const { params } = match;

    this.state = {
      tripSearchData: {
        tripType: params.tripType,
        passengers: {
          adults: Number.parseInt(params.adults, 10),
          children: Number.parseInt(params.children, 10),
          infants: Number.parseInt(params.infants, 10),
        },
        cabinType: params.cabinType,
        originDestination: {
          origin: undefined,
          destination: undefined,
        },
        dates: {
          start: new Date(params.outbound),
          end: params.inbound ? new Date(params.inbound) : undefined,
        },
        bookWithMiles: false,
      },
    };

    this.onTripSearchChange = this.onTripSearchChange.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { airportService, match } = this.props;
    const { params } = match;
    const { tripSearchData } = this.state;

    const originReq = airportService.getAirport(params.originCode);
    const destinationReq = airportService.getAirport(params.destinationCode);

    Object.assign(tripSearchData.originDestination, {
      origin: await originReq,
      destination: await destinationReq,
    });

    this.setState({ tripSearchData });
  }

  private onTripSearchChange(tripSearchData: TripSearchData): void {
    this.setState({ tripSearchData });
  }

  render(): JSX.Element {
    const { airportService } = this.props;
    const { tripSearchData } = this.state;

    return (
      <div className="booking-view">
        <TripSearch
          airportService={airportService}
          data={tripSearchData}
          onChange={this.onTripSearchChange}
        />
      </div>
    );
  }
}

export default withRouter(BookingView);
