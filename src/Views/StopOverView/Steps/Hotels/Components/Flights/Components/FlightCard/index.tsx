import React from 'react';
import css from './FlightCard.module.css';
import arrowRight from '../../../../../../../../Assets/Images/arrow-right.svg';
import DateUtils from '../../../../../../../../DateUtils';
import { FlightOfferModel, FareModel } from '../../../../../../../../Models/FlightOfferModel';
import Utils from '../../../../../../../../Utils';

type FlightCardProps = {
  offer: FlightOfferModel;
  outboundFare: FareModel;
  selected: boolean;
  onSelect: (offer?: FlightOfferModel) => void;
}

export default class FlightCard extends React.Component<FlightCardProps> {
  private getStopsStr(): string {
    const { offer } = this.props;
    const abuDhabiOutboundIdx = offer.fares.findIndex((fare) => fare.origin.code === 'AUH');
    const fareCount = offer.fares.slice(abuDhabiOutboundIdx).length;

    if (fareCount === 1) {
      return 'Direct';
    }

    return offer.stops.slice(abuDhabiOutboundIdx + 1).join(', ');
  }

  private getPriceDelta(): string {
    const { outboundFare, offer } = this.props;

    const { price } = offer.fares[0];
    const priceDelta = price.total - outboundFare.price.total;

    return `${priceDelta < 0 ? '-' : '+'} ${price.currency} ${
      Utils.formatCurrency(Math.abs(priceDelta))
    }`;
  }

  render(): JSX.Element {
    const { offer, onSelect, selected } = this.props;

    const classList = [css.FlightCardItem];

    if (selected) {
      classList.push(css.Selected);
    }

    const onwardLegs = offer.legs.slice(offer.legs.findIndex((leg) => leg.origin.code === 'AUH'));
    const startLeg = onwardLegs[0];
    const endLeg = onwardLegs[onwardLegs.length - 1];

    return (
      <div
        onClick={(): void => onSelect(selected ? undefined : offer)}
        className={classList.join(' ')}
        role="option"
        aria-selected={selected}
      >
        <div className={css.Airport}>
          <h4>{DateUtils.getHourMinuteString(new Date(startLeg.departure))}</h4>
          <span>{`${startLeg.origin.cityName} (${startLeg.origin.code})`}</span>
        </div>

        <div className={css.ArrowRight}>
          <img src={arrowRight} alt="Flight Right Arrow" />
        </div>

        <div className={css.Airport}>
          <h4>
            {DateUtils.getHourMinuteString(new Date(endLeg.arrival))}
            <span>
              {DateUtils.getTimeZoneDelta(startLeg.origin.timeZone, endLeg.destination.timeZone)}
            </span>
          </h4>
          <span>{`${endLeg.destination.cityName} (${endLeg.destination.code})`}</span>
        </div>

        <div className={css.TravelTime}>
          <h4>{DateUtils.getDDHHMMFromMinutes(Utils.getLegDurationMinutes(onwardLegs))}</h4>
          <span>Travel time</span>
        </div>

        <span className={css.Stops}>{this.getStopsStr()}</span>

        <button className={css.AddButton} type="button">
          {this.getPriceDelta()}
        </button>
      </div>
    );
  }
}
