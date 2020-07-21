import React from 'react';
import css from './Flights.module.css';
import Plane from '../../../../../../Assets/Images/plane.svg';
import FlightCard from './Components/FlightCard';
import ContentService from '../../../../../../Services/ContentService';
import { TripModel } from '../../../../../../Models/TripModel';
import { FlightOfferModel, FareModel } from '../../../../../../Models/FlightOfferModel';

interface FlightProps {
  offers?: FlightOfferModel[];
  onSelectOffer: (offer?: FlightOfferModel) => void;
  selectedOffer?: FlightOfferModel;
  contentService: ContentService;
  outboundFare: FareModel;
}

interface FlightState {
  showFlightsCount: number;
  tripSearch?: TripModel;
}

export class Flights extends React.Component<FlightProps, FlightState> {
  constructor(props: FlightProps) {
    super(props);
    this.state = {
      showFlightsCount: 3,
    };
  }

  componentDidUpdate(prevProps: FlightProps): void {
    const { offers } = this.props;
    if (prevProps.offers !== offers) {
      const listLength = offers?.length ?? 0;

      this.setState({
        showFlightsCount: listLength > 3 ? 3 : listLength,
      });
    }
  }

  private showMore(): void {
    const { showFlightsCount } = this.state;
    const { offers } = this.props;
    const listLength = offers?.length ?? 0;

    if (showFlightsCount === listLength) {
      this.setState({
        showFlightsCount: 3,
      });
    } else if (showFlightsCount < listLength) {
      this.setState({
        showFlightsCount: listLength - showFlightsCount > 3 ? showFlightsCount + 3 : listLength,
      });
    }
  }

  render(): JSX.Element {
    const {
      offers,
      contentService,
      onSelectOffer,
      selectedOffer,
      outboundFare,
    } = this.props;
    const { showFlightsCount } = this.state;

    const abuDhabiLeg = offers && offers[0].legs.find((leg) => leg.origin.code === 'AUH');
    const date = abuDhabiLeg?.departure;
    const destination = offers && offers[0].destination;

    return (
      <div className={css.RightWrap}>
        <div className={css.HotelTop}>
          <img src={Plane} alt="" />

          <p style={{ marginBottom: '0px' }}>Select your onward flight:</p>

          {destination && date && (
            <p className={css.DayDuaration}>
              {`${abuDhabiLeg?.origin.cityName} to ${destination?.cityName}, ${
                date?.toLocaleDateString(
                  contentService.locale,
                  { month: 'long', year: 'numeric', day: 'numeric' },
                )
              }`}
            </p>
          )}
        </div>

        <div className={css.RightCard}>
          {offers?.slice(0, showFlightsCount).map((offer, idx) => (
            <FlightCard
              key={`offer-${idx}`}
              offer={offer}
              onSelect={onSelectOffer}
              selected={selectedOffer?.fares[0].hashCode === offer.fares[0].hashCode}
              outboundFare={outboundFare}
            />
          ))}

          {showFlightsCount < (offers?.length ?? 0) && (
            <div
              className={css.MoreFlights}
              onClick={(): void => this.showMore()}
              role="button"
            >
              <span className={css.AngleUp} />
              <p>{`${(offers?.length ?? 0) - showFlightsCount} more flights`}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
