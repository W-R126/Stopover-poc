import React from 'react';

import css from './HotelItem.module.css';
import hotelIcon from '../../../../Assets/Images/hotel-icon.svg';
import shoppingCartCss from '../../ShoppingCart.module.css';
import { ShoppingCartItemProps } from '../..';
import ContentService from '../../../../Services/ContentService';
import { RoomOfferModel } from '../../../../Models/HotelOfferModel';

interface HotelItemProps extends ShoppingCartItemProps<RoomOfferModel> {
  contentService: ContentService;
}

export default function HotelItem({
  item: hotelRoom,
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
          {`${hotelRoom.checkIn.toLocaleDateString(
            contentService.locale,
            { month: 'long', day: 'numeric' },
          )} - ${hotelRoom.checkOut.toLocaleDateString(
            contentService.locale,
            { month: 'long', day: 'numeric' },
          )}`}
        </strong>

        {hotelRoom.hotelName}
      </div>
    </div>
  );
}
