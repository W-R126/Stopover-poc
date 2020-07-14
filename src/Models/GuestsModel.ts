import Utils from '../Utils';

export interface GuestsModel {
  adults: number;
  children: number;
  infants: number;
}

export function copyGuests(guests?: Partial<GuestsModel>): GuestsModel {
  // Ensure that the Guest model follows the constraints of:
  // Adults: min 1, max 9
  // Children: min 0, max 9 - number of adults
  // Infants: min 0, max number of adults
  const adults = Utils.getMinMax(guests?.adults ?? 1, 1, 9);
  const children = Utils.getMinMax(guests?.children ?? 0, 0, 9 - adults);
  const infants = Utils.getMinMax(guests?.infants ?? 0, 0, adults);

  return {
    adults,
    children,
    infants,
  };
}

export function isEqualGuests(guests1?: GuestsModel, guests2?: GuestsModel): boolean {
  return (
    guests1?.adults === guests2?.adults
    && guests1?.children === guests2?.children
    && guests1?.infants === guests2?.infants
  );
}

export function isGuestsValid(guests: GuestsModel): boolean {
  return (
    guests.adults === Utils.getMinMax(guests.adults, 1, 9)
    && guests.children === Utils.getMinMax(guests.children, 0, 9 - guests.adults)
    && guests.infants === Utils.getMinMax(guests.infants, 0, guests.adults)
  );
}

export function parseGuests(guests?: Partial<GuestsModel>): GuestsModel | undefined {
  if (!guests) {
    return undefined;
  }

  try {
    const { adults, children, infants } = guests;

    if (adults === undefined || children === undefined || infants === undefined) {
      return undefined;
    }

    return {
      adults,
      children,
      infants,
    };
  } catch (err) {
    return undefined;
  }
}
