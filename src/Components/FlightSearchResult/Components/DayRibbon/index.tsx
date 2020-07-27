import React from 'react';

import css from './DayRibbon.module.css';
import Utils from '../../../../Utils';
import DateUtils from '../../../../DateUtils';
import { AlternateFlightOfferModel } from '../../../../Models/FlightOfferModel';

interface DayRibbonProps {
  className?: string;
  altOffers: AlternateFlightOfferModel[];
  selectedDate: Date;
  onChange: (date: Date) => void;
  min: Date;
  max: Date;
}

export default function DayRibbon({
  className,
  altOffers,
  selectedDate,
  onChange,
  min,
  max,
}: DayRibbonProps): JSX.Element {
  const classList = [css.DayRibbon];

  if (className) {
    classList.push(className);
  }

  return (
    <div className={classList.join(' ')}>
      {altOffers.map((altOffer, idx) => {
        if (
          DateUtils.compareDates(altOffer.departure, min) === -1
          || DateUtils.compareDates(altOffer.departure, max) === 1
        ) {
          return null;
        }

        const selected = DateUtils.compareDatesSimple(selectedDate, altOffer.departure);

        return (
          <div
            className={css.Day}
            key={`day-${idx}`}
            aria-selected={selected}
            role="option"
            onClick={selected ? undefined : (): void => onChange(altOffer.departure)}
          >
            <strong>
              {`${altOffer.price.currency} ${Utils.formatCurrency(altOffer.price.total)}`}
            </strong>

            <span>
              {altOffer.departure.toLocaleDateString(
                'en-US',
                { weekday: 'short', day: 'numeric', month: 'short' },
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
