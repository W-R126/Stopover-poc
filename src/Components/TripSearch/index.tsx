import React from 'react';

import css from './TripSearch.module.css';
import { TripType } from '../../Enums/TripType';
import { CabinType } from '../../Enums/CabinType';
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
import { TripSearchData, copyTripSearchData, compareTripSearchData } from './TripSearchData';
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
    this.onCabinTypeChange = this.onCabinTypeChange.bind(this);
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

  private onTripTypeChange(tripType: TripType): void {
    const { data } = this.state;
    Object.assign(data, { tripType });
    this.onChange(data);
  }

  private onPassengersChange(passengers: PassengerPickerData): void {
    const { data } = this.state;
    Object.assign(data, { passengers });
    this.onChange(data);
  }

  private onCabinTypeChange(cabinType: CabinType): void {
    const { data } = this.state;
    Object.assign(data, { cabinType });
    this.onChange(data);
  }

  private onOriginDestinationChange(originDestination: OriginDestinationPickerData): void {
    const { data } = this.state;
    Object.assign(data, { originDestination });
    this.onChange(data);
  }

  private onDatesChange(dates: CalendarData): void {
    const { data } = this.state;
    Object.assign(data, { dates });
    this.onChange(data);
  }

  private onBookWithMilesChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const bookWithMiles = e.target.checked;

    const { data } = this.state;
    Object.assign(data, { bookWithMiles });
    this.onChange(data);
  }

  private onSearch(): void {
    const { onSearch } = this.props;
    const { data } = this.state;

    // TODO: Validation.

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

    const cabinTypeLocale: { [key: string]: string } = {
      all: 'All Cabins',
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
          data={data.originDestination}
          onChange={this.onOriginDestinationChange}
          airportService={airportService}
        />
        <DatePicker
          className={css.DatePicker}
          locale={locale}
          data={data.dates}
          onChange={this.onDatesChange}
          span={data.tripType === TripType.return}
        />
        <div className={css.CabinType}>
          <label htmlFor="cabin-type">Cabin</label>
          <Select
            className={css.CabinTypeSelect}
            wrapperClassName={css.CabinTypeSelectWrapper}
            id="cabin-type"
            value={data.cabinType}
            onChange={this.onCabinTypeChange}
          >
            {Object.keys(CabinType).map((cabinType, idx) => (
              <Option value={(CabinType as any)[cabinType]} key={`cabin-type-option-${idx}`}>
                {cabinTypeLocale[cabinType]}
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
