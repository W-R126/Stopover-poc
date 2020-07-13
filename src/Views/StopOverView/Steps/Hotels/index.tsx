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
import { PackageTypeModel } from '../../../../Models/PackageTypeModel';
import { HotelModel } from '../../../../Models/HotelModel';

interface HotelsProps {
  contentService: ContentService;
  stopOverService: StopOverService;
  onSelectHotel: (selectedHotel?: HotelModel) => void;
}

interface HotelsState {
  loading: boolean;
  confirmStopOverResponse?: ConfirmStopOverResponse;
  stopoverDays: number[];
  packageInfo: PackageTypeModel;
  outboundOffer?: OfferModel;
  trip?: TripModel;
  stopOverOffers?: any;
  stopOverInfo?: StopOverModel;
}

export default class Hotels extends React.Component<HotelsProps, HotelsState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: false,
      confirmStopOverResponse: undefined,
      stopoverDays: [],
      packageInfo: AppState.packageInfo ?? { hotelCode: '', flightId: '', night: -1 },
      outboundOffer: AppState.outboundOffer,
      trip: AppState.tripSearch,
      stopOverInfo: AppState.stopOverInfo,
    };

    this.onSelectHotel = this.onSelectHotel.bind(this);
    this.onSelectFlight = this.onSelectFlight.bind(this);
  }

  componentDidMount(): void {
    this.getStopOverOffers();
  }

  private onSelectHotel(hotelCode: string): void {
    const { onSelectHotel } = this.props;
    const { packageInfo, confirmStopOverResponse } = this.state;

    const checkIn = confirmStopOverResponse?.hotelAvailabilityInfos.checkIn ?? '';
    const checkOut = confirmStopOverResponse?.hotelAvailabilityInfos.checkOut ?? '';
    const hotel = confirmStopOverResponse?.hotelAvailabilityInfos.hotelAvailInfo.find(
      (nextHotel) => nextHotel.hotelInfo.hotelCode === hotelCode,
    );

    let selectedHotel: HotelModel | undefined;

    if (hotel) {
      selectedHotel = {
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        ...hotel,
      };
    }

    onSelectHotel(selectedHotel);

    this.setPackageInfo({
      flightId: packageInfo.flightId,
      night: packageInfo.night,
      hotelCode,
    });
  }

  private onSelectFlight(flightId: string): void {
    const { packageInfo } = this.state;

    this.setPackageInfo({
      flightId,
      night: packageInfo.night,
      hotelCode: packageInfo.hotelCode,
    });
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

    this.setPackageInfo({ hotelCode: '', flightId: '', night: nextNightValue });

    this.setState({
      loading: false,
      stopoverDays: stopOverInfo.days,
      confirmStopOverResponse: stopOverAccept,
    });
  }

  private setPackageInfo(packageInfo: PackageTypeModel): void {
    AppState.packageInfo = packageInfo;

    this.setState({ packageInfo });
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
              selectHotel={this.onSelectHotel}
              selectedHotelCode={packageInfo.hotelCode}
            />

            <Flights
              contentService={contentService}
              airSearchResults={confirmStopOverResponse?.airSearchResults}
              selectFlight={this.onSelectFlight}
              selectedFlightId={packageInfo.flightId}
            />
          </div>
        </div>

        <LoadingSpinner loading={loading} />
      </div>
    );
  }
}
