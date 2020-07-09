import React from 'react';
import css from '../../Hotels.module.css';
import NightSelector from './Components/NightSelector';
import { HotelSelection } from './Components/HotelSelection';
import { Flights } from './Components/Flights';
// import StopOverService from '../../../../../../Services/StopOverService';
// import FlightService from '../../../../../../Services/FlightService';
import LoadingSpinner from '../LoadingSpinner';

import { ConfirmStopOverResponse } from '../../../../../../Services/Responses/ConfirmStopOverResponse';
import { callTestApis } from './test';

interface PackageType {
  hotelCode: string;
  flightId: string;
  night: number;
}
interface StopOverState {
  loading: boolean;
  confirmStopOverResponse?: ConfirmStopOverResponse;
  stopoverDays: number[];
  packageInfo: PackageType;
}

// interface StopOverProps {
//   stopOverService: StopOverService;
//   flightService: FlightService;
// }
export default class Stopover extends React.Component<{}, StopOverState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: false,
      confirmStopOverResponse: undefined,
      stopoverDays: [],
      packageInfo: { hotelCode: '', flightId: '', night: -1 },
    };
  }

  componentDidMount(): void {
    this.callTestApis(-1);
  }

  private callTestApis(nightValue: number): void {
    const updateApiData = (updatedOne: any): void => {
      let nightValueTemp = -1;
      if (nightValue > 0) nightValueTemp = nightValue;
      else nightValueTemp = updatedOne.stopoverDays.length > 0 ? updatedOne.stopoverDays[0] : -1;

      this.setState({
        stopoverDays: updatedOne.stopoverDays,
        confirmStopOverResponse: updatedOne.confirmStopOverResponse,
        loading: false,
        packageInfo: { hotelCode: '', flightId: '', night: nightValueTemp },
      });
    };
    this.setState({ loading: true });
    callTestApis(updateApiData, nightValue);
  }

  private async changeNight(selectedOne: number): Promise<void> {
    this.callTestApis(selectedOne);
  }

  render(): JSX.Element {
    const {
      stopoverDays,
      loading,
      packageInfo,
      confirmStopOverResponse,
    } = this.state;
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
              selectedNight={packageInfo.night}
              hotelAvailabilityInfos={confirmStopOverResponse?.hotelAvailabilityInfos}
              selectHotel={(hotelCode: string): void => {
                this.setState((previousState: StopOverState) => ({
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
              airSearchResults={confirmStopOverResponse?.airSearchResults}
              selectFlight={(flightId: string): void => {
                this.setState((previousState: StopOverState) => ({
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
