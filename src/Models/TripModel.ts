import { TripTypeEnum } from '../Enums/TripTypeEnum';
import {
  GuestsModel,
  copyGuests,
  isGuestsValid,
  isEqualGuests,
  parseGuests,
} from './GuestsModel';
import { CabinClassEnum } from '../Enums/CabinClassEnum';
import {
  LegModel,
  copyLeg,
  isLegValid,
  isEqualLegs,
  parseLeg,
} from './LegModel';
import { isEqualAirports } from './AirportModel';
import AirportService from '../Services/AirportService';
import Utils from '../Utils';

export interface TripModel {
  type: TripTypeEnum;
  passengers: GuestsModel;
  cabinClass: CabinClassEnum;
  legs: LegModel[];
  bookWithMiles: boolean;
}

export function copyTrip(trip?: Partial<TripModel>): TripModel {
  const type = trip?.type ?? TripTypeEnum.roundTrip;

  let defaultLegs: (LegModel | undefined)[] = trip?.legs ?? [undefined];

  if (type === TripTypeEnum.roundTrip && defaultLegs.length !== 2) {
    defaultLegs.push({
      origin: defaultLegs[0]?.destination,
      destination: defaultLegs[0]?.origin,
      outbound: undefined,
    });
  } else if (type === TripTypeEnum.oneWay) {
    defaultLegs = defaultLegs.slice(0, 1);
  }

  const passengers = copyGuests(trip?.passengers);
  const cabinClass = trip?.cabinClass ?? CabinClassEnum.economy;
  const legs = defaultLegs.map((leg) => copyLeg(leg));
  const bookWithMiles = trip?.bookWithMiles ?? false;

  return {
    type,
    passengers,
    cabinClass,
    legs,
    bookWithMiles,
  };
}

export function isEqualTrips(trip1?: TripModel, trip2?: TripModel): boolean {
  return (
    trip1?.type === trip2?.type
    && isEqualGuests(trip1?.passengers, trip2?.passengers)
    && trip1?.cabinClass === trip2?.cabinClass
    && (
      (trip1?.legs ?? []).length === (trip2?.legs ?? []).length
      && (trip1?.legs ?? []).map(
        (leg, idx) => isEqualLegs(leg, (trip2?.legs ?? [])[idx]),
      ).indexOf(false) === -1
    )
    && trip1?.bookWithMiles === trip2?.bookWithMiles
  );
}

export function isTripValid(trip: TripModel): boolean {
  const valid = (
    Object.keys(TripTypeEnum).indexOf(trip.type) !== -1
    && isGuestsValid(trip.passengers)
    && Object.keys(CabinClassEnum).indexOf(trip.cabinClass) !== -1
    && trip.legs.map((leg) => isLegValid(leg)).indexOf(false) === -1
  );

  if (!valid) {
    return false;
  }

  if (trip.type === TripTypeEnum.roundTrip) {
    if (trip.legs.length !== 2) {
      // Two legs aren't defined.
      return false;
    }

    const [outbound, inbound] = trip.legs;

    if (
      !isEqualAirports(outbound.destination, inbound.origin)
      || !isEqualAirports(outbound.origin, inbound.destination)
    ) {
      // Origin of inbound leg does not match destination of outbound leg
      // or Origin of outbound leg does not match destination of inbound leg.
      return false;
    }
  } else if (trip.type === TripTypeEnum.oneWay) {
    if (trip.legs.length !== 1) {
      return false;
    }
  }

  return true;
}

export function tripToUrl(trip: TripModel): string {
  const params: string[] = [
    `type=${trip.type}`,
    `cabinClass=${trip.cabinClass}`,
    `origin=${trip.legs[0]?.origin?.code}`,
    `destination=${trip.legs[0]?.destination?.code}`,
    `outbound=${trip.legs[0]?.outbound?.toLocaleDateString('sv-SE')}`,
  ];

  if (trip.type === TripTypeEnum.roundTrip && trip.legs[1]?.outbound) {
    params.push(`inbound=${trip.legs[1].outbound.toLocaleDateString('sv-SE')}`);
  }

  Object.keys(trip.passengers).forEach((key) => {
    const value = (trip.passengers as any)[key];
    if (value !== 0) {
      params.push(`${key}=${value}`);
    }
  });

  if (trip.bookWithMiles) {
    params.push('bookWithMiles=true');
  }

  return params.join('&');
}

export async function getTripFromQuery(
  location: any,
  airportService: AirportService,
): Promise<TripModel> {
  const nextTrip = copyTrip();

  const params = Utils.getQueryParams(
    {
      origin: { default: '' },
      destination: { default: '' },
      cabinClass: {
        formatter: (value): CabinClassEnum => value as CabinClassEnum,
        default: CabinClassEnum.economy,
      },
      adults: { formatter: Utils.stringToNumber, default: 1 },
      children: { formatter: Utils.stringToNumber, default: 0 },
      infants: { formatter: Utils.stringToNumber, default: 0 },
      type: {
        formatter: (value): TripTypeEnum => value as TripTypeEnum,
        default: TripTypeEnum.roundTrip,
      },
      outbound: { formatter: (value): Date => new Date(value) },
      inbound: { formatter: (value): Date => new Date(value) },
      bookWithMiles: { formatter: (value): boolean => value === 'true', default: false },
    },
    location.search,
  );

  const originReq = airportService.getAirport(params.origin);
  const destinationReq = airportService.getAirport(params.destination);

  nextTrip.cabinClass = params.cabinClass;
  nextTrip.bookWithMiles = params.bookWithMiles;
  nextTrip.passengers = {
    adults: params.adults,
    children: params.children,
    infants: params.infants,
  };
  nextTrip.type = params.type;
  nextTrip.legs = [
    {
      destination: await destinationReq,
      origin: await originReq,
      outbound: params.outbound,
    },
  ];

  if (nextTrip.type === TripTypeEnum.roundTrip) {
    nextTrip.legs.push({
      destination: await originReq,
      origin: await destinationReq,
      outbound: params.inbound,
    });

    if (!params.inbound) {
      nextTrip.legs[0].outbound = undefined;
    }
  }

  return copyTrip(nextTrip);
}

export function parseTrip(trip?: { [key: string]: any }): TripModel | undefined {
  if (!trip) {
    return undefined;
  }

  try {
    const passengers = parseGuests(trip.passengers);

    if (!passengers) {
      throw new Error();
    }

    const legs: (LegModel | undefined)[] = trip.legs.map(
      (leg: { [key: string]: string }) => parseLeg(leg),
    );

    if (legs.indexOf(undefined) !== -1) {
      throw new Error();
    }

    return {
      bookWithMiles: trip.bookWithMiles,
      cabinClass: trip.cabinClass as CabinClassEnum,
      type: trip.type as TripTypeEnum,
      passengers,
      legs: legs as LegModel[],
    };
  } catch (err) {
    return undefined;
  }
}
