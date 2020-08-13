import React from 'react';

import css from './SearchPanel.module.css';

import AirportService from '../../../../../Services/AirportService';
import ContentService from '../../../../../Services/ContentService';
import { AirportModel } from '../../../../../Models/AirportModel';
import { GuestsModel } from '../../../../../Models/GuestsModel';
import { CabinClassEnum } from '../../../../../Enums/CabinClassEnum';

import Utils from '../../../../../Utils';
import { getCityImage, getCityPrice } from '../../../MockData';

import AirportSearch from '../../../../../Components/TripSearch/Components/OriginDestinationPicker/Components/AirportSearch';
import DestinationAirport from './Components/DestinationAirport';
import DateSelector from './Components/DateSelector';
import PassengerSelector from './Components/PassengerSelector';
import CabinClassSelector from './Components/CabinClassSelector';
import Option from '../../../../../Components/UI/Select/Option';

interface SearchPanelProps {
  airportService: AirportService;
  contentService: ContentService;
  origin?: AirportModel;
  destination?: AirportModel;
  dateRange?: any;
  passenger: GuestsModel;
  cabinClass: CabinClassEnum;
  price: number;
  onChangeAirports: (origin?: AirportModel, destination?: AirportModel) => void;
  onChangeDateRange: (start?: Date, end?: Date) => void;
  onChangePassenger: (passenger: GuestsModel) => void;
  onChangeCabinClass: (cabinClass: CabinClassEnum) => void;
  onChangePrice: (value: number) => void;
}

interface SearchPanelState {
  selectedPane: string;
  airports: AirportModel[];
  cabinClasses: { [key: string]: string };
}

class SearchPanel extends React.Component<
  SearchPanelProps, SearchPanelState
> {
  private readonly TAB_CONTENTS = ['FLIGHTS', 'HOTELS', 'CARS', 'ACTIVITIES']

  constructor(props: SearchPanelProps) {
    super(props);
    this.state = {
      selectedPane: 'FLIGHTS',
      airports: [],
      cabinClasses: {},
    };

    this.swapDirections = this.swapDirections.bind(this);
    this.onOriginChange = this.onOriginChange.bind(this);
    this.onDestinationChange = this.onDestinationChange.bind(this);
    this.setOriginAirportFromPosition = this.setOriginAirportFromPosition.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { airportService, contentService } = this.props;

    const airports = await airportService.getAirports();
    const airportsWithImg = airports.map((item: AirportModel): AirportModel => ({
      ...item,
      cityBgImg: getCityImage(item.cityCode),
      price: getCityPrice(item.cityCode),
    }));

    await new Promise((resolve) => this.setState({ airports: airportsWithImg }, resolve));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setOriginAirportFromPosition);
    }

    const common = await contentService.get('common');
    this.setState({ cabinClasses: common.cabinClasses });
  }

  private onOriginChange(origin?: AirportModel): void {
    const { destination, onChangeAirports } = this.props;

    onChangeAirports(origin, destination);
  }

  private onDestinationChange(destination?: AirportModel): void {
    const { origin, onChangeAirports } = this.props;

    onChangeAirports(origin, destination);
  }

  private setOriginAirportFromPosition(position: Position): void {
    const { origin } = this.props;

    if (origin) {
      return;
    }

    const { longitude: long, latitude: lat } = position.coords;
    const { airports } = this.state;

    let nextOrigin = airports[0];
    let distance = Utils.getDistance(nextOrigin.coordinates, { long, lat });

    airports.forEach((airport) => {
      const nextDistance = Utils.getDistance(airport.coordinates, { long, lat });

      if (nextDistance < distance) {
        distance = nextDistance;
        nextOrigin = airport;
      }
    });

    this.onOriginChange(nextOrigin);
  }

  private swapDirections(): void {
    const { origin, destination, onChangeAirports } = this.props;

    onChangeAirports(destination, origin);
  }

  render(): JSX.Element {
    const { selectedPane, airports, cabinClasses } = this.state;
    const {
      contentService,
      origin, destination,
      dateRange, onChangeDateRange,
      passenger, onChangePassenger,
      cabinClass, onChangeCabinClass,
      price,
      onChangePrice,
    } = this.props;

    return (
      <div className={css.ComponentContainer}>
        <div className={css.TabSelector}>
          {this.TAB_CONTENTS.map((item, idx) => (
            <div
              key={idx}
              className={`${css.TabItem} ${item === selectedPane ? css.Active : ''}`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className={css.FlightSelector}>
          <AirportSearch
            className={css.AirportSearch}
            wrapperClassName={css.AirportSearchWrapper}
            focusedClassName={css.AirportSearchFocused}
            airports={airports.filter((airport) => airport.code !== destination?.code)}
            onChange={this.onOriginChange}
            id="trip-origin"
            placeholder="Where are you flying from?"
            value={origin}
          />
          <DestinationAirport
            className={css.AirportSearch}
            wrapperClassName={css.AirportSearchWrapper}
            focusedClassName={css.AirportSearchFocused}
            airports={airports.filter((airport) => airport.code !== origin?.code)}
            onChange={this.onDestinationChange}
            id="trip-destination"
            placeholder="Where do you want to go?"
            value={destination}
            price={price}
            onChangePrice={onChangePrice}
          />
          <button
            className={css.SwapButton}
            type="button"
            tabIndex={-1}
            onClick={this.swapDirections}
          />
        </div>
        {(origin && destination) && (
          <div className={css.TripBar}>
            <DateSelector
              className={css.DateSelectorWrapper}
              contentService={contentService}
              flightDate={dateRange}
              changeDate={onChangeDateRange}
            />
            <PassengerSelector
              id="experimental-home-passenger-selector"
              data={passenger}
              style={{ flex: '1 1 100%' }}
              onChange={onChangePassenger}
            />
            <CabinClassSelector
              className={css.CabinClassSelect}
              wrapperClassName={css.CabinClassSelectWrapper}
              value={cabinClass}
              onChange={onChangeCabinClass}
            >
              {Object.keys(CabinClassEnum).map((cc, idx) => (
                <Option
                  value={CabinClassEnum[cc as keyof typeof CabinClassEnum]}
                  key={`cabin-type-option-${idx}`}
                >
                  {cabinClasses[cc] ?? ''}
                </Option>
              ))}
            </CabinClassSelector>
            <div
              className={css.SearchButton}
              role="button"
              onClick={(): void => {
                console.log('Click Search Button');
              }}
            >
              Search
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SearchPanel;
