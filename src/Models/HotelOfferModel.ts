import { CoordinateModel } from './CoordinateModel';
import { PriceModel } from './FlightOfferModel';

export interface HotelOfferModel {
  checkIn: Date;
  checkOut: Date;
  hotels: HotelModel[];
}

export interface HotelModel {
  images: ImageModel[];
  rooms: RoomModel[];
  chain: {
    code?: string;
    name?: string;
  };
  checkIn?: string;
  checkOut?: string;
  free: boolean;
  name: string;
  code: string;
  rating: number;
  recommended: boolean;
  reviews: ReviewModel[];
  categories: string[];
  coordinates: CoordinateModel;
  contact: {
    phone: string;
    fax?: string;
  };
  address: AddressModel;
  amenities: AmenityModel[];
}

export interface ImageModel {
  thumb: string;
  original: string;
  code: string;
  description: string;
}

export interface RoomModel {
  occupancy: {
    min: number;
    max: number;
  };
  amenities: AmenityModel[];
  category: string;
  type: {
    name: string;
    description: string;
    code: string;
  };
  offers: RoomOfferModel[];
}

export interface RoomOfferModel {
  available: number;
  includedMeals: {
    breakfast: boolean;
    dinner: boolean;
    lunch: boolean;
    lunchOrDinner: boolean;
  };
  checkIn: Date;
  checkOut: Date;
  hashCode: string;
  id: string;
  price: PriceModel;
  hotelName: string;
  cancelPenalty: {
    price: PriceModel;
    deadline: Date;
  };
  discounts: {
    total: number;
    code: number;
    name: string;
  }[];
}

export function parseRoomOffer(data?: any): RoomOfferModel | undefined {
  if (!data) {
    return undefined;
  }

  const {
    checkIn,
    checkOut,
    cancelPenalty,
    ...restProps
  } = data;

  return {
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    cancelPenalty: {
      price: cancelPenalty.price,
      deadline: new Date(cancelPenalty.deadline),
    },
    ...restProps,
  };
}

export interface ReviewModel {
  rating: number;
  count: number;
  type: string;
}

export interface AddressModel {
  line1: string;
  city: {
    name: string;
    code: string;
  };
  country: {
    name: string;
    code: string;
  };
  state: {
    name: string;
    code: string;
  };
}

export interface AmenityModel {
  code: number;
  description: string;
  value?: string;
  complimentary: boolean;
}

export function getHotelRoomOfferChain(hotels?: HotelModel[], roomOffer?: RoomOfferModel): [
  HotelModel | undefined,
  RoomModel | undefined,
  RoomOfferModel | undefined,
] {
  if (!hotels) {
    return [undefined, undefined, undefined];
  }

  let room: RoomModel | undefined;
  let offer: RoomOfferModel | undefined;

  const hotel = hotels.find(
    (h) => {
      room = h.rooms.find(
        (r) => {
          offer = r.offers.find(
            (o) => {
              if (roomOffer?.id === undefined) {
                return o;
              }

              return o.id === roomOffer.id;
            },
          );

          return offer ? r : undefined;
        },
      );

      return room ? h : undefined;
    },
  );

  return [hotel, room, offer];
}
