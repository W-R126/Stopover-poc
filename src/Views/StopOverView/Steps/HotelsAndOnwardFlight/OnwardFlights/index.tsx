import React, { useMemo } from 'react';

import css from './OnwardFlights.module.css';
import flightIcon from '../../../../../Assets/Images/flight.svg';
import { FlightOfferModel, LegModel, FareModel } from '../../../../../Models/FlightOfferModel';
import ContentService from '../../../../../Services/ContentService';
import Flight from './Flight';

interface OnwardFlightsProps {
  originalFare: FareModel;
  className?: string;
  offers: FlightOfferModel[];
  contentService: ContentService;
  onSelect: (fare?: FareModel) => void;
  onwardFare?: FareModel;
}

export default function OnwardFlights({
  className,
  offers,
  contentService,
  originalFare,
  onSelect,
  onwardFare,
}: OnwardFlightsProps): JSX.Element {
  const classList = [css.OnwardFlights];

  if (className) {
    classList.push(className);
  }

  const abuDhabiLeg = offers[0].legs.find((leg) => leg.origin.code === 'AUH') as LegModel;
  const endLeg = offers[0].legs[offers[0].legs.length - 1];

  const [recommended, ...restOffers] = offers;

  return (
    <div className={classList.join(' ')}>
      <div className={css.Header}>
        <img src={flightIcon} alt="Flight" className={css.Icon} />

        <h1>Select your onward flight</h1>
        <h2>
          {`${abuDhabiLeg.origin.cityName} to ${endLeg.destination.cityName}, ${
            abuDhabiLeg.departure.toLocaleDateString(
              contentService.locale,
              { day: 'numeric', month: 'long', year: 'numeric' },
            )
          }`}
        </h2>
      </div>

      <div className={css.Recommended}>
        <Flight
          offer={recommended}
          onSelect={onSelect}
          selected={onwardFare?.hashCode === recommended.fares[0].hashCode}
          originalFare={originalFare}
          className={css.FlightEntry}
        />
      </div>

      <div className={css.Offers}>
        {restOffers.map((offer, idx) => (
          <Flight
            offer={offer}
            onSelect={onSelect}
            key={`flight-offer-${idx}`}
            selected={onwardFare?.hashCode === offer.fares[0].hashCode}
            originalFare={originalFare}
            className={css.FlightEntry}
          />
        ))}
      </div>
    </div>
  );
}
