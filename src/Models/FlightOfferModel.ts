import { AirportModel, parseAirport } from './AirportModel';
import { CabinClassEnum } from '../Enums/CabinClassEnum';

export function parseFlight(flight?: Partial<FlightModel>): FlightModel | undefined {
  if (!flight) {
    return undefined;
  }

  try {
    const {
      equipment,
      airlineCode,
      flightNumber,
      operatingAirlineCode,
    } = flight;

    if (Number.isNaN(flightNumber) || !(equipment && airlineCode && operatingAirlineCode)) {
      return undefined;
    }

    return {
      equipment,
      airlineCode,
      flightNumber: flightNumber as number,
      operatingAirlineCode,
    };
  } catch (err) {
    return undefined;
  }
}

export function parseLeg(leg?: Partial<LegModel>): LegModel | undefined {
  if (!leg) {
    return undefined;
  }

  try {
    const arrival = leg.arrival ? new Date(leg.arrival) : undefined;
    const departure = leg.departure ? new Date(leg.departure) : undefined;
    const origin = parseAirport(leg.origin);
    const destination = parseAirport(leg.destination);
    const { duration, milesEarned } = leg;
    const flight = parseFlight(leg.flight);

    if (
      !(origin && destination && flight)
      || !(arrival instanceof Date)
      || Number.isNaN(arrival)
      || !(departure instanceof Date)
      || Number.isNaN(departure)
      || Number.isNaN(duration)
      || Number.isNaN(milesEarned)
    ) {
      return undefined;
    }

    return {
      arrival,
      departure,
      origin,
      destination,
      duration: duration as number,
      milesEarned: milesEarned as number,
      flight,
    };
  } catch (err) {
    return undefined;
  }
}

export function parsePrice(price?: Partial<PriceModel>): PriceModel | undefined {
  if (!price) {
    return undefined;
  }

  try {
    const { total, currency, tax } = price;

    if (Number.isNaN(total) || Number.isNaN(tax) || !currency) {
      return undefined;
    }

    return {
      total: total as number,
      currency,
      tax: tax as number,
    };
  } catch (err) {
    return undefined;
  }
}

export function parseFare(fare?: Partial<FareModel>): FareModel | undefined {
  if (!fare) {
    return undefined;
  }

  try {
    const {
      brandId,
      brandLabel,
      hashCode,
      milesEarned,
    } = fare;

    const cabinClass = fare.cabinClass as (string | undefined);
    const price = parsePrice(fare.price);
    const origin = parseAirport(fare.origin);
    const destination = parseAirport(fare.destination);
    const departure = fare.departure ? new Date(fare.departure) : undefined;
    const arrival = fare.arrival ? new Date(fare.arrival) : undefined;

    if (
      !(brandId && brandLabel && price && !Number.isNaN(hashCode) && !Number.isNaN(milesEarned))
      || (!cabinClass || Object.keys(CabinClassEnum).indexOf(cabinClass) === -1)
      || !(origin && destination)
      || !(arrival instanceof Date)
      || Number.isNaN(arrival)
      || !(departure instanceof Date)
      || Number.isNaN(departure)
    ) {
      return undefined;
    }

    return {
      brandId,
      brandLabel,
      cabinClass: cabinClass as CabinClassEnum,
      hashCode: hashCode as number,
      price,
      milesEarned: milesEarned as number,
      origin,
      destination,
      departure,
      arrival,
    };
  } catch (err) {
    return undefined;
  }
}

export function parseCheapestFare(
  cheapestFare?: Partial<CheapestFareModel>,
): CheapestFareModel | undefined {
  if (!cheapestFare) {
    return undefined;
  }

  try {
    const cabinClass = cheapestFare.cabinClass as (string | undefined);
    const price = parsePrice(cheapestFare.price);

    if (
      (!cabinClass || Object.keys(CabinClassEnum).indexOf(cabinClass) === -1)
      || !price
    ) {
      return undefined;
    }

    return {
      cabinClass: cabinClass as CabinClassEnum,
      price,
    };
  } catch (err) {
    return undefined;
  }
}

export function parseFlightOffer(
  flightOffer?: Partial<FlightOfferModel>,
): FlightOfferModel | undefined {
  if (!flightOffer) {
    return undefined;
  }

  try {
    const origin = parseAirport(flightOffer.origin);
    const destination = parseAirport(flightOffer.destination);
    const arrival = flightOffer.arrival ? new Date(flightOffer.arrival) : '';
    const departure = flightOffer.departure ? new Date(flightOffer.departure) : '';
    const { duration } = flightOffer;
    const fares = flightOffer.fares?.map((fare) => parseFare(fare));
    const legs = flightOffer.legs?.map((leg) => parseLeg(leg));
    const stops = flightOffer.stops?.map((stop) => stop);
    const cheapestFares = flightOffer.cheapestFares?.map((cf) => parseCheapestFare(cf));

    if (
      !(origin && destination)
      || !(arrival instanceof Date)
      || Number.isNaN(arrival)
      || !(departure instanceof Date)
      || Number.isNaN(departure)
      || (duration === undefined || Number.isNaN(duration))
      || (!fares || fares.indexOf(undefined) !== -1)
      || (!legs || legs.indexOf(undefined) !== -1)
      || !stops
      || (!cheapestFares || cheapestFares.indexOf(undefined) !== -1)
    ) {
      return undefined;
    }

    return {
      origin,
      destination,
      arrival,
      departure,
      duration,
      fares: fares as FareModel[],
      legs: legs as LegModel[],
      stops,
      cheapestFares: cheapestFares as CheapestFareModel[],
    };
  } catch (err) {
    return undefined;
  }
}

export interface FlightOfferModel {
  origin: AirportModel;
  destination: AirportModel;
  arrival: Date;
  departure: Date;
  duration: number;
  fares: FareModel[];
  legs: LegModel[];
  stops: string[];
  cheapestFares: CheapestFareModel[];
}

export interface AlternateFlightOfferModel {
  departure: Date;
  price: PriceModel;
}

export interface CheapestFareModel {
  cabinClass: CabinClassEnum;
  price: PriceModel;
}

export interface FareModel {
  brandId: string;
  brandLabel: string;
  cabinClass: CabinClassEnum;
  hashCode: number;
  price: PriceModel;
  milesEarned: number;
  origin: AirportModel;
  destination: AirportModel;
  departure: Date;
  arrival: Date;
}

export interface LegModel {
  arrival: Date;
  departure: Date;
  origin: AirportModel;
  destination: AirportModel;
  duration: number;
  milesEarned: number;
  flight: FlightModel;
}

export interface FlightModel {
  equipment: string;
  airlineCode: string;
  flightNumber: number;
  operatingAirlineCode: string;
}

export interface PriceModel {
  total: number;
  currency: string;
  tax: number;
}
