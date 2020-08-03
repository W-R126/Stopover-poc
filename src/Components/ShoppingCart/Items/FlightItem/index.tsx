import React from 'react';

import css from './FlightItem.module.css';
import flightIcon from '../../../../Assets/Images/flight.svg';
import shoppingCartCss from '../../ShoppingCart.module.css';
import { ShoppingCartItemProps } from '../..';
import ContentService from '../../../../Services/ContentService';
import { FareModel, LegModel } from '../../../../Models/FlightOfferModel';
import DateUtils from '../../../../DateUtils';
import Utils from '../../../../Utils';

interface FlightItemProps extends ShoppingCartItemProps<FareModel> {
  contentService: ContentService;
  legs?: LegModel[];
}

export default function FlightItem({
  item: fare,
  className,
  contentService,
  legs,
  detailed,
  style,
  currency,
  price,
}: FlightItemProps): JSX.Element {
  const startLeg = legs ? legs[0] : fare.legs[0];
  const endLeg = legs ? legs[legs.length - 1] : fare.legs[fare.legs.length - 1];

  if (detailed) {
    const nextLegs = legs ?? fare.legs;

    return (
      <div
        className={[css.FlightItemDetailed, shoppingCartCss.Item, className].join(' ')}
        style={style}
      >
        <strong className={css.Pricing}>
          {price === 0
            ? 'FREE'
            : `${currency} ${Utils.formatCurrency(price)}`}
        </strong>

        {nextLegs.map((leg, idx) => (
          <React.Fragment key={`leg-${idx}`}>
            <span className={css.Airport}>
              {`${leg.departure.toLocaleTimeString(
                contentService.locale,
                { hour: 'numeric', minute: 'numeric' },
              )} ${leg.origin.code}`}
            </span>

            <span className={css.TravelTime}>
              {`Travel time: ${DateUtils.getDDHHMMFromMinutes(leg.duration)}`}
            </span>

            <span className={css.Airport}>
              {`${leg.arrival.toLocaleTimeString(
                contentService.locale,
                { hour: 'numeric', minute: 'numeric' },
              )} ${leg.destination.code}`}
            </span>

            {idx !== nextLegs.length - 1 && (
              <span className={css.LayOver}>
                {`${DateUtils.getTimeDeltaFromMs(
                  nextLegs[idx + 1].departure.valueOf() - leg.arrival.valueOf(),
                )} layover · ${leg.destination.code}`}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className={[css.FlightItem, shoppingCartCss.Item, className].join(' ')}>
      <img src={flightIcon} alt="Flight" className={css.Icon} />

      <div className={css.Info}>
        <strong>
          {startLeg.departure.toLocaleDateString(
            contentService.locale,
            { month: 'long', year: 'numeric', day: 'numeric' },
          )}
        </strong>

        <span>{`${startLeg.origin.cityName} - ${endLeg.destination.cityName}`}</span>
      </div>
    </div>
  );
}
