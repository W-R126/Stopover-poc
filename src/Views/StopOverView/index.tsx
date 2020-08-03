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
import ExperienceService from '../../Services/ExperienceService';
import { ExperienceDateModel } from '../../Models/ExperienceDateModel';
import ExperienceItem from '../../Components/ShoppingCart/Items/ExperienceItem';
import { TripModel } from '../../Models/TripModel';
import { TripTypeEnum } from '../../Enums/TripTypeEnum';

interface StopOverProps extends RouteComponentProps<{ progressStep: StopOverProgressStepEnum }> {
  contentService: ContentService;
  stopOverService: StopOverService;
  experienceService: ExperienceService;
  flightOfferService: FlightOfferService;
}

interface StopOverState {
  outboundFare?: FareModel;
  roomOffer?: RoomOfferModel;
  experiences: ExperienceDateModel[];
  onwardFare?: FareModel;
  inboundFare?: FareModel;
  stopOverInfo?: StopOverModel;
  trip: TripModel;
}

class StopOverView extends React.Component<StopOverProps, StopOverState> {
  constructor(props: StopOverProps) {
    super(props);

    this.state = {
      outboundFare: AppState.outboundFare,
      roomOffer: AppState.roomOffer,
      experiences: AppState.experienceDates,
      onwardFare: AppState.onwardFare,
      inboundFare: AppState.inboundFare,
      stopOverInfo: AppState.stopOverInfo,
      trip: AppState.tripSearch as TripModel,
    };

    this.selectRoom = this.selectRoom.bind(this);
    this.selectInbound = this.selectInbound.bind(this);
    this.selectOnward = this.selectOnward.bind(this);
    this.experiencesChange = this.experiencesChange.bind(this);
    this.daysChange = this.daysChange.bind(this);
  }

  private daysChange(): void {
    this.selectRoom(undefined);
    this.selectOnward(undefined);
    this.experiencesChange([]);
    this.selectInbound(undefined);
  }

  private selectRoom(room?: RoomOfferModel): void {
    const { roomOffer } = this.state;

    let nextRoomOffer = room;

    if (nextRoomOffer?.id === roomOffer?.id) {
      nextRoomOffer = undefined;
    }

    AppState.roomOffer = nextRoomOffer;
    this.setState({ roomOffer: nextRoomOffer });
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

  private experiencesChange(experiences: ExperienceDateModel[]): void {
    AppState.experienceDates = experiences;
    this.setState({ experiences });
  }

  render(): JSX.Element {
    const {
      contentService,
      history,
      match: { params: { progressStep } },
      stopOverService,
      experienceService,
      flightOfferService,
    } = this.props;

    const {
      outboundFare,
      roomOffer,
      inboundFare,
      onwardFare,
      stopOverInfo,
      experiences,
      trip,
    } = this.state;

    const filteredExperiences = experiences.filter((exp) => exp.experiences.length > 0);

    if (!outboundFare) {
      return (<div>No outbound fare selected</div>);
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
        nextFunc = trip.type === TripTypeEnum.roundTrip
          ? (): void => history.push(`/stopover/${StopOverProgressStepEnum.inbound}`)
          : (): void => history.push('/done');
        hotelsClassList.push(css.Done);
        experiencesClassList.push(css.Active);
        break;
      case StopOverProgressStepEnum.inbound:
        backLink = (
          <Link to={`/stopover/${StopOverProgressStepEnum.experiences}`}>
            Back to experiences
          </Link>
        );
        nextFunc = (): void => history.push('/done');
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

              {trip.type === TripTypeEnum.roundTrip && (
                <span className={inboundClassList.join(' ')}>
                  <strong>
                    3
                  </strong>
                  <span>Return Flight</span>
                </span>
              )}
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
          {progressStep === StopOverProgressStepEnum.hotels && (
            <HotelsAndOnwardFlight
              originalFare={outboundFare}
              contentService={contentService}
              stopOverService={stopOverService}
              stopOverInfo={stopOverInfo}
              onwardFare={onwardFare}
              onSelectOnward={this.selectOnward}
              onSelectRoom={this.selectRoom}
              onDaysChange={this.daysChange}
              roomOffer={roomOffer}
            />
          )}

          {progressStep === StopOverProgressStepEnum.experiences && (
            <Experiences
              stopOverInfo={stopOverInfo as StopOverModel}
              startDate={roomOffer?.checkIn ?? new Date()}
              endDate={roomOffer?.checkOut ?? new Date()}
              experienceService={experienceService}
              onExperiencesChange={this.experiencesChange}
            />
          )}

          {progressStep === StopOverProgressStepEnum.inbound && (
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
          {outboundFare && (
            <FlightItem
              currency={outboundFare.price.currency}
              item={outboundFare}
              price={onwardFare ? onwardFare.price.total : outboundFare.price.total}
              contentService={contentService}
              legs={!onwardFare ? undefined : outboundFare.legs.slice(
                0,
                outboundFare.legs.findIndex((leg) => leg.origin.code === 'AUH'),
              )}
            />
          )}

          {roomOffer && (
            <HotelItem
              item={roomOffer}
              contentService={contentService}
              currency={roomOffer.price.currency}
              price={roomOffer.free ? 0 : roomOffer.price.total}
            />
          )}

          {filteredExperiences.length > 0 && (
            <ExperienceItem
              item={filteredExperiences}
              contentService={contentService}
              currency={contentService.currency}
              price={filteredExperiences.reduce(
                (prev, curr) => prev + curr.experiences.reduce(
                  (prev2, curr2) => prev2 + curr2.experience.startingFromPrice.total * curr2.guests,
                  0,
                ),
                0,
              )}
            />
          )}

          {onwardFare && (
            <FlightItem
              currency={onwardFare.price.currency}
              item={onwardFare}
              price={0}
              contentService={contentService}
              legs={onwardFare.legs.slice(
                onwardFare.legs.findIndex((leg) => leg.origin.code === 'AUH'),
              )}
            />
          )}

          {inboundFare && (
            <FlightItem
              currency={inboundFare.price.currency}
              item={inboundFare}
              price={inboundFare.price.total}
              contentService={contentService}
            />
          )}
        </ShoppingCart>
      </div>
    );
  }
}

export default withRouter(StopOverView);
