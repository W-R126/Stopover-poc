import React from 'react';
import ContentService from '../../Services/ContentService';

import './TripSearch.css';
import Input from '../UI/Input';
import Radio from '../UI/Radio';
import Checkbox from '../UI/Checkbox';
import Select from '../UI/Select';
import PassengerPicker, { Passengers } from '../PassengerPicker';
import { SingularPlural } from '../../Models/SingularPlural';

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
  cabinType: string;
  passengers: Passengers;
}

interface TripSearchProps {
  contentService: ContentService;
}

export default class TripSearch extends React.Component<TripSearchProps, TripSearchState> {
  constructor(props: TripSearchProps) {
    super(props);

    this.state = {
      content: {},
      cabinType: 'economy',
      passengers: {
        adults: 1,
        children: 0,
        infants: 0,
      },
    };

    this.onCabinTypeChange = this.onCabinTypeChange.bind(this);
    this.onPassengersChange = this.onPassengersChange.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { contentService } = this.props;

    this.setState({
      content: await contentService.get('common'),
    });
  }

  onCabinTypeChange(cabinType: string): void {
    this.setState({ cabinType });
  }

  onPassengersChange(passengers: Passengers): void {
    this.setState({ passengers });
  }

  render(): JSX.Element {
    const { content, ...data } = this.state;
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
          <div className="trip-origin-destination">
            <Input
              label={content.flyingFrom}
              type="text"
              id="trip-origin"
              defaultValue="Stockholm, ARN"
            />
            <Input
              label={content.flyingTo}
              type="text"
              id="trip-destination"
              defaultValue="Abu Dhabi, AUH"
            />
          </div>
          <div className="trip-dates">
            <Input
              label={content.outbound}
              type="text"
              id="trip-date-outbound"
              defaultValue="17/May/2020"
            />
            <Input
              label={content.inbound}
              type="text"
              id="trip-date-inbound"
              defaultValue="24/May/2020"
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
