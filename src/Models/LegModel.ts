import { AirportModel, copyAirport, isEqualAirports, parseAirport } from './AirportModel';

export interface LegModel {
  origin?: AirportModel;
  destination?: AirportModel;
  outbound?: Date;
}

export function copyLeg(leg?: Partial<LegModel>): LegModel {
  return {
    origin: leg?.origin ? copyAirport(leg.origin) : undefined,
    destination: leg?.destination ? copyAirport(leg.destination) : undefined,
    outbound: leg?.outbound,
  };
}

export function isEqualLegs(leg1?: LegModel, leg2?: LegModel): boolean {
  return (
    isEqualAirports(leg1?.origin, leg2?.origin)
    && isEqualAirports(leg1?.destination, leg2?.destination)
    && leg1?.outbound?.valueOf() === leg2?.outbound?.valueOf()
  );
}

export function isLegValid(leg: LegModel): boolean {
  return (
    leg.origin !== undefined
    && leg.destination !== undefined
    && !isEqualAirports(leg.origin, leg.destination)
    && leg.outbound !== undefined
  );
}

export function parseLeg(leg?: { [key: string]: any }): LegModel | undefined {
  if (!leg) {
    return undefined;
  }

  try {
    const outbound = new Date(leg.outbound);

    if (!(outbound instanceof Date) && Number.isNaN(outbound)) {
      throw new Error();
    }

    return {
      destination: parseAirport(leg.destination),
      origin: parseAirport(leg.origin),
      outbound,
    };
  } catch (err) {
    return undefined;
  }
}