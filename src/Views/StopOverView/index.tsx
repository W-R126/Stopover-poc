import React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

import commonCss from '../../common.module.css';
import css from './StopOverView.module.css';
import Button from '../../Components/UI/Button';
import HotelsAndOnwardFlight from './Steps/HotelsAndOnwardFlight';
import Experiences from './Steps/Experiences';
import Inbound from './Steps/Inbound';
import ShoppingCart from '../../Components/ShoppingCart';
import { StopOverProgressStepEnum } from '../../Enums/StopOverProgressStepEnum';
import ContentService from '../../Services/ContentService';
import FlightItem from '../../Components/ShoppingCart/Items/FlightItem';
import AppState from '../../AppState';
import StopOverService from '../../Services/StopOverService';
import FlightOfferService from '../../Services/FlightOfferService';
import HotelItem from '../../Components/ShoppingCart/Items/HotelItem';
import { FareModel } from '../../Models/FlightOfferModel';
import { RoomOfferModel } from '../../Models/HotelOfferModel';
import { StopOverModel } from '../../Models/StopOverModel';

interface StopOverProps extends RouteComponentProps<{ progressStep: StopOverProgressStepEnum }> {
  contentService: ContentService;
  stopOverService: StopOverService;
  flightOfferService: FlightOfferService;
}

interface StopOverState {
  outboundFare?: FareModel;
  hotelRoom?: RoomOfferModel;
  onwardFare?: FareModel;
  inboundFare?: FareModel;
  stopOverInfo?: StopOverModel;
}

class StopOverView extends React.Component<StopOverProps, StopOverState> {
  constructor(props: StopOverProps) {
    super(props);

    this.state = {
      outboundFare: AppState.outboundFare,
      hotelRoom: AppState.hotelRoom,
      onwardFare: AppState.onwardFare,
      inboundFare: AppState.inboundFare,
      stopOverInfo: AppState.stopOverInfo,
    };

    this.selectRoom = this.selectRoom.bind(this);
    this.selectInbound = this.selectInbound.bind(this);
    this.selectOnward = this.selectOnward.bind(this);
  }

  private selectRoom(room?: RoomOfferModel): void {
    const { hotelRoom } = this.state;

    let nextHotelRoom = room;

    const nextHash = nextHotelRoom?.hashCode.substr(0, 91);
    const prevHash = hotelRoom?.hashCode.substr(0, 91);

    if (nextHash === prevHash) {
      nextHotelRoom = undefined;
    }

    AppState.hotelRoom = nextHotelRoom;
    this.setState({ hotelRoom: nextHotelRoom });
  }

  private selectOnward(fare?: FareModel): void {
    const { onwardFare } = this.state;

    let nextOnwardFare = fare;

    if (nextOnwardFare?.hashCode === onwardFare?.hashCode) {
      nextOnwardFare = undefined;
    }

    AppState.onwardFare = nextOnwardFare;
    this.setState({ onwardFare: nextOnwardFare });
  }

  private selectInbound(fare?: FareModel): void {
    const { inboundFare } = this.state;

    let nextInboundFare = fare;

    if (nextInboundFare?.hashCode === inboundFare?.hashCode) {
      nextInboundFare = undefined;
    }

    AppState.inboundFare = nextInboundFare;
    this.setState({ inboundFare: nextInboundFare });
  }

