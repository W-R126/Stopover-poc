import React from 'react';
import FlightOfferService from '../../Services/FlightOfferService';
import StopOverService from '../../Services/StopOverService';
import ContentService from '../../Services/ContentService';
import Inbound from '../StopOverView/Steps/Inbound';
import css from './SelectInbound.module.css';

interface SelectInboundProps {
  contentService: ContentService;
  flightOfferService: FlightOfferService;
  stopOverService: StopOverService;
}

export default class SelectInbound extends React.Component<SelectInboundProps, {}> {
  constructor(props: SelectInboundProps) {
    super(props);
  }

  render(): JSX.Element {
    const {
      flightOfferService,
      stopOverService,
      contentService,
    } = this.props;
    return (
      <div className={css.InboundContainer}>
        <Inbound
          flightOfferService={flightOfferService}
          stopOverService={stopOverService}
          contentService={contentService}
        />
      </div>
    );
  }
}
