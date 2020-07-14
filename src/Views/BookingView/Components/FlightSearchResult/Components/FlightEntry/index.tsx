import React from 'react';

import css from './FlightEntry.module.css';
import Collapsable from '../../../../../../Components/UI/Collapsable';
import FlightDetails from './Components/FlightDetails';
import Utils from '../../../../../../Utils';
import PriceDetails from './Components/PriceDetails';
import { CabinClassEnum } from '../../../../../../Enums/CabinClassEnum';
import DateUtils from '../../../../../../DateUtils';
import { FareModel, FlightOfferModel } from '../../../../../../Models/FlightOfferModel';
import ContentService from '../../../../../../Services/ContentService';

interface FlightEntryProps {
  offer: FlightOfferModel;
  cabinClass: CabinClassEnum;
  onExpandDetails: () => void;
  onFareChange: (offer?: FareModel) => void;
  selectedFare?: FareModel;
  contentService: ContentService;
}

interface FlightEntryState {
  collapsed: boolean;
  selectedCabinClass?: CabinClassEnum;
  content: {
    common: {
      cabinClasses: { [key: string]: string };
    };
  };
}

export default class FlightEntry extends React.Component<FlightEntryProps, FlightEntryState> {
  constructor(props: FlightEntryProps) {
    super(props);

    this.state = {
      collapsed: true,
      selectedCabinClass: undefined,
      content: {
        common: {
          cabinClasses: {},
        },
      },
    };

    this.toggleDetails = this.toggleDetails.bind(this);
    this.showFares = this.showFares.bind(this);
    this.collapseDetails = this.collapseDetails.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { selectedFare, contentService } = this.props;

    this.setState({
      content: { common: await contentService.get('common') },
    });

    // Expand fares upon mount.
    if (selectedFare) {
      this.showFares(selectedFare.cabinClass);
    }
  }

  private toggleDetails(): void {
    const { collapsed } = this.state;

    if (!collapsed) {
      this.collapseDetails();
    } else {
      this.expandDetails();
    }
  }

  showFares(cabinClass: CabinClassEnum): void {
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

  render(): JSX.Element | null {
    const {
      offer,
      cabinClass,
      onFareChange,
      selectedFare,
    } = this.props;

    const { collapsed, selectedCabinClass, content: { common } } = this.state;
    const timeZoneDelta = DateUtils.getTimeZoneDelta(
      offer.origin.timeZone,
      offer.destination.timeZone,
    );
    const cabinClasses = Utils.getCabinClasses(cabinClass);

    return (
      <>
        <div className={css.OriginDestination}>
          <div className={css.Origin}>
            <strong>
              {DateUtils.getHourMinuteString(offer.departure)}
            </strong>
            <span>{`${offer.origin?.cityName} ${offer.origin?.code}`}</span>
          </div>

          <span className={css.Arrow} />

          <div className={css.Destination}>
            <strong>
              {DateUtils.getHourMinuteString(offer.arrival)}
              {timeZoneDelta && (<span className={css.TimeZoneDelta}>{timeZoneDelta}</span>)}
            </strong>
            <span>{`${offer.destination.cityName} ${offer.destination.code}`}</span>
          </div>
        </div>

        <div className={css.TravelTime}>
          <strong>{DateUtils.getDDHHMMFromMinutes(offer.duration)}</strong>
          <span>Travel time</span>
        </div>

        <div className={css.Stops}>
          <strong>
            {offer.stops.length === 0
              ? 'Direct'
              : `${offer.stops.length} Stop${offer.stops.length > 1 ? 's' : ''}`}
          </strong>

          <span>
            {offer.stops.join(', ')}
          </span>
        </div>

        <div className={css.Price}>
          {cabinClasses.map((cc, idx) => {
            if (offer.fares.findIndex((fare) => fare.cabinClass === cc) === -1) {
              return null;
            }

            const cheapestFare = offer.cheapestFares.find((cf) => cf.cabinClass === cc);

            return (
              <button
                type="button"
                key={`cabin-class-${idx}`}
                onClick={(): void => this.showFares(cc)}
                role="option"
                aria-selected={cc === selectedCabinClass}
                className={
                  offer.fares.findIndex(
                    (fare) => fare.hashCode === selectedFare?.hashCode && fare.cabinClass === cc,
                  ) === -1
                    ? undefined
                    : css.Selected
                }
              >
                <strong>
                  {`From ${
                    cheapestFare?.price.currency
                  } ${Utils.formatCurrency(cheapestFare?.price.total ?? 0)}`}
                </strong>

                <span>{common.cabinClasses[cc]}</span>
              </button>
            );
          })}
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
                fares={offer.fares.filter((fare) => fare.cabinClass === selectedCabinClass)}
                onFareChange={onFareChange}
                selectedFare={selectedFare}
              />
            )
            : (
              <FlightDetails legs={offer.legs} />
            )}
        </Collapsable>
      </>
    );
  }
}
