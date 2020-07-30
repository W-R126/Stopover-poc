import { HotelModel } from '../../../../../Models/HotelOfferModel';

function getMinMaxFunc(func: (...values: number[]) => number): (hotel: HotelModel) => number {
  return (hotel: HotelModel): number => hotel.rooms.reduce(
    (prev, curr) => func(prev, curr.offers.reduce(
      (prev2, curr2) => func(prev2, curr2.price.total),
      curr.offers[0].price.total,
    )),
    hotel.rooms[0].offers[0].price.total,
  );
}

const getMinPrice = getMinMaxFunc(Math.min);
const getMaxPrice = getMinMaxFunc(Math.max);

export default {
  recommended: (a: HotelModel, b: HotelModel): number => {
    if (a.recommended === b.recommended) {
      return 0;
    }

    if (a.recommended) {
      return -1;
    }

    return 1;
  },
  lowestPrice: (a: HotelModel, b: HotelModel): number => {
    const aPrice = getMinPrice(a);
    const bPrice = getMinPrice(b);

    if (aPrice === bPrice) {
      return 0;
    }

    if (aPrice < bPrice) {
      return -1;
    }

    return 1;
  },
  highestPrice: (a: HotelModel, b: HotelModel): number => {
    const aPrice = getMaxPrice(a);
    const bPrice = getMaxPrice(b);

    if (aPrice === bPrice) {
      return 0;
    }

    if (aPrice > bPrice) {
      return -1;
    }

    return 1;
  },
  hotelClass: (a: HotelModel, b: HotelModel): number => {
    if (a.rating === b.rating) {
      return 0;
    }

    if (a.rating > b.rating) {
      return -1;
    }

    return 1;
  },
  checkInTime: (a: HotelModel, b: HotelModel): number => {
    if (!(a.checkIn && b.checkIn)) {
      return 0;
    }

    const [ah, am] = a.checkIn.split(':');
    const [bh, bm] = b.checkIn.split(':');

    const aTotal = Number.parseInt(ah, 10) * 60 + Number.parseInt(am, 10);
    const bTotal = Number.parseInt(bh, 10) * 60 + Number.parseInt(bm, 10);

    if (aTotal === bTotal) {
      return 0;
    }

    if (aTotal < bTotal) {
      return -1;
    }

    return 1;
  },
};
