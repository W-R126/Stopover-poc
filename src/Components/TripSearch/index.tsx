import React from 'react';
import ContentService from '../../Services/ContentService';

import './FlightSearch.css';
import Input from '../UI/Input';
import Radio from '../UI/Radio';
import Checkbox from '../UI/Checkbox';

export interface TripSearchProps {
  contentService: ContentService;
}

interface SingularPlural {
  singular?: string;
  plural?: string;
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
    guest?: SingularPlural;
    passengerTypes?: {
      adult?: SingularPlural;
      child?: SingularPlural;
      infant?: SingularPlural;
    };
    bookWithMiles?: string;
    searchFlights?: string;
  };
}

export default class TripSearch extends React.Component<TripSearchProps, TripSearchState> {
  constructor(props: TripSearchProps) {
    super(props);

    this.state = {
      content: {},
    };
  }

  async componentDidMount(): Promise<void> {
    const { contentService } = this.props;

    this.setState({
      content: await contentService.get('common'),
    });
  }

  render(): JSX.Element {
    const { content } = this.state;

    return (
      <div className="flight-search-component">
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
            <div>
              <select id="trip-cabin-type">
                <option value="economy">{content.cabinTypes?.economy}</option>
                <option value="business">{content.cabinTypes?.business}</option>
                <option value="first">{content.cabinTypes?.first}</option>
              </select>
            </div>
            <div>
              <select id="trip-passengers">
                <option value="adults">{content.passengerTypes?.adult?.plural}</option>
                <option value="children">{content.passengerTypes?.child?.plural}</option>
                <option value="infants">{content.passengerTypes?.infant?.plural}</option>
              </select>
            </div>
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
