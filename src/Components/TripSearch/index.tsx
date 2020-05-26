import React from 'react';
import ContentService from '../../Services/ContentService';

import './TripSearch.css';
import Input from '../UI/Input';
import Radio from '../UI/Radio';
import Checkbox from '../UI/Checkbox';
import Select from '../UI/Select';
import PassengerPicker, { Passengers } from '../PassengerPicker';
import { SingularPlural } from '../../Models/SingularPlural';
import AirportService from '../../Services/AirportService';
import { AirportModel } from '../../Models/AirportModel';
import AirportSearch from '../AirportSearch';

interface TripSearchProps {
  contentService: ContentService;
  airportService: AirportService;
}

interface TripSearchState {
  content: {
    tripTypes?: {
      return?: string;
      oneWay?: string;
      multiCity?: string;
    };
    flyingFrom?: string;
    flyingTo?: string;
    outbound?: string;
    inbound?: string;
    cabin?: string;
    cabinTypes?: {
      economy?: string;
      business?: string;
      first?: string;
    };
    passengerTypes?: {
      adult?: SingularPlural;
      child?: SingularPlural;
      infant?: SingularPlural;
    };
    bookWithMiles?: string;
    searchFlights?: string;
  };
  originAirports: AirportModel[];
  destinationAirports: AirportModel[];
  // Trip search values.
  originAirport?: AirportModel;
  destinationAirport?: AirportModel;
  cabinType: string;
  passengers: Passengers;
  outboundDate: Date;
  inboundDate: Date;
}

export default class TripSearch extends React.Component<TripSearchProps, TripSearchState> {
  constructor(props: TripSearchProps) {
    super(props);

    this.state = {
      content: {},
      originAirports: [],
      destinationAirports: [],
      // Trip search default values.
      originAirport: undefined,
      destinationAirport: undefined,
      cabinType: 'economy',
      passengers: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      outboundDate: new Date(),
      inboundDate: new Date(),
    };

    this.onOriginAirportChange = this.onOriginAirportChange.bind(this);
    this.onDestinationAirportChange = this.onDestinationAirportChange.bind(this);
    this.onCabinTypeChange = this.onCabinTypeChange.bind(this);
    this.onPassengersChange = this.onPassengersChange.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { contentService, airportService } = this.props;

    const contentReq = contentService.get('common');
    const airportsReq = airportService.getOriginAirports();

    this.setState({
      content: await contentReq,
      originAirports: await airportsReq,
      destinationAirports: await airportsReq, // TODO: Impl.
    });
  }

  onOriginAirportChange(originAirport?: AirportModel): void {
    this.setState({ originAirport });
  }

  onDestinationAirportChange(destinationAirport?: AirportModel): void {
    this.setState({ destinationAirport });
  }

  onCabinTypeChange(cabinType: string): void {
    this.setState({ cabinType });
  }

  onPassengersChange(passengers: Passengers): void {
    this.setState({ passengers });
  }

  render(): JSX.Element {
    const { content, originAirports, ...data } = this.state;
    const { contentService } = this.props;

    return (
      <div className="trip-search-component">
        <div className="trip-type">
          <Radio
            label={content.tripTypes?.return ?? ''}
            value="return"
            id="trip-type-return"
            name="trip-type"
            defaultChecked
          />
          <Radio
            label={content.tripTypes?.oneWay ?? ''}
            value="return"
            id="trip-type-one-way"
            name="trip-type"
          />
          <Radio
            label={content.tripTypes?.multiCity ?? ''}
            value="return"
            id="trip-type-multi-city"
            name="trip-type"
          />
        </div>
        <div className="trip-details">
          <div className="trip-origin-destination" style={{ zIndex: 1 }}>
            <AirportSearch
              id="trip-origin"
              contentService={contentService}
              airports={originAirports}
              label={content.flyingFrom}
              value={data.originAirport}
              onChange={this.onOriginAirportChange}
            />
            <AirportSearch
              id="trip-destination"
              contentService={contentService}
              airports={originAirports}
              label={content.flyingTo}
              value={data.destinationAirport}
              onChange={this.onDestinationAirportChange}
            />
          </div>
          <div className="trip-dates">
            <Input
              label={content.outbound}
              type="text"
              id="trip-date-outbound"
              value={data.outboundDate.toString()}
            />
            <Input
              label={content.inbound}
              type="text"
              id="trip-date-inbound"
              value={data.outboundDate.toString()}
            />
          </div>
        </div>
        <div className="trip-final-step">
          <div className="passenger-details">
            <Select
              id="trip-cabin-type"
              label={content.cabin}
              value={data.cabinType}
              onChange={this.onCabinTypeChange}
            >
              <option value="economy">{content.cabinTypes?.economy}</option>
              <option value="business">{content.cabinTypes?.business}</option>
              <option value="first">{content.cabinTypes?.first}</option>
            </Select>
            <PassengerPicker
              contentService={contentService}
              value={data.passengers}
              onChange={this.onPassengersChange}
            />
          </div>
          <div className="trip-finalize">
            <div className="book-with-miles">
              <Checkbox
                label={content.bookWithMiles ?? ''}
                id="trip-book-with-miles"
              />
            </div>
            <div>
              <button type="button">{content.searchFlights}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
