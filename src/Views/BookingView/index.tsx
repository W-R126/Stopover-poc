import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import css from './BookingView.module.css';
import TripSearch from '../../Components/TripSearch';
import { TripType } from '../../Enums/TripType';
import { CabinType } from '../../Enums/CabinType';
import AirportService from '../../Services/AirportService';
import { TripSearchData } from '../../Components/TripSearch/TripSearchData';
import Progress, { ProgressStep } from './Components/Progress';
import SearchDetails from './Components/SearchDetails';
import FlightSearchResult from './Components/FlightSearchResult';
import FlightService from '../../Services/FlightService';
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
  flightService: FlightService;
  locale: string;
}

interface BookingState {
  tripSearchData: TripSearchData;
  editing: boolean;
}

class BookingView extends React.Component<BookingViewProps, BookingState> {
  constructor(props: BookingViewProps) {
    super(props);

    const tripSearchData = this.getDataFromParams(props);

    this.state = {
      tripSearchData,
      editing: false,
    };

    this.onOutboundChange = this.onOutboundChange.bind(this);
    this.onTripSearch = this.onTripSearch.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
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

    const newState = { tripSearchData };

    if (!Utils.validateTripSearchData(tripSearchData)) {
      Object.assign(newState, { editing: true });
    }

    this.setState(newState);
  }

  private onTripSearch(tripSearchData: TripSearchData): void {
    const { history } = this.props;

    this.setState({ tripSearchData, editing: false });

    history.replace(Utils.getBookingUrl(tripSearchData));
  }

  private onOutboundChange(outbound: Date): void {
    const { tripSearchData } = this.state;
    const { dates } = tripSearchData;

    Object.assign(dates, { start: outbound });

    this.onTripSearch(tripSearchData);
  }

  private getDataFromParams(props: BookingViewProps): TripSearchData {
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

  private toggleEdit(): void {
    const { editing } = this.state;

    this.setState({ editing: !editing });
  }

  render(): JSX.Element {
    const { locale, airportService, flightService } = this.props;
    const {
      tripSearchData,
      editing,
    } = this.state;

    const tripSearchValid = Utils.validateTripSearchData(tripSearchData);
    const {
      cabinType,
      dates,
      originDestination,
      passengers,
    } = tripSearchData;

    return (
      <div className={css.BookingView}>
        <Progress step={ProgressStep.flights} />
        <div className={`${css.ContentWrapper} content-wrapper`}>
          {editing
            ? (
              <>
                {tripSearchValid && (
                  <button
                    type="button"
                    className={css.CancelSearch}
                    onClick={this.toggleEdit}
                  >
                    Cancel
                  </button>
                )}
                <TripSearch
                  className={css.TripSearch}
                  locale={locale}
                  airportService={airportService}
                  data={tripSearchData}
                  onSearch={this.onTripSearch}
                />
              </>
            )
            : (
              <SearchDetails
                className={css.SearchDetails}
                data={tripSearchData}
                locale={locale}
                toggleEdit={this.toggleEdit}
              />
            )}
          {(dates.start && originDestination.destination && originDestination.origin) && (
            <>
              <h1 className={css.SelectFlightHeader}>Select outbound flight</h1>
              <FlightSearchResult
                onDepartureChange={this.onOutboundChange}
                cabinType={cabinType}
                departure={dates.start}
                destination={originDestination.destination}
                origin={originDestination.origin}
                passengers={passengers}
                flightService={flightService}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(BookingView);
