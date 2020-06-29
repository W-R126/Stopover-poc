import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import css from './BookingView.module.css';
import TripSearch from '../../Components/TripSearch';
import { TripTypeEnum } from '../../Enums/TripTypeEnum';
import { CabinClassEnum } from '../../Enums/CabinClassEnum';
import AirportService from '../../Services/AirportService';
import { TripSearchData, validateTripSearchData, getTripSearchDelta, copyTripSearchData } from '../../Components/TripSearch/TripSearchData';
import Progress, { ProgressStep } from './Components/Progress';
import SearchDetails from './Components/SearchDetails';
import FlightSearchResult from './Components/FlightSearchResult';
import FlightService from '../../Services/FlightService';
import Utils from '../../Utils';
import ShoppingCart from './Components/ShoppingCart';
import {
  OfferModel,
  GroupedOfferModel,
  AltOfferModel,
  findOfferFromHash,
} from '../../Models/OfferModel';
import { AirportModel } from '../../Models/AirportModel';
import StopOverService from '../../Services/StopOverService';
import StopOverPrompt from '../../Components/StopOverPrompt';

interface BookingViewProps extends RouteComponentProps<{
  originCode: string;
  destinationCode: string;
  cabinClass: string;
  adults: string;
  children: string;
  infants: string;
  tripType: string;
  outbound: string;
  inbound?: string;
}> {
  stopOverService: StopOverService;
  airportService: AirportService;
  flightService: FlightService;
  locale: string;
}

interface BookingState {
  tripSearchData: TripSearchData;
  editing: boolean;
  outboundOffers?: {
    offers: GroupedOfferModel[];
    altOffers: AltOfferModel[];
  };
  outboundOfferHash?: number;
}

class BookingView extends React.Component<BookingViewProps, BookingState> {
  private readonly outboundOfferKey = 'Booking.outboundOfferHash';

  private readonly flightSearchResultRef = React.createRef<FlightSearchResult>();

  private readonly stopOverPromptRef = React.createRef<StopOverPrompt>();

