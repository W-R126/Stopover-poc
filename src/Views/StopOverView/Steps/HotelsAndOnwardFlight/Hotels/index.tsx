import React from 'react';

import css from './Hotels.module.css';
import hotelIcon from '../../../../../Assets/Images/hotel-icon.svg';
import {
  HotelOfferModel,
  HotelModel,
  RoomOfferModel,
  getHotelRoomOfferChain,
} from '../../../../../Models/HotelOfferModel';
import ContentService from '../../../../../Services/ContentService';
import Hotel from './Hotel';
import Menu from '../../../../../Components/UI/Menu';
import SortAlgorithms from './SortAlgorithms';
import Filters, { FilterFunc } from './Filters';

interface HotelProps {
  className?: string;
  offers: HotelOfferModel;
  contentService: ContentService;
  occupants: number;
  hotelRoom?: RoomOfferModel;
  onSelectRoom: (room?: RoomOfferModel) => void;
}

interface HotelState {
  sorting: string;
  filtering?: FilterFunc;
}

export default class Hotels extends React.Component<HotelProps, HotelState> {
  private readonly offersRef = React.createRef<HTMLDivElement>();

  private readonly sortLabels = {
    recommended: 'Recommended',
    lowestPrice: 'Lowest price',
    highestPrice: 'Highest price',
    hotelClass: 'Hotel class',
    checkInTime: 'Check-in time',
  };

  constructor(props: HotelProps) {
    super(props);

    this.state = {
      sorting: 'recommended',
      filtering: undefined,
    };

    this.filterChange = this.filterChange.bind(this);
  }

  componentDidMount(): void {
    const { hotelRoom, offers } = this.props;

    const [selectedHotel] = getHotelRoomOfferChain(offers.hotels, hotelRoom);

    if (selectedHotel && this.offersRef.current) {
      const child = this.offersRef.current.children[offers.hotels.indexOf(selectedHotel)];

      child.scrollIntoView(true);
      this.offersRef.current.scrollTop -= 16;
    }
  }

  private filterChange(filtering: FilterFunc): void {
    this.setState({ filtering });
  }

  render(): JSX.Element {
    const {
      className,
      offers,
      contentService,
      occupants,
      hotelRoom,
      onSelectRoom,
    } = this.props;

    const { sorting, filtering } = this.state;
    const { sortLabels } = this;

    offers.hotels.sort(SortAlgorithms[sorting as keyof typeof SortAlgorithms]);

    const classList = [css.Hotels];

    if (className) {
      classList.push(className);
    }

    let selected: HotelModel | undefined;

    if (hotelRoom) {
      [selected] = getHotelRoomOfferChain(offers.hotels, hotelRoom);
    }

    const filteredHotels = offers.hotels.filter(filtering ?? ((): boolean => true));

    return (
      <div className={classList.join(' ')}>
        <div className={css.Header}>
          <img src={hotelIcon} alt="Hotel" className={css.Icon} />

          <h1>Select Hotel</h1>
          <h2>
            {`${offers.checkIn.toLocaleDateString(
              contentService.locale,
              { day: 'numeric', month: 'long', year: 'numeric' },
            )} - ${offers.checkOut.toLocaleDateString(
              contentService.locale,
              { day: 'numeric', month: 'long', year: 'numeric' },
            )}`}
          </h2>
        </div>

        <div className={css.SortingAndFiltering}>
          <Filters
            className={css.FilterMenu}
            onChange={this.filterChange}
            hotels={offers.hotels}
            currency={contentService.currency}
          />

          <Menu header="Sort by" className={css.SortMenu}>
            <div className={css.SortMenuContent}>
              {Object.keys(SortAlgorithms).map((sortAlgo, idx) => (
                <React.Fragment key={`sort-${idx}`}>
                  <input
                    type="radio"
                    name="sorting-and-filtering"
                    id={`sort-by-${sortAlgo}`}
                    checked={sorting === sortAlgo}
                    onChange={(): void => this.setState({ sorting: sortAlgo })}
                  />

                  <label htmlFor={`sort-by-${sortAlgo}`}>
                    {sortLabels[sortAlgo as keyof typeof sortLabels]}
                  </label>
                </React.Fragment>
              ))}
            </div>
          </Menu>
        </div>

        <div className={css.Offers} ref={this.offersRef}>
          {filteredHotels.length === 0
            ? (<span className={css.NoResult}>No hotels found.</span>)
            : filteredHotels.map((hotel, idx) => (
              <Hotel
                hotel={hotel}
                onSelect={onSelectRoom}
                key={`hotel-${idx}`}
                checkIn={offers.checkIn}
                checkOut={offers.checkOut}
                occupants={occupants}
                className={css.Hotel}
                selected={hotel === selected}
              />
            ))}
        </div>
      </div>
    );
  }
}
