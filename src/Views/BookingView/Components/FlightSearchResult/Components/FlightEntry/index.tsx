import React from 'react';

import css from './FlightEntry.module.css';
import Collapsable from '../../../../../../Components/UI/Collapsable';
import FlightDetails from './Components/FlightDetails';
import { GroupedOfferModel, OfferModel } from '../../../../../../Models/OfferModel';
import Utils from '../../../../../../Utils';
import PriceDetails from './Components/PriceDetails';

interface FlightEntryProps {
  data: GroupedOfferModel;
  onExpandDetails: () => void;
  onOfferChange: (offer?: OfferModel) => void;
  selectedOffer?: OfferModel;
  selectedOfferHash?: number;
}

interface FlightEntryState {
  collapsed: boolean;
  selectedCabinClass?: string;
}

export default class FlightEntry extends React.Component<FlightEntryProps, FlightEntryState> {
  constructor(props: FlightEntryProps) {
    super(props);

    this.state = {
      collapsed: true,
      selectedCabinClass: undefined,
    };

    this.toggleDetails = this.toggleDetails.bind(this);
    this.showOffers = this.showOffers.bind(this);
    this.collapseDetails = this.collapseDetails.bind(this);
  }

  componentDidMount(): void {
    const { selectedOfferHash, data } = this.props;

    Object.keys(data.cabinClasses).forEach((cc) => {
      if (data.cabinClasses[cc].offers.findIndex(
        (ccOffer) => ccOffer.basketHash === selectedOfferHash,
      ) !== -1) {
        this.showOffers(cc);
      }
    });
  }

  private toggleDetails(): void {
    const { collapsed } = this.state;

    if (!collapsed) {
      this.collapseDetails();
    } else {
      this.expandDetails();
    }
  }

  private showOffers(cabinClass: string): void {
    const { collapsed, selectedCabinClass } = this.state;

    if (collapsed) {
      this.expandDetails();
    }

    this.setState({
      selectedCabinClass: cabinClass === selectedCabinClass ? undefined : cabinClass,
    });
  }

  expandDetails(): void {
    const { collapsed } = this.state;
    const { onExpandDetails } = this.props;

    onExpandDetails();

    if (collapsed) {
      this.setState({ collapsed: false });
    }
  }

  collapseDetails(): void {
    const { collapsed } = this.state;

    if (!collapsed) {
      this.setState({ collapsed: true, selectedCabinClass: undefined });
    }
  }

  render(): JSX.Element {
    const {
      data,
      onOfferChange,
      selectedOffer,
      selectedOfferHash,
    } = this.props;

    const { collapsed, selectedCabinClass } = this.state;
    const timeZoneDelta = Utils.getTimeZoneDelta(data.origin.timeZone, data.destination.timeZone);

    return (
      <>
        <div className={css.OriginDestination}>
          <div className={css.Origin}>
            <strong>
              {Utils.getHourMinuteString(data.departure, data.origin.timeZone)}
            </strong>
            <span>{`${data.origin?.cityName} ${data.origin?.code}`}</span>
          </div>

          <span className={css.Arrow} />

          <div className={css.Destination}>
            <strong>
              {Utils.getHourMinuteString(data.arrival, data.destination.timeZone)}
              {timeZoneDelta && (<span className={css.TimeZoneDelta}>{timeZoneDelta}</span>)}
            </strong>
            <span>{`${data.destination.cityName} ${data.destination.code}`}</span>
          </div>
        </div>

        <div className={css.TravelTime}>
          <strong>{Utils.getTimeDelta(data.departure, data.arrival)}</strong>
          <span>Travel time</span>
        </div>

        <div className={css.Stops}>
          <strong>
            {data.stops.length === 0
              ? 'Direct'
              : `${data.stops.length} Stop${data.stops.length > 1 ? 's' : ''}`}
          </strong>

          <span>
            {data.stops.join(', ')}
          </span>
        </div>

        <div className={css.Price}>
          {Object.keys(data.cabinClasses).slice(0, 2).map((cabinClass, idx) => (
            <button
              type="button"
              key={`cabin-class-${idx}`}
              onClick={(): void => this.showOffers(cabinClass)}
              role="option"
              aria-selected={cabinClass === selectedCabinClass}
              className={data.cabinClasses[cabinClass].offers.findIndex(
                (offer) => offer.basketHash === selectedOfferHash,
              ) === -1 ? undefined : css.Selected}
            >
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
          <button
            type="button"
            onClick={this.toggleDetails}
            role="option"
            aria-selected={!collapsed}
          >
            Show details
          </button>
        </div>

        <Collapsable collapsed={collapsed} className={css.FlightDetailsCollapsable}>
          {selectedCabinClass
            ? (
              <PriceDetails
                className={css.PriceDetails}
                cabinClass={data.cabinClasses[selectedCabinClass]}
                onOfferChange={onOfferChange}
                selectedOffer={selectedOffer}
              />
            )
            : (
              <FlightDetails segments={data.segments} />
            )}
        </Collapsable>
      </>
    );
  }
}
