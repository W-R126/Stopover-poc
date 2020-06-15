import React from 'react';

import css from './FlightEntry.module.css';
import Collapsable from '../../../../../../Components/UI/Collapsable';
import FlightDetails from './Components/FlightDetails';
import { FlightModel } from '../../../../../../Models/FlightModel';
import Utils from '../../../../../../Utils';

interface FlightEntryProps {
  className?: string;
  data: FlightModel;
}

interface FlightEntryState {
  collapsed: boolean;
}

export default class FlightEntry extends React.Component<FlightEntryProps, FlightEntryState> {
  constructor(props: FlightEntryProps) {
    super(props);

    this.state = {
      collapsed: true,
    };

    this.toggleDetails = this.toggleDetails.bind(this);
  }

  private toggleDetails(): void {
    const { collapsed } = this.state;

    this.setState({ collapsed: !collapsed });
  }

  render(): JSX.Element {
    const { className, data } = this.props;
    const { collapsed } = this.state;

    const classList = [css.FlightEntry];

    if (className) {
      classList.push(className);
    }

    if (!collapsed) {
      classList.push(css.ShowingDetails);
    }

    const start = data.itineraryPart.segments[0];

    const end = data.itineraryPart.segments[data.itineraryPart.segments.length - 1];

    return (
      <div className={classList.join(' ')}>
        <div className={css.DepartureArrival}>
          <strong>
            {Utils.getHourMinuteString(start.departure)}
          </strong>
          <span>{`${start.origin?.cityName} ${start.origin?.code}`}</span>
        </div>
        <span className={css.Arrow} />
        <div className={css.DepartureArrival}>
          <strong>
            {Utils.getHourMinuteString(end.arrival)}
          </strong>
          <span>{`${end.destination?.cityName} ${end.destination?.code}`}</span>
        </div>
        <div className={css.TravelTime}>
          <strong>{Utils.getTimeDelta(start.departure, end.arrival)}</strong>
          <span>Travel time</span>
        </div>
        <div className={css.Stops}>
          <strong>{`${data.itineraryPart.segments.length - 1} Stop`}</strong>
          <span>
            {
              data.itineraryPart.segments.length > 1
                && data
                  .itineraryPart
                  .segments
                  .slice(0, data.itineraryPart.segments.length - 1)
                  .map((segment) => segment.destination?.code)
                  .join(', ')
            }
          </span>
        </div>
        <div className={css.Price}>
          <button type="button">
            <strong>From AED 895</strong>
            <span>Economy</span>
          </button>
        </div>
        <div className={css.Price}>
          <button type="button">
            <strong>From AED 895</strong>
            <span>Business</span>
          </button>
        </div>
        <div className={css.ShowDetails}>
          <button type="button" onClick={this.toggleDetails}>
            Show details
          </button>
        </div>
        <Collapsable collapsed={collapsed} className={css.FlightDetailsCollapsable}>
          <FlightDetails
            segments={data.itineraryPart.segments}
            className={css.FlightDetails}
          />
        </Collapsable>
      </div>
    );
  }
}