  constructor(props: BookingViewProps) {
    super(props);

    const tripSearchData = this.getDataFromParams(props);

    this.state = {
      outboundOffers: undefined,
      tripSearchData,
      editing: false,
      outboundOfferHash: Utils.sessionStore.get<number>(this.outboundOfferKey),
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
    const { airportService, match } = this.props;
    const { params } = match;
    const { tripSearchData } = this.state;

    const originReq = airportService.getAirport(params.originCode);
    const destinationReq = airportService.getAirport(params.destinationCode);

    tripSearchData.origin = await originReq;
    tripSearchData.destination = await destinationReq;

    const newState: Partial<BookingState> = { tripSearchData };

    if (!validateTripSearchData(tripSearchData)) {
      newState.editing = true;
    } else {
      this.searchOffers(tripSearchData);
    }

    this.setState(newState as BookingState);
  }

  private onTripSearch(data: TripSearchData): void {
    const { history } = this.props;
    const { tripSearchData } = this.state;

    Utils.sessionStore.remove(this.outboundOfferKey);

    const delta = getTripSearchDelta(tripSearchData, data);

    this.setState({
      tripSearchData: data,
      editing: false,
      outboundOfferHash: undefined,
    });

    if (
      Object.keys(delta).length > 0
      && !(Object.keys(delta).length === 1 && delta.cabinClass !== undefined)
    ) {
      // Only search if cabin class was not the only thing that changed.
      this.searchOffers(data);
    } else if (this.flightSearchResultRef.current) {
      // Collapse all flight result details.
      this.flightSearchResultRef.current.collapseAll();
    }

    if (this.flightSearchResultRef.current) {
      // Reset the show counter of flight search result.
      this.flightSearchResultRef.current.resetShowCounter();
    }

    history.replace(Utils.getBookingUrl(data));
  }

  private onOutboundDateChange(outbound: Date): void {
    const { tripSearchData } = this.state;
    const { inbound } = tripSearchData;
    const data = copyTripSearchData(tripSearchData);

    if (inbound && Utils.compareDates(inbound, outbound) === -1) {
      // Span is negative, update end to match start
      data.inbound = new Date(outbound);
    }

    data.outbound = outbound;

    this.onTripSearch(data);
  }

  private onOutboundOfferChange(outboundOffer?: OfferModel): void {
    Utils.sessionStore.set(this.outboundOfferKey, outboundOffer?.basketHash);

    this.setState({ outboundOfferHash: outboundOffer?.basketHash });
  }

  private async onSelectInbound(): Promise<void> {
    const { stopOverService, history } = this.props;
    const { outboundOfferHash } = this.state;

    if (outboundOfferHash === undefined) {
      return;
    }

    const result = await stopOverService.getStopOver(outboundOfferHash);

    if (!(result && this.stopOverPromptRef.current)) {
      history.push('/select-inbound');

      return;
    }

    this.stopOverPromptRef.current.show(result.customerSegment, result.days, result.airportCode);
  }

  private async onAcceptStopOver(
    airportCode?: string,
    days?: number,
  ): Promise<void> {
    const { history, stopOverService } = this.props;
    const { outboundOfferHash } = this.state;

    if (!this.stopOverPromptRef.current) {
      return;
    }

    await this.stopOverPromptRef.current.hide();

    if (airportCode && days !== undefined && outboundOfferHash !== undefined) {
      await stopOverService.acceptStopOver(
        outboundOfferHash,
        airportCode,
        days,
      );
    }

    history.push('/stopover-accepted');
  }

  private async onRejectStopOver(airportCode?: string): Promise<void> {
    const { history, stopOverService } = this.props;
    const { tripSearchData } = this.state;

    if (!this.stopOverPromptRef.current) {
      return;
    }

    await this.stopOverPromptRef.current.hide();

    if (airportCode) {
      await stopOverService.rejectStopOver(airportCode);
    }

    if (tripSearchData.tripType === TripTypeEnum.return) {
      history.push('/select-inbound');
    } else {
      history.push('/passenger-details');
    }
  }

  private getDataFromParams(props: BookingViewProps): TripSearchData {
    const { match } = props;
    const { params } = match;

    const outbound = params.outbound ? new Date(params.outbound) : undefined;
    let inbound = params.inbound ? new Date(params.inbound) : undefined;

    if (!inbound && outbound) {
      inbound = new Date(outbound);
    } else if (inbound && outbound && Utils.compareDates(inbound, outbound) === -1) {
      inbound = new Date(outbound);
    }

    return {
      tripType: (TripTypeEnum as any)[params.tripType],
      passengers: {
        adults: Number.parseInt(params.adults, 10),
        children: Number.parseInt(params.children, 10),
        infants: Number.parseInt(params.infants, 10),
      },
      cabinClass: (CabinClassEnum as any)[params.cabinClass],
      origin: undefined,
      destination: undefined,
      outbound,
      inbound,
      bookWithMiles: false,
    };
  }

  private async searchOffers(data: TripSearchData): Promise<void> {
    const { flightService } = this.props;

    // Reset in- and outbound offers.
    await new Promise(
      (resolve) => this.setState({ outboundOffers: undefined }, resolve),
    );

    const outboundOffersReq = flightService.getOffers(
      data.passengers,
      {
        departure: data.outbound as Date,
        destination: data.destination as AirportModel,
        origin: data.origin as AirportModel,
      },
      data.tripType !== TripTypeEnum.return
        ? undefined
        : {
          departure: data.inbound as Date,
          destination: data.origin as AirportModel,
          origin: data.destination as AirportModel,
        },
    );

    const outboundOffers = await outboundOffersReq;
    this.setState({ outboundOffers });
  }

  private toggleEdit(): void {
    const { editing } = this.state;

    this.setState({ editing: !editing });
  }

  render(): JSX.Element {
    const { locale, airportService } = this.props;
    const {
      outboundOffers,
      tripSearchData,
      editing,
      outboundOfferHash,
    } = this.state;

    const {
      cabinClass,
      outbound,
      origin,
      destination,
    } = tripSearchData;
    const outboundOffer = findOfferFromHash(outboundOffers?.offers, outboundOfferHash);

    return (
      <div className={css.BookingView}>
        <StopOverPrompt
          onAccept={this.onAcceptStopOver}
          onReject={this.onRejectStopOver}
          ref={this.stopOverPromptRef}
        />

        <Progress step={ProgressStep.flights} />

        <div className={`${css.ContentWrapper} content-wrapper`}>
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

          {(outbound && destination && origin) && (
            <>
              <h1 className={css.SelectFlightHeader}>Select outbound flight</h1>
              <FlightSearchResult
                cabinClass={cabinClass}
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

        <ShoppingCart
          outboundOffer={outboundOffer}
          onSelectInbound={this.onSelectInbound}
        />
      </div>
    );
  }
}

export default withRouter(BookingView);
