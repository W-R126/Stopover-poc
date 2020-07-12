import { AirportModel } from './AirportModel';
import { CabinClassEnum } from '../Enums/CabinClassEnum';

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

export function parseSegment(segment: { [key: string]: any }): SegmentModel | undefined {
  try {
    return {
      arrival: new Date(segment.arrival),
      departure: new Date(segment.departure),
      bookingClass: segment.bookingClass,
      cabinClass: segment.cabinClass,
      destination: segment.destination,
      origin: segment.origin,
      equipment: segment.equipment,
      flight: segment.flight,
      milesEarned: segment.milesEarned,
    };
  } catch (err) {
    return undefined;
  }
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
  departure: Date;
  arrival: Date;
  origin: AirportModel;
  destination: AirportModel;
  soldout: boolean;
  total: {
    amount: number;
    tax: number;
    currency: string;
  };
}

export function parseOffer(offer?: { [key: string]: any }): OfferModel | undefined {
  if (!offer) {
    return undefined;
  }

  try {
    const segments: (SegmentModel | undefined)[] = offer.itineraryPart.segments.map(
      (segment: { [key: string]: any }) => parseSegment(segment),
    );

    if (segments.indexOf(undefined) !== -1) {
      throw new Error();
    }

    return {
      basketHash: offer.basketHash,
      brandLabel: offer.brandLabel,
      cabinClass: offer.cabinClass as CabinClassEnum,
      destination: offer.destination,
      origin: offer.origin,
      departure: new Date(offer.departure),
      arrival: new Date(offer.arrival),
      soldout: offer.soldout,
      total: offer.total,
      itineraryPart: {
        bookingClass: offer.itineraryPart.bookingClass,
        milesEarned: offer.itineraryPart.milesEarned,
        segments: segments as SegmentModel[],
      },
    };
  } catch (err) {
    return undefined;
  }
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
