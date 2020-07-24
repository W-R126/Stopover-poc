import React from 'react';
import PlanImg from '../../../../Assets/Images/plane.svg';
import css from './Inbound.module.css';

import FlightSearchResult from './Components/FlightSearchResult';
import { FlightOfferModel, FareModel } from '../../../../Models/FlightOfferModel';
import { TripModel, copyTrip } from '../../../../Models/TripModel';

import AppState from '../../../../AppState';
import StopOverService from '../../../../Services/StopOverService';
import ContentService from '../../../../Services/ContentService';
import FlightOfferService from '../../../../Services/FlightOfferService';
import { RoomOfferModel } from '../../../../Models/HotelOfferModel';

interface InboundProps {
  flightOfferService: FlightOfferService;
  stopOverService: StopOverService;
  contentService: ContentService;
  selectInbound: Function;
  isStopOver?: boolean;
}

interface InboundState {
  offers?: FlightOfferModel[][];
  trip: TripModel;
  onwardFare?: FareModel;
  hotelRoom?: RoomOfferModel;
  inboundFare?: FareModel;
}

export default class Inbound extends React.Component<InboundProps, InboundState> {
  private readonly flightSearchResultRef = React.createRef<FlightSearchResult>();

  constructor(props: any) {
    super(props);
    this.state = {
      offers: undefined,
      inboundFare: AppState.inboundFare,
      onwardFare: AppState.onwardFare,
      hotelRoom: AppState.hotelRoom,
      trip: AppState.tripSearch ? AppState.tripSearch : copyTrip(),
    };

    this.onInboundOfferChange = this.onInboundOfferChange.bind(this);
  }

  componentDidMount(): void {
    this.getOffers();
  }

  private onInboundOfferChange(inBoundOffer?: FareModel): void {
    const { selectInbound } = this.props;

    this.setState({
      inboundFare: inBoundOffer,
    });

    selectInbound(inBoundOffer);
  }

  private async getOffers(): Promise<void> {
    const { stopOverService } = this.props;
    const { onwardFare, hotelRoom } = this.state;

    const asd = await stopOverService.getFlights(
      onwardFare?.hashCode as number,
      hotelRoom?.hashCode as string,
    );

    console.log(asd);

    // const { flightOfferService, isStopOver } = this.props;
    // const { packageInfo } = this.state;
    // if (isStopOver
    //   && packageInfo
    //   && packageInfo.fareHashCode
    //   && packageInfo.rateKey) {
    //   const offerReq = flightOfferService.getInboundOffers(
    //     packageInfo.fareHashCode,
    //     packageInfo.rateKey,
    //   );
    //   const offerResult = await offerReq;
    //   this.setState({
    //     offers: offerResult.offers,
    //   });
    // } else {
    //   const resultData = await callTestApis();

    //   const offerReq = flightOfferService.getInboundOffersTest(
    //     resultData.selectOnwardFlightAndHotelResponse,
    //   );
    //   const offerResult = await offerReq;
    //   this.setState({
    //     offers: offerResult.offers,
    //   });
    // }
  }

  render(): JSX.Element {
    const { contentService } = this.props;
    const {
      offers,
      trip,
      inboundFare,
    } = this.state;

    const { departure, origin, destination } = trip.legs[1];

    return (
      <>
        <div className={css.InboundContainer}>
          <div className={css.Header}>
            <p>Finally, select your return flight.</p>
            <img src={PlanImg} alt="Plan" />
            <p>
              Select your return flight:
              <br />
              <strong>
                {`${origin?.cityName} to ${destination?.cityName} , `}
                {`${departure ? (departure).toLocaleDateString(
                  'en-US',
                  { day: 'numeric', month: 'long', year: 'numeric' },
                ) : ''}`}
              </strong>
            </p>
          </div>
          <FlightSearchResult
            trip={trip}
            cabinClass={trip.cabinClass}
            ref={this.flightSearchResultRef}
            offers={offers && offers[1]}
            className={css.FlightSearchResult}
            onFareChange={this.onInboundOfferChange}
            selectedFare={inboundFare}
            contentService={contentService}
          />
        </div>
      </>
    );
  }
}
