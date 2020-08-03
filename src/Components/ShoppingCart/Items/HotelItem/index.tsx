import React from 'react';

import css from './HotelItem.module.css';
import hotelIcon from '../../../../Assets/Images/hotel-icon.svg';
import shoppingCartCss from '../../ShoppingCart.module.css';
import { ShoppingCartItemProps } from '../..';
import ContentService from '../../../../Services/ContentService';
import { RoomOfferModel } from '../../../../Models/HotelOfferModel';
import DateUtils from '../../../../DateUtils';
import Utils from '../../../../Utils';

interface HotelItemProps extends ShoppingCartItemProps<RoomOfferModel> {
  contentService: ContentService;
}

export default function HotelItem({
  item: roomOffer,
  className,
  contentService,
  detailed,
  style,
}: HotelItemProps): JSX.Element {
  if (detailed) {
    const includedMeals = Object.keys(roomOffer.includedMeals).map(
      (meal) => {
        if (roomOffer.includedMeals[meal as keyof typeof roomOffer.includedMeals]) {
          return Utils.upperCaseFirst(meal);
        }

        return undefined;
      },
    ).filter((meal) => meal !== undefined);

    return (
      <div
        className={[css.HotelItemDetailed, shoppingCartCss.Item, className].join(' ')}
        style={style}
      >
        <strong>{roomOffer.hotelName}</strong>
        <span>{`${DateUtils.getDaysDelta(roomOffer.checkIn, roomOffer.checkOut)} Nights`}</span>
        <span>{Utils.upperCaseFirst(roomOffer.title)}</span>
        {includedMeals.length > 0 && (
          <span className={css.IncludedMeals}>
            {`${includedMeals.join(', ')} included`}
          </span>
        )}
        <span className={css.CheckInOut}>
          {`Check-in: ${roomOffer.checkInTime}, ${roomOffer.checkIn.toLocaleDateString(
            contentService.locale,
            { month: 'long', day: 'numeric' },
          )}`}
        </span>
        <span className={css.CheckInOut}>
          {`Check-out: ${roomOffer.checkOutTime}, ${roomOffer.checkOut.toLocaleDateString(
            contentService.locale,
            { month: 'long', day: 'numeric' },
          )}`}
        </span>
      </div>
    );
  }

  return (
    <div className={[shoppingCartCss.Item, css.HotelItem, className].join(' ')}>
      <img src={hotelIcon} alt="Hotel" className={css.Icon} />

      <div className={css.Info}>
        <strong>
          {`${roomOffer.checkIn.toLocaleDateString(
            contentService.locale,
            { month: 'long', day: 'numeric' },
          )} - ${roomOffer.checkOut.toLocaleDateString(
            contentService.locale,
            { month: 'long', day: 'numeric' },
          )}`}
        </strong>

        {roomOffer.hotelName}
      </div>
    </div>
  );
}
