import React from 'react';

import css from './FlightDetails.module.css';
import Segment from './Components/Stop/segment';
import { SegmentModel } from '../../../../../../../../Models/FlightModel';

interface FlightDetailsProps {
  className?: string;
  segments: SegmentModel[];
}

export default function FlightDetails({ className, segments }: FlightDetailsProps): JSX.Element {
  const classList = [css.FlightDetails];

  if (className) {
    classList.push(className);
  }

  return (
    <div className={classList.join(' ')}>
      {segments.map((segment, idx) => (
        <React.Fragment key={`segment-${idx}`}>
          <Segment
            segment={segment}
            className={css.Segment}
            layoverSegment={segments.length - 1 !== idx
              ? (
                segments[idx + 1]
              )
              : undefined}
          />
        </React.Fragment>
      ))}
    </div>
  );
}
