import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import commonCss from '../../common.module.css';
import css from './BookingView.module.css';
import TripSearch from '../../Components/TripSearch';
import { TripTypeEnum } from '../../Enums/TripTypeEnum';
import AirportService from '../../Services/AirportService';
import Progress, { ProgressStep } from './Components/Progress';
import SearchDetails from './Components/SearchDetails';
import FlightSearchResult from './Components/FlightSearchResult';
import StopOverService from '../../Services/StopOverService';
import StopOverPrompt from '../../Components/StopOverPrompt';
import {
  TripModel,
  copyTrip,
  isTripValid,
  tripToUrl,
  getTripFromQuery,
} from '../../Models/TripModel';
import ShoppingCart from '../../Components/ShoppingCart';
import FlightItem from '../../Components/ShoppingCart/Items/FlightItem';
import ContentService from '../../Services/ContentService';
import AppState from '../../AppState';
import FlightOfferService from '../../Services/FlightOfferService';
import { FlightOfferModel, FareModel, AlternateFlightOfferModel } from '../../Models/FlightOfferModel';
import DateUtils from '../../DateUtils';

interface BookingViewProps extends RouteComponentProps {
  stopOverService: StopOverService;
  airportService: AirportService;
  flightOfferService: FlightOfferService;
  contentService: ContentService;
}

interface BookingState {
  trip: TripModel;
  editing: boolean;
  offers?: FlightOfferModel[][];
  altOffers?: AlternateFlightOfferModel[][];
  outboundFare?: FareModel;
}

class BookingView extends React.Component<BookingViewProps, BookingState> {
  private readonly flightSearchResultRef = React.createRef<FlightSearchResult>();

  private readonly stopOverPromptRef = React.createRef<StopOverPrompt>();

  private offersReq?: Promise<{
    offers: FlightOfferModel[][];
    altOffers: AlternateFlightOfferModel[][];
  } | undefined>;

  constructor(props: BookingViewProps) {
    super(props);

    this.state = {
      offers: undefined,
      altOffers: undefined,
      trip: copyTrip(),
      editing: false,
      outboundFare: AppState.outboundFare,
    };

    this.onOutboundDateChange = this.onOutboundDateChange.bind(this);
    this.onTripSearch = this.onTripSearch.bind(this);
    this.onOutboundOfferChange = this.onOutboundOfferChange.bind(this);
    this.onSelectInbound = this.onSelectInbound.bind(this);
    this.onAcceptStopOver = this.onAcceptStopOver.bind(this);
    this.onRejectStopOver = this.onRejectStopOver.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { location, airportService } = this.props;

    const trip = await getTripFromQuery(location, airportService);

    this.setState({ trip });
    this.searchOffers(trip);
  }

  componentWillUnmount(): void {
    this.offersReq = undefined;
  }

  private onTripSearch(nextTrip: TripModel): void {
    const { history } = this.props;

    this.onOutboundOfferChange(undefined);

    this.setState({
      trip: nextTrip,
      editing: false,
    });

    if (this.flightSearchResultRef.current) {
      // Collapse all flight result details.
      this.flightSearchResultRef.current.collapseAll();
    }

    if (this.flightSearchResultRef.current) {
      // Reset the show counter of flight search result.
      this.flightSearchResultRef.current.resetShowCounter();
      this.flightSearchResultRef.current.clearFilterState();
    }

    history.replace(`/booking?${tripToUrl(nextTrip)}`);
    this.searchOffers(nextTrip);
  }

  private onOutboundDateChange(nextOutbound: Date): void {
    const { trip } = this.state;
    const nextTrip = copyTrip(trip);

    nextTrip.legs[0].departure = nextOutbound;

    if (nextTrip.legs[1]?.departure) {
      // Ensure that inbound is not equal to or before outbound.
      const compare = DateUtils.compareDates(nextOutbound, nextTrip.legs[1].departure);

      if (compare === 1 || compare === 0) {
        const nextInbound = new Date(nextOutbound);
        nextInbound.setDate(nextInbound.getDate() + 1);

        nextTrip.legs[1].departure = nextInbound;
      }
    }

    if (!isTripValid(nextTrip)) {
      return;
    }

    this.onTripSearch(nextTrip);
  }

  private onOutboundOfferChange(outboundOffer?: FareModel): void {
    AppState.outboundFare = outboundOffer;

    this.setState({ outboundFare: outboundOffer });
  }

