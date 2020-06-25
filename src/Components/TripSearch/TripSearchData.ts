import { TripType } from '../../Enums/TripType';
import { PassengerPickerData, comparePassengerPickerData, copyPassengerPickerData } from './Components/PassengerPicker/PassengerPickerData';
import { CabinType } from '../../Enums/CabinType';
import { AirportModel } from '../../Models/AirportModel';

export interface TripSearchData {
  tripType: TripType;
  passengers: PassengerPickerData;
  cabinType: CabinType;
  origin?: AirportModel;
  destination?: AirportModel;
  outbound?: Date;
  inbound?: Date;
  bookWithMiles: boolean;
}

export function defaultTripSearchData(): TripSearchData {
  return {
    tripType: TripType.return,
    passengers: copyPassengerPickerData(undefined),
    bookWithMiles: false,
    cabinType: CabinType.all,
    origin: undefined,
    destination: undefined,
    outbound: undefined,
    inbound: undefined,
  };
}

export function copyTripSearchData(data?: TripSearchData): TripSearchData {
  if (!data) {
    return defaultTripSearchData();
  }

  return {
    tripType: data.tripType,
    passengers: copyPassengerPickerData(data.passengers),
    bookWithMiles: data.bookWithMiles,
    cabinType: data.cabinType,
    origin: data.origin,
    destination: data.destination,
    outbound: data.outbound ? new Date(data.outbound) : undefined,
    inbound: data.inbound ? new Date(data.inbound) : undefined,
  };
}

export function compareTripSearchData(a?: TripSearchData, b?: TripSearchData): boolean {
  if (a === b) {
    return true;
  }

  if (a === undefined || b === undefined) {
    return false;
  }

  return (
    a.bookWithMiles === b.bookWithMiles
    && a.cabinType === b.cabinType
    && a.tripType === b.tripType
    && a.outbound?.valueOf() === b.outbound?.valueOf()
    && a.inbound?.valueOf() === b.inbound?.valueOf()
    && a.origin?.code === b.origin?.code
    && a.destination?.code === b.destination?.code
    && comparePassengerPickerData(a.passengers, b.passengers)
  );
}

export function validateTripSearchData(data: TripSearchData): boolean {
  const { passengers } = data;

  if (!(data.destination && data.origin)) {
    return false;
  }

  if (!data.outbound) {
    return false;
  }

  if (data.tripType === TripType.return && !data.inbound) {
    return false;
  }

  if (passengers.adults + passengers.children > 9) {
    return false;
  }

  if (passengers.infants > passengers.adults) {
    return false;
  }

  return true;
}
