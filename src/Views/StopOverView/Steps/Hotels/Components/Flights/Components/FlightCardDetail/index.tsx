import React from 'react';
import { Segment } from '../../../../../../../../Services/Responses/ConfirmStopOverResponse';
import css from './FlightCardDetail.module.css';

interface FlightCardDetailProps {
  segment: Segment;
}

export default function FlightCardDetail({ segment }: FlightCardDetailProps): JSX.Element {
  return (
    <div className={css.Container}>
      <h4>Flight</h4>
      <div className={css.FlightContent}>
        <div className={css.Item}>
          <p>Flight Number</p>
          <p>{segment.flight.flightNumber}</p>
        </div>
        <div className={css.Item}>
          <p>Airline</p>
          <p>{segment.flight.airlineCode}</p>
        </div>
        <div className={css.Item}>
          <p>Departure Terminal</p>
          <p>{segment.flight.departureTerminal}</p>
        </div>
        <div className={css.Item}>
          <p>Arrival Terminal</p>
          <p>{segment.flight.arrivalTerminal}</p>
        </div>
      </div>

      <h4>Segment Offer Information </h4>
      <div className={css.OfferInformation}>
        <p className={css.OfferItem}>
          Flight Miles:
          <span>
            {segment.segmentOfferInformation.flightsMiles}
          </span>
        </p>
        <p className={css.OfferItem}>
          AwardFare:
          <span>
            {segment.segmentOfferInformation.awardFare ? 'Yes' : 'No'}
          </span>
        </p>
      </div>

    </div>
  );
}
