import React from 'react';
import PlanImg from '../../../../Assets/Images/plane.svg';
import css from './Inbound.module.css';

import FlightSearchResult from './Components/FlightSearchResult';
import { FlightOfferModel, FareModel } from '../../../../Models/FlightOfferModel';
import { TripModel, copyTrip } from '../../../../Models/TripModel';
import { PackageTypeModel } from '../../../../Models/PackageTypeModel';

import AppState from '../../../../AppState';
import StopOverService from '../../../../Services/StopOverService';
import ContentService from '../../../../Services/ContentService';
import { callTestApis } from './test';
import FlightOfferService from '../../../../Services/FlightOfferService';

interface InboundState {
  offers?: FlightOfferModel[][];
  packageInfo?: PackageTypeModel;
  trip: TripModel;
  inboundFare?: FareModel;
}

interface InboundProps {
  flightOfferService: FlightOfferService;
  stopOverService: StopOverService;
  contentService: ContentService;
  selectInbound: Function;
  isStopOver?: boolean;
}
export default class Inbound extends React.Component<InboundProps, InboundState> {
  private readonly flightSearchResultRef = React.createRef<FlightSearchResult>();

  constructor(props: any) {
    super(props);
    this.state = {
      offers: undefined,
      packageInfo: AppState.packageInfo,
      inboundFare: AppState.inboundFare,
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
    const { flightOfferService, isStopOver } = this.props;
    const { packageInfo } = this.state;
    if (isStopOver
      && packageInfo
      && packageInfo.fareHashCode
      && packageInfo.rateKey) {
      const offerReq = flightOfferService.getInboundOffers(
        packageInfo.fareHashCode,
        packageInfo.rateKey,
      );
      const offerResult = await offerReq;
      this.setState({
        offers: offerResult.offers,
      });
    } else {
      const resultData = await callTestApis();

      const offerReq = flightOfferService.getInboundOffersTest(
        resultData.selectOnwardFlightAndHotelResponse,
      );
      const offerResult = await offerReq;
      this.setState({
        offers: offerResult.offers,
      });
    }
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
