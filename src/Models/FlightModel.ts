import { AirportModel } from './AirportModel';

export interface SegmentModel {
  arrival: Date;
  departure: Date;
  origin: AirportModel;
  destination: AirportModel;
  cabinClass: string;
  bookingClass: string;
  flight: {
    airlineCode: string;
    flightNumber: number;
    operatingAirlineCode: string;
  };
}

export interface FlightModel {
  cabinClass: string;
  itineraryPart: {
    bookingClass: string;
    segments: SegmentModel[];
  };
  soldout: boolean;
  total: {
    amount: number;
    currency: string;
  };
}
