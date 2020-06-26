import React from 'react';

import css from './SearchDetails.module.css';
import switchDirection from '../../../../Assets/Images/switch.svg';
import arrowRight from '../../../../Assets/Images/arrow-right.svg';
import { TripSearchData } from '../../../../Components/TripSearch/TripSearchData';
import { TripTypeEnum } from '../../../../Enums/TripTypeEnum';

interface SearchDetailsProps {
  locale: string;
  data: TripSearchData;
  toggleEdit: () => void;
  className?: string;
}

export default function SearchDetails({
  data,
  locale,
  toggleEdit,
  className,
}: SearchDetailsProps): JSX.Element {
  const { origin, destination } = data;
  const { outbound, inbound } = data;
  const { passengers } = data;

  const passengerCount = passengers.adults + passengers.children + passengers.infants;
  const classList = [css.SearchDetails];

  if (className) {
    classList.push(className);
  }

  return (
    <div className={classList.join(' ')}>
      <span className={css.OriginDestination}>
        {origin && (
          <span className="origin">
            <strong>{origin.code}</strong>
            <span>{origin.cityName}</span>
          </span>
        )}
        <img
          src={data.tripType === TripTypeEnum.return ? switchDirection : arrowRight}
          alt={data.tripType === TripTypeEnum.return ? 'Round trip' : 'One way'}
        />
        {destination && (
          <span className="destination">
            <strong>{destination.code}</strong>
            <span>{destination.cityName}</span>
          </span>
        )}
      </span>
      <span className="dates">
        {`${
          outbound && outbound.toLocaleDateString(locale, { month: 'long', day: 'numeric' })
        }${
          (data.tripType === TripTypeEnum.return && inbound) ? ` to ${
            inbound.toLocaleDateString(locale, { month: 'long', day: 'numeric' })
          }` : ''
        }`}
      </span>
      <span className="passengers">
        {`${passengerCount} Passenger${passengerCount > 1 ? 's' : ''}`}
      </span>
      <span className={css.EditSearch}>
        <button type="button" onClick={toggleEdit}>
          Edit Search
        </button>
      </span>
    </div>
  );
}
