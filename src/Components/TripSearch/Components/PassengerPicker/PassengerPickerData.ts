export interface PassengerPickerData {
  adults: number;
  children: number;
  infants: number;
}

export function copyPassengerPickerData(data?: PassengerPickerData): PassengerPickerData {
  if (!data) {
    return {
      adults: 1,
      children: 0,
      infants: 0,
    };
  }

  return {
    adults: data.adults,
    children: data.children,
    infants: data.infants,
  };
}

export function comparePassengerPickerData(
  a?: PassengerPickerData,
  b?: PassengerPickerData,
): boolean {
  if (a === b) {
    return true;
  }

  if (a === undefined || b === undefined) {
    return true;
  }

  return (
    a.adults === b.adults
    && a.children === b.children
    && a.infants === b.infants
  );
}
