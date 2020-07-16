import React from 'react';
import css from './Hotels.module.css';
import NightSelector from './Components/NightSelector';
import { HotelSelection } from './Components/HotelSelection';
import { Flights } from './Components/Flights';
import LoadingSpinner from './Components/LoadingSpinner';

import { HotelAvailabilityInfos } from '../../../../Services/Responses/ConfirmStopOverResponse';
import ContentService from '../../../../Services/ContentService';
import AppState from '../../../../AppState';
import StopOverService from '../../../../Services/StopOverService';
import { TripModel } from '../../../../Models/TripModel';
import { StopOverModel } from '../../../../Models/StopOverModel';
import { PackageTypeModel } from '../../../../Models/PackageTypeModel';
import { HotelModel } from '../../../../Models/HotelModel';
import { FareModel, FlightOfferModel } from '../../../../Models/FlightOfferModel';

interface HotelsProps {
  contentService: ContentService;
  stopOverService: StopOverService;
  onSelectHotel: (selectedHotel?: HotelModel) => void;
  outboundFare: FareModel;
}

interface HotelsState {
  loading: boolean;
  flightOffers?: FlightOfferModel[];
  hotelOffers?: HotelAvailabilityInfos;
  stopoverDays: number[];
  packageInfo: PackageTypeModel;
  trip?: TripModel;
  stopOverOffers?: any;
  stopOverInfo?: StopOverModel;
}

export default class Hotels extends React.Component<HotelsProps, HotelsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      flightOffers: undefined,
      hotelOffers: undefined,
      stopoverDays: [],
      packageInfo: AppState.packageInfo ?? {
        hotelCode: undefined,
        night: undefined,
        fareHashCode: undefined,
        rateKey: undefined,
      },
      trip: AppState.tripSearch,
      stopOverInfo: AppState.stopOverInfo,
    };

    this.onSelectHotel = this.onSelectHotel.bind(this);
    this.onSelectFare = this.onSelectFare.bind(this);
  }

  componentDidMount(): void {
    this.getStopOverOffers();
  }

  private onSelectHotel(hotelCode: string, rateKey: string): void {
    const { onSelectHotel } = this.props;
    const { packageInfo, hotelOffers } = this.state;

    const checkIn = hotelOffers?.checkIn ?? '';
    const checkOut = hotelOffers?.checkOut ?? '';
    const hotel = hotelOffers?.hotelAvailInfo.find(
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
      night: packageInfo.night,
      fareHashCode: packageInfo.fareHashCode,
      rateKey,
      hotelCode,
    });
  }

  private onSelectFare(offer?: FlightOfferModel): void {
    const { packageInfo } = this.state;

    this.setPackageInfo({
      fareHashCode: offer?.fares[0].hashCode,
      night: packageInfo.night,
      hotelCode: packageInfo.hotelCode,
      rateKey: packageInfo.rateKey,
    });
  }

  private async getStopOverOffers(nightValue?: number): Promise<void> {
    const { stopOverService, outboundFare } = this.props;
    const {
      trip,
      stopOverInfo,
      packageInfo,
    } = this.state;

    await new Promise((resolve) => this.setState({ loading: true }, resolve));

    if (!(outboundFare && trip)) {
      return;
    }

    if (!stopOverInfo) {
      return;
    }

    const nextNightValue = nightValue === undefined ? stopOverInfo.days[0] : nightValue;

    const stopOverOffers = await stopOverService.getStopOverOffers(
      outboundFare.hashCode,
      stopOverInfo.airportCode,
      nextNightValue,
      outboundFare.departure,
      trip.legs[trip.legs.length - 1].departure,
    );

    if (!stopOverOffers) {
      return;
    }

    const { flightOffers, hotelAvailabilityInfos } = stopOverOffers;

    this.setPackageInfo({
      hotelCode: packageInfo.hotelCode,
      night: nextNightValue,
      fareHashCode: packageInfo.fareHashCode,
      rateKey: packageInfo.rateKey,
    });

    this.setState({
      loading: false,
      stopoverDays: stopOverInfo.days,
      flightOffers: flightOffers[0],
      hotelOffers: hotelAvailabilityInfos,
    });
  }

  private setPackageInfo(packageInfo: PackageTypeModel): void {
    AppState.packageInfo = packageInfo;

    this.setState({ packageInfo });
  }

  private async changeNights(value: number): Promise<void> {
    const { packageInfo } = this.state;

    this.setPackageInfo({
      hotelCode: undefined,
      night: packageInfo.night,
      fareHashCode: undefined,
      rateKey: undefined,
    });

    this.getStopOverOffers(value);
  }

  render(): JSX.Element {
    const {
      stopoverDays,
      loading,
      packageInfo,
      flightOffers,
      hotelOffers,
    } = this.state;

    const { contentService, outboundFare } = this.props;

    return (
      <div className={css.FullContainer}>
        <div className={css.Card}>
          <NightSelector
            selectedNight={packageInfo.night}
            changeNight={(selectedOne: number): void => {
              this.changeNights(selectedOne);
            }}
            stopoverDays={stopoverDays === undefined ? [] : stopoverDays}
          />

          <div className={css.InnerWrap}>
            <HotelSelection
              contentService={contentService}
              selectedNight={packageInfo.night}
              hotelAvailabilityInfos={hotelOffers}
              selectHotel={this.onSelectHotel}
              selectedHotelCode={packageInfo.hotelCode}
            />

            <Flights
              contentService={contentService}
              offers={flightOffers}
              onSelectOffer={this.onSelectFare}
              selectedOffer={flightOffers?.find(
                (fos) => fos.fares[0].hashCode === packageInfo.fareHashCode,
              )}
              outboundFare={outboundFare}
            />
          </div>
        </div>

        <LoadingSpinner loading={loading} />
      </div>
    );
  }
}
