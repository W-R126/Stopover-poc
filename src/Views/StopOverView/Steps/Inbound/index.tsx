import React from 'react';
import PlaneImg from '../../../../Assets/Images/plane.svg';
import css from './Inbound.module.css';

import FlightSearchResult from '../../../../Components/FlightSearchResult';
import { FlightOfferModel, FareModel } from '../../../../Models/FlightOfferModel';
import { TripModel } from '../../../../Models/TripModel';

import AppState from '../../../../AppState';
import StopOverService from '../../../../Services/StopOverService';
import ContentService from '../../../../Services/ContentService';
import FlightOfferService from '../../../../Services/FlightOfferService';
import { AirportModel } from '../../../../Models/AirportModel';
import { RoomOfferModel } from '../../../../Models/HotelOfferModel';

interface InboundProps {
  className?: string;
  flightOfferService: FlightOfferService;
  stopOverService: StopOverService;
  contentService: ContentService;
  selectInbound: Function;
  isStopOver?: boolean;
}

interface InboundState {
  offers?: FlightOfferModel[];
  trip: TripModel;
  onwardFare: FareModel;
  roomOffer?: RoomOfferModel;
  inboundFare?: FareModel;
}

export default class Inbound extends React.Component<InboundProps, InboundState> {
  constructor(props: any) {
    super(props);
    this.state = {
      offers: undefined,
      inboundFare: AppState.inboundFare,
      onwardFare: AppState.onwardFare as FareModel,
      roomOffer: AppState.roomOffer,
      trip: AppState.tripSearch as TripModel,
    };

    this.inboundOfferChange = this.inboundOfferChange.bind(this);
  }

  componentDidMount(): void {
    this.getOffers();
  }

  private async getOffers(): Promise<void> {
    const { stopOverService } = this.props;
    const { onwardFare, roomOffer } = this.state;

    const offers = await stopOverService.selectOnwardFlightAndHotel(
      onwardFare.hashCode,
      roomOffer?.hashCode,
    );

    if (offers) {
      const nextOnwardFare = offers[0][0].fares[0];

      AppState.onwardFare = nextOnwardFare;

      this.setState({ onwardFare: nextOnwardFare });
    }

    this.setState({
      offers: offers ? offers[offers.length - 1] : [],
    });
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
      trip,
      inboundFare,
    } = this.state;

    const { departure, origin, destination } = trip.legs[1];

    return (
      <div className={[css.Inbound, className].join(' ')}>
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
          cabinClass={trip.cabinClass}
          offers={offers}
          className={css.FlightSearchResult}
          onFareChange={this.inboundOfferChange}
          selectedFare={inboundFare}
          contentService={contentService}
        />
      </div>
    );
  }
}
