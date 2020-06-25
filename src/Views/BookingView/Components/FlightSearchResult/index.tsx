import React from 'react';

import css from './FlightSearchResult.module.css';
import spinner from '../../../../Assets/Images/spinner.svg';
import flightIcon from '../../../../Assets/Images/flight.svg';
import { GroupedOfferModel, AltOfferModel, OfferModel } from '../../../../Models/OfferModel';
import DayRibbon from './Components/DayRibbon';
import FlightEntry from './Components/FlightEntry';
import Select from '../../../../Components/UI/Select';
import Option from '../../../../Components/UI/Select/Option';
import SortAlgorithms, { SortAlgorithm } from './SortAlgorithms';
import { AirportModel } from '../../../../Models/AirportModel';

interface FlightSearchResultProps {
  origin: AirportModel;
  destination: AirportModel;
  offers?: GroupedOfferModel[];
  altOffers?: AltOfferModel[];
  selectedDepartureDate: Date;
  className?: string;
  onDepartureChange?: (departure: Date) => void;
  onOfferChange: (offer?: OfferModel) => void;
  selectedOffer?: OfferModel;
}

interface FlightSearchResultState {
  showCountFactor: number;
  sortingAlgorithm: SortAlgorithm;
  filters?: (groupedOffer: GroupedOfferModel) => boolean;
}

export default class FlightSearchResult extends React.Component<
  FlightSearchResultProps,
  FlightSearchResultState
> {
  private readonly flightEntryRefs: (FlightEntry | null)[] = [];

  private readonly showCount = 5;

  constructor(props: FlightSearchResultProps) {
    super(props);

    this.state = {
      showCountFactor: 1,
      sortingAlgorithm: SortAlgorithms.departure,
      filters: undefined,
    };

    this.onDepartureChange = this.onDepartureChange.bind(this);
    this.onFlightEntryExpandDetails = this.onFlightEntryExpandDetails.bind(this);
    this.onSortingChange = this.onSortingChange.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);
  }

  async componentDidMount(): Promise<void> {
    this.expandSelectedIntoView();
  }

  componentDidUpdate(prevProps: FlightSearchResultProps): void {
    const { offers } = this.props;

    if (prevProps.offers !== offers) {
      this.expandSelectedIntoView();
    }
  }

  private onDepartureChange(departure: Date): void {
    const { onDepartureChange, onOfferChange } = this.props;

    onOfferChange(undefined);

    if (onDepartureChange) {
      onDepartureChange(departure);
    }
  }

  private onFlightEntryExpandDetails(): void {
    // Collapse all flight entires when one is expanded.
    this.flightEntryRefs.forEach((flightEntryRef) => {
      if (flightEntryRef) {
        flightEntryRef.collapseDetails();
      }
    });
  }

  private onSortingChange(sortingAlgorithm: SortAlgorithm): void {
    this.onFlightEntryExpandDetails();

    this.setState({ sortingAlgorithm }, this.expandSelectedIntoView);
  }

  private onFiltersChange(filters: any): void {
    this.onFlightEntryExpandDetails();

    this.setState({ filters }, this.expandSelectedIntoView);
  }

  private getFilteredAndSorted(offers: GroupedOfferModel[]): GroupedOfferModel[] {
    const { sortingAlgorithm, filters } = this.state;

    let nextOffers = offers;

    if (filters) {
      nextOffers = nextOffers.filter(filters);
    }

    return nextOffers.sort(sortingAlgorithm);
  }

  private expandSelectedIntoView(): void {
    const { showCountFactor } = this.state;
    const { offers, selectedOffer } = this.props;

    if (!(offers && selectedOffer)) {
      return;
    }

    // Expand search result to show selected offer.
    this.getFilteredAndSorted(offers).forEach((offer, idx) => {
      Object.keys(offer.cabinClasses).forEach((cc) => {
        if (offer.cabinClasses[cc].offers.findIndex(
          (ccOffer) => ccOffer.basketHash === selectedOffer.basketHash,
        ) !== -1) {
          if (idx >= showCountFactor * this.showCount) {
            this.setState({
              showCountFactor: Math.ceil((idx + 1) / this.showCount),
            });
          }
        }
      });
    });
  }

  resetShowCounter(): void {
    this.setState({ showCountFactor: 1 });
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
    const {
      onOfferChange,
      selectedDepartureDate,
      selectedOffer,
    } = this.props;

    const showCount = showCountFactor * this.showCount;

    return (
      <>
        <DayRibbon
          selectedDate={selectedDepartureDate}
          className={css.DayRibbon}
          altOffers={altOffers}
          onChange={this.onDepartureChange}
        />

        <div className={css.FlightEntries}>
          {this.getFilteredAndSorted(offers).slice(0, showCount).map((offer, idx) => (
            <FlightEntry
              ref={(ref): void => {
                this.flightEntryRefs[idx] = ref;
              }}
              data={offer}
              key={`flight-entry-${idx}`}
              onExpandDetails={this.onFlightEntryExpandDetails}
              onOfferChange={onOfferChange}
              selectedOffer={selectedOffer}
            />
          ))}

          {showCount < offers.length && (
            <div className={css.ShowMore}>
              <button
                type="button"
                onClick={(): void => this.setState({ showCountFactor: showCountFactor + 1 })}
              >
                {`${offers.length - showCount} more flights`}
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  render(): JSX.Element {
    const {
      offers,
      altOffers,
      className,
      origin,
      destination,
    } = this.props;
    const { sortingAlgorithm } = this.state;

    const classList = [css.FlightSearchResult];

    if (className) {
      classList.push(className);
    }

    return (
      <div className={classList.join(' ')}>
        <div className={css.Header}>
          <div className={css.OriginDestination}>
            <img src={flightIcon} alt="Flight" />
            <strong>
              {`${origin.cityName} to ${destination.cityName}`}
            </strong>
          </div>

          <div className={css.Actions}>
            <Select
              className={css.Sorting}
              wrapperClassName={css.SortingWrapper}
              value={sortingAlgorithm}
              onChange={this.onSortingChange}
            >
              <Option value={SortAlgorithms.departure}>Departure</Option>
              <Option value={SortAlgorithms.arrival}>Arrival</Option>
              <Option value={SortAlgorithms.stopCount}>Number of stops</Option>
              <Option value={SortAlgorithms.travelTime}>Travel time</Option>
              <Option value={SortAlgorithms.economyPrice}>Economy price</Option>
              <Option value={SortAlgorithms.businessPrice}>Business price</Option>
            </Select>
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
