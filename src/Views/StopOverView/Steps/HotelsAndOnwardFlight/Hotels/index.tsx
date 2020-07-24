import React from 'react';

import css from './Hotels.module.css';
import hotelIcon from '../../../../../Assets/Images/hotel-icon.svg';
import { HotelOfferModel, HotelModel, RoomOfferModel, getHotelRoomOfferChain } from '../../../../../Models/HotelOfferModel';
import ContentService from '../../../../../Services/ContentService';
import Hotel from './Hotel';

interface HotelProps {
  className?: string;
  offers: HotelOfferModel;
  contentService: ContentService;
  occupants: number;
  hotelRoom?: RoomOfferModel;
  onSelectRoom: (room?: RoomOfferModel) => void;
}

export default class Hotels extends React.Component<HotelProps> {
  private readonly offersRef = React.createRef<HTMLDivElement>();

  componentDidMount(): void {
    const { hotelRoom, offers } = this.props;

    const [selectedHotel] = getHotelRoomOfferChain(offers.hotels, hotelRoom);

    if (selectedHotel && this.offersRef.current) {
      const child = this.offersRef.current.children[offers.hotels.indexOf(selectedHotel)];

      child.scrollIntoView(true);
      this.offersRef.current.scrollTop -= 16;
    }
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

    const classList = [css.Hotels];

    if (className) {
      classList.push(className);
    }

    const recommended = offers.hotels.find((hotel) => hotel.recommended === true) as HotelModel;
    const restOffers = offers.hotels.filter((hotel) => hotel !== recommended);

    let selected: HotelModel | undefined;

    if (hotelRoom) {
      [selected] = getHotelRoomOfferChain(offers.hotels, hotelRoom);
    }

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

        <div className={css.Offers} ref={this.offersRef}>
          <Hotel
            hotel={recommended}
            onSelect={onSelectRoom}
            checkIn={offers.checkIn}
            checkOut={offers.checkOut}
            occupants={occupants}
            className={css.Hotel}
            selected={recommended === selected}
          />

          {restOffers.map((hotel, idx) => (
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
