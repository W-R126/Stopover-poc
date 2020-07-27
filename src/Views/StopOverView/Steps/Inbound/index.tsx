import React from 'react';
import PlaneImg from '../../../../Assets/Images/plane.svg';
import css from './Inbound.module.css';

import FlightSearchResult from '../../../../Components/FlightSearchResult';
import { FlightOfferModel, FareModel, AlternateFlightOfferModel } from '../../../../Models/FlightOfferModel';
import { TripModel, copyTrip } from '../../../../Models/TripModel';

import AppState from '../../../../AppState';
import StopOverService from '../../../../Services/StopOverService';
import ContentService from '../../../../Services/ContentService';
import FlightOfferService from '../../../../Services/FlightOfferService';
import { RoomOfferModel } from '../../../../Models/HotelOfferModel';
import { AirportModel } from '../../../../Models/AirportModel';

interface InboundProps {
  className?: string;
  flightOfferService: FlightOfferService;
  stopOverService: StopOverService;
  contentService: ContentService;
  selectInbound: Function;
  isStopOver?: boolean;
}

interface InboundState {
  offers?: FlightOfferModel[][];
  altOffers?: AlternateFlightOfferModel[][];
  trip: TripModel;
  outboundFare: FareModel;
  onwardFare: FareModel;
  hotelRoom: RoomOfferModel;
  inboundFare?: FareModel;
}

export default class Inbound extends React.Component<InboundProps, InboundState> {
  private readonly flightSearchResultRef = React.createRef<FlightSearchResult>();

  constructor(props: any) {
    super(props);
    this.state = {
      offers: undefined,
      altOffers: undefined,
      outboundFare: AppState.outboundFare as FareModel,
      inboundFare: AppState.inboundFare,
      onwardFare: AppState.onwardFare as FareModel,
      hotelRoom: AppState.hotelRoom as RoomOfferModel,
      trip: AppState.tripSearch as TripModel,
    };

    this.inboundOfferChange = this.inboundOfferChange.bind(this);
    this.inboundDateChange = this.inboundDateChange.bind(this);
  }

  componentDidMount(): void {
    const { trip } = this.state;

    this.getOffers(trip);
  }

  private async getOffers(trip: TripModel): Promise<void> {
    const { flightOfferService } = this.props;

    const offers = await flightOfferService.getOffers(
      trip.passengers,
      trip.legs.map((leg) => ({
        originCode: leg.origin?.code ?? '',
        destinationCode: leg.destination?.code ?? '',
        departure: leg.departure as Date,
      })),
      trip.cabinClass,
    );

    if (offers) {
      this.setState({
        offers: offers.offers,
        altOffers: offers.altOffers,
      });
    }
  }

  private async inboundDateChange(nextInbound: Date): Promise<void> {
    await new Promise((resolve) => this.setState(
      { offers: undefined, altOffers: undefined },
      resolve,
    ));

    const { trip } = this.state;
    const nextTrip = copyTrip(trip);

    nextTrip.legs[1].departure = nextInbound;

    this.setState({ trip: nextTrip });
    AppState.tripSearch = nextTrip;

    this.getOffers(nextTrip);
  }

  private inboundOfferChange(inboundFare?: FareModel): void {
    const { selectInbound } = this.props;

    this.setState({
      inboundFare,
    });

    selectInbound(inboundFare);
  }

  render(): JSX.Element {
    const { contentService, className } = this.props;
    const {
      offers,
      altOffers,
      trip,
      inboundFare,
    } = this.state;

    const classList = [css.Inbound, className];

    const { departure, origin, destination } = trip.legs[1];

    return (
      <div className={classList.join(' ')}>
        <div className={css.Header}>
          <h1>Finally, select your return flight</h1>

          <img src={PlaneImg} alt="Experiences" />

          <h2>
            {`${origin?.cityName} to ${destination?.cityName}, ${
              (departure as Date).toLocaleDateString(
                'en-US',
                { day: 'numeric', month: 'long', year: 'numeric' },
              )}`}
          </h2>
        </div>

        <FlightSearchResult
          trip={trip}
          origin={origin as AirportModel}
          destination={destination as AirportModel}
          selectedDepartureDate={departure as Date}
          onDepartureChange={this.inboundDateChange}
          cabinClass={trip.cabinClass}
          offers={offers && offers[1]}
          altOffers={altOffers && altOffers[1]}
          className={css.FlightSearchResult}
          onFareChange={this.inboundOfferChange}
          selectedFare={inboundFare}
          contentService={contentService}
        />
      </div>
    );
  }
}
