import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import css from './SelectInboundView.module.css';
import commonCss from '../../common.module.css';
import FlightOfferService from '../../Services/FlightOfferService';
import {
  FareModel,
  LegModel,
  FlightOfferModel,
  AlternateFlightOfferModel,
} from '../../Models/FlightOfferModel';
import { TripModel, copyTrip, isTripValid } from '../../Models/TripModel';
import AppState from '../../AppState';
import FlightSearchResult from '../../Components/FlightSearchResult';
import ContentService from '../../Services/ContentService';
import { AirportModel } from '../../Models/AirportModel';
import ShoppingCart from '../../Components/ShoppingCart';
import FlightItem from '../../Components/ShoppingCart/Items/FlightItem';

interface SelectInboundViewProps extends RouteComponentProps {
  flightOfferService: FlightOfferService;
  contentService: ContentService;
}

interface SelectInboundViewState {
  outboundFare: FareModel;
  inboundFare?: FareModel;
  trip: TripModel;
  offers?: FlightOfferModel[];
  altOffers?: AlternateFlightOfferModel[];
}

class SelectInboundView extends React.Component<
  SelectInboundViewProps,
  SelectInboundViewState
> {
  constructor(props: SelectInboundViewProps) {
    super(props);

    this.state = {
      outboundFare: AppState.outboundFare as FareModel,
      inboundFare: AppState.inboundFare,
      trip: AppState.tripSearch as TripModel,
      offers: undefined,
      altOffers: undefined,
    };

    this.goToDone = this.goToDone.bind(this);
    this.inboundChange = this.inboundChange.bind(this);
    this.departureChange = this.departureChange.bind(this);
  }

  componentDidMount(): void {
    const { trip } = this.state;

    this.getOffers(trip);
  }

  private async getOffers(trip: TripModel): Promise<void> {
    const { flightOfferService } = this.props;

    await new Promise((resolve) => this.setState(
      { offers: undefined, altOffers: undefined },
      resolve,
    ));

    const result = await flightOfferService.getOffers(
      trip.passengers,
      trip.legs.map((leg) => ({
        departure: leg.departure as Date,
        destinationCode: (leg.destination as AirportModel).code,
        originCode: (leg.origin as AirportModel).code,
      })),
      trip.cabinClass,
    );

    const offers = result?.offers ?? [[]];
    const altOffers = result?.altOffers ?? [[]];

    AppState.tripSearch = trip;

    this.setState({
      trip,
      offers: offers[offers.length - 1],
      altOffers: altOffers[altOffers.length - 1],
    });
  }

  private inboundChange(inboundFare?: FareModel): void {
    AppState.inboundFare = inboundFare;
    this.setState({
      inboundFare,
    });
  }

  private goToDone(): void {
    const { history } = this.props;

    history.push('/done');
  }

  private departureChange(departure: Date): void {
    const { trip } = this.state;
    const nextTrip = copyTrip(trip);

    nextTrip.legs[nextTrip.legs.length - 1].departure = departure;

    if (!isTripValid(nextTrip)) {
      return;
    }

    this.getOffers(nextTrip);
  }

  render(): JSX.Element {
    const { contentService } = this.props;
    const {
      trip,
      altOffers,
      offers,
      outboundFare,
      inboundFare,
    } = this.state;

    const leg = trip.legs[trip.legs.length - 1];

    const { destination, origin, departure } = leg as LegModel;

    return (
      <div className={css.SelectInboundView}>
        <div className={commonCss.ContentWrapper}>
          <h1 className={css.SelectFlightHeader}>Select inbound flight</h1>

          <FlightSearchResult
            contentService={contentService}
            destination={destination}
            origin={origin}
            onFareChange={this.inboundChange}
            selectedDepartureDate={departure}
            trip={trip}
            altOffers={altOffers}
            offers={offers}
            onDepartureChange={this.departureChange}
            selectedFare={inboundFare}
            cabinClass={trip.cabinClass}
          />
        </div>

        <ShoppingCart
          proceedLabel="Checkout"
          proceedAction={inboundFare && this.goToDone}
          currency={contentService.currency}
        >
          <FlightItem
            currency={outboundFare.price.currency}
            price={outboundFare.price.total}
            item={outboundFare}
            contentService={contentService}
          />

          {inboundFare && (
            <FlightItem
              currency={inboundFare.price.currency}
              price={inboundFare.price.total}
              item={inboundFare}
              contentService={contentService}
            />
          )}
        </ShoppingCart>
      </div>
    );
  }
}

export default withRouter(SelectInboundView);
