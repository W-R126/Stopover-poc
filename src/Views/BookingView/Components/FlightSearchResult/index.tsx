import React from 'react';

import css from './FlightSearchResult.module.css';
import spinner from '../../../../Assets/Images/spinner.svg';
import flightIcon from '../../../../Assets/Images/flight.svg';
import DayRibbon from './Components/DayRibbon';
import FlightEntry from './Components/FlightEntry';
import SortAlgorithms, { SortAlgorithm } from './SortAlgorithms';
import { AirportModel } from '../../../../Models/AirportModel';
import { CabinClassEnum } from '../../../../Enums/CabinClassEnum';
import Filters from './Components/Filters';
import SortMenu, { SortMenuItem } from './Components/SortMenu';
import Utils from '../../../../Utils';
import {
  FlightOfferModel,
  FareModel,
  AlternateFlightOfferModel,
} from '../../../../Models/FlightOfferModel';
import { TripModel } from '../../../../Models/TripModel';
import DateUtils from '../../../../DateUtils';
import ContentService from '../../../../Services/ContentService';

interface FlightSearchResultProps {
  cabinClass: CabinClassEnum;
  origin: AirportModel;
  destination: AirportModel;
  offers?: FlightOfferModel[];
  altOffers?: AlternateFlightOfferModel[];
  selectedDepartureDate: Date;
  className?: string;
  onDepartureChange?: (departure: Date) => void;
  onFareChange: (fare?: FareModel) => void;
  selectedFare?: FareModel;
  trip: TripModel;
  contentService: ContentService;
}

interface FlightSearchResultState {
  showCountFactor: number;
  sortingAlgorithm: SortAlgorithm;
  filters?: (groupedOffer: FlightOfferModel) => boolean;
}

export default class FlightSearchResult extends React.Component<
  FlightSearchResultProps,
  FlightSearchResultState
