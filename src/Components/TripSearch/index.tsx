import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import './TripSearch.css';
import { TripType } from '../../Enums/TripType';
import { CabinType } from '../../Enums/CabinType';
import AirportService from '../../Services/AirportService';
import PassengerPicker, { PassengerPickerData } from './Components/PassengerPicker';
import OriginDestinationPicker, { OriginDestinationPickerData } from './Components/OriginDestinationPicker';
import DatePicker from './Components/DatePicker';
import TripTypePicker from './Components/TripTypePicker';
import Select from '../UI/Select';
import Option from '../UI/Select/Option';
import { CalendarData } from './Components/Calendar';
import Checkbox from '../UI/Checkbox';
import Utils from '../../Utils';
import { TripSearchData } from './TripSearchData';

interface TripSearchProps extends RouteComponentProps {
  data: TripSearchData;
  locale?: string;
  onChange: (data: TripSearchData) => void;
  airportService: AirportService;
  onSearch?: () => void;
  replaceOnSearch?: boolean;
}

class TripSearch extends React.Component<TripSearchProps, {}> {
  static readonly defaultProps: Pick<TripSearchProps, 'locale' | 'replaceOnSearch'> = {
    locale: 'en-US',
    replaceOnSearch: false,
  };

  constructor(props: TripSearchProps) {
    super(props);

    this.onTripTypeChange = this.onTripTypeChange.bind(this);
    this.onPassengersChange = this.onPassengersChange.bind(this);
    this.onCabinTypeChange = this.onCabinTypeChange.bind(this);
    this.onOriginDestinationChange = this.onOriginDestinationChange.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  private onTripTypeChange(tripType: TripType): void {
    this.onFieldChange('tripType', tripType);
  }

  private onPassengersChange(passengers: PassengerPickerData): void {
    this.onFieldChange('passengers', passengers);
  }

  private onCabinTypeChange(cabinType: CabinType): void {
    this.onFieldChange('cabinType', cabinType);
  }

  private onOriginDestinationChange(originDestination: OriginDestinationPickerData): void {
    this.onFieldChange('originDestination', originDestination);
  }

  private onDatesChange(dates: CalendarData): void {
    this.onFieldChange('dates', dates);
  }

  private onBookWithMilesChange(bookWithMiles: boolean): void {
    this.onFieldChange('bookWithMiles', bookWithMiles);
  }

  private onFieldChange(fieldName: string, value: any): void {
    const { data, onChange } = this.props;

    Object.assign(data, { [fieldName]: value });

    onChange(data);
  }

  private onSearch(): void {
    const {
      history,
      data,
      onSearch,
      replaceOnSearch,
    } = this.props;

    // TODO: Validation.

    if (onSearch) {
      onSearch();
    }

    if (replaceOnSearch) {
      history.replace(Utils.getBookingUrl(data));
    } else {
      history.push(Utils.getBookingUrl(data));
    }
  }

  render(): JSX.Element {
    const { data, airportService, locale } = this.props;
    const cabinTypeLocale: { [key: string]: string } = {
      all: 'All Cabins',
      economy: 'Economy',
      business: 'Business',
      first: 'First Class',
      residence: 'Residence',
    };

    return (
      <div className="trip-search">
        <TripTypePicker
          value={data.tripType}
          onChange={this.onTripTypeChange}
        />
        <OriginDestinationPicker
          data={data.originDestination}
          onChange={this.onOriginDestinationChange}
          airportService={airportService}
        />
        <DatePicker
          locale={locale}
          data={data.dates}
          onChange={this.onDatesChange}
          span={data.tripType === TripType.return}
        />
        <div className="cabin-type">
          <label htmlFor="cabin-type">Cabin</label>
          <Select
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
        <div className="passengers">
          <label htmlFor="passengers">Guests</label>
          <PassengerPicker
            id="passengers"
            data={data.passengers}
            onChange={this.onPassengersChange}
          />
        </div>
        <div className="search-flight">
          <div className="book-with-miles">
            <Checkbox
              checked={data.bookWithMiles}
              id="book-with-miles"
              onChange={(e): void => this.onBookWithMilesChange(e.target.checked)}
            >
              Book with miles
            </Checkbox>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={this.onSearch}
          >
            Search flight
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(TripSearch);
