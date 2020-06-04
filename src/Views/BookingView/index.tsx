import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import TripSearch from '../../Components/TripSearch';
import { TripType } from '../../Enums/TripType';
import { CabinType } from '../../Enums/CabinType';
import AirportService from '../../Services/AirportService';
import { TripSearchData } from '../../Components/TripSearch/TripSearchData';
import Utils from '../../Utils';

interface BookingViewProps extends RouteComponentProps<{
  originCode: string;
  destinationCode: string;
  cabinType: string;
  adults: string;
  children: string;
  infants: string;
  tripType: string;
  outbound: string;
  inbound?: string;
}> {
  airportService: AirportService;
  locale: string;
}

interface BookingState {
  tripSearchData: TripSearchData;
}

class BookingView extends React.Component<BookingViewProps, BookingState> {
  constructor(props: BookingViewProps) {
    super(props);

    this.state = {
      tripSearchData: this.getDataFromParams(props),
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
    const { history } = this.props;

    if (tripSearchData.originDestination.destination && tripSearchData.originDestination.origin) {
      history.replace(Utils.getBookingUrl(tripSearchData));
    }

    this.setState({ tripSearchData });
  }

  private getDataFromParams(props: BookingViewProps): any {
    const { match } = props;
    const { params } = match;

    const start = params.outbound ? new Date(params.outbound) : undefined;
    let end = params.inbound ? new Date(params.inbound) : undefined;

    if (!end && start) {
      end = new Date(start);
    }

    return {
      tripType: (TripType as any)[params.tripType],
      passengers: {
        adults: Number.parseInt(params.adults, 10),
        children: Number.parseInt(params.children, 10),
        infants: Number.parseInt(params.infants, 10),
      },
      cabinType: (CabinType as any)[params.cabinType],
      originDestination: {
        origin: undefined,
        destination: undefined,
      },
      dates: {
        start,
        end,
      },
      bookWithMiles: false,
    };
  }

  render(): JSX.Element {
    const { airportService, locale } = this.props;
    const { tripSearchData } = this.state;

    return (
      <div className="booking-view">
        <TripSearch
          locale={locale}
          airportService={airportService}
          data={tripSearchData}
          onChange={this.onTripSearchChange}
        />
      </div>
    );
  }
}

export default withRouter(BookingView);
