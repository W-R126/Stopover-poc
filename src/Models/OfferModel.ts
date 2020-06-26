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
    Economy?: CabinClass;
    Business?: CabinClass;
    First?: CabinClass;
    Residence?: CabinClass;
  };
  segments: SegmentModel[];
  departure: Date;
  arrival: Date;
  origin: AirportModel;
  destination: AirportModel;
  stops: string[];
}

export interface CabinClass {
  offers: OfferModel[];
  startingFrom: {
    amount: number;
    tax: number;
    currency: string;
  };
}

export function findOfferFromHash(
  offers?: GroupedOfferModel[],
  hash?: number,
): OfferModel | undefined {
  if (!offers || hash === undefined) {
    return undefined;
  }

  for (let i = 0; i < offers.length; i += 1) {
    const offer = offers[i];
    const cabinClasses = Object.keys(offer.cabinClasses);

    for (let j = 0; j < cabinClasses.length; j += 1) {
      const cc: CabinClass = (offer.cabinClasses as any)[cabinClasses[j]];

      for (let k = 0; k < cc.offers.length; k += 1) {
        const ccOffer = cc.offers[k];

        if (ccOffer.basketHash === hash) {
          return ccOffer;
        }
      }
    }
  }

  return undefined;
}
