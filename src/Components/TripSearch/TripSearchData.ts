import { TripType } from '../../Enums/TripType';
import { PassengerPickerData, comparePassengerPickerData, copyPassengerPickerData } from './Components/PassengerPicker/PassengerPickerData';
import { CabinType } from '../../Enums/CabinType';
import { OriginDestinationPickerData, copyDestinationPickerData, compareDestinationPickerData } from './Components/OriginDestinationPicker/OriginDestinationPickerData';
import { CalendarData, copyCalendarData, compareCalendarData } from './Components/DatePicker/Components/Calendar/CalendarData';

export interface TripSearchData {
  tripType: TripType;
  passengers: PassengerPickerData;
  cabinType: CabinType;
  originDestination: OriginDestinationPickerData;
  dates: CalendarData;
  bookWithMiles: boolean;
}

export function copyTripSearchData(data?: TripSearchData): TripSearchData {
  if (!data) {
    return {
      tripType: TripType.return,
      passengers: copyPassengerPickerData(undefined),
      bookWithMiles: false,
      cabinType: CabinType.all,
      dates: copyCalendarData(undefined),
      originDestination: copyDestinationPickerData(undefined),
    };
  }

  return {
    tripType: data.tripType,
    passengers: copyPassengerPickerData(data.passengers),
    cabinType: data.cabinType,
    originDestination: copyDestinationPickerData(data.originDestination),
    bookWithMiles: data.bookWithMiles,
    dates: copyCalendarData(data.dates),
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
    && compareCalendarData(a.dates, b.dates)
    && compareDestinationPickerData(a.originDestination, b.originDestination)
    && comparePassengerPickerData(a.passengers, b.passengers)
  );
}
