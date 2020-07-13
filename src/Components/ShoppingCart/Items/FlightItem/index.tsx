import React from 'react';

import css from './FlightItem.module.css';
import flightIcon from '../../../../Assets/Images/flight.svg';
import shoppingCartCss from '../../ShoppingCart.module.css';
import { OfferModel } from '../../../../Models/OfferModel';
import { ShoppingCartItemProps } from '../..';
import ContentService from '../../../../Services/ContentService';

interface FlightItemProps extends ShoppingCartItemProps<OfferModel> {
  contentService: ContentService;
}

export default function FlightItem({
  item: offer,
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
          {offer.departure.toLocaleDateString(
            contentService.locale,
            { month: 'long', year: 'numeric', day: 'numeric' },
          )}
        </strong>

        <span>{`${offer.origin.cityName} - ${offer.destination.cityName}`}</span>

        <button type="button">View details</button>
      </div>
    </div>
  );
}
