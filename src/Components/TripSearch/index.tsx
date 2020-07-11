import React from 'react';

import css from './TripSearch.module.css';
import { TripTypeEnum } from '../../Enums/TripTypeEnum';
import { CabinClassEnum } from '../../Enums/CabinClassEnum';
import AirportService from '../../Services/AirportService';
import PassengerPicker from './Components/PassengerPicker';
import { PassengerPickerData } from './Components/PassengerPicker/PassengerPickerData';
import OriginDestinationPicker from './Components/OriginDestinationPicker';
import { OriginDestinationPickerData } from './Components/OriginDestinationPicker/OriginDestinationPickerData';
import DatePicker from './Components/DatePicker';
import TripTypePicker from './Components/TripTypePicker';
import Select from '../UI/Select';
import Option from '../UI/Select/Option';
import { CalendarData } from './Components/DatePicker/Components/Calendar/CalendarData';
import Checkbox from '../UI/Checkbox';
import {
  TripSearchData,
  copyTripSearchData,
  compareTripSearchData,
  validateTripSearchData,
} from './TripSearchData';
import Button from '../UI/Button';

interface TripSearchProps {
  data?: TripSearchData;
  locale?: string;
  onChange?: (data: TripSearchData) => void;
  airportService: AirportService;
  onSearch?: (data: TripSearchData) => void;
  className?: string;
}

interface TripSearchState {
  data: TripSearchData;
}

class TripSearch extends React.Component<TripSearchProps, TripSearchState> {
  static readonly defaultProps: Pick<TripSearchProps, 'locale'> = {
    locale: 'en-US',
  };

  constructor(props: TripSearchProps) {
    super(props);

    const { data } = props;

    this.state = {
      data: copyTripSearchData(data),
    };

    this.onChange = this.onChange.bind(this);
    this.onTripTypeChange = this.onTripTypeChange.bind(this);
    this.onPassengersChange = this.onPassengersChange.bind(this);
    this.onCabinClassChange = this.onCabinClassChange.bind(this);
    this.onOriginDestinationChange = this.onOriginDestinationChange.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onBookWithMilesChange = this.onBookWithMilesChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  componentDidUpdate(prevProps: TripSearchProps): void {
    const { data } = this.props;

    if (!compareTripSearchData(prevProps.data, data)) {
      this.setState({ data: copyTripSearchData(data) });
    }
  }

  private onChange(data: TripSearchData): void {
    const { onChange } = this.props;

    this.setState({ data });

    if (onChange) {
      onChange(data);
    }
  }

  private onTripTypeChange(tripType: TripTypeEnum): void {
    const { data } = this.state;
    data.tripType = tripType;

    this.onChange(data);
  }

  private onPassengersChange(passengers: PassengerPickerData): void {
    const { data } = this.state;
    data.passengers = passengers;

    this.onChange(data);
  }

  private onCabinClassChange(cabinClass: CabinClassEnum): void {
    const { data } = this.state;
    data.cabinClass = cabinClass;

    this.onChange(data);
  }

  private onOriginDestinationChange(originDestination: OriginDestinationPickerData): void {
    const { data } = this.state;
    data.origin = originDestination.origin;
    data.destination = originDestination.destination;

    this.onChange(data);
  }

  private onDatesChange(dates: CalendarData): void {
    const { data } = this.state;
    data.outbound = dates.start;
    data.inbound = dates.end;

    this.onChange(data);
  }

  private onBookWithMilesChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { data } = this.state;
    const bookWithMiles = e.target.checked;
    data.bookWithMiles = bookWithMiles;

    this.onChange(data);
  }

  private onSearch(): void {
    const { onSearch } = this.props;
    const { data } = this.state;

    // TODO: Validation.
    if (!validateTripSearchData(data)) {
      // TODO: Invalid data, display messages.
      return;
    }

    if (onSearch) {
      onSearch(data);
    }
  }

  render(): JSX.Element {
    const {
      airportService,
      locale,
      className,
    } = this.props;

    const { data } = this.state;

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
          value={data.tripType}
          onChange={this.onTripTypeChange}
        />

        <OriginDestinationPicker
          className={css.OriginDestinationPicker}
          data={{ origin: data.origin, destination: data.destination }}
          onChange={this.onOriginDestinationChange}
          airportService={airportService}
        />

        <DatePicker
          className={css.DatePicker}
          locale={locale}
          data={{ start: data.outbound, end: data.inbound }}
          onChange={this.onDatesChange}
          span={data.tripType === TripTypeEnum.return}
        />

        <div className={css.CabinClass}>
          <label htmlFor="cabin-type">Cabin</label>
          <Select
            className={css.CabinClassSelect}
            wrapperClassName={css.CabinClassSelectWrapper}
            id="cabin-type"
            value={data.cabinClass}
            onChange={this.onCabinClassChange}
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
            data={data.passengers}
            onChange={this.onPassengersChange}
          />
        </div>

        <div className={css.SearchFlight}>
          <div className={css.BookWithMiles}>
            <Checkbox
              checked={data.bookWithMiles}
              id="book-with-miles"
              onChange={this.onBookWithMilesChange}
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
