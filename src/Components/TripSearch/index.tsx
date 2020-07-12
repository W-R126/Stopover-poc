import React from 'react';

import css from './TripSearch.module.css';
import { TripTypeEnum } from '../../Enums/TripTypeEnum';
import { CabinClassEnum } from '../../Enums/CabinClassEnum';
import AirportService from '../../Services/AirportService';
import PassengerPicker from './Components/PassengerPicker';
import OriginDestinationPicker from './Components/OriginDestinationPicker';
import DatePicker from './Components/DatePicker';
import TripTypePicker from './Components/TripTypePicker';
import Select from '../UI/Select';
import Option from '../UI/Select/Option';
import Checkbox from '../UI/Checkbox';
import Button from '../UI/Button';
import {
  TripModel,
  copyTrip,
  isEqualTrips,
  isTripValid,
} from '../../Models/TripModel';
import { AirportModel } from '../../Models/AirportModel';
import ContentService from '../../Services/ContentService';

interface TripSearchProps {
  trip?: TripModel;
  contentService: ContentService;
  onChange?: (data: TripModel) => void;
  airportService: AirportService;
  onSearch?: (data: TripModel) => void;
  className?: string;
}

interface TripSearchState {
  trip: TripModel;
}

class TripSearch extends React.Component<TripSearchProps, TripSearchState> {
  constructor(props: TripSearchProps) {
    super(props);

    const { trip } = props;

    this.state = {
      trip: copyTrip(trip),
    };

    this.onOriginDestinationChange = this.onOriginDestinationChange.bind(this);
    this.onTripTypeChange = this.onTripTypeChange.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  componentDidUpdate(prevProps: TripSearchProps): void {
    const { trip } = this.props;

    if (!isEqualTrips(prevProps.trip, trip)) {
      this.setState({ trip: copyTrip(trip) });
    }
  }

  private async onChange(nextTrip: Partial<TripModel>): Promise<void> {
    const { onChange } = this.props;
    const { trip } = this.state;

    Object.assign(trip, nextTrip);

    this.setState({ trip });

    if (onChange) {
      onChange(trip);
    }
  }

  private onOriginDestinationChange(origin?: AirportModel, destination?: AirportModel): void {
    const { trip } = this.state;

    trip.legs[0].origin = origin;
    trip.legs[0].destination = destination;

    if (trip.type === TripTypeEnum.roundTrip) {
      trip.legs[1].origin = destination;
      trip.legs[1].destination = origin;
    }

    this.onChange(trip);
  }

  private onDatesChange(start?: Date, end?: Date): void {
    const { trip } = this.state;

    trip.legs[0].outbound = start;

    if (trip.type === TripTypeEnum.roundTrip) {
      trip.legs[1].outbound = end;
    }

    this.onChange(trip);
  }

  private onTripTypeChange(type: TripTypeEnum): void {
    const { trip } = this.state;

    if (trip.type === TripTypeEnum.oneWay && type === TripTypeEnum.roundTrip) {
      trip.legs[0].outbound = undefined;
    }

    trip.type = type;

    this.onChange(copyTrip(trip));
  }

  private onSearch(): void {
    const { onSearch } = this.props;
    const { trip } = this.state;

    // TODO: Validation.
    if (!isTripValid(trip)) {
      return;
    }

    if (onSearch) {
      onSearch(trip);
    }
  }

  render(): JSX.Element {
    const {
      airportService,
      contentService,
      className,
    } = this.props;

    const { trip } = this.state;

    const cabinClassLocale: { [key: string]: string } = {
      economy: 'Economy',
      business: 'Business',
      first: 'First Class',
      residence: 'Residence',
    };

    const classList = [css.TripSearch];

    if (className) {
      classList.push(className);
    }

    return (
      <div className={classList.join(' ')}>
        <TripTypePicker
          className={css.TripTypePicker}
          value={trip.type}
          onChange={this.onTripTypeChange}
        />

        <OriginDestinationPicker
          className={css.OriginDestinationPicker}
          origin={trip.legs[0].origin}
          destination={trip.legs[0].destination}
          onChange={this.onOriginDestinationChange}
          airportService={airportService}
        />

        <DatePicker
          className={css.DatePicker}
          contentService={contentService}
          start={trip.legs[0].outbound}
          end={trip.legs[1] && trip.legs[1].outbound}
          onChange={this.onDatesChange}
          span={trip.type === TripTypeEnum.roundTrip}
        />

        <div className={css.CabinClass}>
          <label htmlFor="cabin-type">Cabin</label>
          <Select
            className={css.CabinClassSelect}
            wrapperClassName={css.CabinClassSelectWrapper}
            id="cabin-type"
            value={trip.cabinClass}
            onChange={(cabinClass): Promise<void> => this.onChange({ cabinClass })}
          >
            {Object.keys(CabinClassEnum).map((cc, idx) => (
              <Option value={cc as CabinClassEnum} key={`cabin-type-option-${idx}`}>
                {cabinClassLocale[cc]}
              </Option>
            ))}
          </Select>
        </div>

        <div className={css.Passengers}>
          <label htmlFor="passengers">Guests</label>
          <PassengerPicker
            className={css.PassengerPicker}
            wrapperClassName={css.PassengerPickerWrapper}
            id="passengers"
            data={trip.passengers}
            onChange={(passengers): Promise<void> => this.onChange({ passengers })}
          />
        </div>

        <div className={css.SearchFlight}>
          <div className={css.BookWithMiles}>
            <Checkbox
              checked={trip.bookWithMiles}
              id="book-with-miles"
              onChange={(e): Promise<void> => this.onChange({ bookWithMiles: e.target.checked })}
            >
              Book with miles
            </Checkbox>
          </div>

          <Button onClick={this.onSearch}>
            Search flight
          </Button>
        </div>
      </div>
    );
  }
}

export default TripSearch;
