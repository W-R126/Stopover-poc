import React from 'react';

import css from './FlightItem.module.css';
import flightIcon from '../../../../Assets/Images/flight.svg';
import shoppingCartCss from '../../ShoppingCart.module.css';
import { ShoppingCartItemProps } from '../..';
import ContentService from '../../../../Services/ContentService';
import { FareModel, LegModel } from '../../../../Models/FlightOfferModel';

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
}: FlightItemProps): JSX.Element {
  const startLeg = legs ? legs[0] : fare.legs[0];
  const endLeg = legs ? legs[legs.length - 1] : fare.legs[fare.legs.length - 1];

  if (detailed) {
    return (
      <div
        className={[css.FlightItemDetailed, shoppingCartCss.Item, className].join(' ')}
        style={style}
      >
        Detailed flight!
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
