import React from 'react';

import css from './Flight.module.css';
import { FlightOfferModel, LegModel, FareModel } from '../../../../../../Models/FlightOfferModel';
import DateUtils from '../../../../../../DateUtils';
import Utils from '../../../../../../Utils';

interface FlightProps {
  originalFare: FareModel;
  className?: string;
  offer: FlightOfferModel;
  onSelect: (fare?: FareModel) => void;
  selected?: boolean;
}

export default function Flight({
  originalFare,
  className,
  onSelect,
  selected,
  offer,
}: FlightProps): JSX.Element {
  const classList = [css.Flight];

  if (className) {
    classList.push(className);
  }

  const abuDhabiLeg = offer.legs.find((leg) => leg.origin.code === 'AUH') as LegModel;
  const endLeg = offer.legs[offer.legs.length - 1];
  const tzDelta = DateUtils.getTimeZoneDeltaMs(
    abuDhabiLeg.origin.timeZone,
    endLeg.destination.timeZone,
  ) ?? 0;
  const travelTime = (
    ((endLeg.arrival.valueOf() - tzDelta) - abuDhabiLeg.departure.valueOf()) / 60000
  );

  const stops = offer.stops.slice(offer.stops.indexOf('AUH') + 1);
  const priceDelta = offer.fares[0].price.total - originalFare.price.total;

  return (
    <div className={classList.join(' ')} aria-selected={selected} role="option">
      <div className={css.Info}>
        <div className={css.Airport}>
          <strong>{DateUtils.getHHMM(abuDhabiLeg.departure)}</strong>
          <span>{`${abuDhabiLeg.origin.cityName} (${abuDhabiLeg.origin.code})`}</span>
        </div>

        <span className={css.Arrow} />

        <div className={css.Airport}>
          <strong>
            {DateUtils.getHHMM(endLeg.arrival)}

            <span>
              {DateUtils.getTimeZoneDelta(
                abuDhabiLeg.origin.timeZone,
                endLeg.destination.timeZone,
              )}
            </span>
          </strong>
          <span>
            {`${endLeg.destination.cityName} (${endLeg.destination.code})`}
          </span>
        </div>

        <div className={css.TravelTime}>
          <strong>{DateUtils.getDDHHMMFromMinutes(travelTime)}</strong>
          <span>Travel time</span>
        </div>

        <div className={css.Stops}>
          <strong>
            {stops.length === 0 ? 'Direct' : `${stops.length} Stop${
              stops.length === 1 ? '' : 's'
            }`}
          </strong>
          {stops.length > 0 && (<span>{stops.join(', ')}</span>)}
        </div>

        <button
          type="button"
          className={css.SelectOffer}
          onClick={(): void => onSelect(offer.fares[0])}
        >
          {`${originalFare.price.currency} ${priceDelta < 0 ? '-' : '+'}${
            Utils.formatCurrency(Math.abs(priceDelta))
          }`}
        </button>
      </div>
    </div>
  );
}