> {
  private readonly flightEntryRefs: (FlightEntry | null)[] = [];

  private readonly flightFilterRefs = React.createRef<Filters>();

  private readonly showCount = 5;

  private readonly SORT_ITEMS = [
    { value: SortAlgorithms.departure, label: 'Departure' },
    { value: SortAlgorithms.arrival, label: 'Arrival' },
    { value: SortAlgorithms.stopCount, label: 'Number of stops' },
    { value: SortAlgorithms.travelTime, label: 'Travel time' },
  ]

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
    const { offers, cabinClass } = this.props;
    if (prevProps.offers !== offers) {
      this.expandSelectedIntoView();
    }

    if (prevProps.cabinClass !== cabinClass) {
      // Reset sorting to departure.
      this.setState({ sortingAlgorithm: SortAlgorithms.departure });
    }
  }

  private onDepartureChange(departure: Date): void {
    const { onDepartureChange, onFareChange: onOfferChange } = this.props;

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

  private getFilteredAndSorted(offers: FlightOfferModel[]): FlightOfferModel[] {
    const { sortingAlgorithm, filters } = this.state;
    const { cabinClass } = this.props;
    const cabinClasses = Utils.getCabinClasses(cabinClass);

    let nextOffers = offers;

    nextOffers = nextOffers.filter(
      (offer) => offer.fares.findIndex(
        (fare) => cabinClasses.indexOf(fare.cabinClass) !== -1,
      ) !== -1,
    );

    if (filters) {
      nextOffers = nextOffers.filter(filters);
    }

    return nextOffers.sort(sortingAlgorithm);
  }

  private getSortItems(): SortMenuItem[] {
    const returnSortItem = [...this.SORT_ITEMS];
    const { cabinClass } = this.props;

    if (cabinClass === CabinClassEnum.economy) {
      returnSortItem.push({ value: SortAlgorithms.economyPrice, label: 'Economy price' });
    }
    if (cabinClass === CabinClassEnum.economy || cabinClass === CabinClassEnum.business) {
      returnSortItem.push({ value: SortAlgorithms.businessPrice, label: 'Business price' });
    }

    if (cabinClass === CabinClassEnum.business || cabinClass === CabinClassEnum.first) {
      returnSortItem.push({ value: SortAlgorithms.firstPrice, label: 'First class price' });
    }
    if (cabinClass === CabinClassEnum.first || cabinClass === CabinClassEnum.residence) {
      returnSortItem.push({ value: SortAlgorithms.residencePrice, label: 'Residence price' });
    }
    return returnSortItem;
  }

  private expandSelectedIntoView(): void {
    const { showCountFactor } = this.state;
    const { offers, selectedFare } = this.props;

    if (!(offers && selectedFare)) {
      return;
    }

    // Expand search result to show selected offer.
    this.getFilteredAndSorted(offers).forEach((offer, idx) => {
      if (offer.fares.findIndex((fare) => fare.hashCode === selectedFare.hashCode) !== -1) {
        if (idx >= showCountFactor * this.showCount) {
          this.setState({
            showCountFactor: Math.ceil((idx + 1) / this.showCount),
          });
        }
      }
    });
  }

  collapseAll(): void {
    this.flightEntryRefs.forEach((flightEntryRef) => {
      if (flightEntryRef) {
        flightEntryRef.collapseDetails();
      }
    });
  }

  resetShowCounter(): void {
    this.setState({ showCountFactor: 1 });
  }

  clearFilterState(): void {
    if (this.flightFilterRefs.current) {
      this.setState({ filters: undefined });
      this.flightFilterRefs.current.setFilterSpans();
    }
  }

  private renderResult(
    offers: FlightOfferModel[],
    altOffers: AlternateFlightOfferModel[],
  ): JSX.Element {
    if (offers.length === 0) {
      return (
        <div className={css.NoResult}>
          No flights found.
        </div>
      );
    }

    const { showCountFactor } = this.state;
    const {
      onFareChange,
      selectedDepartureDate,
      selectedFare,
      cabinClass,
      trip,
      contentService,
    } = this.props;

    const showCount = showCountFactor * this.showCount;

    const today = new Date();
    let defaultMin = trip.legs[0].departure ? new Date(trip.legs[0].departure) : new Date();
    defaultMin.setDate(defaultMin.getDate() - 3);

    if (DateUtils.compareDates(defaultMin, today) === -1) {
      defaultMin = today;
    }

    const defaultMax = new Date(today);
    defaultMax.setFullYear(defaultMax.getFullYear() + 1);

    return (
      <>
        <DayRibbon
          selectedDate={selectedDepartureDate}
          className={css.DayRibbon}
          altOffers={altOffers}
          onChange={this.onDepartureChange}
          min={defaultMin}
          max={defaultMax}
        />

        <div className={css.FlightEntries}>
          {offers.slice(0, showCount).map((offer, idx) => (
            <FlightEntry
              contentService={contentService}
              cabinClass={cabinClass}
              ref={(ref): void => { this.flightEntryRefs[idx] = ref; }}
              offer={offer}
              key={`flight-entry-${idx}`}
              onExpandDetails={this.onFlightEntryExpandDetails}
              onFareChange={onFareChange}
              selectedFare={offer.fares.find((fare) => fare.hashCode === selectedFare?.hashCode)}
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

    let filteredOffers: FlightOfferModel[] = [];

    if (offers) {
      filteredOffers = this.getFilteredAndSorted(offers);
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
            {offers !== undefined && offers?.length > 0
              && (
                <>
                  <Filters
                    offers={offers}
                    onChange={this.onFiltersChange}
                    ref={this.flightFilterRefs}
                  />
                  <SortMenu
                    sortItems={this.getSortItems()}
                    selectedSort={sortingAlgorithm}
                    changeSort={this.onSortingChange}
                  />
                </>
              )}
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
            : (this.renderResult(filteredOffers, altOffers ?? []))}
        </div>
      </div>
    );
  }
}
