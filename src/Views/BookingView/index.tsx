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
import FlightService from '../../Services/FlightService';
import {
  OfferModel,
  GroupedOfferModel,
  AltOfferModel,
} from '../../Models/OfferModel';
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

interface BookingViewProps extends RouteComponentProps {
  stopOverService: StopOverService;
  airportService: AirportService;
  flightService: FlightService;
  contentService: ContentService;
}

interface BookingState {
  trip: TripModel;
  editing: boolean;
  outboundOffers?: {
    offers: GroupedOfferModel[];
    altOffers: AltOfferModel[];
  };
  outboundOffer?: OfferModel;
}

class BookingView extends React.Component<BookingViewProps, BookingState> {
  private readonly flightSearchResultRef = React.createRef<FlightSearchResult>();

  private readonly stopOverPromptRef = React.createRef<StopOverPrompt>();

  private offersReq?: Promise<{
    altOffers: AltOfferModel[];
    offers: GroupedOfferModel[];
  }>;

  constructor(props: BookingViewProps) {
    super(props);

    this.state = {
      outboundOffers: undefined,
      trip: copyTrip(),
      editing: false,
      outboundOffer: AppState.outboundOffer,
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

    nextTrip.legs[0].outbound = nextOutbound;

    if (!isTripValid(nextTrip)) {
      return;
    }

    this.onTripSearch(nextTrip);
  }

  private onOutboundOfferChange(outboundOffer?: OfferModel): void {
    AppState.outboundOffer = outboundOffer;

    this.setState({ outboundOffer });
  }

  private async onSelectInbound(): Promise<void> {
    const { stopOverService, history } = this.props;
    const { outboundOffer, trip } = this.state;

    if (outboundOffer === undefined) {
      return;
    }

    const result = await stopOverService.getStopOver(outboundOffer.basketHash);

    if (!(result && this.stopOverPromptRef.current)) {
      history.push('/select-inbound');

      return;
    }

    this.stopOverPromptRef.current.show(
      result.customerSegment,
      result.days,
      result.airportCode,
      trip,
    );
  }

  private async onAcceptStopOver(
    outbound?: Date,
    inbound?: Date,
    airportCode?: string,
    days?: number,
  ): Promise<void> {
    const { history, stopOverService } = this.props;
    const { outboundOffer } = this.state;

    if (!this.stopOverPromptRef.current) {
      return;
    }

    await this.stopOverPromptRef.current.hide();

    if (outboundOffer) {
      // TODO: Save result in state.
      await stopOverService.acceptStopOver(
        outboundOffer.basketHash,
        airportCode as string,
        days as number,
        outbound as Date,
        inbound,
      );
    }

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
    const { flightService } = this.props;

    if (!isTripValid(trip)) {
      this.setState({ editing: true });

      return;
    }

    AppState.tripSearch = trip;

    // Reset offers.
    await new Promise((resolve) => this.setState({ outboundOffers: undefined }, resolve));

    // Ensure that older requests don't trigger a rerender when done.
    const offersReq = flightService.getOffers(
      trip.passengers,
      trip.legs,
    );

    this.offersReq = offersReq;
    this.offersReq.then((outboundOffers) => {
      if (this.offersReq === offersReq) {
        this.setState({ outboundOffers });
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
      outboundOffers,
      trip,
      editing,
      outboundOffer,
    } = this.state;

    const { outbound, origin, destination } = trip.legs[0];

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

          {(outbound && destination && origin) && (
            <>
              <h1 className={css.SelectFlightHeader}>Select outbound flight</h1>
              <FlightSearchResult
                cabinClass={trip.cabinClass}
                ref={this.flightSearchResultRef}
                origin={origin}
                destination={destination}
                offers={outboundOffers?.offers}
                altOffers={outboundOffers?.altOffers}
                selectedDepartureDate={outbound}
                className={css.FlightSearchResult}
                onDepartureChange={this.onOutboundDateChange}
                onOfferChange={this.onOutboundOfferChange}
                selectedOffer={outboundOffer}
              />
            </>
          )}
        </div>

        <ShoppingCart proceedLabel="Select inbound flight" proceedAction={this.onSelectInbound}>
          {outboundOffer && (
            <FlightItem
              price={outboundOffer.total.amount}
              item={outboundOffer}
              contentService={contentService}
            />
          )}
        </ShoppingCart>
      </div>
    );
  }
}

export default withRouter(BookingView);
