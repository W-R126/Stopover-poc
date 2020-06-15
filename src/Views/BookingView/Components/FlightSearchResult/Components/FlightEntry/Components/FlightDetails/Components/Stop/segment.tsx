import React from 'react';

import css from './Segment.module.css';
import tailIcon from '../../../../../../../../../../Assets/Images/tail.webp';
import { SegmentModel } from '../../../../../../../../../../Models/FlightModel';
import Utils from '../../../../../../../../../../Utils';

interface SegmentProps {
  className?: string;
  segment: SegmentModel;
  layoverSegment?: SegmentModel;
}

export default function Segment({
  className,
  segment,
  layoverSegment,
}: SegmentProps): JSX.Element {
  const classList = [css.Segment];

  if (className) {
    classList.push(className);
  }

  return (
    <div className={classList.join(' ')}>
      <div className={css.TailIcon}>
        <img src={tailIcon} alt="Tail" />
      </div>
      <span className={css.Dotted}>
        <span />
      </span>
      <span className={css.Location}>
        <span className={css.Time}>{Utils.getHourMinuteString(segment.departure)}</span>
        <span className={css.Airport}>
          {`${segment.origin?.name} (${segment.origin?.code})`}
        </span>
      </span>
      <span className={css.TravelTime}>
        {`Travel time: ${Utils.getTimeDelta(segment.departure, segment.arrival)}`}
      </span>
      <span className={css.Location}>
        <span className={css.Time}>{Utils.getHourMinuteString(segment.arrival)}</span>
        <span className={css.Airport}>
          {`${segment.destination?.name} (${segment.destination?.code})`}
        </span>
      </span>
      <span className={css.Flight}>
        <span className={css.Company}>Etihad Airways</span>
        <span className={css.Tail}>
          {`${segment.flight.airlineCode} ${segment.flight.flightNumber}`}
        </span>
        <span className={css.FlightModel}>Airbus A380</span>
      </span>
      {layoverSegment && (
        <span className={css.Layover}>
          <span>
            {`${Utils.getTimeDelta(segment.arrival, layoverSegment.departure)} layover`}
          </span>
          <span>
            {`${layoverSegment.origin?.cityName} (${layoverSegment.origin?.code})`}
          </span>
        </span>
      )}
    </div>
  );
}
