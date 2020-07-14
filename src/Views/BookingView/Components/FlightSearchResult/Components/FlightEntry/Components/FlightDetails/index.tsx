import React from 'react';

import css from './FlightDetails.module.css';
import tailIcon from '../../../../../../../../Assets/Images/tail.webp';
import { LegModel } from '../../../../../../../../Models/FlightOfferModel';
import DateUtils from '../../../../../../../../DateUtils';

interface FlightDetailsProps {
  className?: string;
  legs: LegModel[];
}

export default function FlightDetails({ className, legs }: FlightDetailsProps): JSX.Element {
  const classList = [css.FlightDetails];

  if (className) {
    classList.push(className);
  }

  return (
    <div className={classList.join(' ')}>
      {legs.map((leg, idx) => {
        const nextLeg = legs[idx + 1];

        return (
          <div className={css.Leg} key={`leg-${idx}`}>
            <div className={css.TailIcon}>
              <img src={tailIcon} alt="Tail" />
            </div>

            <span className={css.Dotted}>
              <span />
            </span>

            <span className={css.Location}>
              <span className={css.Time}>
                {DateUtils.getHourMinuteString(leg.departure)}
              </span>

              <span className={css.Airport}>
                {`${leg.origin.name} (${leg.origin.code})`}
              </span>
            </span>

            <span className={css.TravelTime}>
              {`Travel time: ${DateUtils.getDDHHMMFromMinutes(leg.duration)}`}
            </span>

            <span className={css.Location}>
              <span className={css.Time}>
                {DateUtils.getHourMinuteString(leg.arrival)}
              </span>

              <span className={css.Airport}>
                {`${leg.destination.name} (${leg.destination.code})`}
              </span>
            </span>

            <span className={css.Flight}>
              <span className={css.Company}>Etihad Airways</span>

              <span className={css.Tail}>
                {`${leg.flight.airlineCode} ${leg.flight.flightNumber}`}
              </span>

              <span className={css.FlightModel}>{leg.flight.equipment}</span>
            </span>

            {nextLeg && (
              <span className={css.Layover}>
                <span>
                  {`${DateUtils.getTimeDelta(leg.arrival, nextLeg.departure)} layover`}
                </span>

                <span>
                  {`${nextLeg.origin.cityName} (${nextLeg.origin.code})`}
                </span>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
