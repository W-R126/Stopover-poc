import { TripTypeEnum } from '../../../Enums/TripTypeEnum';
import {
  GuestsModel,
  copyGuests,
  isGuestsValid,
  isEqualGuests,
  parseGuests,
} from '../../../Models/GuestsModel';

import {
  LegModel,
  copyLeg,
  isLegValid,
  isEqualLegs,
  parseLeg,
} from '../../../Models/LegModel';

import { CabinClassEnum } from '../Enums/CabinClassEnum';

export interface TripModel {
  type: TripTypeEnum;
  passengers: GuestsModel;
  cabinClass: CabinClassEnum;
  legs: LegModel[];
}

export function copyTrip(trip?: Partial<TripModel>): TripModel {
  const type = trip?.type ?? TripTypeEnum.roundTrip;

  let defaultLegs: (LegModel | undefined)[] = trip?.legs ?? [undefined];

  if (type === TripTypeEnum.roundTrip && defaultLegs.length !== 2) {
    defaultLegs.push({
      origin: defaultLegs[0]?.destination,
      destination: defaultLegs[0]?.origin,
      departure: undefined,
    });
  } else if (type === TripTypeEnum.oneWay) {
    defaultLegs = defaultLegs.slice(0, 1);
  }

  const passengers = copyGuests(trip?.passengers);
  const cabinClass = trip?.cabinClass ?? CabinClassEnum.P;
  const legs = defaultLegs.map((leg) => copyLeg(leg));

  return {
    type,
    passengers,
    cabinClass,
    legs,
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
      outbound.destination?.code !== inbound.origin?.code
      || outbound.origin?.code !== inbound.destination?.code
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

export function parseTrip(trip?: Partial<TripModel>): TripModel | undefined {
  if (!trip) {
    return undefined;
  }

  try {
    const passengers = parseGuests(trip.passengers);

    const legs: (LegModel | undefined)[] | undefined = trip.legs?.map(
      (leg: Partial<LegModel>) => parseLeg(leg),
    );

    const type = TripTypeEnum[trip.type as keyof typeof TripTypeEnum];
    const cabinClass = CabinClassEnum[trip.cabinClass as keyof typeof CabinClassEnum];

    if (
      !legs
      || legs.length === 0
      || legs.indexOf(undefined) !== -1
      || !cabinClass
      || !type
      || !passengers
    ) {
      return undefined;
    }

    return {
      cabinClass,
      type,
      passengers,
      legs: legs as LegModel[],
    };
  } catch (err) {
    return undefined;
  }
}
