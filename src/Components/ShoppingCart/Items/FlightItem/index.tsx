import React from 'react';

import css from './FlightItem.module.css';
import flightIcon from '../../../../Assets/Images/flight.svg';
import shoppingCartCss from '../../ShoppingCart.module.css';
import { ShoppingCartItemProps } from '../..';
import ContentService from '../../../../Services/ContentService';
import { FareModel } from '../../../../Models/FlightOfferModel';

interface FlightItemProps extends ShoppingCartItemProps<FareModel> {
  contentService: ContentService;
}

export default function FlightItem({
  item: fare,
  className,
  contentService,
}: FlightItemProps): JSX.Element {
  const classList = [css.FlightItem, shoppingCartCss.Item];

  if (className) {
    classList.push(className);
  }

  return (
    <div className={classList.join(' ')}>
      <img src={flightIcon} alt="Flight" className={css.Icon} />

      <div className={css.Info}>
        <strong>
          {fare.departure.toLocaleDateString(
            contentService.locale,
            { month: 'long', year: 'numeric', day: 'numeric' },
          )}
        </strong>

        <span>{`${fare.origin.cityName} - ${fare.destination.cityName}`}</span>

        <button type="button">View details</button>
      </div>
    </div>
  );
}
