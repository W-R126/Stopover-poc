import React from 'react';
import css from './FlightCard.module.css';
import { Segment, DifferenceFromLowestPrice } from '../../../../../../../../Services/Responses/ConfirmStopOverResponse';
import arrowRight from '../../../../../../../../Assets/Images/arrow-right.svg';
import FlightCardDetail from '../FlightCardDetail';
import DateUtils from '../../../../../../../../DateUtils';

type FlightCardProps = {
  segment: Segment;
  selectFlight: Function;
  selectedFlightId: string;
  differenceFromLowestPrice?: DifferenceFromLowestPrice;
}

type FlightCardState = {
  isShowDetail: boolean;
}

export default class FlightCard extends React.Component<FlightCardProps, FlightCardState> {
  constructor(props: FlightCardProps) {
    super(props);
    this.state = { isShowDetail: false };
    this.showFlightDetail = this.showFlightDetail.bind(this);
  }

  private getFormattedDuaration(duarationValue: number | undefined): string {
    if (duarationValue === undefined) { return ''; }
    const hValue = duarationValue / 60;
    const mValue = duarationValue % 60;
    return `${hValue >= 1 ? `${Math.floor(hValue)} h` : ''} ${mValue > 0 ? `${mValue} m` : ''}`;
  }

  private getStopsStr(): string {
    const { segment } = this.props;
    const { stopAirports } = segment.flight;
    if (stopAirports.length === 0) { return 'Direct'; }
    return stopAirports.toString();
  }

  private getDetalStr(): string {
    const { differenceFromLowestPrice } = this.props;
    if (differenceFromLowestPrice === undefined) {
      return '+ AED 0';
    }

    const deltaValue = differenceFromLowestPrice.alternatives[0][0].amount;
    if (deltaValue > 0) return `AED + ${deltaValue}`;
    if (deltaValue < 0) return `AED - ${deltaValue}`;

    return '+AED 0';
  }

  private showFlightDetail(): void {
    this.setState((previousState: FlightCardState) => ({
      isShowDetail: !previousState.isShowDetail,
    }));
  }

  render(): JSX.Element {
    const { segment, selectFlight, selectedFlightId } = this.props;
    const { isShowDetail } = this.state;
    return (
      <div
        className={
          `${css.FlightCardItem} ${selectedFlightId === segment['@id'] ? css.Selected : ''}`
        }
      >
        <div
          className={css.MainContent}
          onClick={this.showFlightDetail}
          role="button"
        >
          <div className={css.InnerItem}>
            <h4 className={css.Time}>
              {DateUtils.getHourMinuteString(new Date(segment.departure))}
            </h4>
            <p className={css.State}>{segment.origin}</p>
          </div>
          <div className={css.ArrowRight}>
            <img src={arrowRight} alt="Flight Right Arrow" />
          </div>
          <div className={css.InnerItem}>
            <h4 className={css.Time}>
              {DateUtils.getHourMinuteString(new Date(segment.arrival))}
            </h4>
            <p className={css.State}>{segment.destination}</p>
          </div>
          <div className={css.InnerItem}>
            <div className={css.Content}>
              <h4 className={css.TravelTime}>{this.getFormattedDuaration(segment.duration)}</h4>
              <p className={css.TravelTimeText}>Travel time</p>
            </div>
          </div>
          <div className={css.InnerItem}>
            <div className={css.Content}>
              <h4 className={css.TravelTime}>{this.getStopsStr()}</h4>
            </div>
          </div>
          <div className={css.InnerItem}>
            <div className={css.Content}>
              <h4 className={css.Delta}>{this.getDetalStr()}</h4>
            </div>
          </div>
          <button
            className={
            `${css.AddButton} ${selectedFlightId === segment['@id'] ? css.Selected : ''}`
          }
            onClick={(e): void => {
              e.preventDefault();
              e.stopPropagation();
              selectFlight(segment['@id']);
            }}
            type="button"
          >
            {selectedFlightId === segment['@id'] ? 'Selected' : 'Select'}
          </button>
          {isShowDetail ? <span className={css.AngleUp} /> : <span className={css.AngleDown} />}
        </div>
        {isShowDetail
        && <FlightCardDetail segment={segment} />}
      </div>
    );
  }
}
