import React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

import commonCss from '../../common.module.css';
import css from './StopOverView.module.css';
import Button from '../../Components/UI/Button';
import Hotels from './Steps/Hotels';
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
import { HotelModel } from '../../Models/HotelModel';
import { FareModel } from '../../Models/FlightOfferModel';

interface StopOverProps extends RouteComponentProps<{ progressStep: StopOverProgressStepEnum }> {
  contentService: ContentService;
  stopOverService: StopOverService;
  flightOfferService: FlightOfferService;
}

interface StopOverState {
  outboundFare?: FareModel;
  startDate: Date;
  endDate: Date;
  selectedHotel?: HotelModel;
  inboundFare?: FareModel;
}

class StopOverView extends React.Component<StopOverProps, StopOverState> {
  constructor(props: StopOverProps) {
    super(props);

    this.state = {
      outboundFare: AppState.outboundFare,
      startDate: new Date(2020, 7, 5),
      endDate: new Date(2020, 7, 7),
      selectedHotel: AppState.selectedHotel,
      inboundFare: AppState.inboundFare,
    };

    this.onSelectHotel = this.onSelectHotel.bind(this);
  }

  private onSelectHotel(selectedHotel?: HotelModel): void {
    AppState.selectedHotel = selectedHotel;

    this.setState({ selectedHotel });
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
      startDate,
      endDate,
      selectedHotel,
    } = this.state;

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
            <Hotels
              contentService={contentService}
              stopOverService={stopOverService}
              onSelectHotel={this.onSelectHotel}
            />
          )}
          {progressStep === 'experiences' && (
            <Experiences
              startDate={startDate}
              endDate={endDate}
            />
          )}
          {progressStep === 'inbound' && (
            <Inbound
              flightOfferService={flightOfferService}
              stopOverService={stopOverService}
              contentService={contentService}
              isStopOver
            />
          )}
        </div>

        {
          (progressStep === 'hotels' || progressStep === 'experiences') && (
          <ShoppingCart currency={contentService.currency}>
            {
            outboundFare && (
            <FlightItem
              currency={outboundFare.price.currency}
              item={outboundFare}
              price={outboundFare.price.total}
              contentService={contentService}
            />
            )
          }
            {selectedHotel && (
            <HotelItem
              item={selectedHotel}
              contentService={contentService}
              currency={selectedHotel.hotelInfo.currencyCode ?? contentService.currency}
              price={
                selectedHotel.hotelRateInfo.rooms.room[0].ratePlans.ratePlan[0].rateInfo.netRate
              }
            />
            )}
          </ShoppingCart>
          )
        }
      </div>
    );
  }
}

export default withRouter(StopOverView);
