import {
  copyAirport,
  parseAirport,
} from './AirportModel';
import { LegModel as OfferLegModel } from './FlightOfferModel';

export type LegModel = Pick<Partial<OfferLegModel>, 'origin' | 'destination' | 'departure'>

export function copyLeg(leg?: Partial<LegModel>): LegModel {
  return {
    origin: leg?.origin ? copyAirport(leg.origin) : undefined,
    destination: leg?.destination ? copyAirport(leg.destination) : undefined,
    departure: leg?.departure,
  };
}

export function isEqualLegs(leg1?: LegModel, leg2?: LegModel): boolean {
  return (
    leg1?.origin?.code === leg2?.origin?.code
    && leg1?.destination?.code === leg2?.destination?.code
    && leg1?.departure?.valueOf() === leg2?.departure?.valueOf()
  );
}

export function isLegValid(leg: LegModel): boolean {
  return (
    (leg.origin !== undefined && leg.destination !== undefined && leg.departure !== undefined)
    && leg.origin.code !== leg.destination.code
  );
}

export function parseLeg(leg?: Partial<LegModel>): LegModel | undefined {
  if (!leg) {
    return undefined;
  }

  try {
    const departure = leg.departure ? new Date(leg.departure) : undefined;

    if (departure && !(departure instanceof Date) && Number.isNaN(departure)) {
      return undefined;
    }

    return {
      destination: parseAirport(leg.destination),
      origin: parseAirport(leg.origin),
      departure,
    };
  } catch (err) {
    return undefined;
  }
}
