import { CoordinateModel } from './CoordinateModel';

export interface HotelOfferModel {
  checkIn: Date;
  checkOut: Date;
  hotels: HotelModel[];
}

export interface HotelModel {
  images: any[];
  rates: any[];
  chain: {
    code?: string;
    name?: string;
  };
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
  }
}

export interface ReviewModel {
  rating: number;
  count: number;
  type: string;
}
