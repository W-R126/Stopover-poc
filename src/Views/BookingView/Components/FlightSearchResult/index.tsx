import React from 'react';

import css from './FlightSearchResult.module.css';
import spinner from '../../../../Assets/Images/spinner.svg';
import flightIcon from '../../../../Assets/Images/flight.svg';
import { GroupedOfferModel, AltOfferModel } from '../../../../Models/FlightModel';
import FlightService from '../../../../Services/FlightService';
import DayRibbon from './Components/DayRibbon';
import FlightEntry from './Components/FlightEntry';
import { PassengerPickerData } from '../../../../Components/TripSearch/Components/PassengerPicker/PassengerPickerData';
import { CabinType } from '../../../../Enums/CabinType';
import { AirportModel } from '../../../../Models/AirportModel';

interface FlightSearchResultProps {
  passengers: PassengerPickerData;
  cabinType: CabinType;
  origin: AirportModel;
  destination: AirportModel;
  departure: Date;
  flightService: FlightService;
  onDepartureChange?: (departure: Date) => void;
}

interface FlightSearchResultState {
  offers?: GroupedOfferModel[];
  altOffers?: AltOfferModel[];
  showCountFactor: number;
}

export default class FlightSearchResult extends React.Component<
  FlightSearchResultProps,
  FlightSearchResultState
> {
  private readonly showCount = 5;

  constructor(props: FlightSearchResultProps) {
    super(props);

    this.state = {
      offers: undefined,
      altOffers: undefined,
      showCountFactor: 1,
    };

    this.onDepartureChange = this.onDepartureChange.bind(this);
  }

  componentDidMount(): void {
    this.search();
  }

  componentDidUpdate(prevProps: FlightSearchResultProps): void {
    const {
      passengers,
      cabinType,
      origin,
      destination,
      departure,
    } = this.props;

    if (
      passengers !== prevProps.passengers
      || cabinType !== prevProps.cabinType
      || origin !== prevProps.origin
      || destination !== prevProps.destination
      || departure !== prevProps.departure
    ) {
      this.search();
    }
  }

  private onDepartureChange(departure: Date): void {
    const { onDepartureChange } = this.props;

    if (onDepartureChange) {
      onDepartureChange(departure);
    }
  }

  private async search(): Promise<void> {
    const {
      flightService,
      cabinType,
      departure,
      destination,
      origin,
      passengers,
    } = this.props;

    this.setState({ offers: undefined, showCountFactor: 1 });
    const { offers, altOffers } = await flightService.getOffers(
      cabinType,
      departure,
      destination,
      origin,
      passengers,
    );

    this.setState({
      offers,
      altOffers,
    });
  }

  private renderResult(offers: GroupedOfferModel[], altOffers: AltOfferModel[]): JSX.Element {
    if (offers.length === 0) {
      return (
        <div className={css.NoResult}>
          No flights found.
        </div>
      );
    }

    const { showCountFactor } = this.state;
    const { departure } = this.props;
    const showCount = showCountFactor * this.showCount;

    return (
      <>
        <DayRibbon
          selectedDate={departure}
          className={css.DayRibbon}
          altOffers={altOffers}
          onChange={this.onDepartureChange}
        />

        <div className={css.FlightEntries}>
          {offers.slice(0, showCount).map((flight, idx) => (
            <FlightEntry
              className={css.FlightEntry}
              data={flight}
              key={`flight-entry-${idx}`}
            />
          ))}

          {showCount < offers.length && (
            <div className={css.ShowMore}>
              <span
                role="button"
                onClick={(): void => this.setState({ showCountFactor: showCountFactor + 1 })}
              >
                {`${offers.length - showCount} more flights`}
              </span>
            </div>
          )}
        </div>
      </>
    );
  }

  render(): JSX.Element {
    const { origin, destination } = this.props;
    const { offers, altOffers } = this.state;

    return (
      <div className={css.FlightSearchResult}>
        <div>
          <div className={css.OriginDestination}>
            <img src={flightIcon} alt="Flight" />
            <strong>
              {`${origin?.cityName} to ${destination?.cityName}`}
            </strong>
          </div>
        </div>
        <div className={css.Result}>
          {!offers
            ? (
              <strong className={css.Searching}>
                <img src={spinner} alt="Searching" />
                Searching
              </strong>
            )
            : (this.renderResult(offers, altOffers ?? []))}
        </div>
      </div>
    );
  }
}
