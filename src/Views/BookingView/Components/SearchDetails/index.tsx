import React from 'react';

import css from './SearchDetails.module.css';
import switchDirection from '../../../../Assets/Images/switch.svg';
import arrowRight from '../../../../Assets/Images/arrow-right.svg';
import { TripTypeEnum } from '../../../../Enums/TripTypeEnum';
import { TripModel } from '../../../../Models/TripModel';
import ContentService from '../../../../Services/ContentService';

interface SearchDetailsProps {
  contentService: ContentService;
  trip: TripModel;
  toggleEdit: () => void;
  className?: string;
}

export default function SearchDetails({
  trip,
  contentService,
  toggleEdit,
  className,
}: SearchDetailsProps): JSX.Element {
  const { passengers } = trip;
  const { origin, destination, departure } = trip.legs[0];

  let inbound;

  if (trip.type === TripTypeEnum.roundTrip) {
    inbound = trip.legs[1].departure;
  }

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
          src={trip.type === TripTypeEnum.roundTrip ? switchDirection : arrowRight}
          alt={trip.type === TripTypeEnum.roundTrip ? 'Round trip' : 'One way'}
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
          departure && departure.toLocaleDateString(
            contentService.locale,
            { month: 'long', day: 'numeric' },
          )
        }${
          inbound
            ? ` to ${inbound.toLocaleDateString(
              contentService.locale,
              { month: 'long', day: 'numeric' },
            )}`
            : ''
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
