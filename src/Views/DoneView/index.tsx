import React from 'react';

import css from './DoneView.module.css';
import commonCss from '../../common.module.css';
import spinnerIcon from '../../Assets/Images/spinner.svg';
import FlightOfferService from '../../Services/FlightOfferService';
import { FareModel } from '../../Models/FlightOfferModel';
import AppState from '../../AppState';
import { ExperienceDateModel } from '../../Models/ExperienceDateModel';
import { RoomOfferModel } from '../../Models/HotelOfferModel';
import StopOverService from '../../Services/StopOverService';

interface DoneViewProps {
  flightOfferService: FlightOfferService;
  stopOverService: StopOverService;
}

interface DoneViewState {
  outboundFare: FareModel;
  inboundFare?: FareModel;
  experiences?: ExperienceDateModel[];
  roomOffer?: RoomOfferModel;
  onwardFare?: FareModel;
  result?: string;
}

export default class DoneView extends React.Component<DoneViewProps, DoneViewState> {
  constructor(props: DoneViewProps) {
    super(props);

    this.state = {
      outboundFare: AppState.outboundFare as FareModel,
      inboundFare: AppState.inboundFare,
      experiences: AppState.experienceDates,
      roomOffer: AppState.roomOffer,
      onwardFare: AppState.onwardFare,
    };
  }

  async componentDidMount(): Promise<void> {
    const { onwardFare } = this.state;

    if (onwardFare) {
      this.finishStopOver();
    } else {
      this.finishRegular();
    }
  }

  private async finishStopOver(): Promise<void> {
    const { stopOverService } = this.props;
    const { onwardFare, inboundFare, roomOffer } = this.state;

    const hashCodes = [(onwardFare as FareModel).hashCode];

    if (inboundFare) {
      hashCodes.push(inboundFare.hashCode);
    }

    const result = await stopOverService.selectFlights(
      hashCodes,
      roomOffer?.hashCode,
    );

    this.setState({ result: JSON.stringify(result ?? 'fail') });
  }

  private async finishRegular(): Promise<void> {
    const { outboundFare, inboundFare } = this.state;
    const { flightOfferService } = this.props;

    const hashCodes = [outboundFare.hashCode];

    if (inboundFare) {
      hashCodes.push(inboundFare.hashCode);
    }

    const result = await flightOfferService.selectOffer(hashCodes);

    this.setState({ result: JSON.stringify(result ?? 'fail') });
  }

  render(): JSX.Element {
    const { result } = this.state;

    return (
      <div className={css.DoneView}>
        <div className={commonCss.ContentWrapper}>
          And we are done!
          <br />
          <br />
          {result || (<img src={spinnerIcon} alt="Loading" />)}
        </div>
      </div>
    );
  }
}