  private async onSelectInbound(): Promise<void> {
    const { stopOverService, history } = this.props;
    const { outboundFare } = this.state;

    if (outboundFare === undefined) {
      return;
    }

    const result = await stopOverService.getStopOver(outboundFare.hashCode);

    if (!(result && this.stopOverPromptRef.current)) {
      history.push('/select-inbound');

      return;
    }

    AppState.stopOverInfo = result;

    this.stopOverPromptRef.current.show(result.customerSegment, result.airportCode);
  }

  private async onAcceptStopOver(): Promise<void> {
    const { history } = this.props;

    if (!this.stopOverPromptRef.current) {
      return;
    }

    await this.stopOverPromptRef.current.hide();

    history.push('/stopover/hotels');
  }

  private async onRejectStopOver(airportCode?: string): Promise<void> {
    const { history, stopOverService } = this.props;
    const { trip } = this.state;

    if (!this.stopOverPromptRef.current) {
      return;
    }

    await this.stopOverPromptRef.current.hide();

    if (airportCode) {
      await stopOverService.rejectStopOver(airportCode);
    }

    if (trip.type === TripTypeEnum.roundTrip) {
      history.push('/select-inbound');
    } else {
      history.push('/passenger-details');
    }
  }

  private async searchOffers(trip: TripModel): Promise<void> {
    const { flightOfferService } = this.props;

    if (!isTripValid(trip)) {
      this.setState({ editing: true });

      return;
    }

    AppState.tripSearch = trip;

    // Reset offers.
    await new Promise((resolve) => this.setState({
      offers: undefined,
      altOffers: undefined,
    }, resolve));

    // Ensure that older requests don't trigger a rerender when done.
    const offersReq = flightOfferService.getOffers(
      trip.passengers,
      trip.legs.map((leg) => ({
        originCode: leg.origin?.code ?? '',
        destinationCode: leg.destination?.code ?? '',
        departure: leg.departure as Date,
      })),
      trip.cabinClass,
    );

    this.offersReq = offersReq;
    offersReq.then((offers) => {
      if (this.offersReq === offersReq) {
        this.setState({
          offers: offers?.offers,
          altOffers: offers?.altOffers,
        });
      }
    });
  }

  private toggleEdit(): void {
    const { editing } = this.state;

    this.setState({ editing: !editing });
  }

  render(): JSX.Element {
    const { contentService, airportService } = this.props;
    const {
      offers,
      altOffers,
      trip,
      editing,
      outboundFare,
    } = this.state;

    const { departure, origin, destination } = trip.legs[0];

    return (
      <div className={css.BookingView}>
        <StopOverPrompt
          onAccept={this.onAcceptStopOver}
          onReject={this.onRejectStopOver}
          ref={this.stopOverPromptRef}
        />

        <Progress step={ProgressStep.flights} />

        <div className={`${css.ContentWrapper} ${commonCss.ContentWrapper}`}>
          {editing
            ? (
              <>
                <button
                  type="button"
                  className={css.CancelSearch}
                  onClick={this.toggleEdit}
                >
                  Cancel
                </button>

                <TripSearch
                  className={css.TripSearch}
                  contentService={contentService}
                  airportService={airportService}
                  trip={trip}
                  onSearch={this.onTripSearch}
                />
              </>
            )
            : (
              <SearchDetails
                className={css.SearchDetails}
                trip={trip}
                contentService={contentService}
                toggleEdit={this.toggleEdit}
              />
            )}

          {(departure && destination && origin) && (
            <>
              <h1 className={css.SelectFlightHeader}>Select outbound flight</h1>

              <FlightSearchResult
                trip={trip}
                cabinClass={trip.cabinClass}
                ref={this.flightSearchResultRef}
                origin={origin}
                destination={destination}
                offers={offers && offers[0]}
                altOffers={altOffers && altOffers[0]}
                selectedDepartureDate={departure}
                className={css.FlightSearchResult}
                onDepartureChange={this.onOutboundDateChange}
                onFareChange={this.onOutboundOfferChange}
                selectedFare={outboundFare}
                contentService={contentService}
              />
            </>
          )}
        </div>

        <ShoppingCart
          proceedLabel="Select inbound flight"
          proceedAction={this.onSelectInbound}
          currency={contentService.currency}
        >
          {outboundFare && (
            <FlightItem
              currency={outboundFare.price.currency}
              price={outboundFare.price.total}
              item={outboundFare}
              contentService={contentService}
            />
          )}
        </ShoppingCart>
      </div>
    );
  }
}

export default withRouter(BookingView);
