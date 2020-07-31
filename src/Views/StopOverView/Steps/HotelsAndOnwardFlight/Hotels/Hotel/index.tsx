import React, { useMemo, useState } from 'react';

import css from './Hotel.module.css';
import { RoomOfferModel, HotelModel, getHotelRoomOfferChain } from '../../../../../../Models/HotelOfferModel';
import DateUtils from '../../../../../../DateUtils';
import Utils from '../../../../../../Utils';
import HotelInfoModal from './HotelInfoModal';

interface HotelProps {
  className?: string;
  hotel: HotelModel;
  checkIn: Date;
  checkOut: Date;
  occupants: number;
  roomOffer?: RoomOfferModel;
  onSelect: (roomOffer?: RoomOfferModel) => void;
  selected?: boolean;
}

export default function Hotel({
  className,
  selected,
  hotel,
  checkIn,
  checkOut,
  occupants,
  roomOffer,
  onSelect,
}: HotelProps): JSX.Element {
  const classList = [css.Hotel, className];

  const nextRoomOffer = roomOffer ?? hotel.rooms[0].offers[0];

  const room = useMemo(
    () => getHotelRoomOfferChain([hotel], nextRoomOffer)[1],
    [nextRoomOffer, hotel],
  );

  const roomType = useMemo(
    () => Utils.upperCaseFirst(room?.type.description.toLowerCase() ?? ''),
    [room],
  );

  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {showDetails && (
        <HotelInfoModal
          hotel={hotel}
          onClose={(): void => setShowDetails(false)}
        />
      )}
      <div className={classList.join(' ')} aria-selected={selected}>
        <div className={css.Image}>
          {hotel.recommended && (
            <div className={css.Recommended}>
              <span>Recommended</span>
            </div>
          )}

          <img
            src={hotel.images[0].thumb}
            alt={hotel.images[0].description}
          />
        </div>

        <div className={css.Info}>
          <div className={css.Details}>
            <h1>{hotel.name}</h1>

            <div className={css.Rating}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  className={rating <= hotel.rating ? css.Filled : undefined}
                  key={`rating-${rating}`}
                >
                  ★
                </span>
              ))}
            </div>

            <div className={css.CheckInCheckOut}>
              <span>{`Check-in: ${hotel.checkIn}`}</span>
              <span>{`Check-out: ${hotel.checkOut}`}</span>
            </div>
          </div>

          <div className={css.Pricing}>
            <strong>
              {hotel.free
                ? 'FREE'
                : `${nextRoomOffer.price.currency} ${
                  Utils.formatCurrency(nextRoomOffer.price.total)
                }`}
            </strong>

            <span>
              {`${DateUtils.getDaysDelta(checkIn, checkOut)} nights, ${occupants} ${
                occupants === 1 ? 'guest' : 'guests'
              }`}
            </span>

            <button
              type="button"
              onClick={(): void => setShowDetails(true)}
            >
              Hotel details
            </button>
          </div>

          <div className={css.RoomDetails}>
            <div className={css.RoomDescription}>
              <span>{roomType}</span>
            </div>

            <button
              type="button"
              onClick={(): void => onSelect(nextRoomOffer)}
              className={selected ? css.Selected : undefined}
            >
              {selected ? 'Deselect' : 'Select' }
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
