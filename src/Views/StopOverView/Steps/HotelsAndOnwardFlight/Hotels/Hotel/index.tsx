import React, { useMemo, useState } from 'react';

import css from './Hotel.module.css';
import { RoomOfferModel, HotelModel, getHotelRoomOfferChain } from '../../../../../../Models/HotelOfferModel';
import DateUtils from '../../../../../../DateUtils';
import Utils from '../../../../../../Utils';
import HotelInfoModal from './HotelInfoModal';
import Collapsable from '../../../../../../Components/UI/Collapsable';

interface HotelProps {
  className?: string;
  hotel: HotelModel;
  checkIn: Date;
  checkOut: Date;
  occupants: number;
  roomOffer?: RoomOfferModel;
  onSelect: (roomOffer?: RoomOfferModel) => void;
  onChangeRoomExpanded: (hotel?: HotelModel) => void;
  changeRoomExpanded: boolean;
  selected?: boolean;
}

export default function Hotel({
  className,
  selected,
  hotel,
  checkIn,
  checkOut,
  occupants,
  roomOffer: propRoomOffer,
  onSelect,
  onChangeRoomExpanded,
  changeRoomExpanded,
}: HotelProps): JSX.Element {
  const classList = [css.Hotel, className];

  let roomOffer = hotel.rooms[0].offers[0];

  if (selected && propRoomOffer) {
    roomOffer = propRoomOffer;
  }

  const room = useMemo(
    () => getHotelRoomOfferChain([hotel], roomOffer)[1],
    [roomOffer, hotel],
  );

  const roomType = useMemo(
    () => Utils.upperCaseFirst(room?.type.description ?? ''),
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

              <strong className={css.AverageReview}>
                {`Avg. review: ${(hotel.reviews.reduce(
                  (prev, curr) => prev + curr.rating,
                  0,
                ) / hotel.reviews.length).toFixed(2)}`}
              </strong>
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
                : `${roomOffer.price.currency} ${
                  Utils.formatCurrency(roomOffer.price.total)
                }`}
            </strong>

            <span>
              {`${DateUtils.getDaysDelta(checkIn, checkOut)} nights, ${occupants} ${
                occupants === 1 ? 'guest' : 'guests'
              }`}
            </span>

            <button
              className={css.BlueLink}
              type="button"
              onClick={(): void => setShowDetails(true)}
            >
              Hotel details
            </button>
          </div>

          <div className={css.RoomDetails}>
            <span>{roomType}</span>

            <button
              type="button"
              className={css.BlueLink}
              onClick={(): void => onChangeRoomExpanded(changeRoomExpanded ? undefined : hotel)}
            >
              Change room
            </button>
          </div>

          <button
            type="button"
            onClick={(): void => onSelect(roomOffer)}
            className={[css.SelectButton, selected ? css.Selected : undefined].join(' ')}
          >
            {selected ? 'Deselect' : 'Select' }
          </button>
        </div>

        <Collapsable collapsed={!changeRoomExpanded} className={css.Rooms}>
          {hotel.rooms.map((nextRoom, idx) => (
            <div key={`room-${idx}`} className={css.Room}>
              <span>
                {Utils.upperCaseFirst(nextRoom.type.description)}
              </span>

              <button
                className={[
                  css.SelectButton,
                  selected && nextRoom.offers.findIndex((o) => o.id === roomOffer?.id) !== -1
                    ? css.Selected
                    : undefined,
                ].join(' ')}
                type="button"
                onClick={(): void => {
                  if (
                    selected
                    && nextRoom.offers.findIndex((o) => o.id === roomOffer?.id) !== -1
                  ) {
                    return;
                  }

                  onSelect(nextRoom.offers[0]);
                }}
              >
                {hotel.free
                  ? 'FREE'
                  : `${nextRoom.offers[0].price.currency} ${
                    Utils.formatCurrency(nextRoom.offers[0].price.total)}`}
              </button>
            </div>
          ))}
        </Collapsable>
      </div>
    </>
  );
}