  render(): JSX.Element {
    const {
      contentService,
      history,
      match: { params: { progressStep } },
      stopOverService,
      flightOfferService,
    } = this.props;

    const {
      outboundFare,
      hotelRoom,
      inboundFare,
      onwardFare,
      stopOverInfo,
    } = this.state;

    if (!outboundFare) {
      return (<div>No outbound fare selected</div>); // TODO: Something pretty
    }

    const hotelsClassList = [css.Step];
    const experiencesClassList = [css.Step];
    const inboundClassList = [css.Step];
    let nextFunc;
    let backLink;

    switch (progressStep) {
      case StopOverProgressStepEnum.hotels:
        hotelsClassList.push(css.Active);
        nextFunc = (): void => history.push(`/stopover/${StopOverProgressStepEnum.experiences}`);
        break;
      case StopOverProgressStepEnum.experiences:
        backLink = (
          <Link to={`/stopover/${StopOverProgressStepEnum.hotels}`}>
            Back to hotels and onward flight
          </Link>
        );
        nextFunc = (): void => history.push(`/stopover/${StopOverProgressStepEnum.inbound}`);
        hotelsClassList.push(css.Done);
        experiencesClassList.push(css.Active);
        break;
      case StopOverProgressStepEnum.inbound:
        backLink = (
          <Link to={`/stopover/${StopOverProgressStepEnum.experiences}`}>
            Back to experiences
          </Link>
        );
        hotelsClassList.push(css.Done);
        experiencesClassList.push(css.Done);
        inboundClassList.push(css.Active);
        break;
      default:
        break;
    }

    return (
      <div className={css.StopOverView}>
        <div className={css.Progress}>
          <div className={`${commonCss.ContentWrapper} ${css.ContentWrapper}`}>
            <span className={css.NavigateBack}>
              {backLink}
            </span>

            <div className={css.StepContainer}>
              <span className={hotelsClassList.join(' ')}>
                <strong>
                  1
                </strong>
                <span>Hotel + Onward Flight</span>
              </span>

              <span className={experiencesClassList.join(' ')}>
                <strong>
                  2
                </strong>
                <span>Experiences</span>
              </span>

              <span className={inboundClassList.join(' ')}>
                <strong>
                  3
                </strong>
                <span>Return Flight</span>
              </span>
            </div>

            {nextFunc && (
              <Button
                type="primary"
                className={css.NavigateForward}
                onClick={nextFunc}
              >
                Next
              </Button>
            )}
          </div>
        </div>

        <div className={`${css.ContentWrapper} ${commonCss.ContentWrapper}`}>
          {progressStep === 'hotels' && (
            <HotelsAndOnwardFlight
              originalFare={outboundFare}
              contentService={contentService}
              stopOverService={stopOverService}
              stopOverInfo={stopOverInfo}
              onwardFare={onwardFare}
              onSelectOnward={this.selectOnward}
              onSelectRoom={this.selectRoom}
              hotelRoom={hotelRoom}
            />
          )}
          {progressStep === 'experiences' && (
            <Experiences
              startDate={hotelRoom?.checkIn ?? new Date()}
              endDate={hotelRoom?.checkOut ?? new Date()}
            />
          )}
          {progressStep === 'inbound' && (
            <Inbound
              flightOfferService={flightOfferService}
              stopOverService={stopOverService}
              contentService={contentService}
              selectInbound={this.selectInbound}
              isStopOver
            />
          )}
        </div>

        <ShoppingCart currency={contentService.currency}>
          {
            outboundFare && (
              <FlightItem
                currency={outboundFare.price.currency}
                item={outboundFare}
                price={onwardFare ? 0 : outboundFare.price.total}
                contentService={contentService}
                legs={!onwardFare ? undefined : outboundFare.legs.slice(
                  0,
                  outboundFare.legs.findIndex((leg) => leg.origin.code === 'AUH'),
                )}
              />
            )
          }
          {hotelRoom && (
            <HotelItem
              item={hotelRoom}
              contentService={contentService}
              currency={hotelRoom.price.currency}
              price={hotelRoom.price.total}
            />
          )}
          {
            onwardFare && (
              <FlightItem
                currency={onwardFare.price.currency}
                item={onwardFare}
                price={onwardFare.price.total}
                contentService={contentService}
                legs={onwardFare.legs.slice(
                  onwardFare.legs.findIndex((leg) => leg.origin.code === 'AUH'),
                )}
              />
            )
          }
          {
            inboundFare && (
              <FlightItem
                currency={inboundFare.price.currency}
                item={inboundFare}
                price={inboundFare.price.total}
                contentService={contentService}
              />
            )
          }
        </ShoppingCart>
      </div>
    );
  }
}

export default withRouter(StopOverView);
