import React from 'react';

import css from './FlightEntry.module.css';
import Collapsable from '../../../../../../Components/UI/Collapsable';
import FlightDetails from './Components/FlightDetails';
import { GroupedOfferModel } from '../../../../../../Models/FlightModel';
import Utils from '../../../../../../Utils';

interface FlightEntryProps {
  className?: string;
  data: GroupedOfferModel;
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

    return (
      <div className={classList.join(' ')}>
        <div className={css.OriginDestination}>
          <div className={css.Origin}>
            <strong>
              {Utils.getHourMinuteString(data.departure)}
            </strong>
            <span>{`${data.origin?.cityName} ${data.origin?.code}`}</span>
          </div>
          <span className={css.Arrow} />
          <div className={css.Destination}>
            <strong>
              {Utils.getHourMinuteString(data.arrival)}
            </strong>
            <span>{`${data.destination.cityName} ${data.destination.code}`}</span>
          </div>
        </div>
        <div className={css.TravelTime}>
          <strong>{Utils.getTimeDelta(data.departure, data.arrival)}</strong>
          <span>Travel time</span>
        </div>
        <div className={css.Stops}>
          <strong>{`${data.stops.length} Stop`}</strong>
          <span>
            {data.stops.join(', ')}
          </span>
        </div>
        <div className={css.Price}>
          {Object.keys(data.cabinClasses).map((cabinClass, idx) => (
            <button type="button" key={`cabin-class-${idx}`}>
              <strong>
                {`From ${
                  data.cabinClasses[cabinClass].startingFrom.currency
                } ${Utils.formatCurrency(data.cabinClasses[cabinClass].startingFrom.amount)}`}
              </strong>
              <span>{cabinClass}</span>
            </button>
          ))}
        </div>
        <div className={css.ShowDetails}>
          <button type="button" onClick={this.toggleDetails}>
            Show details
          </button>
        </div>
        <Collapsable collapsed={collapsed} className={css.FlightDetailsCollapsable}>
          <FlightDetails
            segments={data.segments}
            className={css.FlightDetails}
          />
        </Collapsable>
      </div>
    );
  }
}
