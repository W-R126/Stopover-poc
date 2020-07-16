import React from 'react';
import FlightOfferService from '../../Services/FlightOfferService';
import StopOverService from '../../Services/StopOverService';
import ContentService from '../../Services/ContentService';
import Inbound from '../StopOverView/Steps/Inbound';
import css from './SelectInbound.module.css';
import ShoppingCart from '../../Components/ShoppingCart';
import FlightItem from '../../Components/ShoppingCart/Items/FlightItem';
import { FareModel } from '../../Models/FlightOfferModel';
import AppState from '../../AppState';

interface SelectInboundProps {
  contentService: ContentService;
  flightOfferService: FlightOfferService;
  stopOverService: StopOverService;
}

interface SelectInboundState {
  inboundFare?: FareModel;
}

export default class SelectInbound extends React.Component<SelectInboundProps, SelectInboundState> {
  constructor(props: SelectInboundProps) {
    super(props);
    this.state = {
      inboundFare: AppState.inboundFare,
    };
    this.onSelectInbound = this.onSelectInbound.bind(this);
  }

  private onSelectInbound(selectedInboud?: FareModel): void {
    AppState.inboundFare = selectedInboud;
    this.setState({ inboundFare: selectedInboud });
  }

  render(): JSX.Element {
    const {
      flightOfferService,
      stopOverService,
      contentService,
    } = this.props;
    const { inboundFare } = this.state;

    return (
      <div className={css.InboundContainer}>
        <Inbound
          flightOfferService={flightOfferService}
          stopOverService={stopOverService}
          contentService={contentService}
          selectInbound={this.onSelectInbound}
        />
        <ShoppingCart currency={contentService.currency}>
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
