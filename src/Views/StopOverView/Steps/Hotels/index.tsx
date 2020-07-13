import React from 'react';
import css from './Hotels.module.css';
import NightSelector from './Components/NightSelector';
import { HotelSelection } from './Components/HotelSelection';
import { Flights } from './Components/Flights';
import LoadingSpinner from './Components/LoadingSpinner';

import { ConfirmStopOverResponse } from '../../../../Services/Responses/ConfirmStopOverResponse';
import ContentService from '../../../../Services/ContentService';
import { OfferModel } from '../../../../Models/OfferModel';
import AppState from '../../../../AppState';
import StopOverService from '../../../../Services/StopOverService';
import { TripModel } from '../../../../Models/TripModel';
import { StopOverModel } from '../../../../Models/StopOverModel';

interface PackageType {
  hotelCode: string;
  flightId: string;
  night: number;
}

interface HotelsState {
  loading: boolean;
  confirmStopOverResponse?: ConfirmStopOverResponse;
  stopoverDays: number[];
  packageInfo: PackageType;
  outboundOffer?: OfferModel;
  trip?: TripModel;
  stopOverOffers?: any;
  stopOverInfo?: StopOverModel;
}

interface HotelsProps {
  contentService: ContentService;
  stopOverService: StopOverService;
}

export default class Hotels extends React.Component<HotelsProps, HotelsState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: false,
      confirmStopOverResponse: undefined,
      stopoverDays: [],
      packageInfo: { hotelCode: '', flightId: '', night: -1 },
      outboundOffer: AppState.outboundOffer,
      trip: AppState.tripSearch,
      stopOverInfo: AppState.stopOverInfo,
    };
  }

  componentDidMount(): void {
    this.getStopOverOffers();
  }

  private async getStopOverOffers(nightValue?: number): Promise<void> {
    const { stopOverService } = this.props;
    const { outboundOffer, trip, stopOverInfo } = this.state;

    await new Promise((resolve) => this.setState({ loading: true }, resolve));

    if (!(outboundOffer && trip)) {
      return;
    }

    if (!stopOverInfo) {
      return;
    }

    const nextNightValue = nightValue === undefined ? stopOverInfo.days[0] : nightValue;

    const stopOverAccept = await stopOverService.acceptStopOver(
      outboundOffer.basketHash,
      stopOverInfo.airportCode,
      nextNightValue,
      trip.legs[0].outbound as Date,
      trip.legs[trip.legs.length - 1].outbound,
    );

    this.setState({
      loading: false,
      stopoverDays: stopOverInfo.days,
      confirmStopOverResponse: stopOverAccept,
      packageInfo: { hotelCode: '', flightId: '', night: nextNightValue },
    });
  }

  private async changeNight(selectedOne: number): Promise<void> {
    this.getStopOverOffers(selectedOne);
  }

  render(): JSX.Element {
    const {
      stopoverDays,
      loading,
      packageInfo,
      confirmStopOverResponse,
    } = this.state;

    const { contentService } = this.props;

    return (
      <div className={css.FullContainer}>
        <div className={css.Card}>
          <NightSelector
            selectedNight={packageInfo.night}
            changeNight={(selectedOne: number): void => {
              this.changeNight(selectedOne);
            }}
            stopoverDays={stopoverDays === undefined ? [] : stopoverDays}
          />

          <div className={css.InnerWrap}>
            <HotelSelection
              contentService={contentService}
              selectedNight={packageInfo.night}
              hotelAvailabilityInfos={confirmStopOverResponse?.hotelAvailabilityInfos}
              selectHotel={(hotelCode: string): void => {
                this.setState((previousState: HotelsState) => ({
                  packageInfo: {
                    hotelCode,
                    flightId: previousState.packageInfo.flightId,
                    night: previousState.packageInfo.night,
                  },
                }));
              }}
              selectedHotelCode={packageInfo.hotelCode}
            />

            <Flights
              contentService={contentService}
              airSearchResults={confirmStopOverResponse?.airSearchResults}
              selectFlight={(flightId: string): void => {
                this.setState((previousState: HotelsState) => ({
                  packageInfo: {
                    hotelCode: previousState.packageInfo.hotelCode,
                    night: previousState.packageInfo.night,
                    flightId,
                  },
                }));
              }}
              selectedFlightId={packageInfo.flightId}
            />
          </div>
        </div>

        <LoadingSpinner loading={loading} />
      </div>
    );
  }
}
