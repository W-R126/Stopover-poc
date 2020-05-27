import React from 'react';
import { Link } from 'react-router-dom';

import './TripSearch.css';
import switchIcon from '../../Assets/Images/switch.svg';
import { TripType } from '../../Types/TripType';
import { CabinType } from '../../Types/CabinType';
import { AirportModel } from '../../Models/AirportModel';
import Select from '../UI/Select';
import PassengerPicker, { PassengerPickerData } from '../PassengerPicker';
import openExternal from '../../Assets/Images/open-external.svg';
import AirportSearch from '../AirportSearch';
import AirportService from '../../Services/AirportService';

export interface TripSearchData {
  tripType: TripType;
  passengers: PassengerPickerData;
  cabinType: CabinType;
  origin?: AirportModel;
  destination?: AirportModel;
  outbound: Date;
  inbound: Date;
}

interface TripSearchProps {
  data: TripSearchData;
  onChange: (data: TripSearchData) => void;
  airportService: AirportService;
}

interface TripSearchState {
  originAirports: AirportModel[];
  destinationAirports: AirportModel[];
}

export default class TripSearch extends React.Component<TripSearchProps, TripSearchState> {
  constructor(props: TripSearchProps) {
    super(props);

    this.state = {
      originAirports: [],
      destinationAirports: [],
    };

    this.onTripTypeChange = this.onTripTypeChange.bind(this);
    this.onPassengersChange = this.onPassengersChange.bind(this);
    this.onCabinTypeChange = this.onCabinTypeChange.bind(this);
    this.onOriginChange = this.onOriginChange.bind(this);
    this.onDestinationChange = this.onDestinationChange.bind(this);
    this.swapDirections = this.swapDirections.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { airportService } = this.props;

    const airports = await airportService.getOriginAirports();

    this.setState({
      originAirports: airports,
      destinationAirports: airports,
    });
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

  private onOriginChange(origin?: AirportModel): void {
    this.onFieldChange('origin', origin);

    if (origin === undefined) {
      this.onFieldChange('destination', undefined);
    }
  }

  private onDestinationChange(destination?: AirportModel): void {
    this.onFieldChange('destination', destination);
  }

  private onFieldChange(fieldName: string, value: any): void {
    const { data, onChange } = this.props;

    Object.assign(data, { [fieldName]: value });

    onChange(data);
  }

  private swapDirections(): void {
    const { data, onChange } = this.props;

    Object.assign(data, { origin: data.destination, destination: data.origin });

    onChange(data);
  }

  render(): JSX.Element {
    const { data } = this.props;
    const { originAirports, destinationAirports } = this.state;
    const swapDisabled = data.destination === undefined || data.origin === undefined;

    return (
      <div className="trip-search">
        <div className="row-1">
          <div className="trip-details">
            <Select
              className="trip-type"
              value={data.tripType}
              onChange={this.onTripTypeChange}
            >
              <option value="return">Return trip</option>
              <option value="oneWay">One-way</option>
              <option value="multiCity">Multi-city</option>
            </Select>

            <PassengerPicker
              data={data.passengers}
              onChange={this.onPassengersChange}
            />

            <Select value={data.cabinType} onChange={this.onCabinTypeChange}>
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
              <option value="residence">The Residence</option>
            </Select>
          </div>

          <div className="trip-options">
            <Link to="/">Use a promocode</Link>
            <Link to="/" className="external-link">
              Book with miles
              <img src={openExternal} alt="Open external" />
            </Link>
          </div>
        </div>

        <div className="row-2">
          <div className="trip-origin-destination">
            <AirportSearch
              label="Flying from"
              airports={originAirports}
              value={data.origin}
              placeholder="Where are you flying from?"
              onChange={this.onOriginChange}
            />
            <button
              tabIndex={swapDisabled ? undefined : 0}
              type="button"
              onClick={swapDisabled ? undefined : this.swapDirections}
              disabled={swapDisabled}
            >
              <img src={switchIcon} alt="Switch direction" />
            </button>
            <AirportSearch
              label="Flying to"
              airports={destinationAirports}
              value={data.destination}
              placeholder="Where are you header?"
              disabled={data.origin === undefined}
              onChange={this.onDestinationChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
