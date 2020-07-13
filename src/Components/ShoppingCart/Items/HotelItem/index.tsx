import React from 'react';

import css from './HotelItem.module.css';
import hotelIcon from '../../../../Assets/Images/hotel-bed.svg';
import shoppingCartCss from '../../ShoppingCart.module.css';
import { ShoppingCartItemProps } from '../..';
import ContentService from '../../../../Services/ContentService';
import { HotelModel } from '../../../../Models/HotelModel';

interface HotelItemProps extends ShoppingCartItemProps<HotelModel> {
  contentService: ContentService;
}

export default function HotelItem({
  item: hotel,
  className,
  contentService,
}: HotelItemProps): JSX.Element {
  const classList = [shoppingCartCss.Item, css.HotelItem];

  if (className) {
    classList.push(className);
  }

  return (
    <div className={classList.join(' ')}>
      <img src={hotelIcon} alt="Hotel" className={css.Icon} />

      <div className={css.Info}>
        <strong>
          {`${hotel.checkIn.toLocaleDateString(
            contentService.locale,
            { month: 'long', day: 'numeric' },
          )} - ${hotel.checkOut.toLocaleDateString(
            contentService.locale,
            { month: 'long', year: 'numeric', day: 'numeric' },
          )}`}
        </strong>

        {hotel.hotelInfo.hotelName}

        <button type="button">View details</button>
      </div>
    </div>
  );
}
