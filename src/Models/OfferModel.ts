import { AirportModel } from './AirportModel';

export interface SegmentModel {
  arrival: Date;
  departure: Date;
  origin: AirportModel;
  destination: AirportModel;
  cabinClass: string;
  bookingClass: string;
  equipment: string;
  milesEarned: number;
  flight: {
    airlineCode: string;
    flightNumber: number;
    operatingAirlineCode: string;
  };
}

export interface AltOfferModel {
  departure: Date;
  total: {
    amount: number;
    tax: number;
    currency: string;
  };
}

export interface OfferModel {
  cabinClass: string;
  brandLabel: string;
  basketHash: number;
  itineraryPart: {
    bookingClass: string;
    milesEarned: number;
    segments: SegmentModel[];
  };
  soldout: boolean;
  total: {
    amount: number;
    tax: number;
    currency: string;
  };
}

export interface GroupedOfferModel {
  cabinClasses: {
    [cabinClass: string]: {
      offers: OfferModel[];
      startingFrom: {
        amount: number;
        tax: number;
        currency: string;
      };
    };
  };
  segments: SegmentModel[];
  departure: Date;
  arrival: Date;
  origin: AirportModel;
  destination: AirportModel;
  stops: string[];
}
