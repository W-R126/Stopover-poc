import React from 'react';

import './TripSearch.css';
import { TripType } from '../../Types/TripType';
import { CabinType } from '../../Types/CabinType';
import AirportService from '../../Services/AirportService';
import PassengerPicker, { PassengerPickerData } from '../PassengerPicker';
import OriginDestinationPicker, { OriginDestinationPickerData } from '../OriginDestinationPicker';
import DatePicker from '../DatePicker';
import TripTypePicker from '../TripTypePicker';
import Select from '../UI/Select';
import Option from '../UI/Select/Option';

export interface TripSearchData {
  tripType: TripType;
  passengers: PassengerPickerData;
  cabinType: CabinType;
  originDestination: OriginDestinationPickerData;
  dates: {
    outbound: Date;
    inbound: Date;
  };
}

interface TripSearchProps {
  data: TripSearchData;
  onChange: (data: TripSearchData) => void;
  airportService: AirportService;
}

export default class TripSearch extends React.Component<TripSearchProps, {}> {
  constructor(props: TripSearchProps) {
    super(props);

    this.onTripTypeChange = this.onTripTypeChange.bind(this);
    this.onPassengersChange = this.onPassengersChange.bind(this);
    this.onCabinTypeChange = this.onCabinTypeChange.bind(this);
    this.onOriginDestinationChange = this.onOriginDestinationChange.bind(this);
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

  private onFieldChange(fieldName: string, value: any): void {
    const { data, onChange } = this.props;

    Object.assign(data, { [fieldName]: value });

    onChange(data);
  }

  render(): JSX.Element {
    const { data, airportService } = this.props;

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
        <DatePicker />
        <div className="cabin-type">
          <label htmlFor="cabin-type">Cabin</label>
          <Select
            id="cabin-type"
            value={data.cabinType}
            onChange={this.onCabinTypeChange}
          >
            <Option value="economy">Economy</Option>
            <Option value="business">Business</Option>
            <Option value="first">First Class</Option>
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
      </div>
    );
  }
}
