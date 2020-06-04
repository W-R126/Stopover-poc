import React from 'react';

import './SearchDetails.css';
import switchDirection from '../../../../Assets/Images/switch.svg';
import arrowRight from '../../../../Assets/Images/arrow-right.svg';
import { TripSearchData } from '../../../../Components/TripSearch/TripSearchData';
import { TripType } from '../../../../Enums/TripType';

interface SearchDetailsProps {
  locale: string;
  data: TripSearchData;
  toggleEdit: () => void;
}

export default function SearchDetails(props: SearchDetailsProps): JSX.Element {
  const { data, locale, toggleEdit } = props;
  const { origin, destination } = data.originDestination;
  const { start, end } = data.dates;
  const { passengers } = data;

  const passengerCount = passengers.adults + passengers.children + passengers.infants;

  return (
    <div className="search-details">
      <span className="origin-destination">
        {origin && (
          <span className="origin">
            <strong>{origin.code}</strong>
            <span>{origin.cityName}</span>
          </span>
        )}
        <img
          src={data.tripType === TripType.return ? switchDirection : arrowRight}
          alt={data.tripType === TripType.return ? 'Round trip' : 'One way'}
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
          start && start.toLocaleDateString(locale, { month: 'long', day: 'numeric' })
        }${
          (data.tripType === TripType.return && end) ? ` to ${
            end.toLocaleDateString(locale, { month: 'long', day: 'numeric' })
          }` : ''
        }`}
      </span>
      <span className="passengers">
        {`${passengerCount} Passenger${passengerCount > 1 ? 's' : ''}`}
      </span>
      <span className="edit-search">
        <button type="button" onClick={toggleEdit}>
          Edit Search
        </button>
      </span>
    </div>
  );
}
