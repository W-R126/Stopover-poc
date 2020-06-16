import { AirportModel } from '../../../../Models/AirportModel';

export interface OriginDestinationPickerData {
  origin?: AirportModel;
  destination?: AirportModel;
}

export function copyDestinationPickerData(
  data?: OriginDestinationPickerData,
): OriginDestinationPickerData {
  if (!data) {
    return {
      origin: undefined,
      destination: undefined,
    };
  }

  return {
    origin: data.origin,
    destination: data.destination,
  };
}

export function compareDestinationPickerData(
  a?: OriginDestinationPickerData,
  b?: OriginDestinationPickerData,
): boolean {
  if (a === b) {
    return true;
  }

  if (a === undefined || b === undefined) {
    return false;
  }

  return (
    a.origin?.code === b.origin?.code
    && a.destination?.code === b.destination?.code
  );
}
